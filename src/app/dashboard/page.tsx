import dynamic from 'next/dynamic'
import { StatsCards } from '@/components/dashboard/StatsCards'
import { ReportList } from '@/components/dashboard/ReportList'
import { Map as MapIcon, List as ListIcon, TrendingUp } from 'lucide-react'

const OverviewMap = dynamic(() => import('@/components/dashboard/OverviewMap'), { 
  ssr: false,
  loading: () => <div className="h-[500px] bg-slate-100 animate-pulse rounded-3xl" />
})

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gradient">Authority Dashboard</h1>
            <p className="text-muted-foreground">Strategic overview of road safety and infrastructure status.</p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-50 transition-all">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              Download Audit
            </button>
          </div>
        </div>

        {/* Stats */}
        <StatsCards />

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map View */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <MapIcon className="h-5 w-5 text-blue-500" />
                Live Geospatial View
              </h2>
            </div>
            <OverviewMap />
          </div>

          {/* List View */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <ListIcon className="h-5 w-5 text-blue-500" />
                Priority Queue
              </h2>
            </div>
            <ReportList />
          </div>
        </div>
      </div>
    </div>
  )
}
