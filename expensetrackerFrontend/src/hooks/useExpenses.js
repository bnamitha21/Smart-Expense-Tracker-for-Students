import { useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import {
  getExpenses,
  addExpense as apiAddExpense,
  updateExpense as apiUpdateExpense,
  deleteExpense as apiDeleteExpense,
  getExpensesByCategory,
  getExpensesByDate,
} from '../api/expensesApi'
import { getErrorMessage } from '../utils/helpers'

export function useExpenses() {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchExpenses = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await getExpenses()
      setExpenses(res.data)
    } catch (err) {
      const msg = getErrorMessage(err)
      setError(msg)
    } finally {
      setLoading(false)
    }
  }, [])

  const addExpense = useCallback(async (data) => {
    setLoading(true)
    try {
      await apiAddExpense(data)
      toast.success('Expense added successfully!')
      await fetchExpenses()
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [fetchExpenses])

  const updateExpense = useCallback(async (id, data) => {
    setLoading(true)
    try {
      await apiUpdateExpense(id, data)
      toast.success('Expense updated!')
      await fetchExpenses()
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [fetchExpenses])

  const deleteExpense = useCallback(async (id) => {
    setLoading(true)
    try {
      await apiDeleteExpense(id)
      toast.success('Expense deleted.')
      await fetchExpenses()
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [fetchExpenses])

  const filterByCategory = useCallback(async (category) => {
    if (!category) return fetchExpenses()
    setLoading(true)
    try {
      const res = await getExpensesByCategory(category)
      setExpenses(res.data)
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [fetchExpenses])

  const filterByDate = useCallback(async (date) => {
    if (!date) return fetchExpenses()
    setLoading(true)
    try {
      const res = await getExpensesByDate(date)
      setExpenses(res.data)
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [fetchExpenses])

  return {
    expenses,
    loading,
    error,
    fetchExpenses,
    addExpense,
    updateExpense,
    deleteExpense,
    filterByCategory,
    filterByDate,
  }
}
