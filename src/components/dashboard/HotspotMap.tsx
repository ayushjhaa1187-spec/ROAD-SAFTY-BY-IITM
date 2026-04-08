'use client'

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Rectangle, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { Sparkles, AlertTriangle, Activity } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function HotspotMap() {
  const [hotspots, setHotspots] = useState<any[]>([])
  const [selectedSegment, setSelectedSegment] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [analyzingSegment, setAnalyzingSegment] = useState(false)

  useEffect(() => {
    fetchHotspots()
  }, [])

  const fetchHotspots = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('http://localhost:5000/api/analytics/hotspots')
      if (!res.ok) throw new Error('Hotspot service unavailable')
      const data = await res.json()
      setHotspots(data)
    } catch (error: any) {
      console.error('Failed to fetch hotspots', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchSegmentDetails = async (id: string) => {
    setAnalyzingSegment(true)
    setSelectedSegment(null)
    try {
      const res = await fetch(`http://localhost:5000/api/analytics/segments/${id}`)
      if (!res.ok) throw new Error('Analysis service error')
      const data = await res.json()
      setSelectedSegment(data)
    } catch (error) {
      console.error('Failed to fetch segment details', error)
      setSelectedSegment({ error: true })
    } finally {
      setAnalyzingSegment(false)
    }
  }

  // Parses segment ID back to coordinates
  const getBounds = (segmentId: string) => {
    const parts = segmentId.split('_')
    const lat = parseFloat(parts[1])
    const lng = parseFloat(parts[2])
    const offset = 0.001 // ~100m
    return [
      [lat - offset / 2, lng - offset / 2],
      [lat + offset / 2, lng + offset / 2]
    ] as [number, number][]
  }

  const getRiskColor = (index: number) => {
    if (index > 75) return '#ef4444' // Red
    if (index > 50) return '#f97316' // Orange
    if (index > 25) return '#eab308' // Yellow
    return '#22c55e' // Green
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
      <div className="lg:col-span-2 relative rounded-3xl overflow-hidden border border-slate-100 shadow-sm">
        <MapContainer
          center={[12.9915, 80.2337]}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {hotspots.map((spot) => (
            <Rectangle
              key={spot.segmentId}
              bounds={getBounds(spot.segmentId)}
              pathOptions={{
                color: getRiskColor(spot.riskIndex),
                fillOpacity: 0.6,
                weight: 1
              }}
              eventHandlers={{
                click: () => fetchSegmentDetails(spot.segmentId)
              }}
            >
              <Popup>
                <div className="p-2 space-y-1">
                  <p className="font-bold text-xs uppercase tracking-wider text-slate-400">Segment ID</p>
                  <p className="font-bold text-sm">{spot.segmentId}</p>
                  <p className="font-bold text-xs">Risk Index: {spot.riskIndex}%</p>
                </div>
              </Popup>
            </Rectangle>
          ))}
        </MapContainer>
        {loading && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-[1000] flex items-center justify-center">
            <Activity className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        )}
      </div>

      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm overflow-y-auto">
        {selectedSegment ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <div className="pb-6 border-b">
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest block mb-2">Segment Intel</span>
              <h3 className="text-2xl font-extrabold tracking-tight">{selectedSegment.segmentId}</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-2xl">
                <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Vibration Score</span>
                <p className="text-xl font-bold">{selectedSegment.ai_risk_analysis.risk_score}%</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl">
                <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Confidence</span>
                <p className="text-xl font-bold">{(selectedSegment.ai_risk_analysis.risk_score * 0.9).toFixed(0)}%</p>
              </div>
            </div>

            <div className="p-6 bg-blue-600 rounded-2xl text-white relative overflow-hidden">
               <Sparkles className="absolute -bottom-2 -right-2 h-16 w-16 opacity-10" />
               <div className="relative z-10">
                 <div className="flex items-center gap-2 mb-2">
                   <Sparkles className="h-4 w-4" />
                   <span className="text-[10px] font-bold uppercase tracking-widest">AI Safety Summary</span>
                 </div>
                 <p className="text-sm font-medium leading-relaxed italic opacity-90">
                   "{selectedSegment.ai_risk_analysis.explanation}"
                 </p>
               </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">Contextual Data</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-3 border rounded-xl">
                  <span className="text-xs font-medium">Telemetry Trips</span>
                  <span className="text-xs font-bold">{selectedSegment.stats.telemetry_trips}</span>
                </div>
                <div className="flex justify-between items-center p-3 border rounded-xl">
                  <span className="text-xs font-medium">CV Detections</span>
                  <span className="text-xs font-bold">{selectedSegment.stats.detected_defects}</span>
                </div>
                <div className="flex justify-between items-center p-3 border rounded-xl">
                  <span className="text-xs font-medium">Citizen Reports</span>
                  <span className="text-xs font-bold">{selectedSegment.stats.citizen_reports}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 space-y-4">
            <div className="p-4 bg-slate-50 rounded-full">
              <Activity className="h-8 w-8" />
            </div>
            <p className="text-sm font-medium">Select a segment on the map to see AI risk analysis</p>
          </div>
        )}
      </div>
    </div>
  )
}
