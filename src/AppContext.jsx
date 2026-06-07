import { createContext, useContext, useState, useEffect } from "react"

const AppContext = createContext()

export function AppProvider({ children }) {
  const [produits, setProduits] = useState(() => {
    const saved = localStorage.getItem("fintpe_produits")
    return saved ? JSON.parse(saved) : []
  })

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("fintpe_transactions")
    return saved ? JSON.parse(saved) : []
  })

  const [ventes, setVentes] = useState(() => {
    const saved = localStorage.getItem("fintpe_ventes")
    return saved ? JSON.parse(saved) : []
  })

  const [config, setConfigState] = useState(() => {
    const saved = localStorage.getItem("fintpe_config")
    return saved ? JSON.parse(saved) : {
      nom: "Ma Boutique",
      proprietaire: "",
      secteur: "Commerce",
      ville: "Yaoundé"
    }
  })

  useEffect(() => {
    localStorage.setItem("fintpe_produits", JSON.stringify(produits))
  }, [produits])

  useEffect(() => {
    localStorage.setItem("fintpe_transactions", JSON.stringify(transactions))
  }, [transactions])

  useEffect(() => {
    localStorage.setItem("fintpe_ventes", JSON.stringify(ventes))
  }, [ventes])

  useEffect(() => {
    localStorage.setItem("fintpe_config", JSON.stringify(config))
  }, [config])

  function ajouterProduit(produit) {
    setProduits(prev => [...prev, { ...produit, id: Date.now() }])
  }

  function supprimerProduit(id) {
    setProduits(prev => prev.filter(p => p.id !== id))
  }


  function ajouterTransaction(transaction) {
    setTransactions(prev => [transaction, ...prev])
  }

  function ajouterVente(vente) {
    setVentes(prev => [vente, ...prev])
    ajouterTransaction({
      id: Date.now(),
      type: "entree",
      montant: vente.montantTotal,
      description: `${vente.produitNom} x${vente.quantite}`,
      categorie: "Vente",
      benefice: vente.benefice,
      date: new Date().toLocaleDateString("fr-FR")
    })
  }

  function setConfig(nouvelleConfig) {
    setConfigState(nouvelleConfig)
  }

  return (
    <AppContext.Provider value={{
      produits, ajouterProduit, supprimerProduit,
      transactions, ajouterTransaction,
      ventes, ajouterVente,
      config, setConfig
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  return useContext(AppContext)
}
