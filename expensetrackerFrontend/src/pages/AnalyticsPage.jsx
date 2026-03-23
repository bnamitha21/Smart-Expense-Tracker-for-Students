import { useEffect, useState } from 'react'
import { Menu, BarChart3, PieChart } from 'lucide-react'
import {
  PieChart as RechartsPie,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts'
import toast from 'react-hot-toast'
import Sidebar from '../components/Sidebar'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'
import { getAnalytics, getExpenses } from '../api/expensesApi'
import { getErrorMessage } from '../utils/helpers'

// 5 distinct colors for pie slices
const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f59e0b', '#10b981']

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card px-4 py-3 text-sm border border-white/10">
        {label && <p className="text-slate-400 mb-1">{label}</p>}
        <p className="text-white font-semibold">₹{Number(payload[0].value).toFixed(2)}</p>
      </div>
    )
  }
  return null
}

// Group a flat expense list by month → [{ month: "Mar", amount: 1050 }, ...]
function groupByMonth(expenses) {
  const map = {}
  expenses.forEach((exp) => {
    if (!exp.date) return
    const d = new Date(exp.date)
    const key = d.toLocaleString('default', { month: 'short', year: '2-digit' })
    map[key] = (map[key] || 0) + Number(exp.amount || 0)
  })
  return Object.entries(map)
    .map(([month, amount]) => ({ month, amount }))
    .sort((a, b) => {
      // keep chronological order based on first seen date
      return 0
    })
}

export default function AnalyticsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [categoryData, setCategoryData] = useState([])   // [{ name, value }]
  const [monthlyData, setMonthlyData] = useState([])   // [{ month, amount }]
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        // 1. GET /api/expenses/analytics → [["Food", 950], ...]
        const analyticsRes = await getAnalytics()
        const rawAnalytics = analyticsRes.data || []
        setCategoryData(
          rawAnalytics.map(([name, value]) => ({
            name: String(name),
            value: Number(value),
          }))
        )

        // 2. GET /api/expenses → group by month for bar chart
        const expensesRes = await getExpenses()
        const expenses = expensesRes.data || []
        setMonthlyData(groupByMonth(expenses))
      } catch (err) {
        toast.error(getErrorMessage(err))
      } finally {
        setLoading(false)
      }
    }
    load()
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
            <BarChart3 size={20} className="text-primary-400" />
            <h1 className="text-lg font-bold text-white">Analytics</h1>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

              {/* ── Category Pie Chart ── */}
              <div className="glass-card p-6 animate-fade-in">
                <div className="flex items-center gap-2 mb-5">
                  <PieChart size={18} className="text-accent-400" />
                  <h2 className="font-semibold text-white">Category Breakdown</h2>
                </div>
                {categoryData.length === 0 ? (
                  <EmptyState message="No data available" subtext="Add expenses to see a breakdown." />
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPie>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={110}
                        paddingAngle={4}
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                        labelLine={false}
                      >
                        {categoryData.map((_, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend
                        formatter={(value) => (
                          <span className="text-slate-300 text-sm">{value}</span>
                        )}
                      />
                    </RechartsPie>
                  </ResponsiveContainer>
                )}
              </div>

              {/* ── Monthly Bar Chart ── */}
              <div className="glass-card p-6 animate-fade-in">
                <div className="flex items-center gap-2 mb-5">
                  <BarChart3 size={18} className="text-primary-400" />
                  <h2 className="font-semibold text-white">Monthly Expenses</h2>
                </div>
                {monthlyData.length === 0 ? (
                  <EmptyState message="No data available" subtext="Add expenses to see monthly trends." />
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={monthlyData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                      <defs>
                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#6366f1" />
                          <stop offset="100%" stopColor="#a855f7" />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis
                        dataKey="month"
                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(v) => `₹${v}`}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="amount" radius={[6, 6, 0, 0]} fill="url(#barGradient)" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>

            </div>
          )}
        </div>
      </main>
    </div>
  )
}
