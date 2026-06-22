/**
 * @param {number} amount
 * @param {string} [currency]
 * @returns {string}
 */
export function formatCurrency(amount, currency = 'TRY') {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency,
  }).format(amount);
}
