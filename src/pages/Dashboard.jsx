import { useApp } from "../AppContext"
import { exporterExcel } from "../export"

export default function Dashboard() {
  const { transactions, ventes, produits,config } = useApp()

  const totalEntrees = transactions
    .filter(t => t.type === "entree")
    .reduce((acc, t) => acc + t.montant, 0)

  const totalSorties = transactions
    .filter(t => t.type === "sortie")
    .reduce((acc, t) => acc + t.montant, 0)

  const totalCA = ventes.reduce((acc, v) => acc + v.montantTotal, 0)
  const totalBenefice = ventes.reduce((acc, v) => acc + v.benefice, 0)
  const solde = totalEntrees - totalSorties
  const margeNette = totalCA > 0 ? ((totalBenefice / totalCA) * 100).toFixed(1) : 0
  const endettement = totalEntrees > 0 ? ((totalSorties / totalEntrees) * 100).toFixed(1) : 0
  const liquidite = totalSorties > 0 ? (totalEntrees / totalSorties).toFixed(2) : "∞"

  const scoreTotal = (() => {
    let s = 0
    const liq = totalSorties > 0 ? totalEntrees / totalSorties : 2
    const end = totalEntrees > 0 ? (totalSorties / totalEntrees) * 100 : 0
    const marge = totalCA > 0 ? (totalBenefice / totalCA) * 100 : 0
    s += liq >= 1.5 ? 20 : liq >= 1 ? 12 : 5
    s += marge >= 10 ? 20 : marge >= 5 ? 12 : 5
    s += end <= 50 ? 20 : end <= 70 ? 12 : 5
    s += solde >= 0 ? 20 : 5
    s += ventes.length >= 10 ? 20 : ventes.length >= 5 ? 14 : ventes.length >= 1 ? 10 : 3
    return s
  })()

  const getScoreInfo = () => {
    if (scoreTotal >= 80) return { label: "Excellente santé", color: "text-green-600", bg: "bg-green-100" }
    if (scoreTotal >= 60) return { label: "Situation stable", color: "text-yellow-600", bg: "bg-yellow-100" }
    if (scoreTotal >= 40) return { label: "Situation fragile", color: "text-orange-500", bg: "bg-orange-100" }
    return { label: "Situation critique", color: "text-red-600", bg: "bg-red-100" }
  }

  const scoreInfo = getScoreInfo()

  const dernièresVentes = ventes.slice(0, 5)

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-green-800">Tableau de bord</h1>
        <p className="text-gray-500 text-sm mt-1">Vue d'ensemble de votre activité</p>
      </div>
      <button
        onClick={() => exporterExcel(produits, transactions, ventes, config)}
        className="bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-600 flex items-center gap-2"
      >
        Exporter Excel
      </button>

      {/* KPIs principaux */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-green-800 text-white rounded-2xl p-5">
          <p className="text-green-300 text-xs uppercase tracking-wider">Trésorerie nette</p>
          <p className={`text-2xl font-bold mt-2 ${solde >= 0 ? "text-white" : "text-red-300"}`}>
            {solde.toLocaleString("fr-FR")} F
          </p>
          <p className="text-green-300 text-xs mt-1">
            {solde >= 0 ? "✅ Positive" : "🚨 Négative"}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="text-gray-400 text-xs uppercase tracking-wider">Chiffre d'affaires</p>
          <p className="text-2xl font-bold mt-2 text-gray-800">
            {totalCA.toLocaleString("fr-FR")} F
          </p>
          <p className="text-xs text-gray-400 mt-1">{ventes.length} vente(s)</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="text-gray-400 text-xs uppercase tracking-wider">Bénéfice réel</p>
          <p className="text-2xl font-bold mt-2 text-green-600">
            +{totalBenefice.toLocaleString("fr-FR")} F
          </p>
          <p className="text-xs text-gray-400 mt-1">Marge : {margeNette}%</p>
        </div>
        <div className={`${scoreInfo.bg} rounded-2xl p-5`}>
          <p className="text-gray-500 text-xs uppercase tracking-wider">Score santé</p>
          <p className={`text-2xl font-bold mt-2 ${scoreInfo.color}`}>
            {scoreTotal} / 100
          </p>
          <p className={`text-xs mt-1 ${scoreInfo.color}`}>{scoreInfo.label}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-6">

        {/* Ratios rapides */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="font-bold text-gray-800 mb-4">Ratios clés</h2>
          <div className="flex flex-col gap-4">
            {[
              { label: "Liquidité", valeur: liquidite, ok: parseFloat(liquidite) >= 1.5 },
              { label: "Endettement", valeur: `${endettement}%`, ok: parseFloat(endettement) <= 50 },
              { label: "Marge nette", valeur: `${margeNette}%`, ok: parseFloat(margeNette) >= 10 },
            ].map((r, i) => (
              <div key={i} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{r.label}</span>
                <div className="flex items-center gap-2">
                  <span className={`font-bold text-sm ${r.ok ? "text-green-600" : "text-red-500"}`}>
                    {r.valeur}
                  </span>
                  <span>{r.ok ? "✅" : "🚨"}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Résumé trésorerie */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="font-bold text-gray-800 mb-4">Flux financiers</h2>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-50">
              <span className="text-sm text-gray-600">Total entrées</span>
              <span className="font-bold text-green-600">+{totalEntrees.toLocaleString("fr-FR")} F</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-50">
              <span className="text-sm text-gray-600">Total sorties</span>
              <span className="font-bold text-red-500">-{totalSorties.toLocaleString("fr-FR")} F</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm font-bold text-gray-800">Flux net</span>
              <span className={`font-bold ${solde >= 0 ? "text-green-600" : "text-red-500"}`}>
                {solde >= 0 ? "+" : ""}{solde.toLocaleString("fr-FR")} F
              </span>
            </div>
          </div>
        </div>

        {/* Statistiques catalogue */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="font-bold text-gray-800 mb-4">Catalogue & Ventes</h2>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-50">
              <span className="text-sm text-gray-600">Produits enregistrés</span>
              <span className="font-bold text-gray-800">{produits.length}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-50">
              <span className="text-sm text-gray-600">Ventes enregistrées</span>
              <span className="font-bold text-gray-800">{ventes.length}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-600">Bénéfice moyen/vente</span>
              <span className="font-bold text-green-600">
                {ventes.length > 0
                  ? Math.round(totalBenefice / ventes.length).toLocaleString("fr-FR")
                  : 0} F
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Dernières ventes */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="font-bold text-gray-800 mb-4">Dernières ventes</h2>
        {dernièresVentes.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-6">
            Aucune vente enregistrée — allez dans le module Ventes pour commencer.
          </p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
                <th className="text-left px-4 py-3">Produit</th>
                <th className="text-left px-4 py-3">Date</th>
                <th className="text-right px-4 py-3">Qté</th>
                <th className="text-right px-4 py-3">CA</th>
                <th className="text-right px-4 py-3">Bénéfice</th>
              </tr>
            </thead>
            <tbody>
              {dernièresVentes.map(v => (
                <tr key={v.id} className="border-t border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">{v.produitNom}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{v.date}</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-600">{v.quantite}</td>
                  <td className="px-4 py-3 text-sm text-right font-semibold text-green-700">
                    {v.montantTotal.toLocaleString("fr-FR")} F
                  </td>
                  <td className="px-4 py-3 text-sm text-right font-semibold text-green-600">
                    +{v.benefice.toLocaleString("fr-FR")} F
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
