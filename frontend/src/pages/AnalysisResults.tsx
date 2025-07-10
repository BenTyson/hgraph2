import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { SearchInput } from '../components/SearchInput'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { Badge } from '../components/Badge'
import { batchApi } from '../services/api'
import { BeakerIcon, ChartBarIcon, EyeIcon } from '@heroicons/react/24/outline'

interface AnalysisTest {
  id: string
  category: string
  testName: string
  method: string
  status: 'pending' | 'in_progress' | 'completed' | 'failed'
  priority: 'low' | 'medium' | 'high' | 'critical'
  estimatedCompletion?: string
  results?: any
  notes?: string
}

export function AnalysisResults() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  // Mock data for now - this will come from your API later
  const analysisTests: AnalysisTest[] = [
    {
      id: '1',
      category: 'BET Surface Area Analysis',
      testName: 'Specific Surface Area',
      method: 'ASTM D3663/D6556',
      status: 'completed',
      priority: 'critical',
      results: { value: 1650, unit: 'm²/g', batch: 'MRa445' }
    },
    {
      id: '2',
      category: 'BET Surface Area Analysis',
      testName: 'Pore Volume',
      method: 'ASTM D3663/D6556',
      status: 'completed',
      priority: 'high',
      results: { value: 0.85, unit: 'cm³/g', batch: 'MRa445' }
    },
    {
      id: '3',
      category: 'Microscopy & Morphology',
      testName: 'SEM Imaging',
      method: 'Standard SEM Protocol',
      status: 'completed',
      priority: 'high',
      results: { images: 5, magnifications: '1000x-50000x', batch: 'MRa445' }
    },
    {
      id: '4',
      category: 'Chemical/Structural Analysis',
      testName: 'Raman Spectroscopy',
      method: 'D/G ratio analysis',
      status: 'in_progress',
      priority: 'critical',
      estimatedCompletion: '2025-07-15'
    },
    {
      id: '5',
      category: 'Electrical Properties',
      testName: 'Electrical Conductivity',
      method: '4-point probe method',
      status: 'completed',
      priority: 'critical',
      results: { value: 13.7, unit: 'S/m', batch: 'MRa445' }
    },
    {
      id: '6',
      category: 'Chemical/Structural Analysis',
      testName: 'XRD Analysis',
      method: 'Crystalline structure',
      status: 'pending',
      priority: 'high',
      estimatedCompletion: '2025-07-20'
    },
    {
      id: '7',
      category: 'Thermal Properties',
      testName: 'TGA Analysis',
      method: 'Thermal stability',
      status: 'pending',
      priority: 'medium',
      estimatedCompletion: '2025-07-25'
    },
    {
      id: '8',
      category: 'Mechanical Properties',
      testName: 'Tensile Strength',
      method: 'Standard tensile test',
      status: 'pending',
      priority: 'medium',
      estimatedCompletion: '2025-08-01'
    },
  ]

  const categories = [
    'BET Surface Area Analysis',
    'Microscopy & Morphology',
    'Chemical/Structural Analysis',
    'Electrical Properties',
    'Thermal Properties',
    'Mechanical Properties'
  ]

  const filteredTests = analysisTests.filter(test => {
    const matchesCategory = selectedCategory === 'all' || test.category === selectedCategory
    const matchesStatus = selectedStatus === 'all' || test.status === selectedStatus
    const matchesSearch = test.testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         test.method.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesStatus && matchesSearch
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="green">Completed</Badge>
      case 'in_progress':
        return <Badge variant="blue">In Progress</Badge>
      case 'pending':
        return <Badge variant="yellow">Pending</Badge>
      case 'failed':
        return <Badge variant="red">Failed</Badge>
      default:
        return <Badge variant="gray">Unknown</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'critical':
        return <Badge variant="red" size="sm">Critical</Badge>
      case 'high':
        return <Badge variant="yellow" size="sm">High</Badge>
      case 'medium':
        return <Badge variant="blue" size="sm">Medium</Badge>
      case 'low':
        return <Badge variant="gray" size="sm">Low</Badge>
      default:
        return <Badge variant="gray" size="sm">-</Badge>
    }
  }

  const getStatusStats = () => {
    const stats = analysisTests.reduce((acc, test) => {
      acc[test.status] = (acc[test.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    return {
      total: analysisTests.length,
      completed: stats.completed || 0,
      in_progress: stats.in_progress || 0,
      pending: stats.pending || 0,
      failed: stats.failed || 0
    }
  }

  const stats = getStatusStats()

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-bold text-gray-900">Analysis Results</h1>
        <p className="mt-2 text-gray-600">Track comprehensive testing of hemp graphene material properties</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <BeakerIcon className="h-8 w-8 text-gray-400" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Tests</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <ChartBarIcon className="h-8 w-8 text-green-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Completed</p>
              <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <EyeIcon className="h-8 w-8 text-blue-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">In Progress</p>
              <p className="text-2xl font-bold text-blue-600">{stats.in_progress}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
              <div className="h-4 w-4 bg-yellow-500 rounded-full"></div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
              <div className="h-4 w-4 bg-red-500 rounded-full"></div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Failed</p>
              <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="card-body">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <SearchInput
              placeholder="Search tests or methods..."
              value={searchTerm}
              onChange={setSearchTerm}
            />

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="select"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="select"
            >
              <option value="all">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="in_progress">In Progress</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>

            <button className="btn btn-primary">
              Add New Test
            </button>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="card">
        <div className="card-body p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Test Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Results
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTests.map((test) => (
                  <tr key={test.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{test.testName}</div>
                        <div className="text-sm text-gray-500">{test.category}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{test.method}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(test.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getPriorityBadge(test.priority)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {test.results ? (
                        <div className="text-sm text-gray-900">
                          {test.results.value} {test.results.unit}
                          {test.results.batch && (
                            <div className="text-xs text-gray-500">Batch: {test.results.batch}</div>
                          )}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">
                          {test.estimatedCompletion ? `Est: ${test.estimatedCompletion}` : 'Pending'}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">
                        View
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">
          Showing {filteredTests.length} of {analysisTests.length} tests
        </p>
        <div className="flex space-x-2">
          <button className="btn btn-secondary">Export CSV</button>
          <button className="btn btn-secondary">Generate Report</button>
        </div>
      </div>
    </div>
  )
}
