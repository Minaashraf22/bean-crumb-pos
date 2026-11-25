export const TAX = 0.14
export const r2 = n => Math.round((n + Number.EPSILON) * 100) / 100
export const fmt = n => r2(n).toFixed(2) + ' EGP'
// Pure order maths: discount first, then 14% VAT on the discounted amount.
export function orderTotals(cart, discount) {
  const rate = Math.min(Math.max(Number.isFinite(discount) ? discount : 0, 0), 100)
  const sub = r2(cart.reduce((s, i) => s + i.price * i.qty, 0))
  const disc = r2(sub * rate / 100)
  const base = r2(sub - disc)
  const tax = r2(base * TAX)
  return { rate, sub, disc, base, tax, total: r2(base + tax) }
}
