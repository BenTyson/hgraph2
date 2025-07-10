import { useQuery } from '@tanstack/react-query'
import { StatCard } from '../components/StatCard'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { Badge } from '../components/Badge'
import { BETTrendChart } from '../components/charts/BETTrendChart'
import { ProcessCorrelationChart } from '../components/charts/ProcessCorrelationChart'
import { dashboardApi } from '../services/api'
import { FireIcon, TruckIcon, ChartBarIcon } from '@heroicons/react/24/outline'

export function Dashboard() {
  const { data: summary, isLoading, error } = useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: () => dashboardApi.getSummary().then(res => res.data),
  })

  const { data: batchPerformance } = useQuery({
    queryKey: ['batch-performance'],
    queryFn: () => dashboardApi.getBatchPerformance().then(res => res.data),
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error loading dashboard</h3>
            <p className="mt-1 text-sm text-red-700">Failed to load dashboard data. Please try again.</p>
          </div>
        </div>
      </div>
    )
  }

  // Transform batch performance data for charts
  const trendData = batchPerformance?.map(batch => ({
    date: batch.date,
    batch: batch.name,
    bet: batch.bet || 0,
    isOvenC: batch.is_oven_c_era,
  })).filter(d => d.bet > 0) || []

  const correlationData = batchPerformance?.map(batch => ({
    batch: batch.name,
    temperature: batch.temperature || 0,
    bet: batch.bet || 0,
    kohRatio: batch.koh_ratio || 0,
    isOvenC: batch.is_oven_c_era,
  })).filter(d => d.bet > 0 && d.temperature > 0) || []

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-bold text-gray-900">HGraph2 Material Status</h1>
        <p className="mt-2 text-gray-600">Hemp-derived graphene production and analysis overview</p>
      </div>

      {/* Key Performance Metrics */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <StatCard
          title="Best BET Surface Area"
          value={`${summary?.oven_c_performance.best_bet?.toLocaleString() || 'N/A'} m²/g`}
          subtitle={summary?.oven_c_performance.best_batch || 'No data'}
          trend={{
            direction: 'up',
            value: '+15% vs pre-Oven C'
          }}
          icon={<FireIcon className="h-5 w-5 text-orange-600" />}
        />

        <StatCard
          title="Recent Average BET"
          value={`${summary?.oven_c_performance.avg_bet_recent?.toLocaleString() || 'N/A'} m²/g`}
          subtitle="Last 10 Oven C batches"
          trend={{
            direction: 'up',
            value: 'Consistent improvement'
          }}
          icon={<ChartBarIcon className="h-5 w-5 text-blue-600" />}
        />

        <StatCard
          title="Production Status"
          value={`${summary?.oven_c_performance.total_batches || 0}`}
          subtitle="Total Oven C batches"
          icon={<TruckIcon className="h-5 w-5 text-green-600" />}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* BET Trend Chart */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">BET Surface Area Trends</h3>
            <p className="text-sm text-gray-500">Performance evolution over time</p>
          </div>
          <div className="card-body">
            {trendData.length > 0 ? (
              <BETTrendChart data={trendData} />
            ) : (
              <div className="h-80 flex items-center justify-center">
                <p className="text-gray-500">No trend data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Process Correlation Chart */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Temperature vs BET Correlation</h3>
            <p className="text-sm text-gray-500">Process parameter optimization</p>
          </div>
          <div className="card-body">
            {correlationData.length > 0 ? (
              <ProcessCorrelationChart 
                data={correlationData} 
                xAxis="temperature"
                title="Temperature vs BET"
              />
            ) : (
              <div className="h-80 flex items-center justify-center">
                <p className="text-gray-500">No correlation data available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Shipment Tracker */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Shipment Tracker</h3>
            <p className="text-sm text-gray-500">Customer deliveries and pending shipments</p>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Shipped</span>
                <Badge variant="green">{summary?.shipments.total_shipped || 0} batches</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Pending Shipment</span>
                <Badge variant="yellow">{summary?.shipments.pending || 0} batches</Badge>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Recent Shipments</h4>
                <div className="space-y-3">
                  {summary?.shipments.recent_shipments?.slice(0, 3).map((shipment, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{shipment.batch}</p>
                        <p className="text-xs text-gray-500">{shipment.weight}g</p>
                      </div>
                      <Badge variant="blue">{shipment.customer}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* KOH Ratio Correlation */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">KOH Ratio vs BET Correlation</h3>
            <p className="text-sm text-gray-500">Chemical process optimization</p>
          </div>
          <div className="card-body">
            {correlationData.length > 0 ? (
              <ProcessCorrelationChart 
                data={correlationData} 
                xAxis="kohRatio"
                title="KOH Ratio vs BET"
              />
            ) : (
              <div className="h-80 flex items-center justify-center">
                <p className="text-gray-500">No correlation data available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Process Performance Summary */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900">Process Performance Summary</h3>
          <p className="text-sm text-gray-500">Key metrics and optimization insights</p>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">1,839</p>
              <p className="text-sm text-gray-600">Peak BET (m²/g)</p>
              <p className="text-xs text-gray-500">TB1175B</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">800°C</p>
              <p className="text-sm text-gray-600">Optimal Temperature</p>
              <p className="text-xs text-gray-500">Most batches</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">1.5</p>
              <p className="text-sm text-gray-600">KOH Ratio</p>
              <p className="text-xs text-gray-500">Best results</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">739g</p>
              <p className="text-sm text-gray-600">Largest Batch</p>
              <p className="text-xs text-gray-500">Shipped to Albany</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
