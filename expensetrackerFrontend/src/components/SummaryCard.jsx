export default function SummaryCard({ icon: Icon, label, value, color = 'primary', trend }) {
  const colorMap = {
    primary: {
      bg: 'from-primary-600/20 to-primary-800/10',
      icon: 'from-primary-500 to-primary-600',
      text: 'text-primary-400',
      border: 'border-primary-500/20',
    },
    purple: {
      bg: 'from-accent-600/20 to-accent-800/10',
      icon: 'from-accent-500 to-accent-600',
      text: 'text-accent-400',
      border: 'border-accent-500/20',
    },
    amber: {
      bg: 'from-amber-600/20 to-amber-800/10',
      icon: 'from-amber-500 to-amber-600',
      text: 'text-amber-400',
      border: 'border-amber-500/20',
    },
    emerald: {
      bg: 'from-emerald-600/20 to-emerald-800/10',
      icon: 'from-emerald-500 to-emerald-600',
      text: 'text-emerald-400',
      border: 'border-emerald-500/20',
    },
  }

  const c = colorMap[color] || colorMap.primary

  return (
    <div className={`glass-card p-5 bg-gradient-to-br ${c.bg} border ${c.border} animate-fade-in hover:scale-[1.02] transition-transform duration-200 glow`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-400 font-medium mb-1">{label}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
          {trend && (
            <p className={`text-xs mt-1 ${c.text}`}>{trend}</p>
          )}
        </div>
        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${c.icon} flex items-center justify-center shadow-lg`}>
          <Icon size={20} className="text-white" />
        </div>
      </div>
    </div>
  )
}
