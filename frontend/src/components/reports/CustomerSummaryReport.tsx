import { format } from 'date-fns'
import { Badge } from '../Badge'

interface CustomerSummaryReportProps {
  data: {
    customerName: string
    reportDate: string
    batches: any[]
    summary: {
      totalBatches: number
      averageBET: number
      peakBET: number
      totalWeight: number
    }
  }
}

export function CustomerSummaryReport({ data }: CustomerSummaryReportProps) {
  return (
    <div className="max-w-4xl mx-auto bg-white p-8 print:p-6">
      {/* Header */}
      <div className="border-b-2 border-gray-200 pb-6 mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">HGraph2 Material Report</h1>
            <p className="text-lg text-gray-600 mt-2">Hemp-Derived Graphene Analysis</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Report Generated</p>
            <p className="text-lg font-semibold text-gray-900">{format(new Date(data.reportDate), 'MMMM dd, yyyy')}</p>
          </div>
        </div>
      </div>

      {/* Customer Information */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Customer Information</h2>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-lg font-medium text-gray-900">{data.customerName}</p>
          <p className="text-sm text-gray-600">Hemp Graphene Material Analysis Report</p>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Executive Summary</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-blue-600">Total Batches</p>
            <p className="text-2xl font-bold text-blue-900">{data.summary.totalBatches}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-green-600">Average BET</p>
            <p className="text-2xl font-bold text-green-900">{data.summary.averageBET.toLocaleString()} m²/g</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-purple-600">Peak BET</p>
            <p className="text-2xl font-bold text-purple-900">{data.summary.peakBET.toLocaleString()} m²/g</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-orange-600">Total Weight</p>
            <p className="text-2xl font-bold text-orange-900">{data.summary.totalWeight}g</p>
          </div>
        </div>
      </div>

      {/* Batch Details */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Batch Analysis</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-4 font-medium text-gray-900">Batch ID</th>
                <th className="text-left py-2 px-4 font-medium text-gray-900">Date</th>
                <th className="text-left py-2 px-4 font-medium text-gray-900">BET (m²/g)</th>
                <th className="text-left py-2 px-4 font-medium text-gray-900">Weight (g)</th>
                <th className="text-left py-2 px-4 font-medium text-gray-900">Grade</th>
              </tr>
            </thead>
            <tbody>
              {data.batches.map((batch, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2 px-4 font-medium text-gray-900">{batch.name}</td>
                  <td className="py-2 px-4 text-gray-600">{format(new Date(batch.date), 'MMM dd, yyyy')}</td>
                  <td className="py-2 px-4 text-gray-900">{batch.bet?.toLocaleString() || 'N/A'}</td>
                  <td className="py-2 px-4 text-gray-900">{batch.weight || 'N/A'}</td>
                  <td className="py-2 px-4">
                    <Badge variant={batch.bet >= 1800 ? 'green' : batch.bet >= 1500 ? 'blue' : 'yellow'}>
                      {batch.bet >= 1800 ? 'Excellent' : batch.bet >= 1500 ? 'Good' : 'Standard'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Technical Notes */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Technical Notes</h2>
        <div className="bg-gray-50 p-4 rounded-lg">
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• BET surface area analysis performed according to ASTM D3663/D6556 standards</li>
            <li>• All batches processed using our proprietary Oven C technology</li>
            <li>• Material optimized for energy storage applications</li>
            <li>• Quality assurance testing completed on all shipped batches</li>
          </ul>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t-2 border-gray-200 pt-6 text-center">
        <p className="text-sm text-gray-500">
          This report is confidential and proprietary. For questions, please contact our technical team.
        </p>
        <p className="text-sm text-gray-500 mt-2">
          HGraph2 Analytics Platform • Hemp Graphene Research & Development
        </p>
      </div>
    </div>
  )
}
