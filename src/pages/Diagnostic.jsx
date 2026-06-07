import { useApp } from "../AppContext"

export default function Diagnostic() {
  const { transactions, ventes } = useApp()

  const totalEntrees = transactions
    .filter(t => t.type === "entree")
    .reduce((acc, t) => acc + t.montant, 0)

  const totalSorties = transactions
    .filter(t => t.type === "sortie")
    .reduce((acc, t) => acc + t.montant, 0)

  const totalCA = ventes.reduce((acc, v) => acc + v.montantTotal, 0)
  const totalBenefice = ventes.reduce((acc, v) => acc + v.benefice, 0)
  const totalCout = ventes.reduce((acc, v) => acc + (v.pa * v.quantite), 0)

  const solde = totalEntrees - totalSorties

  // Ratios
  const margeNette = totalCA > 0 ? ((totalBenefice / totalCA) * 100).toFixed(1) : 0
  const margeBrute = totalCA > 0 ? (((totalCA - totalCout) / totalCA) * 100).toFixed(1) : 0
  const tauxEndettement = totalEntrees > 0 ? ((totalSorties / totalEntrees) * 100).toFixed(1) : 0
  const liquidite = totalSorties > 0 ? (totalEntrees / totalSorties).toFixed(2) : "∞"
  const autonomie = totalEntrees > 0 ? (((totalEntrees - totalSorties) / totalEntrees) * 100).toFixed(1) : 0
  const bfr = (totalSorties * 0.3).toFixed(0)
  const fr = solde
  const tn = fr - bfr

  function getStatut(valeur, seuil, inverse = false) {
    if (inverse) return valeur <= seuil ? "ok" : valeur <= seuil * 1.3 ? "warn" : "bad"
    return valeur >= seuil ? "ok" : valeur >= seuil * 0.7 ? "warn" : "bad"
  }

  const statuts = {
    margeNette: getStatut(parseFloat(margeNette), 10),
    margeBrute: getStatut(parseFloat(margeBrute), 30),
    liquidite: getStatut(parseFloat(liquidite), 1.5),
    endettement: getStatut(parseFloat(tauxEndettement), 50, true),
    autonomie: getStatut(parseFloat(autonomie), 30),
  }

  const couleurs = {
    ok:   { bg: "bg-green-50",  val: "text-green-600",  badge: "bg-green-100 text-green-700",  icon: "✅" },
    warn: { bg: "bg-yellow-50", val: "text-yellow-600", badge: "bg-yellow-100 text-yellow-700", icon: "⚠️" },
    bad:  { bg: "bg-red-50",    val: "text-red-600",    badge: "bg-red-100 text-red-700",       icon: "🚨" },
  }

  const ratios = [
    {
      label: "Marge nette",
      valeur: `${margeNette}%`,
      statut: statuts.margeNette,
      interp: margeNette >= 10
        ? "Bonne rentabilité. Pour 100F vendus, vous gardez " + margeNette + "F de bénéfice net."
        : "Rentabilité faible. Essayez d'augmenter vos prix de vente ou réduire vos coûts.",
      seuil: "Idéal : > 10%"
    },
    {
      label: "Marge brute",
      valeur: `${margeBrute}%`,
      statut: statuts.margeBrute,
      interp: margeBrute >= 30
        ? "Bonne marge commerciale sur vos produits."
        : "Marge commerciale faible. Vos produits se vendent peu au-dessus de leur coût d'achat.",
      seuil: "Idéal : > 30%"
    },
    {
      label: "Ratio de liquidité",
      valeur: liquidite,
      statut: statuts.liquidite,
      interp: parseFloat(liquidite) >= 1.5
        ? "Bonne capacité à couvrir vos dépenses avec vos recettes."
        : "Attention : vos recettes couvrent difficilement vos dépenses.",
      seuil: "Idéal : > 1,5"
    },
    {
      label: "Taux d'endettement",
      valeur: `${tauxEndettement}%`,
      statut: statuts.endettement,
      interp: tauxEndettement <= 50
        ? "Niveau d'endettement acceptable."
        : "Endettement élevé. Vos sorties représentent plus de la moitié de vos entrées.",
      seuil: "Idéal : < 50%"
    },
    {
      label: "Autonomie financière",
      valeur: `${autonomie}%`,
      statut: statuts.autonomie,
      interp: autonomie >= 30
        ? "Bonne indépendance financière."
        : "Faible autonomie. Votre activité dépend trop de financements externes.",
      seuil: "Idéal : > 30%"
    },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-green-800 mb-2">Diagnostic financier</h1>
      <p className="text-gray-500 text-sm mb-6">
        Calculé automatiquement à partir de vos données. Aucune connaissance comptable requise.
      </p>

      {/* BFR */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-5 shadow-sm text-center">
          <p className="text-xs text-gray-400 uppercase font-semibold">Fonds de Roulement</p>
          <p className={`text-2xl font-bold mt-2 ${fr >= 0 ? "text-green-600" : "text-red-500"}`}>
            {fr.toLocaleString("fr-FR")} F
          </p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm text-center">
          <p className="text-xs text-gray-400 uppercase font-semibold">Besoin en FDR</p>
          <p className="text-2xl font-bold mt-2 text-orange-500">
            {parseInt(bfr).toLocaleString("fr-FR")} F
          </p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm text-center">
          <p className="text-xs text-gray-400 uppercase font-semibold">Trésorerie Nette</p>
          <p className={`text-2xl font-bold mt-2 ${tn >= 0 ? "text-green-600" : "text-red-500"}`}>
            {tn.toLocaleString("fr-FR")} F
          </p>
          <p className="text-xs mt-1">
            {tn >= 0 ? "✅ Positive" : "🚨 Négative"}
          </p>
        </div>
      </div>

      {/* RATIOS */}
      <div className="grid grid-cols-2 gap-4">
        {ratios.map((r, i) => {
          const c = couleurs[r.statut]
          return (
            <div key={i} className={`${c.bg} rounded-2xl p-5`}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">{r.label}</p>
                  <p className={`text-3xl font-bold mt-1 ${c.val}`}>{r.valeur}</p>
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${c.badge}`}>
                  {r.seuil}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-3 leading-relaxed">
                {c.icon} {r.interp}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
