import { useState, useEffect } from 'react'
import { CATEGORIES } from '../utils/helpers'
import { Save, X } from 'lucide-react'

const defaultForm = {
  amount: '',
  category: 'Food',
  description: '',
  date: new Date().toISOString().split('T')[0],
}

export default function ExpenseForm({ onSubmit, initialData = null, onCancel, loading = false }) {
  const [form, setForm] = useState(defaultForm)

  useEffect(() => {
    if (initialData) {
      setForm({
        amount: initialData.amount || '',
        category: initialData.category || 'Food',
        description: initialData.description || '',
        date: initialData.date ? initialData.date.split('T')[0] : new Date().toISOString().split('T')[0],
      })
    } else {
      setForm(defaultForm)
    }
  }, [initialData])

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) return
    onSubmit({ ...form, amount: Number(form.amount) })
    if (!initialData) setForm(defaultForm)
  }

  return (
    <form onSubmit={handleSubmit} className="glass-card p-6 animate-slide-up">
      <h2 className="text-lg font-semibold text-white mb-5">
        {initialData ? 'Edit Expense' : 'Add New Expense'}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Amount */}
        <div>
          <label htmlFor="amount" className="label">Amount (₹)</label>
          <input
            id="amount"
            name="amount"
            type="number"
            min="0"
            step="0.01"
            value={form.amount}
            onChange={handleChange}
            placeholder="e.g. 250"
            className="input-field"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="label">Category</label>
          <select
            id="category"
            name="category"
            value={form.category}
            onChange={handleChange}
            className="input-field bg-slate-900 cursor-pointer"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat} className="bg-slate-900">
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div className="sm:col-span-2">
          <label htmlFor="description" className="label">Description</label>
          <input
            id="description"
            name="description"
            type="text"
            value={form.description}
            onChange={handleChange}
            placeholder="What did you spend on?"
            className="input-field"
          />
        </div>

        {/* Date */}
        <div>
          <label htmlFor="date" className="label">Date</label>
          <input
            id="date"
            name="date"
            type="date"
            value={form.date}
            onChange={handleChange}
            className="input-field"
            required
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 mt-6">
        <button
          type="submit"
          disabled={loading}
          className="btn-primary flex items-center gap-2"
        >
          <Save size={16} />
          {loading ? 'Saving...' : initialData ? 'Update Expense' : 'Add Expense'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary flex items-center gap-2"
          >
            <X size={16} />
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}
