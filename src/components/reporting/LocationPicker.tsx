'use client'

import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { MapPin } from 'lucide-react'

// Fix Leaflet icon issue
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

interface LocationPickerProps {
  onLocationSelect: (lat: number, lng: number) => void
  initialLocation?: [number, number]
}

function LocationMarker({ onLocationSelect, position }: { 
  onLocationSelect: (lat: number, lng: number) => void
  position: [number, number] | null 
}) {
  const map = useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng)
    },
  })

  return position === null ? null : (
    <Marker position={position} icon={icon} />
  )
}

export default function LocationPicker({ onLocationSelect, initialLocation }: LocationPickerProps) {
  const [position, setPosition] = useState<[number, number] | null>(initialLocation || null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (!initialLocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const newPos: [number, number] = [pos.coords.latitude, pos.coords.longitude]
        setPosition(newPos)
        onLocationSelect(newPos[0], newPos[1])
      })
    }
  }, [])

  const handleSelect = (lat: number, lng: number) => {
    setPosition([lat, lng])
    onLocationSelect(lat, lng)
  }

  if (!mounted) return <div className="h-[400px] bg-slate-100 animate-pulse rounded-2xl" />

  return (
    <div className="rounded-2xl overflow-hidden border-2 border-slate-200 h-[400px]">
      <MapContainer 
        center={position || [20.5937, 78.9629]} 
        zoom={position ? 15 : 5} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <LocationMarker onLocationSelect={handleSelect} position={position} />
      </MapContainer>
    </div>
  )
}
