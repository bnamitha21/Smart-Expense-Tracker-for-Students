import { useEffect, useState } from 'react'
import { Menu, PlusCircle } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import ExpenseForm from '../components/ExpenseForm'
import ExpenseTable from '../components/ExpenseTable'
import FilterBar from '../components/FilterBar'
import { useExpenses } from '../hooks/useExpenses'

export default function AddExpensePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const {
    expenses,
    loading,
    fetchExpenses,
    addExpense,
    updateExpense,
    deleteExpense,
    filterByCategory,
    filterByDate,
  } = useExpenses()

  useEffect(() => {
    fetchExpenses()
  }, [])

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-10 bg-slate-950/80 backdrop-blur-sm border-b border-white/5 px-6 py-4 flex items-center gap-4">
          <button
            className="lg:hidden text-slate-400 hover:text-white"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={22} />
          </button>
          <div className="flex items-center gap-2">
            <PlusCircle size={20} className="text-primary-400" />
            <h1 className="text-lg font-bold text-white">Add Expense</h1>
          </div>
        </header>

        <div className="p-6 space-y-6">
          <ExpenseForm onSubmit={addExpense} loading={loading} />

          <div>
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
              All Expenses
            </h2>
            <FilterBar
              onFilterCategory={filterByCategory}
              onFilterDate={filterByDate}
              onReset={fetchExpenses}
            />
            <div className="mt-4">
              <ExpenseTable
                expenses={expenses}
                loading={loading}
                onUpdate={updateExpense}
                onDelete={deleteExpense}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
