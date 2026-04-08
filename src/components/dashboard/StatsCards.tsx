import { CheckCircle, Clock, AlertCircle, MapPin } from 'lucide-react'

const stats = [
  { label: 'Total Reports', value: '1,420', icon: MapPin, color: 'text-blue-500', bg: 'bg-blue-50' },
  { label: 'Resolved', value: '890', icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50' },
  { label: 'In Progress', value: '320', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' },
  { label: 'Active Hazards', value: '210', icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50' },
]

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, i) => (
        <div key={i} className="p-6 rounded-3xl bg-card border border-border shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
              <stat.icon className="h-6 w-6" />
            </div>
            <span className="text-2xl font-bold">{stat.value}</span>
          </div>
          <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
        </div>
      ))}
    </div>
  )
}
