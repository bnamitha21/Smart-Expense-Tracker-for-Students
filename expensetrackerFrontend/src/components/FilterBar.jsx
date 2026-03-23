import { useState } from 'react'
import { Filter, X } from 'lucide-react'
import { CATEGORIES } from '../utils/helpers'

export default function FilterBar({ onFilterCategory, onFilterDate, onReset }) {
  const [category, setCategory] = useState('')
  const [date, setDate] = useState('')

  const handleCategoryChange = (e) => {
    const val = e.target.value
    setCategory(val)
    onFilterCategory(val)
  }

  const handleDateChange = (e) => {
    const val = e.target.value
    setDate(val)
    onFilterDate(val)
  }

  const handleReset = () => {
    setCategory('')
    setDate('')
    onReset()
  }

  const hasFilter = category || date

  return (
    <div className="glass-card px-5 py-4 flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2 text-slate-400 text-sm">
        <Filter size={15} />
        <span className="font-medium">Filter by</span>
      </div>

      {/* Category filter */}
      <select
        id="filter-category"
        value={category}
        onChange={handleCategoryChange}
        className="input-field w-auto text-sm py-2 px-3 bg-slate-900 cursor-pointer"
      >
        <option value="">All Categories</option>
        {CATEGORIES.map((cat) => (
          <option key={cat} value={cat} className="bg-slate-900">
            {cat}
          </option>
        ))}
      </select>

      {/* Date filter */}
      <input
        id="filter-date"
        type="date"
        value={date}
        onChange={handleDateChange}
        className="input-field w-auto text-sm py-2"
        placeholder="Filter by date"
      />

      {/* Reset */}
      {hasFilter && (
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors ml-auto"
        >
          <X size={14} />
          Clear filters
        </button>
      )}
    </div>
  )
}
