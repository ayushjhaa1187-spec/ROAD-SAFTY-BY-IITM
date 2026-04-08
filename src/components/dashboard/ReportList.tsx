'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/db/supabase'
import { formatDate, cn } from '@/lib/utils'
import { MoreHorizontal, ExternalLink, Filter } from 'lucide-react'

export function ReportList() {
  const [reports, setReports] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)
    
    if (data) setReports(data)
    setLoading(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-700'
      case 'verified': return 'bg-blue-100 text-blue-700'
      case 'forwarded': return 'bg-purple-100 text-purple-700'
      case 'resolved': return 'bg-green-100 text-green-700'
      default: return 'bg-slate-100 text-slate-700'
    }
  }

  return (
    <div className="bg-card border rounded-3xl overflow-hidden shadow-sm">
      <div className="p-6 border-b flex justify-between items-center">
        <h3 className="font-bold text-lg">Recent Reports</h3>
        <button className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
          <Filter className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
              <th className="px-6 py-4">Issue Type</th>
              <th className="px-6 py-4">Level</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Reported On</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? (
              Array(5).fill(0).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={5} className="px-6 py-4 h-16 bg-slate-50/20" />
                </tr>
              ))
            ) : reports.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                  No reports found.
                </td>
              </tr>
            ) : (
              reports.map((report) => (
                <tr key={report.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-bold text-sm block">{report.issue_type}</span>
                    <span className="text-[10px] text-muted-foreground line-clamp-1 max-w-[200px]">{report.description}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2 py-1 rounded-lg text-[10px] font-bold uppercase",
                      report.severity === 'critical' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600'
                    )}>
                      {report.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2 py-1 rounded-lg text-[10px] font-bold uppercase",
                      getStatusColor(report.status)
                    )}>
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {formatDate(report.created_at)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-white border transparent hover:border-slate-200 rounded-xl transition-all">
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
