import React from 'react'
import { fmt } from '../money.js'
import TotalsRows from './TotalsRows.jsx'
export default function ReceiptModal({ receipt, onClose }) {
  return (
    <div className="modal" onClick={onClose}>
      <div className="receipt" onClick={e => e.stopPropagation()}>
        <h3>Bean &amp; Crumb</h3><small>Receipt #{receipt.no} · {receipt.at}</small>
        {receipt.items.map(i => <div className="sum" key={i.id}><span>{i.qty} x {i.name}</span><span>{fmt(i.qty * i.price)}</span></div>)}
        <hr />
        <TotalsRows t={receipt} totalLabel={`Total (${receipt.method})`} />
        <button className="pay" onClick={() => window.print()}>Print</button>
        <button className="chip" onClick={onClose}>Close</button>
      </div>
    </div>
  )
}
