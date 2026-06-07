import { useState } from "react"
import { useApp } from "../AppContext"

export default function Configuration() {
  const { config, setConfig } = useApp()
  const [nom, setNom] = useState(config?.nom || "")
  const [secteur, setSecteur] = useState(config?.secteur || "Commerce")
  const [ville, setVille] = useState(config?.ville || "")
  const [proprietaire, setProprietaire] = useState(config?.proprietaire || "")
  const [sauvegarde, setSauvegarde] = useState(false)

  function handleSauvegarder() {
    setConfig({ nom, secteur, ville, proprietaire })
    setSauvegarde(true)
    setTimeout(() => setSauvegarde(false), 3000)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-green-800 mb-2">Configuration</h1>
      <p className="text-gray-500 text-sm mb-6">Personnalisez votre espace FinTPE</p>

      <div className="bg-white rounded-2xl p-6 shadow-sm max-w-lg">
        <h2 className="font-bold text-gray-800 mb-4">Informations de la boutique</h2>

        <div className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">
              Nom de la boutique
            </label>
            <input type="text" value={nom} onChange={e => setNom(e.target.value)}
              placeholder="Ex: Boutique Stella"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500" />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">
              Propriétaire
            </label>
            <input type="text" value={proprietaire} onChange={e => setProprietaire(e.target.value)}
              placeholder="Ex: Marie Fouda"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500" />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">
              Secteur d'activité
            </label>
            <select value={secteur} onChange={e => setSecteur(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none">
              <option>Commerce</option>
              <option>Restauration</option>
              <option>Services</option>
              <option>Artisanat</option>
              <option>Agriculture</option>
              <option>Autre</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">
              Ville
            </label>
            <input type="text" value={ville} onChange={e => setVille(e.target.value)}
              placeholder="Ex: Douala, Yaoundé..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500" />
          </div>
        </div>

        <button onClick={handleSauvegarder}
          className="w-full bg-green-700 text-white py-3 rounded-lg font-semibold hover:bg-green-600 mt-6">
          ✓ Sauvegarder
        </button>

        {sauvegarde && (
          <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-3 text-center">
            <p className="text-green-700 text-sm font-semibold">✅ Configuration sauvegardée !</p>
          </div>
        )}
      </div>
    </div>
  )
}