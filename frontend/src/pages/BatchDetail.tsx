import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { 
  ArrowLeftIcon, 
  BeakerIcon, 
  ChartBarIcon, 
  CameraIcon,
  DocumentTextIcon,
  FireIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import { Badge } from '../components/Badge'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { StatCard } from '../components/StatCard'
import { batchApi, analysisApi } from '../services/api'
import { format } from 'date-fns'

export function BatchDetail() {
  const { batchId } = useParams()
  const [activeTab, setActiveTab] = useState('overview')

  const { data: batch, isLoading: batchLoading } = useQuery({
    queryKey: ['batch-detail', batchId],
    queryFn: () => batchApi.getGrapheneBatch(batchId!).then(res => res.data),
    enabled: !!batchId
  })

  const { data: analysisResults } = useQuery({
    queryKey: ['batch-analysis', batchId],
    queryFn: () => analysisApi.getBatchAnalysis(batchId!).then(res => res.data),
    enabled: !!batchId
  })

  if (batchLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading batch details...</p>
        </div>
      </div>
    )
  }

  if (!batch) {
    return (
      <div className="text-center py-12">
        <BeakerIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Batch not found</h3>
        <p className="mt-1 text-sm text-gray-500">The batch you're looking for doesn't exist.</p>
        <div className="mt-6">
          <Link to="/batches" className="btn btn-primary">
            Back to Batch Explorer
          </Link>
        </div>
      </div>
    )
  }

  const getBETGrade = (bet: number | null) => {
    if (!bet) return { label: 'No Data', variant: 'gray' as const }
    if (bet >= 2000) return { label: 'Excellent', variant: 'green' as const }
    if (bet >= 1500) return { label: 'Good', variant: 'blue' as const }
    if (bet >= 1000) return { label: 'Acceptable', variant: 'yellow' as const }
    return { label: 'Poor', variant: 'red' as const }
  }

  const betGrade = getBETGrade(batch.best_bet)

  const tabs = [
    { id: 'overview', name: 'Overview', icon: ChartBarIcon },
    { id: 'process', name: 'Process Parameters', icon: FireIcon },
    { id: 'analysis', name: 'Analysis Results', icon: BeakerIcon },
    { id: 'images', name: 'SEM/TEM Images', icon: CameraIcon },
    { id: 'history', name: 'History & Notes', icon: DocumentTextIcon },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-gray-200 pb-6">
        <div className="flex items-center space-x-4 mb-4">
          <Link 
            to="/batches" 
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
          </Link>
          <div className="flex-1">
            <div className="flex items-center space-x-3">
              <h1 className="text-3xl font-bold text-gray-900">{batch.name}</h1>
              {batch.is_oven_c_era && (
                <Badge variant="green">Oven C Era</Badge>
              )}
              {batch.shipped_to && (
                <Badge variant="blue">Shipped to {batch.shipped_to}</Badge>
              )}
            </div>
            <p className="mt-2 text-gray-600">
              Created on {format(new Date(batch.date_created), 'MMMM dd, yyyy')} • 
              Species {batch.species || 'Unknown'} • 
              Oven {batch.oven || 'Unknown'}
            </p>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <StatCard
          title="BET Surface Area"
          value={`${batch.best_bet?.toLocaleString() || 'N/A'} m²/g`}
          subtitle={betGrade.label}
          icon={<ChartBarIcon className="h-5 w-5 text-blue-600" />}
        />

        <StatCard
          title="Electrical Conductivity"
          value={`${batch.best_conductivity?.toLocaleString() || 'N/A'} S/m`}
          subtitle="4-point probe method"
          icon={<FireIcon className="h-5 w-5 text-orange-600" />}
        />

        <StatCard
          title="Process Temperature"
          value={`${batch.temperature || 'N/A'}°C`}
          subtitle={`${batch.time_hours || 'N/A'} hours`}
          icon={<ClockIcon className="h-5 w-5 text-green-600" />}
        />

        <StatCard
          title="Material Output"
          value={`${batch.shipped_weight || 'N/A'}g`}
          subtitle={batch.shipped_to ? 'Shipped' : 'In Lab'}
          icon={<BeakerIcon className="h-5 w-5 text-purple-600" />}
        />
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.name}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Batch Information */}
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-medium text-gray-900">Batch Information</h3>
              </div>
              <div className="card-body">
                <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Batch ID</dt>
                    <dd className="mt-1 text-sm text-gray-900">{batch.name}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Date Created</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {format(new Date(batch.date_created), 'MMM dd, yyyy')}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Oven</dt>
                    <dd className="mt-1 text-sm text-gray-900">{batch.oven || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Species</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {batch.species ? `Species ${batch.species}` : 'N/A'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Operator</dt>
                    <dd className="mt-1 text-sm text-gray-900">{batch.operator || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Appearance</dt>
                    <dd className="mt-1 text-sm text-gray-900">{batch.appearance || 'N/A'}</dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Shipment Information */}
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-medium text-gray-900">Shipment Information</h3>
              </div>
              <div className="card-body">
                {batch.shipped_to ? (
                  <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Customer</dt>
                      <dd className="mt-1 text-sm text-gray-900">{batch.shipped_to}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Shipped Date</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {batch.shipped_date ? format(new Date(batch.shipped_date), 'MMM dd, yyyy') : 'N/A'}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Weight Shipped</dt>
                      <dd className="mt-1 text-sm text-gray-900">{batch.shipped_weight}g</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Shipment Notes</dt>
                      <dd className="mt-1 text-sm text-gray-900">{batch.shipment_notes || 'N/A'}</dd>
                    </div>
                  </dl>
                ) : (
                  <div className="text-center py-6">
                    <BeakerIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Not Shipped</h3>
                    <p className="mt-1 text-sm text-gray-500">This batch is currently in the lab</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'process' && (
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">Process Parameters</h3>
              <p className="text-sm text-gray-600">Complete process conditions for this batch</p>
            </div>
            <div className="card-body">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">Thermal Conditions</h4>
                  <dl className="space-y-2">
                    <div>
                      <dt className="text-sm text-gray-500">Temperature</dt>
                      <dd className="text-lg font-semibold text-gray-900">{batch.temperature || 'N/A'}°C</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Time</dt>
                      <dd className="text-lg font-semibold text-gray-900">{batch.time_hours || 'N/A'} hours</dd>
                    </div>
                  </dl>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">Chemical Process</h4>
                  <dl className="space-y-2">
                    <div>
                      <dt className="text-sm text-gray-500">KOH Ratio</dt>
                      <dd className="text-lg font-semibold text-gray-900">{batch.koh_ratio || 'N/A'}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Gas Type</dt>
                      <dd className="text-lg font-semibold text-gray-900">{batch.gas_type || 'N/A'}</dd>
                    </div>
                  </dl>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">Physical Processing</h4>
                  <dl className="space-y-2">
                    <div>
                      <dt className="text-sm text-gray-500">Grinding Method</dt>
                      <dd className="text-lg font-semibold text-gray-900">{batch.grinding_method || 'N/A'}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Equipment</dt>
                      <dd className="text-lg font-semibold text-gray-900">Oven {batch.oven || 'N/A'}</dd>
                    </div>
                  </dl>
                </div>
              </div>

              {batch.quality_notes && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Quality Notes</h4>
                  <p className="text-sm text-blue-800">{batch.quality_notes}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'analysis' && (
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">Analysis Results</h3>
              <p className="text-sm text-gray-600">Comprehensive material characterization</p>
            </div>
            <div className="card-body">
              {analysisResults && analysisResults.length > 0 ? (
                <div className="space-y-6">
                  {analysisResults.map((result, index) => (
                    <div key={result.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium text-gray-900">
                          Analysis #{index + 1}
                        </h4>
                        <Badge variant="green">
                          {format(new Date(result.date_analyzed), 'MMM dd, yyyy')}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div>
                          <dt className="text-sm font-medium text-gray-500">BET Surface Area</dt>
                          <dd className="mt-1 text-lg font-semibold text-gray-900">
                            {result.bet_surface_area?.toLocaleString() || 'N/A'} m²/g
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Langmuir Surface Area</dt>
                          <dd className="mt-1 text-lg font-semibold text-gray-900">
                            {result.bet_langmuir?.toLocaleString() || 'N/A'} m²/g
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Conductivity</dt>
                          <dd className="mt-1 text-lg font-semibold text-gray-900">
                            {result.conductivity?.toLocaleString() || 'N/A'} {result.conductivity_unit}
                          </dd>
                        </div>
                      </div>

                      {result.comments && (
                        <div className="mt-4 p-3 bg-gray-50 rounded">
                          <p className="text-sm text-gray-700">{result.comments}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No Analysis Results</h3>
                  <p className="mt-1 text-sm text-gray-500">Analysis results will appear here when available</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'images' && (
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">SEM/TEM Images</h3>
              <p className="text-sm text-gray-600">Microscopy images and morphology analysis</p>
            </div>
            <div className="card-body">
              <div className="text-center py-12">
                <CameraIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No Images Available</h3>
                <p className="mt-1 text-sm text-gray-500">
                  SEM and TEM images will be displayed here when uploaded
                </p>
                <button className="mt-4 btn btn-primary">
                  Upload Images
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">History & Notes</h3>
              <p className="text-sm text-gray-600">Timeline of batch creation and modifications</p>
            </div>
            <div className="card-body">
              <div className="flow-root">
                <ul className="-mb-8">
                  <li>
                    <div className="relative pb-8">
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center ring-8 ring-white">
                            <BeakerIcon className="h-5 w-5 text-white" />
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div>
                            <p className="text-sm text-gray-500">
                              Batch created on{' '}
                              <time className="font-medium text-gray-900">
                                {format(new Date(batch.date_created), 'MMMM dd, yyyy')}
                              </time>
                            </p>
                          </div>
                          <div className="mt-2 text-sm text-gray-700">
                            <p>Initial batch creation with process parameters set</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>

                  {batch.shipped_date && (
                    <li>
                      <div className="relative pb-8">
                        <div className="relative flex space-x-3">
                          <div>
                            <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                              <DocumentTextIcon className="h-5 w-5 text-white" />
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div>
                              <p className="text-sm text-gray-500">
                                Shipped to {batch.shipped_to} on{' '}
                                <time className="font-medium text-gray-900">
                                  {format(new Date(batch.shipped_date), 'MMMM dd, yyyy')}
                                </time>
                              </p>
                            </div>
                            <div className="mt-2 text-sm text-gray-700">
                              <p>Weight: {batch.shipped_weight}g</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
