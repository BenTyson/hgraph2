import { useState } from 'react'
import { Badge } from './Badge'
import { StatCard } from './StatCard'
import { ChartBarIcon, BeakerIcon, FireIcon } from '@heroicons/react/24/outline'

interface BatchComparisonProps {
  batches: any[]
}

export function BatchComparison({ batches }: BatchComparisonProps) {
  const [selectedBatches, setSelectedBatches] = useState<string[]>([])

  const toggleBatch = (batchId: string) => {
    if (selectedBatches.includes(batchId)) {
      setSelectedBatches(selectedBatches.filter(id => id !== batchId))
    } else if (selectedBatches.length < 3) {
      setSelectedBatches([...selectedBatches, batchId])
    }
  }

  const comparisonBatches = batches.filter(batch => selectedBatches.includes(batch.id))

  return (
    <div className="space-y-6">
      {/* Batch Selection */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900">Select Batches to Compare</h3>
          <p className="text-sm text-gray-600">Choose up to 3 batches for side-by-side comparison</p>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {batches.slice(0, 9).map((batch) => (
              <div
                key={batch.id}
                className={`relative cursor-pointer rounded-lg border-2 p-3 transition-all ${
                  selectedBatches.includes(batch.id)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => toggleBatch(batch.id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{batch.name}</h4>
                    <p className="text-xs text-gray-500">
                      {batch.best_bet?.toLocaleString() || 'N/A'} m²/g BET
                    </p>
                  </div>
                  {selectedBatches.includes(batch.id) && (
                    <Badge variant="blue" size="sm">Selected</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Comparison Results */}
      {comparisonBatches.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Batch Comparison</h3>
            <p className="text-sm text-gray-600">Side-by-side analysis of selected batches</p>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {comparisonBatches.map((batch) => (
                <div key={batch.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="text-center mb-4">
                    <h4 className="font-semibold text-gray-900">{batch.name}</h4>
                    <p className="text-sm text-gray-500">
                      {new Date(batch.date_created).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="text-center p-3 bg-blue-50 rounded">
                      <ChartBarIcon className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                      <p className="text-lg font-bold text-blue-900">
                        {batch.best_bet?.toLocaleString() || 'N/A'}
                      </p>
                      <p className="text-xs text-blue-700">BET (m²/g)</p>
                    </div>

                    <div className="text-center p-3 bg-orange-50 rounded">
                      <FireIcon className="h-6 w-6 text-orange-600 mx-auto mb-1" />
                      <p className="text-lg font-bold text-orange-900">
                        {batch.temperature || 'N/A'}°C
                      </p>
                      <p className="text-xs text-orange-700">Temperature</p>
                    </div>

                    <div className="text-center p-3 bg-green-50 rounded">
                      <BeakerIcon className="h-6 w-6 text-green-600 mx-auto mb-1" />
                      <p className="text-lg font-bold text-green-900">
                        {batch.koh_ratio || 'N/A'}
                      </p>
                      <p className="text-xs text-green-700">KOH Ratio</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Comparison Summary */}
            {comparisonBatches.length > 1 && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Comparison Summary</h4>
                <div className="grid grid-cols-1 gap-2 md:grid-cols-3 text-sm">
                  <div>
                    <span className="font-medium">Best BET:</span>{' '}
                    {Math.max(...comparisonBatches.map(b => b.best_bet || 0)).toLocaleString()} m²/g
                  </div>
                  <div>
                    <span className="font-medium">Avg Temperature:</span>{' '}
                    {Math.round(
                      comparisonBatches.reduce((sum, b) => sum + (b.temperature || 0), 0) / 
                      comparisonBatches.length
                    )}°C
                  </div>
                  <div>
                    <span className="font-medium">Range:</span>{' '}
                    {Math.max(...comparisonBatches.map(b => b.best_bet || 0)) - 
                     Math.min(...comparisonBatches.map(b => b.best_bet || 0))} m²/g
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
