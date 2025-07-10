import { useState } from 'react'
import { CloudArrowUpIcon, DocumentTextIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { Badge } from '../components/Badge'
import { LoadingSpinner } from '../components/LoadingSpinner'

interface ImportResult {
  success: boolean
  imported: number
  errors: string[]
  total: number
}

export function DataImport() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [importType, setImportType] = useState('graphene_batches')
  const [isUploading, setIsUploading] = useState(false)
  const [importResult, setImportResult] = useState<ImportResult | null>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setImportResult(null)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setIsUploading(true)
    
    // Simulate upload process - replace with actual API call later
    setTimeout(() => {
      setImportResult({
        success: true,
        imported: 15,
        errors: ['Row 3: Missing temperature value', 'Row 7: Invalid BET format'],
        total: 17
      })
      setIsUploading(false)
    }, 2000)
  }

  const importTypes = [
    {
      id: 'graphene_batches',
      name: 'Graphene Batches',
      description: 'Import graphene batch data with process parameters',
      template: 'Batch Name, Date, Oven, Species, Temperature, Time, KOH Ratio...'
    },
    {
      id: 'biochar_batches', 
      name: 'Biochar Batches',
      description: 'Import biochar batch data (Step 1 process)',
      template: 'Batch Name, Date, Reactor, Temperature, Time, Raw Material...'
    },
    {
      id: 'analysis_results',
      name: 'Analysis Results',
      description: 'Import BET, conductivity, and other analysis data',
      template: 'Sample, BET Surface Area, Langmuir Area, Conductivity...'
    },
    {
      id: 'curia_report',
      name: 'Curia Report',
      description: 'Import complete Curia analytical report',
      template: 'Full Curia report format with all measurements'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-bold text-gray-900">Data Import</h1>
        <p className="mt-2 text-gray-600">Upload CSV files to import batch data and analysis results</p>
      </div>

      {/* Import Type Selection */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-xl font-semibold text-gray-900">Select Import Type</h2>
          <p className="text-sm text-gray-600">Choose the type of data you want to import</p>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {importTypes.map((type) => (
              <div
                key={type.id}
                className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all ${
                  importType === type.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setImportType(type.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900">{type.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">{type.description}</p>
                    <p className="text-xs text-gray-400 mt-2 font-mono">{type.template}</p>
                  </div>
                  {importType === type.id && (
                    <Badge variant="blue" size="sm">Selected</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* File Upload */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-xl font-semibold text-gray-900">Upload File</h2>
          <p className="text-sm text-gray-600">Select a CSV or Excel file to import</p>
        </div>
        <div className="card-body">
          <div className="space-y-4">
            {/* File Input */}
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <CloudArrowUpIcon className="w-10 h-10 mb-3 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">CSV or Excel files (MAX. 10MB)</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileSelect}
                />
              </label>
            </div>

            {/* Selected File Info */}
            {selectedFile && (
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <DocumentTextIcon className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                    <p className="text-xs text-gray-500">
                      {(selectedFile.size / 1024).toFixed(1)} KB • {importTypes.find(t => t.id === importType)?.name}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="btn btn-primary flex items-center space-x-2"
                >
                  {isUploading ? (
                    <>
                      <LoadingSpinner size="sm" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <CloudArrowUpIcon className="h-4 w-4" />
                      <span>Import Data</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Import Results */}
      {importResult && (
        <div className="card">
          <div className="card-header">
            <h2 className="text-xl font-semibold text-gray-900">Import Results</h2>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              {/* Summary */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-green-600">Successfully Imported</p>
                  <p className="text-2xl font-bold text-green-900">{importResult.imported}</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-red-600">Errors</p>
                  <p className="text-2xl font-bold text-red-900">{importResult.errors.length}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-blue-600">Total Rows</p>
                  <p className="text-2xl font-bold text-blue-900">{importResult.total}</p>
                </div>
              </div>

              {/* Errors */}
              {importResult.errors.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">Import Warnings</h3>
                      <div className="mt-2 text-sm text-yellow-700">
                        <ul className="space-y-1">
                          {importResult.errors.map((error, index) => (
                            <li key={index}>• {error}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Templates & Help */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Download Templates</h3>
          </div>
          <div className="card-body">
            <div className="space-y-3">
              <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="font-medium text-gray-900">Graphene Batch Template</div>
                <div className="text-xs text-gray-500">CSV template for graphene batch data</div>
              </button>
              <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="font-medium text-gray-900">Analysis Results Template</div>
                <div className="text-xs text-gray-500">CSV template for BET and analysis data</div>
              </button>
              <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="font-medium text-gray-900">Curia Report Template</div>
                <div className="text-xs text-gray-500">Template matching Curia report format</div>
              </button>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Import Guidelines</h3>
          </div>
          <div className="card-body">
            <div className="space-y-3 text-sm text-gray-700">
              <div>
                <strong>File Format:</strong> CSV or Excel files are supported
              </div>
              <div>
                <strong>File Size:</strong> Maximum 10MB per file
              </div>
              <div>
                <strong>Data Validation:</strong> All data is validated before import
              </div>
              <div>
                <strong>Duplicates:</strong> Duplicate batch names will be flagged
              </div>
              <div>
                <strong>Required Fields:</strong> Batch name and date are required
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
