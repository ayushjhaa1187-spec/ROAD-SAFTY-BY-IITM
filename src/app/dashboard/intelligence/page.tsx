'use client'

import dynamic from 'next/dynamic'
import { Activity, Shield, Map as MapIcon, ChevronRight } from 'lucide-react'
import Link from 'next/link'

const HotspotMap = dynamic(() => import('@/components/dashboard/HotspotMap'), { ssr: false })

export default function IntelligencePage() {
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Advanced Roadmap</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Road Intelligence Engine</h1>
            <p className="text-slate-500 mt-2 font-medium">Visualizing cross-modal sensor data, CV detections, and citizen reports in real-time.</p>
          </div>
          <Link 
            href="/dashboard"
            className="px-6 py-3 bg-white border border-slate-100 rounded-2xl text-sm font-bold flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm"
          >
            Back to Dashboard
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="space-y-8">
          {/* Main Map View */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-widest pl-2">
              <MapIcon className="h-4 w-4" />
              Hotspot Monitoring View
            </div>
            <HotspotMap />
          </section>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4 hover:shadow-md transition-all">
              <div className="p-3 bg-red-50 rounded-2xl w-fit text-red-600">
                <Activity className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg">Sensor Fusion</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Combining accelerometer telemetry from over 1,000 trips into a high-precision road roughness index.
              </p>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4 hover:shadow-md transition-all">
              <div className="p-3 bg-blue-50 rounded-2xl w-fit text-blue-600">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg">CV Verification</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Automated YOLOv8 validation of potholes and cracks ensures that reports are accurate and verifiable.
              </p>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4 hover:shadow-md transition-all">
              <div className="p-3 bg-green-50 rounded-2xl w-fit text-green-600">
                <MapIcon className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg">Social Context</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Layering citizen sentiment and recurring reports into the risk score for prioritize governance action.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
