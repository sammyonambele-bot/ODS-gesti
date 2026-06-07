import { useState } from "react"
import { useApp } from "../AppContext"

export default function Ventes() {
  const { produits, ventes, ajouterVente } = useApp()
  const [recherche, setRecherche] = useState("")
  const [produitSelectionne, setProduitSelectionne] = useState(null)
  const [quantite, setQuantite] = useState(1)

  const produitsFiltres = produits.filter(p =>
    p.nom.toLowerCase().includes(recherche.toLowerCase()) ||
    p.categorie.toLowerCase().includes(recherche.toLowerCase())
  )

  function handleVente() {
    if (!produitSelectionne) return
    ajouterVente({
      id: Date.now(),
      produitId: produitSelectionne.id,
      produitNom: produitSelectionne.nom,
      categorie: produitSelectionne.categorie,
      quantite,
      pa: produitSelectionne.pa,
      pv: produitSelectionne.pv,
      montantTotal: produitSelectionne.pv * quantite,
      benefice: produitSelectionne.marge * quantite,
      date: new Date().toLocaleDateString("fr-FR")
    })
    setProduitSelectionne(null)
    setRecherche("")
    setQuantite(1)
  }

  const totalCA = ventes.reduce((acc, v) => acc + v.montantTotal, 0)
  const totalBenefice = ventes.reduce((acc, v) => acc + v.benefice, 0)
  const totalCout = ventes.reduce((acc, v) => acc + (v.pa * v.quantite), 0)
  const margeGlobale = totalCA > 0 ? ((totalBenefice / totalCA) * 100).toFixed(1) : 0

  return (
    <div>
      <h1 className="text-2xl font-bold text-green-800 mb-6">Ventes</h1>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-green-800 text-white rounded-2xl p-5 text-center">
          <p className="text-green-300 text-xs uppercase tracking-wider">Chiffre d'affaires</p>
          <p className="text-2xl font-bold mt-2">{totalCA.toLocaleString("fr-FR")} F</p>
        </div>
        <div className="bg-white rounded-2xl p-5 text-center shadow-sm">
          <p className="text-gray-400 text-xs uppercase tracking-wider">Coût d'achat total</p>
          <p className="text-2xl font-bold mt-2 text-red-500">{totalCout.toLocaleString("fr-FR")} F</p>
        </div>
        <div className="bg-white rounded-2xl p-5 text-center shadow-sm">
          <p className="text-gray-400 text-xs uppercase tracking-wider">Bénéfice réel</p>
          <p className="text-2xl font-bold mt-2 text-green-600">+{totalBenefice.toLocaleString("fr-FR")} F</p>
        </div>
        <div className="bg-white rounded-2xl p-5 text-center shadow-sm">
          <p className="text-gray-400 text-xs uppercase tracking-wider">Marge globale</p>
          <p className={`text-2xl font-bold mt-2 ${margeGlobale >= 20 ? "text-green-600" : "text-red-500"}`}>
            {margeGlobale}%
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

        {/* FORMULAIRE VENTE */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="font-bold text-gray-800 mb-4">Enregistrer une vente</h2>

          {produits.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-4xl mb-3">📦</p>
              <p className="text-gray-500 text-sm">Aucun produit dans le catalogue</p>
              <p className="text-gray-400 text-xs mt-1">Ajoutez des produits dans le Catalogue d'abord</p>
            </div>
          ) : (
            <>
              <div className="mb-3">
                <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">
                  Rechercher un produit
                </label>
                <input
                  type="text"
                  value={recherche}
                  onChange={e => { setRecherche(e.target.value); setProduitSelectionne(null) }}
                  placeholder="🔍 Tapez le nom ou la catégorie..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500"
                />

                {recherche && !produitSelectionne && (
                  <div className="border border-gray-200 rounded-lg mt-1 max-h-48 overflow-y-auto">
                    {produitsFiltres.length === 0 ? (
                      <p className="text-sm text-gray-400 p-3">Aucun produit trouvé</p>
                    ) : (
                      produitsFiltres.map(p => (
                        <div key={p.id}
                          onClick={() => { setProduitSelectionne(p); setRecherche(p.nom) }}
                          className="flex justify-between items-center px-3 py-3 hover:bg-green-50 cursor-pointer border-b border-gray-50">
                          <div>
                            <p className="text-sm font-medium text-gray-800">{p.nom}</p>
                            <p className="text-xs text-gray-400">{p.categorie}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-green-700">{p.pv.toLocaleString("fr-FR")} F</p>
                            <p className="text-xs text-gray-400">marge {p.tauxMarge}%</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              {produitSelectionne && (
                <div className="bg-green-50 rounded-xl p-4 mb-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-bold text-green-800">{produitSelectionne.nom}</p>
                      <p className="text-xs text-gray-500">{produitSelectionne.categorie}</p>
                    </div>
                    <button onClick={() => { setProduitSelectionne(null); setRecherche("") }}
                      className="text-gray-400 hover:text-gray-600 text-sm">✕</button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                    <div className="bg-white rounded-lg p-2 text-center">
                      <p className="text-xs text-gray-400">Prix achat</p>
                      <p className="font-bold text-red-500">{produitSelectionne.pa.toLocaleString("fr-FR")} F</p>
                    </div>
                    <div className="bg-white rounded-lg p-2 text-center">
                      <p className="text-xs text-gray-400">Prix vente</p>
                      <p className="font-bold text-green-700">{produitSelectionne.pv.toLocaleString("fr-FR")} F</p>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Quantité</label>
                    <input type="number" min="1" value={quantite}
                      onChange={e => setQuantite(parseInt(e.target.value) || 1)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500 bg-white"
                    />
                  </div>

                  <div className="bg-white rounded-lg p-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Chiffre d'affaires :</span>
                      <span className="font-bold text-green-700">
                        {(produitSelectionne.pv * quantite).toLocaleString("fr-FR")} F
                      </span>
                    </div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Coût d'achat :</span>
                      <span className="font-bold text-red-500">
                        -{(produitSelectionne.pa * quantite).toLocaleString("fr-FR")} F
                      </span>
                    </div>
                    <div className="flex justify-between text-sm border-t border-gray-100 pt-2 mt-2">
                      <span className="font-bold text-gray-800">Bénéfice réel :</span>
                      <span className="font-bold text-green-600">
                        +{(produitSelectionne.marge * quantite).toLocaleString("fr-FR")} F
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <button onClick={handleVente}
                disabled={!produitSelectionne}
                className={`w-full py-3 rounded-lg font-semibold transition-all ${
                  produitSelectionne
                    ? "bg-green-700 text-white hover:bg-green-600"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}>
                ✓ Enregistrer la vente
              </button>
            </>
          )}
        </div>

        {/* HISTORIQUE VENTES */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="font-bold text-gray-800 mb-4">
            Historique des ventes
            <span className="ml-2 text-sm font-normal text-gray-400">
              ({ventes.length} vente{ventes.length > 1 ? "s" : ""})
            </span>
          </h2>

          {ventes.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-4xl mb-3">🛒</p>
              <p className="text-gray-500 text-sm">Aucune vente enregistrée</p>
            </div>
          ) : (
            <div className="flex flex-col gap-0">
              {ventes.map(v => (
                <div key={v.id} className="flex justify-between items-center py-3 border-b border-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-green-100 rounded-xl flex items-center justify-center text-sm">
                      🛒
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {v.produitNom} × {v.quantite}
                      </p>
                      <p className="text-xs text-gray-400">{v.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-green-700">
                      {v.montantTotal.toLocaleString("fr-FR")} F
                    </p>
                    <p className="text-xs text-green-500">
                      +{v.benefice.toLocaleString("fr-FR")} F bénéf.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
