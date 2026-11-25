import React, { useState } from 'react'
import { fmt } from '../money.js'
export default function ProductGrid({ products, onAdd }) {
  const [cat, setCat] = useState('All')
  const [q, setQ] = useState('')
  const cats = ['All', ...new Set(products.map(p => p.cat))]
  const shown = products.filter(p => (cat === 'All' || p.cat === cat) && p.name.toLowerCase().includes(q.toLowerCase()))
  return (
    <section>
      <div className="bar">
        <input placeholder="Search products" value={q} onChange={e => setQ(e.target.value)} />
        {cats.map(c => <button key={c} className={cat === c ? 'chip on' : 'chip'} onClick={() => setCat(c)}>{c}</button>)}
      </div>
      <div className="grid">{shown.map(p => (
        <button key={p.id} className="prod" disabled={p.stock === 0} onClick={() => onAdd(p)}>
          <img src={p.img} alt={p.name} /><b>{p.name}</b><span>{fmt(p.price)}</span>
          <em className={p.stock < 10 ? 'low' : ''}>{p.stock === 0 ? 'Sold out' : p.stock + ' left'}</em>
        </button>))}</div>
    </section>
  )
}
