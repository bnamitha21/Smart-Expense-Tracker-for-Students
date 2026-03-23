export const CATEGORIES = ['Food', 'Shopping', 'Travel', 'Bills', 'Other']

export const CATEGORY_COLORS = {
  Food: '#6366f1',
  Travel: '#a855f7',
  Shopping: '#ec4899',
  Bills: '#f59e0b',
  Other: '#10b981',
}

export const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount)

export const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export const getErrorMessage = (error) => {
  if (error?.response?.data?.message) return error.response.data.message
  if (error?.response?.data?.error) return error.response.data.error
  if (error?.message) return error.message
  return 'Something went wrong. Please try again.'
}
