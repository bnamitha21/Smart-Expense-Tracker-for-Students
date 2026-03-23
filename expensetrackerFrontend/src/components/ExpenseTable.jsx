import { useState } from 'react'
import { Pencil, Trash2, CircleDollarSign } from 'lucide-react'
import { formatCurrency, formatDate, CATEGORY_COLORS } from '../utils/helpers'
import EmptyState from './EmptyState'
import LoadingSpinner from './LoadingSpinner'
import ExpenseForm from './ExpenseForm'

export default function ExpenseTable({ expenses, loading, onDelete, onUpdate }) {
  const [editId, setEditId] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const editingExpense = expenses.find((e) => e.id === editId) || null

  const handleEdit = (expense) => setEditId(expense.id)
  const handleCancelEdit = () => setEditId(null)

  const handleUpdate = async (data) => {
    await onUpdate(editId, data)
    setEditId(null)
  }

  const handleDeleteClick = (id) => setDeleteConfirm(id)

  const handleDeleteConfirm = async () => {
    await onDelete(deleteConfirm)
    setDeleteConfirm(null)
  }

  if (loading) return <LoadingSpinner />

  if (!expenses.length) {
    return (
      <EmptyState
        message="No expenses found"
        subtext="Your expenses will appear here once you add them."
      />
    )
  }

  return (
    <div className="animate-fade-in">
      {/* Edit form */}
      {editId && (
        <div className="mb-5">
          <ExpenseForm
            initialData={editingExpense}
            onSubmit={handleUpdate}
            onCancel={handleCancelEdit}
            loading={loading}
          />
        </div>
      )}

      {/* Delete confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card p-6 max-w-sm w-full animate-slide-up">
            <h3 className="text-lg font-semibold text-white mb-2">Delete Expense?</h3>
            <p className="text-slate-400 text-sm mb-5">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={handleDeleteConfirm} className="btn-danger flex-1">
                Yes, Delete
              </button>
              <button onClick={() => setDeleteConfirm(null)} className="btn-secondary flex-1">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 bg-white/5">
                <th className="text-left px-5 py-3.5 text-slate-400 font-medium">Amount</th>
                <th className="text-left px-5 py-3.5 text-slate-400 font-medium">Category</th>
                <th className="text-left px-5 py-3.5 text-slate-400 font-medium hidden sm:table-cell">Description</th>
                <th className="text-left px-5 py-3.5 text-slate-400 font-medium hidden md:table-cell">Date</th>
                <th className="text-right px-5 py-3.5 text-slate-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense, idx) => (
                <tr
                  key={expense.id}
                  className={`border-b border-white/5 hover:bg-white/5 transition-colors ${idx % 2 === 0 ? '' : 'bg-white/[0.02]'
                    } ${editId === expense.id ? 'opacity-40' : ''}`}
                >
                  <td className="px-5 py-3.5 font-semibold text-white">
                    <div className="flex items-center gap-2">
                      <CircleDollarSign size={14} className="text-primary-400" />
                      {formatCurrency(expense.amount)}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className="badge text-white"
                      style={{
                        backgroundColor: `${CATEGORY_COLORS[expense.category] || '#6366f1'}30`,
                        border: `1px solid ${CATEGORY_COLORS[expense.category] || '#6366f1'}50`,
                        color: CATEGORY_COLORS[expense.category] || '#6366f1',
                      }}
                    >
                      {expense.category}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-400 hidden sm:table-cell max-w-xs truncate">
                    {expense.description || '—'}
                  </td>
                  <td className="px-5 py-3.5 text-slate-400 hidden md:table-cell">
                    {formatDate(expense.date)}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(expense)}
                        disabled={!!editId}
                        title="Edit"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-primary-400 hover:bg-primary-500/10 transition-colors disabled:opacity-40"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(expense.id)}
                        title="Delete"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-3 bg-white/[0.02] border-t border-white/5 text-xs text-slate-500">
          Showing {expenses.length} {expenses.length === 1 ? 'expense' : 'expenses'}
        </div>
      </div>
    </div>
  )
}
