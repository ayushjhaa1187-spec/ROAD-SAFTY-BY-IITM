import ReportForm from '@/components/reporting/ReportForm'

export default function NewReportPage() {
  return (
    <div className="min-h-screen pt-12 pb-24 px-4 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <span className="text-blue-600 font-bold tracking-widest uppercase text-xs">Crowdsourced Governance</span>
          <h1 className="text-4xl font-extrabold text-gradient">Create New Report</h1>
        </div>
        
        <ReportForm />
      </div>
    </div>
  )
}
