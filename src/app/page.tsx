import Link from 'next/link'
import { ArrowRight, Shield, Map, BarChart3, CloudUpload } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-slate-900 text-white">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1545143333-11bb24019328?auto=format&fit=crop&q=80')] bg-cover bg-center" />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-slate-900 mix-blend-multiply" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
            Smart Roads for <span className="text-blue-400">Better Governance</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed">
            Report road issues, track maintenance in real-time, and help authorities prioritize safety using AI-powered insights.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/report/new" 
              className="w-full sm:w-auto px-8 py-4 bg-blue-600 rounded-full text-lg font-bold hover:bg-blue-700 transition-all flex items-center justify-center shadow-xl shadow-blue-500/20"
            >
              Report an Issue <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link 
              href="/dashboard" 
              className="w-full sm:w-auto px-8 py-4 bg-slate-800 rounded-full text-lg font-bold border border-slate-700 hover:bg-slate-700 transition-all flex items-center justify-center"
            >
              View Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">How RoadWatch Works</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Our modular platform makes it easy for citizens to report and authorities to act.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: 'Citizen Reporting',
                desc: 'Upload photos, pin locations, and describe road issues in seconds.',
                icon: CloudUpload,
                color: 'text-blue-500',
                bg: 'bg-blue-500/10'
              },
              {
                title: 'AI Summarization',
                desc: 'LLMs convert raw reports into professional government complaints.',
                icon: Shield,
                color: 'text-emerald-500',
                bg: 'bg-emerald-500/10'
              },
              {
                title: 'Geo-Tracking',
                desc: 'Track every issue on an interactive map with live status updates.',
                icon: Map,
                color: 'text-amber-500',
                bg: 'bg-amber-500/10'
              },
              {
                title: 'Admin Dashboard',
                desc: 'Authorities can manage workflows, assign tasks, and track resolution.',
                icon: BarChart3,
                color: 'text-purple-500',
                bg: 'bg-purple-500/10'
              }
            ].map((feature, i) => (
              <div key={i} className="p-8 rounded-3xl border border-border bg-card hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                <div className={`w-12 h-12 rounded-2xl ${feature.bg} ${feature.color} flex items-center justify-center mb-6`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-slate-50 border-y dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
              <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 rounded-full text-sm font-bold tracking-wide uppercase mb-6">
                Our Mission
              </span>
              <h2 className="text-4xl font-bold mb-6 leading-tight">
                Empowering Communities Through Data-Driven Safety
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                RoadWatch was built for the National Road Safety Hackathon 2026 to bridge the gap between citizen observations and official actions. By leveraging AI and geospatial technology, we ensure that every pothole and hazard is tracked until it's fixed.
              </p>
              <ul className="space-y-4">
                {['Direct reporting to authorities', 'AI-powered severity assessment', 'Transparent resolution tracking'].map((item, i) => (
                  <li key={i} className="flex items-center text-slate-700 dark:text-slate-300 font-medium">
                    <div className="mr-3 p-1 bg-green-100 dark:bg-green-900/50 rounded-full">
                      <Shield className="h-4 w-4 text-green-600" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex-1 relative">
              <div className="w-full aspect-square rounded-full border-8 border-white dark:border-slate-800 overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1590487988256-9ed24133863e?auto=format&fit=crop&q=80" 
                  alt="Road Construction" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 glass p-6 rounded-2xl shadow-xl max-w-xs">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-600 rounded-lg">
                    <BarChart3 className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-bold">Live Stats</span>
                </div>
                <div className="text-2xl font-bold text-gradient">1,240 Issues Resolved</div>
                <p className="text-xs text-muted-foreground mt-1">Across 12 municipalities since launch.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
