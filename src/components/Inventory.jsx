import React from 'react'
import { fmt } from '../money.js'
export default function Inventory({ products, onRestock }) {
  return (
    <main className="page"><h2>Inventory</h2>
      <table><thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th></th></tr></thead>
        <tbody>{products.map(p => <tr key={p.id}><td>{p.name}</td><td>{p.cat}</td><td>{fmt(p.price)}</td>
          <td className={p.stock < 10 ? 'low' : ''}>{p.stock}</td><td><button className="chip" onClick={() => onRestock(p.id)}>+10 stock</button></td></tr>)}</tbody></table>
    </main>
  )
}
