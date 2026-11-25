import { useEffect, useMemo, useState } from 'react'
import { initialProducts } from '../products.js'
import { orderTotals } from '../money.js'

const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d } catch { return d } }

// All POS state: catalogue, sales, current order, payment and reports.
export function usePos() {
  const [products, setProducts] = useState(() => load('pos-products', initialProducts))
  const [sales, setSales] = useState(() => load('pos-sales', []))
  const [cart, setCart] = useState([])
  const [discount, setDiscount] = useState(0)
  const [method, setMethod] = useState('Cash')
  const [receipt, setReceipt] = useState(null)
  useEffect(() => localStorage.setItem('pos-products', JSON.stringify(products)), [products])
  useEffect(() => localStorage.setItem('pos-sales', JSON.stringify(sales)), [sales])

  const totals = orderTotals(cart, discount)
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
    const sale = { no: 1000 + sales.length + 1, at: new Date().toLocaleString(), items: cart, ...totals, method }
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
  return { products, sales, cart, totals, discount, setDiscount, method, setMethod, receipt, setReceipt, add, change, pay, restock, reset, revenue, best }
}
