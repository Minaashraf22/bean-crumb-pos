import { useEffect, useMemo, useState } from 'react'
import { initialProducts } from './products.js'

const TAX = 0.14
const r2 = n => Math.round((n + Number.EPSILON) * 100) / 100
const fmt = n => r2(n).toFixed(2) + ' EGP'
const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d } catch { return d } }

export default function App() {
  const [products, setProducts] = useState(() => load('pos-products', initialProducts))
  const [sales, setSales] = useState(() => load('pos-sales', []))
  const [cart, setCart] = useState([])
  const [cat, setCat] = useState('All')
  const [q, setQ] = useState('')
  const [discount, setDiscount] = useState(0)
  const [method, setMethod] = useState('Cash')
  const [receipt, setReceipt] = useState(null)
  const [tab, setTab] = useState('sell')

  useEffect(() => localStorage.setItem('pos-products', JSON.stringify(products)), [products])
  useEffect(() => localStorage.setItem('pos-sales', JSON.stringify(sales)), [sales])

  const cats = ['All', ...new Set(products.map(p => p.cat))]
  const shown = products.filter(p => (cat === 'All' || p.cat === cat) && p.name.toLowerCase().includes(q.toLowerCase()))
  const rate = Math.min(Math.max(Number.isFinite(discount) ? discount : 0, 0), 100)
  const sub = r2(cart.reduce((s, i) => s + i.price * i.qty, 0))
  const disc = r2(sub * rate / 100)
  const base = r2(sub - disc)
  const tax = r2(base * TAX)
  const total = r2(base + tax)

  const add = p => {
    const inCart = cart.find(i => i.id === p.id)?.qty || 0
    if (inCart >= p.stock) return
    setCart(c => c.some(i => i.id === p.id) ? c.map(i => i.id === p.id ? { ...i, qty: i.qty + 1 } : i) : [...c, { ...p, qty: 1 }])
  }
  const change = (id, d) => setCart(c => c.flatMap(i => {
    if (i.id !== id) return [i]
    const p = products.find(x => x.id === id)
    const qty = Math.min(i.qty + d, p.stock)
    return qty <= 0 ? [] : [{ ...i, qty }]
  }))
  const pay = () => {
    if (!cart.length) return
    const sale = { no: 1000 + sales.length + 1, at: new Date().toLocaleString(), items: cart, sub, disc, rate, base, tax, total, method }
    if (cart.some(i => i.qty > (products.find(p => p.id === i.id)?.stock ?? 0))) return
    setSales([...sales, sale])
    setProducts(ps => ps.map(p => { const i = cart.find(c => c.id === p.id); return i ? { ...p, stock: p.stock - i.qty } : p }))
    setReceipt(sale); setCart([]); setDiscount(0)
  }
  const restock = id => setProducts(ps => ps.map(p => p.id === id ? { ...p, stock: p.stock + 10 } : p))
  const reset = () => { setProducts(initialProducts); setSales([]); setCart([]) }
  const revenue = useMemo(() => sales.reduce((s, x) => s + x.total, 0), [sales])
  const best = useMemo(() => {
    const m = {}; sales.forEach(s => s.items.forEach(i => { m[i.name] = (m[i.name] || 0) + i.qty }))
    return Object.entries(m).sort((a, b) => b[1] - a[1]).slice(0, 3)
  }, [sales])

  return (
    <div className="app">
      <header>
        <div className="brand"><span className="logo">B&amp;C</span><b>Bean &amp; Crumb</b><small>POS demo</small></div>
        <nav>{['sell', 'inventory', 'reports'].map(t => <button key={t} className={tab === t ? 'on' : ''} onClick={() => setTab(t)}>{t}</button>)}</nav>
      </header>

      {tab === 'sell' && (
        <main className="sell">
          <section>
            <div className="bar">
              <input placeholder="Search products" value={q} onChange={e => setQ(e.target.value)} />
              {cats.map(c => <button key={c} className={cat === c ? 'chip on' : 'chip'} onClick={() => setCat(c)}>{c}</button>)}
            </div>
            <div className="grid">{shown.map(p => (
              <button key={p.id} className="prod" disabled={p.stock === 0} onClick={() => add(p)}>
                <img src={p.img} alt={p.name} /><b>{p.name}</b><span>{fmt(p.price)}</span>
                <em className={p.stock < 10 ? 'low' : ''}>{p.stock === 0 ? 'Sold out' : p.stock + ' left'}</em>
              </button>))}</div>
          </section>
          <aside className="cart">
            <h3>Current order</h3>
            {!cart.length && <p className="muted">Tap a product to add it.</p>}
            {cart.map(i => (
              <div className="line" key={i.id}><span>{i.name}</span>
                <span className="qty"><button onClick={() => change(i.id, -1)}>-</button>{i.qty}<button onClick={() => change(i.id, 1)}>+</button></span>
                <b>{fmt(i.price * i.qty)}</b></div>))}
            <label>Discount % <input type="number" min="0" max="100" step="1" value={discount} onChange={e => setDiscount(Math.min(100, Math.max(0, +e.target.value || 0)))} /></label>
            <div className="sum"><span>Subtotal</span><span>{fmt(sub)}</span></div>
            <div className="sum"><span>Discount ({rate}%)</span><span>{disc > 0 ? "-" : ""}{fmt(disc)}</span></div>
            <div className="sum"><span>Taxable amount</span><span>{fmt(base)}</span></div>
            <div className="sum"><span>VAT 14%</span><span>{fmt(tax)}</span></div>
            <div className="sum total"><span>Total</span><span>{fmt(total)}</span></div>
            <div className="methods">{['Cash', 'Card', 'Wallet'].map(m => <button key={m} className={method === m ? 'chip on' : 'chip'} onClick={() => setMethod(m)}>{m}</button>)}</div>
            <button className="pay" disabled={!cart.length} onClick={pay}>Charge {fmt(total)}</button>
          </aside>
        </main>
      )}

      {tab === 'inventory' && (
        <main className="page"><h2>Inventory</h2>
          <table><thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th></th></tr></thead>
            <tbody>{products.map(p => <tr key={p.id}><td>{p.name}</td><td>{p.cat}</td><td>{fmt(p.price)}</td>
              <td className={p.stock < 10 ? 'low' : ''}>{p.stock}</td><td><button className="chip" onClick={() => restock(p.id)}>+10 stock</button></td></tr>)}</tbody></table>
        </main>)}

      {tab === 'reports' && (
        <main className="page"><h2>Today</h2>
          <div className="kpis"><div><small>Orders</small><b>{sales.length}</b></div><div><small>Revenue</small><b>{fmt(revenue)}</b></div>
            <div><small>Avg. order</small><b>{fmt(sales.length ? revenue / sales.length : 0)}</b></div></div>
          <h3>Best sellers</h3>{best.length ? best.map(([n, c]) => <p key={n}>{n}: {c}</p>) : <p className="muted">No sales yet.</p>}
          <h3>Recent orders</h3>{[...sales].reverse().slice(0, 8).map(s => <p key={s.no}>#{s.no} · {s.at} · {s.method} · {fmt(s.total)}</p>)}
          <button className="chip" onClick={reset}>Reset demo data</button>
        </main>)}

      {receipt && (
        <div className="modal" onClick={() => setReceipt(null)}>
          <div className="receipt" onClick={e => e.stopPropagation()}>
            <h3>Bean &amp; Crumb</h3><small>Receipt #{receipt.no} · {receipt.at}</small>
            {receipt.items.map(i => <div className="sum" key={i.id}><span>{i.qty} x {i.name}</span><span>{fmt(i.qty * i.price)}</span></div>)}
            <hr />
            <div className="sum"><span>Subtotal</span><span>{fmt(receipt.sub)}</span></div>
            <div className="sum"><span>Discount ({receipt.rate}%)</span><span>{receipt.disc > 0 ? "-" : ""}{fmt(receipt.disc)}</span></div>
            <div className="sum"><span>Taxable amount</span><span>{fmt(receipt.base)}</span></div>
            <div className="sum"><span>VAT 14%</span><span>{fmt(receipt.tax)}</span></div>
            <div className="sum total"><span>Total ({receipt.method})</span><span>{fmt(receipt.total)}</span></div>
            <button className="pay" onClick={() => window.print()}>Print</button>
            <button className="chip" onClick={() => setReceipt(null)}>Close</button>
          </div>
        </div>)}
    </div>
  )
}
