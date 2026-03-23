import { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  PlusCircle,
  BarChart3,
  LogOut,
  Wallet,
  X,
  TrendingUp,
  ShoppingBag,
  Utensils,
  Car,
  Receipt,
  Zap,
  HelpCircle,
  Bell,
  Settings,
} from 'lucide-react'
import { removeToken, getUserEmail } from '../utils/auth'
import { getExpenses } from '../api/expensesApi'
import { formatCurrency } from '../utils/helpers'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/add', icon: PlusCircle, label: 'Add Expense' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
]

const CATEGORY_ICONS = {
  Food: Utensils,
  Shopping: ShoppingBag,
  Travel: Car,
  Bills: Zap,
  Other: Receipt,
}

const CATEGORY_COLORS = {
  Food: 'text-indigo-400',
  Shopping: 'text-pink-400',
  Travel: 'text-purple-400',
  Bills: 'text-amber-400',
  Other: 'text-emerald-400',
}

export default function Sidebar({ open, onClose }) {
  const navigate = useNavigate()
  const email = getUserEmail() || 'Student'
  const [stats, setStats] = useState({ total: 0, count: 0, categories: {} })

  useEffect(() => {
    if (open || window.innerWidth >= 1024) {
      loadStats()
    }
  }, [open])

  const loadStats = async () => {
    try {
      const res = await getExpenses()
      const expenses = res.data || []
      const total = expenses.reduce((s, e) => s + Number(e.amount || 0), 0)
      const categories = {}
      expenses.forEach((e) => {
        categories[e.category] = (categories[e.category] || 0) + Number(e.amount || 0)
      })
      setStats({ total, count: expenses.length, categories })
    } catch {
      // silent
    }
  }

  const handleLogout = () => {
    removeToken()
    navigate('/login')
  }

  const topCategory = Object.entries(stats.categories).sort((a, b) => b[1] - a[1])[0]

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 z-30 flex flex-col
          bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950
          border-r border-white/5
          transform transition-transform duration-300 ease-in-out
          ${open ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-auto
        `}
      >
        {/* ── Logo ── */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg">
              <Wallet size={18} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-sm text-white">ExpenseWise</p>
              <p className="text-xs text-slate-500">Student Tracker</p>
            </div>
          </div>
          <button className="lg:hidden text-slate-400 hover:text-white" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto">

          {/* User card */}
          <div className="px-3 pt-4">
            <div className="glass-card px-4 py-3 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 shrink-0 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center text-sm font-bold text-white">
                  {email.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-slate-500">Logged in as</p>
                  <p className="text-sm font-semibold text-white truncate">{email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="px-3 mt-5 space-y-0.5">
            <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-600">
              Navigation
            </p>
            {navItems.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
                  ${isActive
                    ? 'bg-gradient-to-r from-primary-600/30 to-accent-600/20 text-white border border-primary-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon size={17} className={isActive ? 'text-primary-400' : 'text-slate-500 group-hover:text-slate-300'} />
                    {label}
                    {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-400" />}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Quick Stats */}
          <div className="px-3 mt-6">
            <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-600">
              Quick Stats
            </p>
            <div className="glass-card rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Total Spent</span>
                <span className="text-sm font-bold text-white">{formatCurrency(stats.total)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Transactions</span>
                <span className="text-sm font-bold text-white">{stats.count}</span>
              </div>
              {topCategory && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Top Category</span>
                  <span className="text-xs font-semibold text-primary-400">{topCategory[0]}</span>
                </div>
              )}
              <div className="pt-1 border-t border-white/5">

              </div>
            </div>
          </div>

          {/* Category Breakdown */}
          {Object.keys(stats.categories).length > 0 && (
            <div className="px-3 mt-5">
              <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-600">
                By Category
              </p>
              <div className="glass-card rounded-xl p-3 space-y-2">
                {Object.entries(stats.categories)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 4)
                  .map(([cat, amount]) => {
                    const Icon = CATEGORY_ICONS[cat] || Receipt
                    const colorClass = CATEGORY_COLORS[cat] || 'text-slate-400'
                    const pct = stats.total > 0 ? Math.round((amount / stats.total) * 100) : 0
                    return (
                      <div key={cat}>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <Icon size={12} className={colorClass} />
                            <span className="text-xs text-slate-300">{cat}</span>
                          </div>
                          <span className="text-xs text-slate-400">{pct}%</span>
                        </div>
                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
              </div>
            </div>
          )}

          {/* Extra links */}
          <div className="px-3 mt-5">
            <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-600">
              More
            </p>
            <div className="space-y-0.5">
              {[
                { icon: Bell, label: 'Notifications', badge: null },
                { icon: Settings, label: 'Settings', badge: null },
                { icon: HelpCircle, label: 'Help & Support', badge: null },
              ].map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-200 group"
                >
                  <Icon size={17} className="text-slate-500 group-hover:text-slate-300" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Tip card */}
          <div className="px-3 mt-5 mb-3">
            <div className="rounded-xl bg-gradient-to-br from-primary-600/20 to-accent-600/20 border border-primary-500/20 p-4">
              <p className="text-xs font-semibold text-white mb-1">💡 Pro Tip</p>
              <p className="text-xs text-slate-400 leading-relaxed">
                Track daily expenses to stay within your monthly budget goal.
              </p>
            </div>
          </div>
        </div>

        {/* ── Logout ── */}
        <div className="p-3 border-t border-white/5 bg-slate-950/50">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 group"
          >
            <LogOut size={17} className="group-hover:text-red-400 transition-colors" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  )
}
