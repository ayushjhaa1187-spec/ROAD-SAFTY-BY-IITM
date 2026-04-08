'use client'

import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { createClient } from '@/lib/db/supabase'
import { formatDate } from '@/lib/utils'

// Fix Leaflet icon issue
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

export default function OverviewMap() {
  const [reports, setReports] = useState<any[]>([])
  const [mounted, setMounted] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    setMounted(true)
    fetchReports()
  }, [])

  const fetchReports = async () => {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (data) setReports(data)
  }

  if (!mounted) return <div className="h-[500px] bg-slate-100 animate-pulse rounded-3xl" />

  return (
    <div className="rounded-3xl overflow-hidden border-2 border-slate-100 h-[500px] shadow-lg">
      <MapContainer 
        center={[20.5937, 78.9629]} 
        zoom={5} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {reports.map((report) => (
          <Marker 
            key={report.id} 
            position={[report.lat, report.lng]} 
            icon={icon}
          >
            <Popup className="rounded-2xl">
              <div className="p-2 min-w-[200px]">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600">{report.issue_type}</span>
                  <span className={report.status === 'open' ? 'text-red-500 text-[10px] font-bold uppercase' : 'text-green-500 text-[10px] font-bold uppercase'}>
                    {report.status}
                  </span>
                </div>
                <p className="text-sm font-medium mb-3 line-clamp-2">{report.description}</p>
                <div className="text-[10px] text-muted-foreground flex justify-between border-t pt-2">
                  <span>{formatDate(report.created_at)}</span>
                  <span className="capitalize">{report.severity} Priority</span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
