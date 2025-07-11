import { useState } from 'react';
import { ArrowUpTrayIcon, DocumentTextIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export function BETDataImporter() {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<any[]>([]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles(files);
    
    // Simulate data extraction
    setTimeout(() => {
      const mockData = files.map((file, index) => ({
        filename: file.name,
        batchId: `HG${String(index + 1).padStart(3, '0')}`,
        surfaceArea: Math.random() * 1000 + 500,
        poreVolume: Math.random() * 0.5 + 0.3,
        microPoreArea: Math.random() * 800 + 400,
        mesoPoreArea: Math.random() * 200 + 100,
        avgPoreDiameter: Math.random() * 3 + 1,
        extractedAt: new Date().toISOString()
      }));
      setExtractedData(mockData);
      setIsProcessing(false);
    }, 2000);
    setIsProcessing(true);
  };

  const processBETReport = (file: File) => {
    // This would contain actual PDF parsing logic
    // For now, return mock data
    return {
      surfaceArea: Math.random() * 1000 + 500,
      poreVolume: Math.random() * 0.5 + 0.3,
      instrument: 'Micromeritics ASAP 2020',
      analysisDate: new Date().toLocaleDateString()
    };
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
        BET Report Import
      </h3>
      
      {/* Upload Area */}
      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
        <ArrowUpTrayIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
          Upload BET Analysis Reports
        </h4>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Drop your PDF reports here or click to browse
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
          className="bg-copper-600 hover:bg-copper-700 text-white px-4 py-2 rounded-lg cursor-pointer inline-flex items-center"
        >
          Select Files
        </label>
      </div>

      {/* Processing Status */}
      {isProcessing && (
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            <span className="text-blue-800 dark:text-blue-400">
              Processing BET reports... Extracting surface area data...
            </span>
          </div>
        </div>
      )}

      {/* Extracted Data Preview */}
      {extractedData.length > 0 && (
        <div className="mt-6">
          <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
            Extracted Data Preview
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-2 px-3 font-medium text-gray-900 dark:text-gray-100">File</th>
                  <th className="text-left py-2 px-3 font-medium text-gray-900 dark:text-gray-100">Batch ID</th>
                  <th className="text-left py-2 px-3 font-medium text-gray-900 dark:text-gray-100">Surface Area</th>
                  <th className="text-left py-2 px-3 font-medium text-gray-900 dark:text-gray-100">Pore Volume</th>
                  <th className="text-left py-2 px-3 font-medium text-gray-900 dark:text-gray-100">Status</th>
                </tr>
              </thead>
              <tbody>
                {extractedData.map((data, index) => (
                  <tr key={index} className="border-b border-gray-200 dark:border-gray-700">
                    <td className="py-2 px-3 text-gray-700 dark:text-gray-300">{data.filename}</td>
                    <td className="py-2 px-3 text-gray-700 dark:text-gray-300">{data.batchId}</td>
                    <td className="py-2 px-3 text-gray-700 dark:text-gray-300">{data.surfaceArea.toFixed(1)} m²/g</td>
                    <td className="py-2 px-3 text-gray-700 dark:text-gray-300">{data.poreVolume.toFixed(3)} cm³/g</td>
                    <td className="py-2 px-3">
                      <CheckCircleIcon className="h-4 w-4 text-green-500" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 flex justify-end space-x-3">
            <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
              Review Changes
            </button>
            <button className="px-4 py-2 bg-copper-600 hover:bg-copper-700 text-white rounded-lg">
              Import to Database
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
