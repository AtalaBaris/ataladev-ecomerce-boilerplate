/**
 * @param {string | Date} date
 * @returns {string}
 */
export function formatDate(date) {
  return new Intl.DateTimeFormat('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date));
}
