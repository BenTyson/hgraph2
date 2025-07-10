import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ReportGenerator } from '../components/reports/ReportGenerator'
import { CustomerSummaryReport } from '../components/reports/CustomerSummaryReport'
import { ReportService } from '../services/reportService'
import { batchApi, dashboardApi } from '../services/api'
import { DocumentArrowDownIcon } from '@heroicons/react/24/outline'

export function Reports() {
  const [previewReport, setPreviewReport] = useState<string | null>(null)
  const [previewData, setPreviewData] = useState<any>(null)

  const { data: batches } = useQuery({
    queryKey: ['graphene-batches-reports'],
    queryFn: () => batchApi.getGrapheneBatches().then(res => res.data),
  })

  const { data: summary } = useQuery({
    queryKey: ['dashboard-summary-reports'],
    queryFn: () => dashboardApi.getSummary().then(res => res.data),
  })

  const handleGenerateReport = async (reportType: string, options: any) => {
    // Prepare data based on filters
    const filteredBatches = batches?.filter(batch => {
      if (options.batchFilter === 'oven_c_only') return batch.is_oven_c_era
      if (options.batchFilter === 'shipped_only') return batch.shipped_to
      return true
    }) || []

    const reportData = {
      customerName: 'Albany Materials',
      reportDate: new Date().toISOString(),
      batches: filteredBatches.map(batch => ({
        name: batch.name,
        date: batch.date_created,
        bet: batch.best_bet,
        weight: batch.shipped_weight || 100, // Default weight
        conductivity: batch.best_conductivity
      })),
      summary: {
        totalBatches: filteredBatches.length,
        averageBET: filteredBatches.reduce((sum, batch) => sum + (batch.best_bet || 0), 0) / filteredBatches.length,
        peakBET: Math.max(...filteredBatches.map(batch => batch.best_bet || 0)),
        totalWeight: filteredBatches.reduce((sum, batch) => sum + (batch.shipped_weight || 100), 0)
      }
    }

    try {
      switch (reportType) {
        case 'customer_summary':
          await ReportService.generateCustomerSummaryPDF(reportData)
          break
        case 'executive_dashboard':
          await ReportService.generateExecutiveDashboardPDF(reportData)
          break
        case 'technical_datasheet':
          await ReportService.generateTechnicalDatasheet(reportData)
          break
        default:
          console.log('Report type not implemented yet:', reportType)
      }
    } catch (error) {
      console.error('Error generating report:', error)
    }
  }

  const handlePreviewReport = (reportType: string) => {
    const sampleData = {
      customerName: 'Albany Materials',
      reportDate: new Date().toISOString(),
      batches: [
        { name: 'MRa445', date: '2025-07-08', bet: 1650, weight: 14 },
        { name: 'MRa440', date: '2025-07-05', bet: 1625, weight: 23 },
        { name: 'TB1175B', date: '2025-06-15', bet: 1839, weight: 739 }
      ],
      summary: {
        totalBatches: 3,
        averageBET: 1704,
        peakBET: 1839,
        totalWeight: 776
      }
    }

    setPreviewReport(reportType)
    setPreviewData(sampleData)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-gray-200 pb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
            <p className="mt-2 text-gray-600">Generate professional reports for customers and stakeholders</p>
          </div>
          <div className="flex items-center space-x-2">
            <DocumentArrowDownIcon className="h-5 w-5 text-gray-400" />
            <span className="text-sm text-gray-500">PDF Generation</span>
          </div>
        </div>
      </div>

      {/* Report Generator */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-xl font-semibold text-gray-900">Report Generator</h2>
          <p className="text-sm text-gray-600">Create professional reports with your hemp graphene data</p>
        </div>
        <div className="card-body">
          <ReportGenerator onGenerateReport={handleGenerateReport} />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <button
          onClick={() => handlePreviewReport('customer_summary')}
          className="card hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="card-body text-center">
            <DocumentArrowDownIcon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <h3 className="font-medium text-gray-900">Preview Customer Report</h3>
            <p className="text-sm text-gray-500 mt-1">See what your customers will receive</p>
          </div>
        </button>

        <button
          onClick={() => handleGenerateReport('executive_dashboard', { batchFilter: 'oven_c_only', includeCharts: true })}
          className="card hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="card-body text-center">
            <DocumentArrowDownIcon className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <h3 className="font-medium text-gray-900">Quick Executive Report</h3>
            <p className="text-sm text-gray-500 mt-1">Generate executive summary</p>
          </div>
        </button>

        <button
          onClick={() => handleGenerateReport('technical_datasheet', { batchFilter: 'all' })}
          className="card hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="card-body text-center">
            <DocumentArrowDownIcon className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <h3 className="font-medium text-gray-900">Technical Data Sheet</h3>
            <p className="text-sm text-gray-500 mt-1">Material specifications</p>
          </div>
        </button>
      </div>

      {/* Report Preview */}
      {previewReport === 'customer_summary' && previewData && (
        <div className="card">
          <div className="card-header">
            <h2 className="text-xl font-semibold text-gray-900">Report Preview</h2>
            <p className="text-sm text-gray-600">Customer Summary Report</p>
          </div>
          <div className="card-body">
            <CustomerSummaryReport data={previewData} />
          </div>
        </div>
      )}
    </div>
  )
}
