import { useState } from "react"
import { useApp } from "./AppContext"
import Tresorerie from "./pages/Tresorerie"
import Diagnostic from "./pages/Diagnostic"
import Scoring from "./pages/Scoring"
import Alertes from "./pages/Alertes"
import Dashboard from "./pages/Dashboard"
import Ventes from "./pages/Ventes"
import Catalogue from "./pages/Catalogue"
import Configuration from "./pages/Configuration"

export default function App() {
  const [page, setPage] = useState("dashboard")
  const [menuOuvert, setMenuOuvert] = useState(false)
  const { config } = useApp()

  const menus = [
    { id: "dashboard",     label: "Tableau de bord", icon: "📊" },
    { id: "tresorerie",    label: "Trésorerie",       icon: "💵" },
    { id: "catalogue",     label: "Catalogue",        icon: "📦" },
    { id: "ventes",        label: "Ventes",           icon: "🛒" },
    { id: "diagnostic",    label: "Diagnostic",       icon: "🔍" },
    { id: "scoring",       label: "Score de risque",  icon: "⭐" },
    { id: "alertes",       label: "Alertes",          icon: "🔔" },
    { id: "configuration", label: "Configuration",    icon: "⚙️" },
  ]

  function naviguer(id) {
    setPage(id)
    setMenuOuvert(false)
  }

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* OVERLAY mobile */}
      {menuOuvert && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMenuOuvert(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`
        fixed top-0 left-0 bottom-0 z-50
        w-60 bg-green-800 flex flex-col
        transition-transform duration-300
        ${menuOuvert ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0
      `}>
        <div className="p-6 border-b border-green-700 flex justify-between items-center">
          <div>
            <h1 className="text-white text-xl font-bold">FinTPE</h1>
            <p className="text-green-300 text-xs mt-1">Gestion Financière</p>
          </div>
          <button
            onClick={() => setMenuOuvert(false)}
            className="text-green-300 lg:hidden text-xl"
          >
            ✕
          </button>
        </div>

        <nav className="p-3 flex-1 overflow-y-auto">
          {menus.map((item) => (
            <button
              key={item.id}
              onClick={() => naviguer(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg mb-1 text-sm font-medium transition-all ${
                page === item.id
                  ? "bg-white/20 text-white"
                  : "text-green-200 hover:bg-white/10"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-3">
          <div className="bg-white/10 rounded-xl p-3">
            <p className="text-white text-sm font-semibold">{config.nom}</p>
            <p className="text-green-300 text-xs">{config.secteur} — {config.ville}</p>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 lg:ml-60">

        {/* TOPBAR mobile */}
        <div className="lg:hidden bg-green-800 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
          <button
            onClick={() => setMenuOuvert(true)}
            className="text-white text-2xl"
          >
            ☰
          </button>
          <h1 className="text-white font-bold">FinTPE</h1>
          <div className="w-8"></div>
        </div>

        <div className="p-4 lg:p-8">
          {page === "dashboard"     && <Dashboard />}
          {page === "tresorerie"    && <Tresorerie />}
          {page === "catalogue"     && <Catalogue />}
          {page === "ventes"        && <Ventes />}
          {page === "diagnostic"    && <Diagnostic />}
          {page === "scoring"       && <Scoring />}
          {page === "alertes"       && <Alertes />}
          {page === "configuration" && <Configuration />}
        </div>
      </main>

    </div>
  )
}
