import { useEffect, useState } from 'react'
import { DollarSign, TrendingUp, Tag, Menu } from 'lucide-react'
import SummaryCard from '../components/SummaryCard'
import ExpenseTable from '../components/ExpenseTable'
import FilterBar from '../components/FilterBar'
import Sidebar from '../components/Sidebar'
import LoadingSpinner from '../components/LoadingSpinner'
import { useExpenses } from '../hooks/useExpenses'
import { getMonthlySummary } from '../api/expensesApi'
import { getUserEmail } from '../utils/auth'
import { formatCurrency as fmtCur } from '../utils/helpers'

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [monthlyTotal, setMonthlyTotal] = useState(0)
  const [categoryCount, setCategoryCount] = useState(0)
  const {
    expenses,
    loading,
    fetchExpenses,
    updateExpense,
    deleteExpense,
    filterByCategory,
    filterByDate,
  } = useExpenses()

  const email = getUserEmail() || 'Student'

  useEffect(() => {
    fetchExpenses()
    loadMonthlySummary()
  }, [])

  // Fetch monthly total from backend: GET /api/expenses/monthly
  const loadMonthlySummary = async () => {
    try {
      const res = await getMonthlySummary()
      const data = res.data
      // Backend may return a number, array, or object — handle all cases
      if (typeof data === 'number') {
        setMonthlyTotal(data)
      } else if (Array.isArray(data) && data.length > 0) {
        const latest = data[data.length - 1]
        setMonthlyTotal(latest.total || latest.amount || 0)
      } else if (data && typeof data === 'object') {
        setMonthlyTotal(data.total || data.amount || 0)
      }
    } catch {
      // If endpoint not available, monthly card shows 0
    }
  }

  useEffect(() => {
    const cats = new Set(expenses.map((e) => e.category))
    setCategoryCount(cats.size)
  }, [expenses])

  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0)

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <header className="sticky top-0 z-10 bg-slate-950/80 backdrop-blur-sm border-b border-white/5 px-6 py-4 flex items-center gap-4">
          <button
            className="lg:hidden text-slate-400 hover:text-white"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={22} />
          </button>
          <div>
            <h1 className="text-lg font-bold text-white">Dashboard</h1>
            <p className="text-xs text-slate-400">
              Welcome back <span className="text-primary-400"></span> 👋
            </p>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {/* Summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <SummaryCard
              icon={DollarSign}
              label="Total Expenses"
              value={fmtCur(totalExpenses)}
              color="primary"
              trend={`${expenses.length} transactions`}
            />
            <SummaryCard
              icon={TrendingUp}
              label="This Month"
              value={fmtCur(monthlyTotal)}
              color="purple"
              trend="Current month spending"
            />
            <SummaryCard
              icon={Tag}
              label="Categories Used"
              value={categoryCount}
              color="emerald"
              trend="Distinct expense types"
            />
          </div>

          {/* Filter bar */}
          <FilterBar
            onFilterCategory={filterByCategory}
            onFilterDate={filterByDate}
            onReset={fetchExpenses}
          />

          {/* Expense table */}
          <div>
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Recent Expenses
            </h2>
            {loading ? (
              <LoadingSpinner />
            ) : (
              <ExpenseTable
                expenses={expenses}
                loading={loading}
                onUpdate={updateExpense}
                onDelete={deleteExpense}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
