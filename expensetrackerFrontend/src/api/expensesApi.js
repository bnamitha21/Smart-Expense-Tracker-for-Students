import api from './axiosInstance'

export const getExpenses = () => api.get('/expenses')

export const addExpense = (data) => api.post('/expenses', data)

export const updateExpense = (id, data) => api.put(`/expenses/${id}`, data)

export const deleteExpense = (id) => api.delete(`/expenses/${id}`)

// Filter by category — query param: /expenses/category?category=Food
export const getExpensesByCategory = (category) =>
  api.get('/expenses/category', { params: { category } })

// Filter by date — query param: /expenses/date?date=yyyy-MM-dd
export const getExpensesByDate = (date) =>
  api.get('/expenses/date', { params: { date } })

// Analytics: returns [["Food", 950], ["Shopping", 100], ...]
export const getAnalytics = () => api.get('/expenses/analytics')

// Monthly summary for Dashboard card: GET /api/expenses/monthly
export const getMonthlySummary = () => api.get('/expenses/monthly')
