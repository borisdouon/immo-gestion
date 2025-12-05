/**
 * Formate un montant en FCFA
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Formate une date au format français
 */
export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

/**
 * Formate un numéro de téléphone
 */
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/[^\d+]/g, '')
  
  if (cleaned.startsWith('+225')) {
    const number = cleaned.slice(4)
    if (number.length === 10) {
      return `+225 ${number.slice(0, 2)} ${number.slice(2, 4)} ${number.slice(4, 6)} ${number.slice(6, 8)} ${number.slice(8)}`
    }
  }
  
  return cleaned
}


