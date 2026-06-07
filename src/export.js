import * as XLSX from "xlsx"
import { saveAs } from "file-saver"

export function exporterExcel(produits, transactions, ventes, config) {
  const wb = XLSX.utils.book_new()

  // Feuille 1 — Transactions
  const dataTransactions = transactions.map(t => ({
    "Date": t.date,
    "Type": t.type === "entree" ? "Entrée" : "Sortie",
    "Catégorie": t.categorie,
    "Description": t.description || "",
    "Montant (FCFA)": t.montant,
    "Bénéfice (FCFA)": t.benefice || 0,
  }))
  const ws1 = XLSX.utils.json_to_sheet(dataTransactions)
  XLSX.utils.book_append_sheet(wb, ws1, "Trésorerie")

  // Feuille 2 — Ventes
  const dataVentes = ventes.map(v => ({
    "Date": v.date,
    "Produit": v.produitNom,
    "Catégorie": v.categorie,
    "Quantité": v.quantite,
    "Prix achat (FCFA)": v.pa,
    "Prix vente (FCFA)": v.pv,
    "CA (FCFA)": v.montantTotal,
    "Bénéfice (FCFA)": v.benefice,
  }))
  const ws2 = XLSX.utils.json_to_sheet(dataVentes)
  XLSX.utils.book_append_sheet(wb, ws2, "Ventes")

  // Feuille 3 — Catalogue
  const dataProduits = produits.map(p => ({
    "Nom du produit": p.nom,
    "Catégorie": p.categorie,
    "Prix achat (FCFA)": p.pa,
    "Prix vente (FCFA)": p.pv,
    "Marge (FCFA)": p.marge,
    "Taux de marge (%)": p.tauxMarge,
  }))
  const ws3 = XLSX.utils.json_to_sheet(dataProduits)
  XLSX.utils.book_append_sheet(wb, ws3, "Catalogue")

  // Nom du fichier
  const date = new Date().toLocaleDateString("fr-FR").replace(/\//g, "-")
  const nomFichier = `FinTPE_${config.nom}_${date}.xlsx`

  // Téléchargement
  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" })
  saveAs(new Blob([wbout], { type: "application/octet-stream" }), nomFichier)
}
