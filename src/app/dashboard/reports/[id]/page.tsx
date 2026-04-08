'use client'

import { useState, useEffect, use } from 'react'
import { createClient } from '@/lib/db/supabase'
import { formatDate, cn } from '@/lib/utils'
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  User, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Shield, 
  ExternalLink,
  ChevronRight
} from 'lucide-react'
import Link from 'next/link'
import dynamic from 'next/dynamic'

const Map = dynamic(() => import('@/components/reporting/LocationPicker'), { ssr: false })

export default function ReportDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [report, setReport] = useState<any>(null)
  const [media, setMedia] = useState<any[]>([])
  const [updates, setUpdates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchReportDetails()
  }, [id])

  const fetchReportDetails = async () => {
    setLoading(true)
    const { data: reportData } = await supabase
      .from('reports')
      .select('*, profiles(full_name, email)')
      .eq('id', id)
      .single()
    
    const { data: mediaData } = await supabase
      .from('report_media')
      .select('*')
      .eq('report_id', id)

    const { data: updateData } = await supabase
      .from('status_updates')
      .select('*, profiles(full_name)')
      .eq('report_id', id)
      .order('created_at', { ascending: false })

    setReport(reportData)
    setMedia(mediaData || [])
    setUpdates(updateData || [])
    setLoading(false)
  }

  const handleStatusUpdate = async (newStatus: string) => {
    const { data: { user } } = await supabase.auth.getUser()
    
    await supabase.from('reports').update({ status: newStatus }).eq('id', id)
    await supabase.from('status_updates').insert({
      report_id: id,
      status: newStatus,
      updated_by: user?.id,
      comment: `Status changed to ${newStatus}`
    })
    
    fetchReportDetails()
  }

  if (loading) return <div className="p-8 text-center">Loading Report...</div>
  if (!report) return <div className="p-8 text-center">Report not found.</div>

  const statusColors: any = {
    open: 'bg-red-100 text-red-700',
    verified: 'bg-blue-100 text-blue-700',
    forwarded: 'bg-purple-100 text-purple-700',
    resolved: 'bg-green-100 text-green-700',
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link 
          href="/dashboard" 
          className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-slate-900 mb-8 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className={cn("px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2 inline-block", statusColors[report.status])}>
                    {report.status}
                  </span>
                  <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 capitalize">{report.issue_type.replace('_', ' ')}</h1>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Severity</span>
                  <span className={cn(
                    "px-3 py-1 rounded-lg text-sm font-bold capitalize",
                    report.severity === 'critical' ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-900'
                  )}>
                    {report.severity}
                  </span>
                </div>
              </div>

              <p className="text-slate-600 leading-relaxed text-lg mb-8">
                {report.description}
              </p>

              {media.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  {media.map((item) => (
                    <div key={item.id} className="aspect-video rounded-2xl overflow-hidden shadow-sm">
                      <img src={item.url} alt="Report Media" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-slate-100">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> Reported On
                  </span>
                  <p className="font-bold text-sm tracking-tight">{formatDate(report.created_at)}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                    <User className="h-3 w-3" /> Reported By
                  </span>
                  <p className="font-bold text-sm tracking-tight">{report.profiles?.full_name || 'Anonymous'}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> Coordinates
                  </span>
                  <p className="font-bold text-[10px] tracking-tight text-slate-500">{report.lat.toFixed(4)}, {report.lng.toFixed(4)}</p>
                </div>
              </div>
            </div>

            {/* AI Summary Block */}
            {report.ai_summary && (
              <div className="bg-blue-600 rounded-3xl p-8 text-white shadow-xl shadow-blue-600/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Shield className="h-32 w-32" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                    <Shield className="h-5 w-5" />
                    <span className="text-xs font-bold uppercase tracking-widest">AI Audit Summary</span>
                  </div>
                  <p className="text-xl font-medium leading-relaxed italic opacity-90">
                    "{report.ai_summary}"
                  </p>
                </div>
              </div>
            )}

            {/* Admin Timeline */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold mb-8 flex items-center gap-2">
                <Clock className="h-5 w-5 text-slate-400" />
                Resolution Timeline
              </h3>
              <div className="space-y-8 border-l-2 border-slate-100 ml-4 pl-8">
                {updates.map((update, i) => (
                  <div key={update.id} className="relative">
                    <div className="absolute -left-[41px] top-1 h-4 w-4 rounded-full bg-white border-4 border-blue-600 shadow-sm" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold uppercase", statusColors[update.status])}>
                          {update.status}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold">{formatDate(update.created_at)}</span>
                      </div>
                      <p className="text-sm font-medium text-slate-600">{update.comment}</p>
                      <p className="text-[10px] text-slate-400 mt-1">Updated by {update.profiles?.full_name || 'System'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">Location Context</h3>
              <div className="h-64 rounded-2xl overflow-hidden border border-slate-100 mb-4">
                <Map onLocationSelect={() => {}} initialLocation={[report.lat, report.lng]} />
              </div>
              <button className="w-full py-3 bg-slate-900 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all">
                <ExternalLink className="h-4 w-4" />
                Open in Maps
              </button>
            </div>

            {/* Authority Actions */}
            <div className="bg-slate-900 p-6 rounded-3xl shadow-xl shadow-slate-900/10 text-white">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6">Authority Actions</h3>
              <div className="space-y-3">
                {['verified', 'forwarded', 'in_progress', 'resolved'].map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusUpdate(status)}
                    className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-bold flex items-center justify-between group transition-all"
                  >
                    <span className="capitalize">Mark as {status}</span>
                    <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
