import React from 'react'
import { fmt } from '../money.js'
export default function Reports({ sales, revenue, best, onReset }) {
  return (
    <main className="page"><h2>Today</h2>
      <div className="kpis"><div><small>Orders</small><b>{sales.length}</b></div><div><small>Revenue</small><b>{fmt(revenue)}</b></div>
        <div><small>Avg. order</small><b>{fmt(sales.length ? revenue / sales.length : 0)}</b></div></div>
      <h3>Best sellers</h3>{best.length ? best.map(([n, c]) => <p key={n}>{n}: {c}</p>) : <p className="muted">No sales yet.</p>}
      <h3>Recent orders</h3>{[...sales].reverse().slice(0, 8).map(s => <p key={s.no}>#{s.no} · {s.at} · {s.method} · {fmt(s.total)}</p>)}
      <button className="chip" onClick={onReset}>Reset demo data</button>
    </main>
  )
}
