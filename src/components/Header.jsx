import React from 'react'
export default function Header({ tab, setTab }) {
  return (
    <header>
      <div className="brand"><span className="logo">B&amp;C</span><b>Bean &amp; Crumb</b><small>POS demo</small></div>
      <nav>{['sell', 'inventory', 'reports'].map(t => <button key={t} className={tab === t ? 'on' : ''} onClick={() => setTab(t)}>{t}</button>)}</nav>
    </header>
  )
}
