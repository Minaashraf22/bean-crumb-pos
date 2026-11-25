import { useState } from 'react'
import { usePos } from './hooks/usePos.js'
import Header from './components/Header.jsx'
import ProductGrid from './components/ProductGrid.jsx'
import CartPanel from './components/CartPanel.jsx'
import Inventory from './components/Inventory.jsx'
import Reports from './components/Reports.jsx'
import ReceiptModal from './components/ReceiptModal.jsx'

export default function App() {
  const [tab, setTab] = useState('sell')
  const pos = usePos()
  return (
    <div className="app">
      <Header tab={tab} setTab={setTab} />
      {tab === 'sell' && <main className="sell"><ProductGrid products={pos.products} onAdd={pos.add} /><CartPanel pos={pos} /></main>}
      {tab === 'inventory' && <Inventory products={pos.products} onRestock={pos.restock} />}
      {tab === 'reports' && <Reports sales={pos.sales} revenue={pos.revenue} best={pos.best} onReset={pos.reset} />}
      {pos.receipt && <ReceiptModal receipt={pos.receipt} onClose={() => pos.setReceipt(null)} />}
    </div>
  )
}
