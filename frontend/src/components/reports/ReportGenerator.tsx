import { useState } from 'react'
import { Badge } from '../Badge'
import { LoadingSpinner } from '../LoadingSpinner'
import { DocumentTextIcon, ChartBarIcon, UserGroupIcon } from '@heroicons/react/24/outline'

interface ReportGeneratorProps {
  onGenerateReport: (reportType: string, options: any) => Promise<void>
}

export function ReportGenerator({ onGenerateReport }: ReportGeneratorProps) {
  const [selectedReport, setSelectedReport] = useState('')
  const [reportOptions, setReportOptions] = useState({
    includeCharts: true,
    includeSEMImages: true,
    dateRange: 'last30days',
    batchFilter: 'oven_c_only',
    format: 'pdf'
  })
  const [isGenerating, setIsGenerating] = useState(false)

  const reportTypes = [
    {
      id: 'customer_summary',
      name: 'Customer Summary Report',
      description: 'Professional summary for customer deliveries (Albany, etc.)',
      icon: <UserGroupIcon className="h-6 w-6" />,
      color: 'blue'
    },
    {
      id: 'executive_dashboard',
      name: 'Executive Dashboard',
      description: 'High-level overview for stakeholders and management',
      icon: <ChartBarIcon className="h-6 w-6" />,
      color: 'green'
    },
    {
      id: 'technical_datasheet',
      name: 'Technical Data Sheet',
      description: 'Detailed technical specifications and analysis results',
      icon: <DocumentTextIcon className="h-6 w-6" />,
      color: 'purple'
    },
    {
      id: 'batch_comparison',
      name: 'Batch Comparison Report',
      description: 'Side-by-side comparison of multiple batches',
      icon: <ChartBarIcon className="h-6 w-6" />,
      color: 'orange'
    },
    {
      id: 'process_optimization',
      name: 'Process Optimization Report',
      description: 'Analysis of process parameters and recommendations',
      icon: <DocumentTextIcon className="h-6 w-6" />,
      color: 'red'
    }
  ]

  const handleGenerateReport = async () => {
    if (!selectedReport) return
    
    setIsGenerating(true)
    try {
      await onGenerateReport(selectedReport, reportOptions)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Report Type Selection */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {reportTypes.map((report) => (
          <div
            key={report.id}
            className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all ${
              selectedReport === report.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setSelectedReport(report.id)}
          >
            <div className="flex items-center space-x-3">
              <div className={`text-${report.color}-600`}>
                {report.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-900">{report.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{report.description}</p>
              </div>
            </div>
            {selectedReport === report.id && (
              <div className="absolute top-2 right-2">
                <Badge variant="blue" size="sm">Selected</Badge>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Report Options */}
      {selectedReport && (
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Report Options</h3>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date Range
                </label>
                <select
                  className="select"
                  value={reportOptions.dateRange}
                  onChange={(e) => setReportOptions({...reportOptions, dateRange: e.target.value})}
                >
                  <option value="last7days">Last 7 days</option>
                  <option value="last30days">Last 30 days</option>
                  <option value="last90days">Last 90 days</option>
                  <option value="all">All time</option>
                  <option value="custom">Custom range</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Batch Filter
                </label>
                <select
                  className="select"
                  value={reportOptions.batchFilter}
                  onChange={(e) => setReportOptions({...reportOptions, batchFilter: e.target.value})}
                >
                  <option value="all">All batches</option>
                  <option value="oven_c_only">Oven C era only</option>
                  <option value="shipped_only">Shipped batches only</option>
                  <option value="recent_only">Recent batches only</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Include Options
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={reportOptions.includeCharts}
                      onChange={(e) => setReportOptions({...reportOptions, includeCharts: e.target.checked})}
                    />
                    <span className="ml-2 text-sm text-gray-700">Include charts and graphs</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={reportOptions.includeSEMImages}
                      onChange={(e) => setReportOptions({...reportOptions, includeSEMImages: e.target.checked})}
                    />
                    <span className="ml-2 text-sm text-gray-700">Include SEM/TEM images</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Generate Button */}
      <div className="flex justify-end">
        <button
          className="btn btn-primary px-6 py-2 flex items-center space-x-2"
          onClick={handleGenerateReport}
          disabled={!selectedReport || isGenerating}
        >
          {isGenerating ? (
            <>
              <LoadingSpinner size="sm" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <DocumentTextIcon className="h-5 w-5" />
              <span>Generate Report</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
