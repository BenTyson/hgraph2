import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { 
  ExclamationTriangleIcon, 
  CheckCircleIcon, 
  ChartBarIcon,
  BeakerIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline'
import { StatCard } from '../components/StatCard'
import { Badge } from '../components/Badge'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { batchApi, dashboardApi } from '../services/api'

interface QualityAlert {
  id: string
  type: 'warning' | 'error' | 'info'
  title: string
  description: string
  batch?: string
  timestamp: string
  resolved: boolean
}

interface ProcessCapability {
  parameter: string
  target: number
  upperLimit: number
  lowerLimit: number
  currentValue: number
  cpk: number
  trend: 'up' | 'down' | 'stable'
}

export function QualityControl() {
  const [timeRange, setTimeRange] = useState('30days')
  const [alertFilter, setAlertFilter] = useState('all')

  const { data: batches } = useQuery({
    queryKey: ['quality-batches'],
    queryFn: () => batchApi.getGrapheneBatches().then(res => res.data),
  })

  const { data: summary } = useQuery({
    queryKey: ['quality-summary'],
    queryFn: () => dashboardApi.getSummary().then(res => res.data),
  })

  // Mock quality alerts data
  const qualityAlerts: QualityAlert[] = [
    {
      id: '1',
      type: 'warning',
      title: 'BET Surface Area Below Target',
      description: 'Batch MRa446 shows BET of 1,420 m²/g, below target of 1,500 m²/g',
      batch: 'MRa446',
      timestamp: '2025-07-10T10:30:00Z',
      resolved: false
    },
    {
      id: '2',
      type: 'error',
      title: 'Temperature Deviation',
      description: 'Oven C temperature exceeded 820°C during batch processing',
      batch: 'MRa447',
      timestamp: '2025-07-10T08:15:00Z',
      resolved: false
    },
    {
      id: '3',
      type: 'info',
      title: 'Process Improvement Opportunity',
      description: 'KOH ratio optimization could improve BET by 8-12%',
      timestamp: '2025-07-09T16:45:00Z',
      resolved: true
    }
  ]

  // Mock process capability data
  const processCapabilities: ProcessCapability[] = [
    {
      parameter: 'BET Surface Area',
      target: 1600,
      upperLimit: 2000,
      lowerLimit: 1200,
      currentValue: 1650,
      cpk: 1.33,
      trend: 'up'
    },
    {
      parameter: 'Temperature Control',
      target: 800,
      upperLimit: 810,
      lowerLimit: 790,
      currentValue: 802,
      cpk: 1.89,
      trend: 'stable'
    },
    {
      parameter: 'KOH Ratio',
      target: 1.5,
      upperLimit: 1.8,
      lowerLimit: 1.2,
      currentValue: 1.52,
      cpk: 2.15,
      trend: 'stable'
    }
  ]

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
      case 'warning':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />
      default:
        return <CheckCircleIcon className="h-5 w-5 text-blue-500" />
    }
  }

  const getAlertBadge = (type: string) => {
    switch (type) {
      case 'error':
        return <Badge variant="red">Critical</Badge>
      case 'warning':
        return <Badge variant="yellow">Warning</Badge>
      default:
        return <Badge variant="blue">Info</Badge>
    }
  }

  const getCpkColor = (cpk: number) => {
    if (cpk >= 1.67) return 'text-green-600'
    if (cpk >= 1.33) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getCpkLabel = (cpk: number) => {
    if (cpk >= 1.67) return 'Excellent'
    if (cpk >= 1.33) return 'Acceptable'
    return 'Poor'
  }

  const filteredAlerts = qualityAlerts.filter(alert => {
    if (alertFilter === 'unresolved') return !alert.resolved
    if (alertFilter === 'resolved') return alert.resolved
    return true
  })

  const alertStats = {
    total: qualityAlerts.length,
    critical: qualityAlerts.filter(a => a.type === 'error').length,
    warnings: qualityAlerts.filter(a => a.type === 'warning').length,
    unresolved: qualityAlerts.filter(a => !a.resolved).length
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-bold text-gray-900">Quality Control Dashboard</h1>
        <p className="mt-2 text-gray-600">Real-time process monitoring and quality assurance</p>
      </div>

      {/* Quality Overview Stats */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <StatCard
          title="Overall Quality Score"
          value="94.2%"
          subtitle="Last 30 days"
          trend={{
            direction: 'up',
            value: '+2.1% vs last period'
          }}
          icon={<ChartBarIcon className="h-5 w-5 text-green-600" />}
        />

        <StatCard
          title="Process Capability"
          value="1.67 Cpk"
          subtitle="Average across parameters"
          trend={{
            direction: 'up',
            value: 'Excellent performance'
          }}
          icon={<BeakerIcon className="h-5 w-5 text-blue-600" />}
        />

        <StatCard
          title="Active Alerts"
          value={alertStats.unresolved.toString()}
          subtitle={`${alertStats.critical} critical, ${alertStats.warnings} warnings`}
          icon={<ExclamationTriangleIcon className="h-5 w-5 text-orange-600" />}
        />

        <StatCard
          title="Batch Success Rate"
          value="98.5%"
          subtitle="Batches meeting specifications"
          trend={{
            direction: 'up',
            value: '+1.2% improvement'
          }}
          icon={<CheckCircleIcon className="h-5 w-5 text-green-600" />}
        />
      </div>

      {/* Process Capability Analysis */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-xl font-semibold text-gray-900">Process Capability Analysis</h2>
          <p className="text-sm text-gray-600">Statistical process control metrics</p>
        </div>
        <div className="card-body">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Parameter</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Target</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Current</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Cpk</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Trend</th>
                </tr>
              </thead>
              <tbody>
                {processCapabilities.map((param, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium text-gray-900">{param.parameter}</td>
                    <td className="py-3 px-4 text-gray-700">{param.target}</td>
                    <td className="py-3 px-4 text-gray-700">{param.currentValue}</td>
                    <td className={`py-3 px-4 font-semibold ${getCpkColor(param.cpk)}`}>
                      {param.cpk.toFixed(2)}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={param.cpk >= 1.67 ? 'green' : param.cpk >= 1.33 ? 'yellow' : 'red'}>
                        {getCpkLabel(param.cpk)}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-1">
                        {param.trend === 'up' && <ArrowTrendingUpIcon className="h-4 w-4 text-green-500" />}
                        {param.trend === 'down' && <ArrowTrendingDownIcon className="h-4 w-4 text-red-500" />}
                        {param.trend === 'stable' && <div className="h-4 w-4 bg-gray-400 rounded-full"></div>}
                        <span className="text-sm text-gray-600 capitalize">{param.trend}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Quality Alerts */}
      <div className="card">
        <div className="card-header">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Quality Alerts</h2>
              <p className="text-sm text-gray-600">Real-time process monitoring alerts</p>
            </div>
            <select
              value={alertFilter}
              onChange={(e) => setAlertFilter(e.target.value)}
              className="select text-sm"
            >
              <option value="all">All Alerts</option>
              <option value="unresolved">Unresolved</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>
        <div className="card-body">
          <div className="space-y-4">
            {filteredAlerts.map((alert) => (
              <div key={alert.id} className={`p-4 rounded-lg border ${
                alert.resolved ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-300'
              }`}>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    {getAlertIcon(alert.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-900">{alert.title}</h4>
                      {getAlertBadge(alert.type)}
                    </div>
                    <p className="mt-1 text-sm text-gray-600">{alert.description}</p>
                    <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                      <span>{new Date(alert.timestamp).toLocaleString()}</span>
                      {alert.batch && <span>Batch: {alert.batch}</span>}
                      {alert.resolved && <Badge variant="green" size="sm">Resolved</Badge>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
