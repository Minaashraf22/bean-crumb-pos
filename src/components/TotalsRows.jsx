import React from 'react'
import { fmt } from '../money.js'
// Shared by the live cart and the printed receipt so both always show the same maths.
export default function TotalsRows({ t, totalLabel = 'Total' }) {
  return (
    <>
      <div className="sum"><span>Subtotal</span><span>{fmt(t.sub)}</span></div>
      <div className="sum"><span>Discount ({t.rate}%)</span><span>{t.disc > 0 ? '-' : ''}{fmt(t.disc)}</span></div>
      <div className="sum"><span>Taxable amount</span><span>{fmt(t.base)}</span></div>
      <div className="sum"><span>VAT 14%</span><span>{fmt(t.tax)}</span></div>
      <div className="sum total"><span>{totalLabel}</span><span>{fmt(t.total)}</span></div>
    </>
  )
}
