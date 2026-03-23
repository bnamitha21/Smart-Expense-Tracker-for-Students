import { Receipt } from 'lucide-react'

export default function EmptyState({ message = 'No expenses yet', subtext = 'Add your first expense to get started!', action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center animate-fade-in">
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-600/20 to-accent-600/20 border border-white/10 flex items-center justify-center mb-5">
        <Receipt size={36} className="text-primary-400" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{message}</h3>
      <p className="text-slate-400 text-sm max-w-xs mb-6">{subtext}</p>
      {action && action}
    </div>
  )
}
