import { useApp } from "../AppContext"

export default function Alertes() {
  const { transactions, ventes } = useApp()

  const totalEntrees = transactions
    .filter(t => t.type === "entree")
    .reduce((acc, t) => acc + t.montant, 0)

  const totalSorties = transactions
    .filter(t => t.type === "sortie")
    .reduce((acc, t) => acc + t.montant, 0)

  const totalCA = ventes.reduce((acc, v) => acc + v.montantTotal, 0)
  const totalBenefice = ventes.reduce((acc, v) => acc + v.benefice, 0)
  const solde = totalEntrees - totalSorties
  const margeNette = totalCA > 0 ? (totalBenefice / totalCA) * 100 : 0
  const endettement = totalEntrees > 0 ? (totalSorties / totalEntrees) * 100 : 0
  const liquidite = totalSorties > 0 ? totalEntrees / totalSorties : 2

  const charges = transactions.filter(t => t.type === "sortie" && t.echeance)

  // Générer les alertes automatiquement
  const alertes = [
    solde < 0 && {
      type: "danger",
      titre: "🚨 Trésorerie négative",
      texte: "Vos dépenses dépassent vos recettes. Agissez immédiatement pour rééquilibrer votre trésorerie.",
    },
    endettement > 65 && {
      type: "danger",
      titre: "🚨 Endettement critique",
      texte: `Votre taux d'endettement est à ${endettement.toFixed(1)}%, bien au-dessus du seuil de 50%. Réduisez vos charges fixes en priorité.`,
    },
    liquidite < 1 && {
      type: "danger",
      titre: "🚨 Liquidité insuffisante",
      texte: "Vos recettes ne couvrent pas vos dépenses courantes. Constituez une réserve d'urgence.",
    },
    endettement > 50 && endettement <= 65 && {
      type: "warn",
      titre: "⚠️ Endettement élevé",
      texte: `Taux d'endettement à ${endettement.toFixed(1)}%. Surveillez l'évolution et évitez de nouvelles dettes.`,
    },
    liquidite >= 1 && liquidite < 1.5 && {
      type: "warn",
      titre: "⚠️ Liquidité à surveiller",
      texte: `Votre ratio de liquidité est à ${liquidite.toFixed(2)}, sous le seuil idéal de 1,5.`,
    },
    margeNette < 10 && totalCA > 0 && {
      type: "warn",
      titre: "⚠️ Rentabilité faible",
      texte: `Votre marge nette est à ${margeNette.toFixed(1)}%. Revoyez vos prix de vente ou réduisez vos coûts d'achat.`,
    },
    charges.length > 0 && {
      type: "warn",
      titre: "📅 Échéances à venir",
      texte: `Vous avez ${charges.length} charge(s) avec échéance enregistrée. Vérifiez vos disponibilités.`,
    },
    ventes.length === 0 && {
      type: "info",
      titre: "💡 Commencez à enregistrer vos ventes",
      texte: "Enregistrez vos ventes dans le module Ventes pour obtenir un diagnostic complet.",
    },
    margeNette >= 15 && {
      type: "success",
      titre: "✅ Bonne rentabilité",
      texte: `Votre marge nette est à ${margeNette.toFixed(1)}%. Vous êtes au-dessus de la moyenne. Continuez !`,
    },
    solde > 0 && endettement <= 50 && {
      type: "success",
      titre: "✅ Situation financière saine",
      texte: "Votre trésorerie est positive et votre endettement est maîtrisé. Bonne gestion !",
    },
  ].filter(Boolean)

  const couleurs = {
    danger:  { bg: "bg-red-50",    border: "border-red-500",    badge: "bg-red-100 text-red-700" },
    warn:    { bg: "bg-yellow-50", border: "border-yellow-400", badge: "bg-yellow-100 text-yellow-700" },
    info:    { bg: "bg-blue-50",   border: "border-blue-400",   badge: "bg-blue-100 text-blue-700" },
    success: { bg: "bg-green-50",  border: "border-green-500",  badge: "bg-green-100 text-green-700" },
  }

  const labels = {
    danger:  "Urgent",
    warn:    "Attention",
    info:    "Conseil",
    success: "Positif",
  }

  const nbDanger  = alertes.filter(a => a.type === "danger").length
  const nbWarn    = alertes.filter(a => a.type === "warn").length
  const nbSuccess = alertes.filter(a => a.type === "success").length

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-green-800">Alertes & Recommandations</h1>
          <p className="text-gray-500 text-sm mt-1">
            Générées automatiquement selon votre situation financière
          </p>
        </div>
        <div className="flex gap-2">
          {nbDanger > 0 && (
            <span className="bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded-full">
              {nbDanger} urgent{nbDanger > 1 ? "s" : ""}
            </span>
          )}
          {nbWarn > 0 && (
            <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-3 py-1 rounded-full">
              {nbWarn} attention{nbWarn > 1 ? "s" : ""}
            </span>
          )}
          {nbSuccess > 0 && (
            <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">
              {nbSuccess} positif{nbSuccess > 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {alertes.map((a, i) => {
          const c = couleurs[a.type]
          return (
            <div key={i} className={`${c.bg} border-l-4 ${c.border} rounded-2xl p-5 flex gap-4 items-start`}>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <p className="font-bold text-gray-800">{a.titre}</p>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${c.badge}`}>
                    {labels[a.type]}
                  </span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{a.texte}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
