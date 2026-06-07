import { useApp } from "../AppContext"

export default function Scoring() {
  const { transactions, ventes } = useApp()

  const totalEntrees = transactions
    .filter(t => t.type === "entree")
    .reduce((acc, t) => acc + t.montant, 0)

  const totalSorties = transactions
    .filter(t => t.type === "sortie")
    .reduce((acc, t) => acc + t.montant, 0)

  const totalCA = ventes.reduce((acc, v) => acc + v.montantTotal, 0)
  const totalBenefice = ventes.reduce((acc, v) => acc + v.benefice, 0)

  const margeNette = totalCA > 0 ? (totalBenefice / totalCA) * 100 : 0
  const liquidite = totalSorties > 0 ? totalEntrees / totalSorties : 2
  const endettement = totalEntrees > 0 ? (totalSorties / totalEntrees) * 100 : 0
  const solde = totalEntrees - totalSorties

  // Calcul des points par critère
  const criteres = [
    {
      nom: "Liquidité générale",
      valeur: liquidite.toFixed(2),
      seuil: "Idéal : > 1,5",
      points: liquidite >= 1.5 ? 20 : liquidite >= 1 ? 12 : 5,
      max: 20,
    },
    {
      nom: "Rentabilité nette",
      valeur: `${margeNette.toFixed(1)}%`,
      seuil: "Idéal : > 10%",
      points: margeNette >= 10 ? 20 : margeNette >= 5 ? 12 : 5,
      max: 20,
    },
    {
      nom: "Taux d'endettement",
      valeur: `${endettement.toFixed(1)}%`,
      seuil: "Idéal : < 50%",
      points: endettement <= 50 ? 20 : endettement <= 70 ? 12 : 5,
      max: 20,
    },
    {
      nom: "Trésorerie nette",
      valeur: solde >= 0 ? "Positive ✅" : "Négative 🚨",
      seuil: "Idéal : positive",
      points: solde >= 0 ? 20 : 5,
      max: 20,
    },
    {
      nom: "Régularité des entrées",
      valeur: ventes.length > 0 ? `${ventes.length} vente(s)` : "Aucune",
      seuil: "Idéal : activité régulière",
      points: ventes.length >= 10 ? 20 : ventes.length >= 5 ? 14 : ventes.length >= 1 ? 10 : 3,
      max: 20,
    },
  ]

  const scoreTotal = criteres.reduce((acc, c) => acc + c.points, 0)

  const getStatutScore = () => {
    if (scoreTotal >= 80) return { label: "🟢 Excellente santé", color: "text-green-600", bg: "border-green-500" }
    if (scoreTotal >= 60) return { label: "🟡 Situation stable", color: "text-yellow-600", bg: "border-yellow-400" }
    if (scoreTotal >= 40) return { label: "🟠 Situation fragile", color: "text-orange-500", bg: "border-orange-400" }
    return { label: "🔴 Situation critique", color: "text-red-600", bg: "border-red-500" }
  }

  const statut = getStatutScore()

  const getPointColor = (points, max) => {
    const ratio = points / max
    if (ratio >= 0.8) return "text-green-600"
    if (ratio >= 0.5) return "text-yellow-600"
    return "text-red-500"
  }

  const recommandations = [
    liquidite < 1.5 && {
      type: "danger",
      titre: "Améliorer la liquidité",
      texte: "Constituez une réserve de trésorerie d'au moins 2 mois de charges fixes."
    },
    endettement > 50 && {
      type: "danger",
      titre: "Réduire l'endettement",
      texte: "Vos sorties dépassent 50% de vos entrées. Cherchez à réduire vos charges fixes."
    },
    margeNette < 10 && {
      type: "warn",
      titre: "Augmenter la rentabilité",
      texte: "Votre marge nette est faible. Revoyez vos prix de vente ou réduisez vos coûts d'achat."
    },
    solde < 0 && {
      type: "danger",
      titre: "Trésorerie négative",
      texte: "Vos dépenses dépassent vos recettes. Agissez rapidement pour rééquilibrer."
    },
    ventes.length < 5 && {
      type: "info",
      titre: "Enregistrez vos ventes",
      texte: "Enregistrez régulièrement vos ventes pour un diagnostic plus précis."
    },
  ].filter(Boolean)

  return (
    <div>
      <h1 className="text-2xl font-bold text-green-800 mb-6">Score de risque</h1>

      <div className="grid grid-cols-3 gap-6">

        {/* SCORE VISUEL */}
        <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center">
          <p className="text-xs text-gray-400 uppercase font-semibold mb-4">Score global</p>
          <div className={`w-36 h-36 rounded-full border-8 ${statut.bg} flex flex-col items-center justify-center mb-4`}>
            <p className={`text-4xl font-black ${statut.color}`}>{scoreTotal}</p>
            <p className="text-sm text-gray-400">/ 100</p>
          </div>
          <p className={`text-base font-bold ${statut.color}`}>{statut.label}</p>

          {/* Jauge */}
          <div className="flex gap-1 mt-4 w-full">
            <div className="flex-1 h-2 rounded-full bg-red-400"></div>
            <div className="flex-1 h-2 rounded-full bg-orange-400"></div>
            <div className={`flex-1 h-2 rounded-full ${scoreTotal >= 60 ? "bg-yellow-400 ring-2 ring-yellow-600" : "bg-yellow-200"}`}></div>
            <div className={`flex-1 h-2 rounded-full ${scoreTotal >= 80 ? "bg-green-500 ring-2 ring-green-700" : "bg-green-200"}`}></div>
          </div>
          <div className="flex justify-between w-full mt-1">
            <span className="text-xs text-gray-400">0</span>
            <span className="text-xs text-gray-400">100</span>
          </div>

          <div className="mt-4 w-full text-xs text-gray-500 space-y-1">
            <div className="flex justify-between"><span>🔴 0–39</span><span>Critique</span></div>
            <div className="flex justify-between"><span>🟠 40–59</span><span>Fragile</span></div>
            <div className="flex justify-between"><span>🟡 60–79</span><span>Stable</span></div>
            <div className="flex justify-between"><span>🟢 80–100</span><span>Excellent</span></div>
          </div>
        </div>

        {/* CRITÈRES */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="font-bold text-gray-800 mb-4">Détail des critères</h2>
          <div className="flex flex-col gap-3">
            {criteres.map((c, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{c.nom}</p>
                    <p className="text-xs text-gray-400">{c.seuil}</p>
                  </div>
                  <p className={`text-lg font-black ${getPointColor(c.points, c.max)}`}>
                    {c.points}/{c.max}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Valeur : {c.valeur}</span>
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        c.points / c.max >= 0.8 ? "bg-green-500" :
                        c.points / c.max >= 0.5 ? "bg-yellow-400" : "bg-red-400"
                      }`}
                      style={{ width: `${(c.points / c.max) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RECOMMANDATIONS */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="font-bold text-gray-800 mb-4">Recommandations</h2>
          {recommandations.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-4xl mb-3">🎉</p>
              <p className="text-green-600 font-semibold">Excellente situation !</p>
              <p className="text-gray-400 text-sm mt-1">Continuez sur cette lancée.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {recommandations.map((r, i) => (
                <div key={i} className={`p-4 rounded-xl border-l-4 ${
                  r.type === "danger" ? "bg-red-50 border-red-500" :
                  r.type === "warn"   ? "bg-yellow-50 border-yellow-400" :
                  "bg-blue-50 border-blue-400"
                }`}>
                  <p className="text-sm font-bold text-gray-800">{r.titre}</p>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">{r.texte}</p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
