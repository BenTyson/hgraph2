import { useState } from 'react'
import { ArrowUpTrayIcon, DocumentTextIcon, CheckCircleIcon, BeakerIcon, ChartBarIcon } from '@heroicons/react/24/outline'

export function DataImport() {
  const [activeTab, setActiveTab] = useState('bet')
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [extractedData, setExtractedData] = useState<any[]>([])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setUploadedFiles(files)
    setIsProcessing(true)
    
    // Simulate data extraction from BET reports
    setTimeout(() => {
      const mockData = files.map((file, index) => ({
        filename: file.name,
        batchId: `HG${String(Date.now() + index).slice(-3)}`,
        surfaceArea: Math.random() * 1000 + 500,
        poreVolume: Math.random() * 0.5 + 0.3,
        microPoreArea: Math.random() * 800 + 400,
        mesoPoreArea: Math.random() * 200 + 100,
        avgPoreDiameter: Math.random() * 3 + 1,
        instrument: 'Micromeritics ASAP 2020',
        analysisDate: new Date().toLocaleDateString(),
        extractedAt: new Date().toISOString()
      }))
      setExtractedData(mockData)
      setIsProcessing(false)
    }, 2000)
  }

  const handleBulkImport = () => {
    // This would send data to your backend
    console.log('Importing data:', extractedData)
    alert(`Importing ${extractedData.length} BET analysis results to database...`)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Data Import</h1>
        <p className="text-gray-600 dark:text-gray-400">Import experimental data from various sources</p>
      </div>

      {/* Import Type Tabs */}
      <div className="mb-6">
        <div className="flex space-x-2 bg-white dark:bg-gray-800 p-1 rounded-lg w-fit border border-gray-200 dark:border-gray-700">
          {[
            { id: 'bet', label: 'BET Analysis', icon: ChartBarIcon },
            { id: 'sem', label: 'SEM Reports', icon: DocumentTextIcon },
            { id: 'batches', label: 'Batch Data', icon: BeakerIcon }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === tab.id 
                  ? 'bg-amber-600 text-white shadow-sm' 
                  : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <tab.icon className="h-4 w-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* BET Analysis Import */}
      {activeTab === 'bet' && (
        <div className="space-y-6">
          {/* Upload Area */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              BET Surface Area Analysis Import
            </h3>
            
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
              <ArrowUpTrayIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                Upload BET Analysis Reports
              </h4>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Supports PDF reports from Micromeritics, Quantachrome, and other BET instruments
              </p>
              <input
                type="file"
                multiple
                accept=".pdf,.xlsx,.csv"
                onChange={handleFileUpload}
                className="hidden"
                id="bet-file-upload"
              />
              <label
                htmlFor="bet-file-upload"
                className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg cursor-pointer inline-flex items-center font-medium"
              >
                <ArrowUpTrayIcon className="h-5 w-5 mr-2" />
                Select BET Reports
              </label>
            </div>

            {/* Supported Formats */}
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <h4 className="font-medium text-blue-900 dark:text-blue-400 mb-2">Supported Formats:</h4>
              <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                <li>• Micromeritics ASAP 2020 PDF reports</li>
                <li>• Quantachrome Nova series reports</li>
                <li>• Custom CSV templates (surface area, pore volume, etc.)</li>
                <li>• Excel files with BET data</li>
              </ul>
            </div>
          </div>

          {/* Processing Status */}
          {isProcessing && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-amber-600 mr-3"></div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">Processing BET Reports</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Extracting surface area data, pore volumes, and isotherm information...
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Extracted Data Preview */}
          {extractedData.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Extracted Data Preview
                </h3>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {extractedData.length} files processed
                </span>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">File</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Batch ID</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Surface Area</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Pore Volume</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Micro/Meso</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Instrument</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {extractedData.map((data, index) => (
                      <tr key={index} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750">
                        <td className="py-3 px-4 text-gray-700 dark:text-gray-300 max-w-xs truncate">
                          {data.filename}
                        </td>
                        <td className="py-3 px-4 text-gray-700 dark:text-gray-300 font-mono">
                          {data.batchId}
                        </td>
                        <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                          <span className="font-medium">{data.surfaceArea.toFixed(1)}</span>
                          <span className="text-gray-500 ml-1">m²/g</span>
                        </td>
                        <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                          <span className="font-medium">{data.poreVolume.toFixed(3)}</span>
                          <span className="text-gray-500 ml-1">cm³/g</span>
                        </td>
                        <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                          <div className="text-xs">
                            <div>Micro: {data.microPoreArea.toFixed(0)} m²/g</div>
                            <div>Meso: {data.mesoPoreArea.toFixed(0)} m²/g</div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-700 dark:text-gray-300 text-xs">
                          {data.instrument}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <CheckCircleIcon className="h-4 w-4 text-green-500 mr-1" />
                            <span className="text-green-600 text-xs">Ready</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Import Actions */}
              <div className="mt-6 flex justify-between items-center">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Data will be imported to: <span className="font-medium">Hemp Graphene Database</span>
                </div>
                <div className="flex space-x-3">
                  <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-medium">
                    Review Mapping
                  </button>
                  <button 
                    onClick={handleBulkImport}
                    className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium"
                  >
                    Import {extractedData.length} Records
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SEM Reports Tab */}
      {activeTab === 'sem' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            SEM Image & Report Import
          </h3>
          <div className="text-center py-12">
            <DocumentTextIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              SEM import functionality coming soon...
            </p>
          </div>
        </div>
      )}

      {/* Batch Data Tab */}
      {activeTab === 'batches' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Batch Process Data Import
          </h3>
          <div className="text-center py-12">
            <BeakerIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              Batch data import functionality coming soon...
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
