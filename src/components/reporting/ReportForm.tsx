'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { Camera, MapPin, AlertTriangle, Send, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/db/supabase'
import { cn } from '@/lib/utils'

const LocationPicker = dynamic(() => import('./LocationPicker'), { 
  ssr: false,
  loading: () => <div className="h-[400px] bg-slate-100 animate-pulse rounded-2xl flex items-center justify-center text-muted-foreground">Loading Map...</div>
})

const issueTypes = [
  { id: 'pothole', label: 'Pothole', icon: AlertTriangle },
  { id: 'crack', label: 'Road Crack', icon: AlertTriangle },
  { id: 'waterlogging', label: 'Waterlogging', icon: AlertTriangle },
  { id: 'missing_sign', label: 'Missing Sign', icon: AlertTriangle },
  { id: 'damaged_edge', label: 'Damaged Edge', icon: AlertTriangle },
  { id: 'other', label: 'Other', icon: AlertTriangle },
]

export default function ReportForm() {
  const router = useRouter()
  const supabase = createClient()
  
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    issue_type: '',
    description: '',
    lat: 0,
    lng: 0,
    severity: 'medium',
    media_url: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.issue_type || !formData.lat) {
      alert('Please select issue type and location')
      return
    }

    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      const { data, error } = await supabase
        .from('reports')
        .insert({
          user_id: user?.id,
          issue_type: formData.issue_type,
          description: formData.description,
          lat: formData.lat,
          lng: formData.lng,
          severity: formData.severity,
          status: 'open'
        })
        .select()
        .single()

      if (error) throw error

      router.push(`/dashboard?new_report=${data.id}`)
    } catch (error) {
      console.error('Error submitting report:', error)
      alert('Error submitting report. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto p-6 bg-card border rounded-3xl shadow-sm">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <AlertTriangle className="text-amber-500" />
          Report Road Issue
        </h2>
        <p className="text-muted-foreground">Provide details about the hazard to help authorities respond quickly.</p>
      </div>

      {/* Issue Type Selection */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {issueTypes.map((type) => (
          <button
            key={type.id}
            type="button"
            onClick={() => setFormData({ ...formData, issue_type: type.id })}
            className={cn(
              "p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 text-sm font-semibold",
              formData.issue_type === type.id 
                ? "border-blue-500 bg-blue-50 text-blue-700 shadow-md shadow-blue-500/10" 
                : "border-slate-100 hover:border-slate-200"
            )}
          >
            <type.icon className={cn("h-6 w-6", formData.issue_type === type.id ? "text-blue-500" : "text-slate-400")} />
            {type.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          {/* Severity */}
          <div>
            <label className="block text-sm font-bold mb-3">Severity Level</label>
            <div className="flex gap-2">
              {['low', 'medium', 'high', 'critical'].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setFormData({ ...formData, severity: s })}
                  className={cn(
                    "flex-1 py-2 px-3 rounded-xl border text-xs font-bold capitalize transition-all",
                    formData.severity === s 
                      ? "bg-slate-900 text-white border-slate-900" 
                      : "border-slate-200 text-muted-foreground hover:border-slate-300"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-bold mb-2">Description</label>
            <textarea
              required
              rows={4}
              placeholder="Describe the issue, its size, and impact on traffic..."
              className="w-full p-4 rounded-2xl border-2 border-slate-100 focus:border-blue-500 focus:outline-none transition-all resize-none"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          {/* Media Placeholder */}
          <div className="p-6 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-muted-foreground gap-3 hover:bg-slate-50 transition-colors cursor-pointer">
            <div className="p-3 bg-slate-100 rounded-full">
              <Camera className="h-6 w-6" />
            </div>
            <span className="text-sm font-medium">Add Photo / Video</span>
            <span className="text-xs">Supports JPG, PNG, MP4 up to 10MB</span>
          </div>
        </div>

        {/* Map Location */}
        <div className="space-y-3">
          <label className="text-sm font-bold flex items-center gap-2">
            <MapPin className="text-blue-500 h-4 w-4" />
            Pin Location
          </label>
          <LocationPicker 
            onLocationSelect={(lat, lng) => setFormData({ ...formData, lat, lng })}
          />
          <div className="text-[10px] text-muted-foreground flex justify-between bg-slate-50 p-2 rounded-lg">
            <span>Lat: {formData.lat.toFixed(6)}</span>
            <span>Lng: {formData.lng.toFixed(6)}</span>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t flex items-center justify-between">
        <p className="text-xs text-muted-foreground max-w-xs">
          By submitting, you agree that this information will be shared with the relevant authorities.
        </p>
        <button
          disabled={loading}
          type="submit"
          className="px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-bold flex items-center gap-2 hover:opacity-90 transition-all disabled:opacity-50 shadow-xl shadow-blue-500/10"
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          Submit Report
        </button>
      </div>
    </form>
  )
}
