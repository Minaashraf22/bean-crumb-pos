import React from 'react'
import { fmt } from '../money.js'
import TotalsRows from './TotalsRows.jsx'
export default function CartPanel({ pos }) {
  const { cart, totals, discount, setDiscount, method, setMethod, change, pay } = pos
  return (
    <aside className="cart">
      <h3>Current order</h3>
      {!cart.length && <p className="muted">Tap a product to add it.</p>}
      {cart.map(i => (
        <div className="line" key={i.id}><span>{i.name}</span>
          <span className="qty"><button onClick={() => change(i.id, -1)}>-</button>{i.qty}<button onClick={() => change(i.id, 1)}>+</button></span>
          <b>{fmt(i.price * i.qty)}</b></div>))}
      <label>Discount % <input type="number" min="0" max="100" step="1" value={discount} onChange={e => setDiscount(Math.min(100, Math.max(0, +e.target.value || 0)))} /></label>
      <TotalsRows t={totals} />
      <div className="methods">{['Cash', 'Card', 'Wallet'].map(m => <button key={m} className={method === m ? 'chip on' : 'chip'} onClick={() => setMethod(m)}>{m}</button>)}</div>
      <button className="pay" disabled={!cart.length} onClick={pay}>Charge {fmt(totals.total)}</button>
    </aside>
  )
}
