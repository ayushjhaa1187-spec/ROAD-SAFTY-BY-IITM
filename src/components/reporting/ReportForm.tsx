'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { Camera, MapPin, AlertTriangle, Send, Loader2, Sparkles } from 'lucide-react'
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
  const [analyzing, setAnalyzing] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [mediaFile, setMediaFile] = useState<File | null>(null)
  const [mediaPreview, setMediaPreview] = useState<string | null>(null)
  const [aiResult, setAiResult] = useState<{ summary: string, suggested_severity: string, responsible_department: string } | null>(null)
  const [formData, setFormData] = useState({
    issue_type: '',
    description: '',
    lat: 0,
    lng: 0,
    severity: 'medium',
    media_url: ''
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setMediaFile(file)
      setMediaPreview(URL.createObjectURL(file))
    }
  }

  const uploadMedia = async (file: File) => {
    setUploading(true)
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random()}.${fileExt}`
    const filePath = `reports/${fileName}`

    const { data, error } = await supabase.storage
      .from('report-media')
      .upload(filePath, file)

    if (error) {
      console.error('Upload error:', error)
      return null
    }

    const { data: { publicUrl } } = supabase.storage
      .from('report-media')
      .getPublicUrl(filePath)

    return publicUrl
  }

  const handleAiAnalyze = async () => {
    if (!formData.issue_type || !formData.description) {
      alert('Please select issue type and provide a description first')
      return
    }

    setAnalyzing(true)
    try {
      const res = await fetch('/api/analyze-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          issueType: formData.issue_type,
          description: formData.description
        })
      })
      const data = await res.json()
      if (data.summary) {
        setAiResult(data)
        setFormData(prev => ({ ...prev, severity: data.suggested_severity.toLowerCase() }))
      }
    } catch (error) {
      console.error('AI Analysis failed:', error)
    } finally {
      setAnalyzing(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.issue_type || !formData.lat) {
      alert('Please select issue type and location')
      return
    }

    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      let finalMediaUrl = ''
      if (mediaFile) {
        finalMediaUrl = await uploadMedia(mediaFile) || ''
      }

      const { data, error } = await supabase
        .from('reports')
        .insert({
          user_id: user?.id,
          issue_type: formData.issue_type,
          description: formData.description,
          lat: formData.lat,
          lng: formData.lng,
          severity: formData.severity,
          status: 'open',
          ai_summary: aiResult?.summary
        })
        .select()
        .single()

      if (error) throw error

      if (finalMediaUrl) {
        await supabase.from('report_media').insert({
          report_id: data.id,
          url: finalMediaUrl,
          media_type: 'image'
        })
      }

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
            <button
              type="button"
              onClick={handleAiAnalyze}
              disabled={analyzing || !formData.description}
              className="mt-2 text-xs font-bold text-blue-600 flex items-center gap-1 hover:text-blue-700 disabled:opacity-50"
            >
              <Sparkles className={cn("h-3 w-3", analyzing && "animate-spin")} />
              {analyzing ? 'Analyzing...' : 'Analyze with AI'}
            </button>
          </div>

          {/* AI Result Preview */}
          {aiResult && (
            <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-2xl space-y-2 animate-in fade-in slide-in-from-top-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-blue-600 uppercase flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  AI Generated Summary
                </span>
                <button 
                  type="button" 
                  onClick={() => setAiResult(null)}
                  className="text-[10px] text-slate-400 hover:text-slate-600"
                >
                  Clear
                </button>
              </div>
              <p className="text-xs italic text-slate-700 leading-relaxed">"{aiResult.summary}"</p>
              <div className="pt-2 flex gap-4 text-[10px]">
                <div className="flex flex-col">
                  <span className="text-muted-foreground uppercase font-bold">Priority level</span>
                  <span className="font-bold text-blue-700 capitalize">{aiResult.suggested_severity}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground uppercase font-bold">Likely Authority</span>
                  <span className="font-bold text-blue-700">{aiResult.responsible_department}</span>
                </div>
              </div>
            </div>
          )}

          {/* Media Upload */}
          <div className="relative group">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
            />
            <div className={cn(
              "p-6 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-muted-foreground gap-3 transition-all",
              mediaPreview ? "border-blue-500 bg-blue-50/10" : "border-slate-200 group-hover:bg-slate-50"
            )}>
              {mediaPreview ? (
                <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-sm">
                  <img src={mediaPreview} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-xs font-bold">Change Image</span>
                  </div>
                </div>
              ) : (
                <>
                  <div className="p-3 bg-slate-100 rounded-full group-hover:bg-blue-100 transition-colors">
                    <Camera className="h-6 w-6 group-hover:text-blue-600" />
                  </div>
                  <span className="text-sm font-medium">Add Photo / Video</span>
                  <span className="text-xs">Supports JPG, PNG up to 10MB</span>
                </>
              )}
            </div>
            {uploading && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-sm rounded-2xl flex items-center justify-center z-20">
                <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
              </div>
            )}
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
