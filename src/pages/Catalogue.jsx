import { useState } from "react"
import { useApp } from "../AppContext"

export default function Catalogue() {
  const { produits, ajouterProduit, supprimerProduit } = useApp()
  const [categorie, setCategorie] = useState("")
  const [nom, setNom] = useState("")
  const [pa, setPa] = useState("")
  const [pv, setPv] = useState("")
  const [recherche, setRecherche] = useState("")
  const [afficherFormulaire, setAfficherFormulaire] = useState(false)

  function handleAjouter() {
    if (!nom || !pa || !pv || !categorie) return
    const marge = parseFloat(pv) - parseFloat(pa)
    const tauxMarge = ((marge / parseFloat(pa)) * 100).toFixed(1)
    ajouterProduit({ nom, categorie, pa: parseFloat(pa), pv: parseFloat(pv), marge, tauxMarge })
    setNom("")
    setPa("")
    setPv("")
    setCategorie("")
    setAfficherFormulaire(false)
  }
  
  

  const produitsFiltres = produits.filter(p =>
    p.nom.toLowerCase().includes(recherche.toLowerCase()) ||
    p.categorie.toLowerCase().includes(recherche.toLowerCase())
  )

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-green-800">Catalogue produits</h1>
          <p className="text-gray-500 text-sm mt-1">{produits.length} produit(s) enregistré(s)</p>
        </div>
        <button
          onClick={() => setAfficherFormulaire(!afficherFormulaire)}
          className="bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-600"
        >
          + Ajouter un produit
        </button>
      </div>

      {afficherFormulaire && (
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <h2 className="font-bold text-gray-800 mb-4">Nouveau produit</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Catégorie</label>
              <input type="text" value={categorie} onChange={e => setCategorie(e.target.value)}
                placeholder="Ex: Cosmétiques" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Nom du produit</label>
              <input type="text" value={nom} onChange={e => setNom(e.target.value)}
                placeholder="Ex: Crème Nivea 200ml" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Prix d'achat (FCFA)</label>
              <input type="number" value={pa} onChange={e => setPa(e.target.value)}
                placeholder="Ex: 2000" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Prix de vente (FCFA)</label>
              <input type="number" value={pv} onChange={e => setPv(e.target.value)}
                placeholder="Ex: 3000" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500" />
            </div>
          </div>

          {pa && pv && (
            <div className="mt-4 bg-green-50 rounded-xl p-4">
              <p className="text-sm text-gray-600">Marge unitaire :
                <span className="font-bold text-green-700 ml-2">
                  {(parseFloat(pv) - parseFloat(pa)).toLocaleString("fr-FR")} FCFA
                </span>
              </p>
              <p className="text-sm text-gray-600 mt-1">Taux de marge :
                <span className={`font-bold ml-2 ${((parseFloat(pv) - parseFloat(pa)) / parseFloat(pa) * 100) < 20 ? "text-red-500" : "text-green-700"}`}>
                  {((parseFloat(pv) - parseFloat(pa)) / parseFloat(pa) * 100).toFixed(1)}%
                </span>
              </p>
            </div>
          )}

          <div className="flex gap-3 mt-4">
            <button onClick={handleAjouter} className="flex-1 bg-green-700 text-white py-2 rounded-lg font-semibold hover:bg-green-600">✓ Enregistrer</button>
            <button onClick={() => setAfficherFormulaire(false)} className="flex-1 bg-gray-100 text-gray-600 py-2 rounded-lg font-semibold">Annuler</button>
          </div>
        </div>
      )}

      <div className="mb-4">
        <input type="text" value={recherche} onChange={e => setRecherche(e.target.value)}
          placeholder="🔍 Rechercher un produit ou une catégorie..."
          className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500" />
      </div>

      {produits.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
          <p className="text-4xl mb-4">📦</p>
          <p className="text-gray-500">Aucun produit enregistré</p>
          <p className="text-gray-400 text-sm mt-1">Cliquez sur "Ajouter un produit" pour commencer</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
                <th className="text-left px-6 py-4">Produit</th>
                <th className="text-left px-6 py-4">Catégorie</th>
                <th className="text-right px-6 py-4">Prix achat</th>
                <th className="text-right px-6 py-4">Prix vente</th>
                <th className="text-right px-6 py-4">Marge</th>
                <th className="text-right px-6 py-4">Taux</th>
                <th className="px-6 py-4"></th>

              </tr>
            </thead>
            <tbody>
              {produitsFiltres.map(p => (
                <tr key={p.id} className="border-t border-gray-50 hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-800">{p.nom}</td>
                  <td className="px-6 py-4">
                    <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full">{p.categorie}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-right text-gray-600">{p.pa.toLocaleString("fr-FR")} F</td>
                  <td className="px-6 py-4 text-sm text-right text-gray-600">{p.pv.toLocaleString("fr-FR")} F</td>
                  <td className="px-6 py-4 text-sm text-right font-semibold text-green-600">+{p.marge.toLocaleString("fr-FR")} F</td>
                  <td className="px-6 py-4 text-right">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${p.tauxMarge < 20 ? "bg-red-100 text-red-600" : p.tauxMarge < 40 ? "bg-yellow-100 text-yellow-600" : "bg-green-100 text-green-600"}`}>
                      {p.tauxMarge}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                   <button
                    onClick={() => supprimerProduit(p.id)}
                  className="text-red-400 hover:text-red-600 text-lg"
                   >
                  🗑️
                </button>
                </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
