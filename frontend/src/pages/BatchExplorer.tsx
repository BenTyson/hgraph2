import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { SearchInput } from '../components/SearchInput'
import { Table } from '../components/Table'
import { Badge } from '../components/Badge'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ExportControls } from '../components/ExportControls'
import { batchApi, GrapheneBatch } from '../services/api'
import { format } from 'date-fns'
import { EyeIcon } from '@heroicons/react/24/outline'

export function BatchExplorer() {
  const [filters, setFilters] = useState({
    search: '',
    oven: '',
    species: '',
    oven_c_era: false,
    shipped_only: false,
  })

  const { data: batches, isLoading, error } = useQuery({
    queryKey: ['graphene-batches', filters],
    queryFn: () => batchApi.getGrapheneBatches({
      oven: filters.oven || undefined,
      species: filters.species ? parseInt(filters.species) : undefined,
      oven_c_era: filters.oven_c_era || undefined,
      shipped_only: filters.shipped_only || undefined,
    }).then(res => res.data),
  })

  // Filter batches by search term
  const filteredBatches = batches?.filter(batch =>
    batch.name.toLowerCase().includes(filters.search.toLowerCase())
  ) || []

  const getBETGrade = (bet: number | null) => {
    if (!bet) return { label: 'No Data', variant: 'gray' as const }
    if (bet >= 2000) return { label: 'Excellent', variant: 'green' as const }
    if (bet >= 1500) return { label: 'Good', variant: 'blue' as const }
    if (bet >= 1000) return { label: 'Acceptable', variant: 'yellow' as const }
    return { label: 'Poor', variant: 'red' as const }
  }

  // Prepare export data
  const exportData = filteredBatches.map(batch => ({
    batch_name: batch.name,
    date_created: batch.date_created,
    oven: batch.oven || 'N/A',
    species: batch.species || 'N/A',
    temperature: batch.temperature || 'N/A',
    koh_ratio: batch.koh_ratio || 'N/A',
    time_hours: batch.time_hours || 'N/A',
    grinding_method: batch.grinding_method || 'N/A',
    gas_type: batch.gas_type || 'N/A',
    best_bet_surface_area: batch.best_bet || 'N/A',
    best_conductivity: batch.best_conductivity || 'N/A',
    shipped_to: batch.shipped_to || 'Not Shipped',
    shipped_date: batch.shipped_date || 'N/A',
    shipped_weight: batch.shipped_weight || 'N/A',
    is_oven_c_era: batch.is_oven_c_era ? 'Yes' : 'No',
    appearance: batch.appearance || 'N/A',
    quality_notes: batch.quality_notes || 'N/A'
  }))

  const columns = [
    {
      key: 'name' as keyof GrapheneBatch,
      title: 'Batch',
      render: (value: string, row: GrapheneBatch) => (
        <div className="flex flex-col">
          <Link 
            to={`/batch/${row.id}`}
            className="font-medium text-blue-600 hover:text-blue-800 transition-colors"
          >
            {value}
          </Link>
          {row.is_oven_c_era && (
            <Badge variant="green" size="sm" className="mt-1 w-fit">
              Oven C Era
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: 'date_created' as keyof GrapheneBatch,
      title: 'Date',
      render: (value: string) => (
        <span className="text-gray-700">
          {format(new Date(value), 'MMM dd, yyyy')}
        </span>
      ),
    },
    {
      key: 'oven' as keyof GrapheneBatch,
      title: 'Oven',
      render: (value: string | null) => (
        <span className="text-gray-700">{value || 'N/A'}</span>
      ),
    },
    {
      key: 'species' as keyof GrapheneBatch,
      title: 'Species',
      render: (value: number | null) => (
        <span className="text-gray-700">
          {value ? `Species ${value}` : 'N/A'}
        </span>
      ),
    },
    {
      key: 'best_bet' as keyof GrapheneBatch,
      title: 'BET (m²/g)',
      render: (value: number | null) => {
        const grade = getBETGrade(value)
        return (
          <div className="flex flex-col">
            <span className="font-medium text-gray-900">
              {value?.toLocaleString() || 'N/A'}
            </span>
            <Badge variant={grade.variant} size="sm" className="mt-1 w-fit">
              {grade.label}
            </Badge>
          </div>
        )
      },
    },
    {
      key: 'shipped_to' as keyof GrapheneBatch,
      title: 'Status',
      render: (value: string | null) => (
        value ? (
          <Badge variant="green">
            <span className="flex items-center">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
              {value}
            </span>
          </Badge>
        ) : (
          <Badge variant="gray">In Lab</Badge>
        )
      ),
    },
    {
      key: 'id' as keyof GrapheneBatch,
      title: 'Actions',
      render: (value: string) => (
        <Link 
          to={`/batch/${value}`}
          className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm"
        >
          <EyeIcon className="h-4 w-4" />
          <span>View Details</span>
        </Link>
      ),
    },
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading batches...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error loading batches</h3>
            <p className="mt-1 text-sm text-red-700">Failed to load batch data. Please try again.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-bold text-gray-900">Batch Explorer</h1>
        <p className="mt-2 text-gray-600">Search and analyze all graphene batches</p>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="card-body">
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <SearchInput
                placeholder="Search batch name..."
                value={filters.search}
                onChange={(value) => setFilters({ ...filters, search: value })}
               className="md:col-span-2"
             />

             <select
               value={filters.oven}
               onChange={(e) => setFilters({ ...filters, oven: e.target.value })}
               className="select"
             >
               <option value="">All Ovens</option>
               <option value="C">Oven C</option>
               <option value="AV1">AV1</option>
               <option value="AV5">AV5</option>
             </select>

             <select
               value={filters.species}
               onChange={(e) => setFilters({ ...filters, species: e.target.value })}
               className="select"
             >
               <option value="">All Species</option>
               <option value="1">Species 1</option>
               <option value="2">Species 2</option>
             </select>
           </div>

           <div className="flex flex-wrap gap-4">
             <label className="flex items-center">
               <input
                 type="checkbox"
                 checked={filters.oven_c_era}
                 onChange={(e) => setFilters({ ...filters, oven_c_era: e.target.checked })}
                 className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
               />
               <span className="ml-2 text-sm text-gray-700">Oven C Era Only</span>
             </label>

             <label className="flex items-center">
               <input
                 type="checkbox"
                 checked={filters.shipped_only}
                 onChange={(e) => setFilters({ ...filters, shipped_only: e.target.checked })}
                 className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
               />
               <span className="ml-2 text-sm text-gray-700">Shipped Only</span>
             </label>
           </div>
         </div>
       </div>
     </div>

     {/* Results */}
     <div className="space-y-4">
       <div className="flex items-center justify-between">
         <p className="text-sm text-gray-600">
           Found {filteredBatches.length} batches
         </p>
         <ExportControls 
           data={exportData} 
           filename="hgraph2_batches"
           title="Export Batches"
         />
       </div>

       <Table
         data={filteredBatches}
         columns={columns}
       />
     </div>
   </div>
 )
}
