import { useState } from "react"
import { useApp } from "../AppContext"

export default function Tresorerie() {
  const { transactions, ajouterTransaction, produits } = useApp()
  const [type, setType] = useState("entree")
  const [montant, setMontant] = useState("")
  const [description, setDescription] = useState("")
  const [categorie, setCategorie] = useState("Vente")
  const [dateEcheance, setDateEcheance] = useState("")
  const [onglet, setOnglet] = useState("saisie")
  const [rechercheProduit, setRechercheProduit] = useState("")
  const [produitSelectionne, setProduitSelectionne] = useState(null)
  const [quantite, setQuantite] = useState(1)

  const totalEntrees = transactions
    .filter(t => t.type === "entree")
    .reduce((acc, t) => acc + t.montant, 0)

  const totalSorties = transactions
    .filter(t => t.type === "sortie")
    .reduce((acc, t) => acc + t.montant, 0)

  const solde = totalEntrees - totalSorties
  const fluxNet = totalEntrees - totalSorties
  const tauxCouverture = totalSorties > 0
    ? ((totalEntrees / totalSorties) * 100).toFixed(1)
    : 100

  const charges = transactions.filter(t => t.type === "sortie" && t.echeance)

  const produitsFiltres = produits.filter(p =>
    p.nom.toLowerCase().includes(rechercheProduit.toLowerCase()) ||
    p.categorie.toLowerCase().includes(rechercheProduit.toLowerCase())
  )

  function handleAjouter() {
    if (categorie === "Vente" && produitSelectionne) {
      const montantTotal = produitSelectionne.pv * quantite
      ajouterTransaction({
        id: Date.now(),
        type: "entree",
        montant: montantTotal,
        description: `${produitSelectionne.nom} x${quantite}`,
        categorie: "Vente",
        benefice: produitSelectionne.marge * quantite,
        date: new Date().toLocaleDateString("fr-FR")
      })
      setProduitSelectionne(null)
      setQuantite(1)
      setRechercheProduit("")
      return
    }

    if (!montant || montant <= 0) return
    ajouterTransaction({
      id: Date.now(),
      type,
      montant: parseFloat(montant),
      description,
      categorie,
      echeance: dateEcheance,
      date: new Date().toLocaleDateString("fr-FR")
    })
    setMontant("")
    setDescription("")
    setDateEcheance("")
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-green-800 mb-6">Trésorerie</h1>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-green-800 text-white rounded-2xl p-5 text-center">
          <p className="text-green-300 text-xs uppercase tracking-wider">Solde actuel</p>
          <p className={`text-2xl font-bold mt-2 ${solde >= 0 ? "text-white" : "text-red-300"}`}>
            {solde.toLocaleString("fr-FR")} F
          </p>
        </div>
        <div className="bg-white rounded-2xl p-5 text-center shadow-sm">
          <p className="text-gray-400 text-xs uppercase tracking-wider">Total entrées</p>
          <p className="text-2xl font-bold mt-2 text-green-600">
            +{totalEntrees.toLocaleString("fr-FR")} F
          </p>
        </div>
        <div className="bg-white rounded-2xl p-5 text-center shadow-sm">
          <p className="text-gray-400 text-xs uppercase tracking-wider">Total sorties</p>
          <p className="text-2xl font-bold mt-2 text-red-500">
            -{totalSorties.toLocaleString("fr-FR")} F
          </p>
        </div>
        <div className="bg-white rounded-2xl p-5 text-center shadow-sm">
          <p className="text-gray-400 text-xs uppercase tracking-wider">Taux couverture</p>
          <p className={`text-2xl font-bold mt-2 ${tauxCouverture >= 100 ? "text-green-600" : "text-red-500"}`}>
            {tauxCouverture}%
          </p>
        </div>
      </div>

      {/* ONGLETS */}
      <div className="flex gap-2 mb-6">
        {[
          { id: "saisie", label: "💵 Saisie" },
          { id: "transactions", label: "📋 Transactions" },
          { id: "charges", label: "📅 Charges à payer" },
          { id: "prevision", label: "📈 Prévision" },
        ].map(o => (
          <button key={o.id} onClick={() => setOnglet(o.id)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              onglet === o.id ? "bg-green-700 text-white" : "bg-white text-gray-600 hover:bg-gray-50"
            }`}>
            {o.label}
          </button>
        ))}
      </div>

      {/* SAISIE */}
      {onglet === "saisie" && (
        <div className="bg-white rounded-2xl p-6 shadow-sm max-w-lg">
          <h2 className="font-bold text-gray-800 mb-4">Nouvelle opération</h2>

          <div className="flex gap-2 mb-4">
            <button onClick={() => setType("entree")}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                type === "entree" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-600"
              }`}>
              💚 Entrée
            </button>
            <button onClick={() => setType("sortie")}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                type === "sortie" ? "bg-red-500 text-white" : "bg-gray-100 text-gray-600"
              }`}>
              🔴 Sortie
            </button>
          </div>

          <div className="flex flex-col gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Catégorie</label>
              <select value={categorie} onChange={e => { setCategorie(e.target.value); setProduitSelectionne(null) }}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none">
                {type === "entree" ? (
                  <>
                    <option>Vente</option>
                    <option>Recouvrement créance</option>
                    <option>Autre entrée</option>
                  </>
                ) : (
                  <>
                    <option>Achat fournisseur</option>
                    <option>Loyer</option>
                    <option>Salaire</option>
                    <option>Électricité</option>
                    <option>Remboursement dette</option>
                    <option>Autre charge</option>
                  </>
                )}
              </select>
            </div>

            {/* Si vente → afficher catalogue */}
            {type === "entree" && categorie === "Vente" ? (
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">
                  Rechercher un produit
                </label>
                <input type="text" value={rechercheProduit}
                  onChange={e => { setRechercheProduit(e.target.value); setProduitSelectionne(null) }}
                  placeholder="🔍 Tapez le nom du produit..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500"
                />

                {/* Liste produits filtrés */}
                {rechercheProduit && !produitSelectionne && (
                  <div className="border border-gray-200 rounded-lg mt-1 max-h-40 overflow-y-auto">
                    {produitsFiltres.length === 0 ? (
                      <p className="text-sm text-gray-400 p-3">Aucun produit trouvé</p>
                    ) : (
                      produitsFiltres.map(p => (
                        <div key={p.id}
                          onClick={() => { setProduitSelectionne(p); setRechercheProduit(p.nom) }}
                          className="flex justify-between items-center px-3 py-2 hover:bg-green-50 cursor-pointer border-b border-gray-50">
                          <div>
                            <p className="text-sm font-medium text-gray-800">{p.nom}</p>
                            <p className="text-xs text-gray-400">{p.categorie}</p>
                          </div>
                          <p className="text-sm font-bold text-green-700">
                            {p.pv.toLocaleString("fr-FR")} F
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* Produit sélectionné */}
                {produitSelectionne && (
                  <div className="mt-3 bg-green-50 rounded-xl p-4">
                    <p className="text-sm font-bold text-green-800">{produitSelectionne.nom}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      PV : {produitSelectionne.pv.toLocaleString("fr-FR")} F |
                      Marge : {produitSelectionne.marge.toLocaleString("fr-FR")} F
                    </p>
                    <div className="mt-3">
                      <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Quantité</label>
                      <input type="number" min="1" value={quantite}
                        onChange={e => setQuantite(parseInt(e.target.value) || 1)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500"
                      />
                    </div>
                    <div className="mt-2 flex justify-between">
                      <span className="text-sm text-gray-600">Total :</span>
                      <span className="font-bold text-green-700">
                        {(produitSelectionne.pv * quantite).toLocaleString("fr-FR")} F
                      </span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-sm text-gray-600">Bénéfice :</span>
                      <span className="font-bold text-green-600">
                        +{(produitSelectionne.marge * quantite).toLocaleString("fr-FR")} F
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Montant (FCFA)</label>
                  <input type="number" value={montant} onChange={e => setMontant(e.target.value)}
                    placeholder="Ex: 50000"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Description</label>
                  <input type="text" value={description} onChange={e => setDescription(e.target.value)}
                    placeholder="Ex: Loyer mois de mai"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Échéance (optionnel)</label>
                  <input type="date" value={dateEcheance} onChange={e => setDateEcheance(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500" />
                </div>
              </>
            )}
          </div>

          <button onClick={handleAjouter}
            className="w-full bg-green-700 text-white py-3 rounded-lg font-semibold hover:bg-green-600 mt-4">
            ✓ Enregistrer
          </button>
        </div>
      )}

      {/* TRANSACTIONS */}
      {onglet === "transactions" && (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {transactions.length === 0 ? (
            <p className="text-center text-gray-400 py-12">Aucune transaction enregistrée</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
                  <th className="text-left px-6 py-4">Date</th>
                  <th className="text-left px-6 py-4">Description</th>
                  <th className="text-left px-6 py-4">Catégorie</th>
                  <th className="text-right px-6 py-4">Montant</th>
                  <th className="text-right px-6 py-4">Bénéfice</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(t => (
                  <tr key={t.id} className="border-t border-gray-50 hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-500">{t.date}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">{t.description || t.categorie}</td>
                    <td className="px-6 py-4">
                      <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">{t.categorie}</span>
                    </td>
                    <td className={`px-6 py-4 text-sm font-bold text-right ${t.type === "entree" ? "text-green-600" : "text-red-500"}`}>
                      {t.type === "entree" ? "+" : "−"}{t.montant.toLocaleString("fr-FR")} F
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-right text-green-600">
                      {t.benefice ? `+${t.benefice.toLocaleString("fr-FR")} F` : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* CHARGES */}
      {onglet === "charges" && (
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="font-bold text-gray-800 mb-4">Charges à payer</h2>
          {charges.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">
              Ajoutez une sortie avec une date d'échéance pour la voir ici.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {charges.map(t => (
                <div key={t.id} className="flex justify-between items-center p-4 bg-red-50 rounded-xl border border-red-100">
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{t.description || t.categorie}</p>
                    <p className="text-xs text-gray-500 mt-1">Échéance : {t.echeance}</p>
                  </div>
                  <p className="font-bold text-red-500">{t.montant.toLocaleString("fr-FR")} F</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* PREVISION */}
      {onglet === "prevision" && (
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="font-bold text-gray-800 mb-4">Flux nets du mois</h2>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-sm text-gray-600">Total entrées</span>
                <span className="font-bold text-green-600">+{totalEntrees.toLocaleString("fr-FR")} F</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-sm text-gray-600">Total sorties</span>
                <span className="font-bold text-red-500">-{totalSorties.toLocaleString("fr-FR")} F</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-sm font-bold text-gray-800">Flux net</span>
                <span className={`font-bold text-lg ${fluxNet >= 0 ? "text-green-600" : "text-red-500"}`}>
                  {fluxNet >= 0 ? "+" : ""}{fluxNet.toLocaleString("fr-FR")} F
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="font-bold text-gray-800 mb-4">Indicateurs clés</h2>
            <div className="flex flex-col gap-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-500 uppercase font-semibold">Taux de couverture</p>
                <p className={`text-2xl font-bold mt-1 ${tauxCouverture >= 100 ? "text-green-600" : "text-red-500"}`}>
                  {tauxCouverture}%
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {tauxCouverture >= 100 ? "✅ Vos entrées couvrent vos charges" : "🚨 Vos entrées ne couvrent pas vos charges"}
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-500 uppercase font-semibold">BFR simplifié</p>
                <p className="text-2xl font-bold mt-1 text-orange-500">
                  {(totalSorties * 0.3).toLocaleString("fr-FR")} F
                </p>
                <p className="text-xs text-gray-400 mt-1">Estimation du besoin en fonds de roulement</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
