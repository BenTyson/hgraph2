// frontend/src/pages/BETAnalysis.tsx
import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, BarChart, Bar } from 'recharts';

export function BETAnalysis() {
  const [selectedView, setSelectedView] = useState('trends');
  const [selectedBatch, setSelectedBatch] = useState(null);
  
  // Sample BET data based on your hemp graphene research
  const betData = [
    {
      id: 'HG001',
      batchName: 'Hemp-AC-001',
      date: '2025-01-15',
      surfaceArea: 1247.2,
      poreVolume: 0.621,
      avgPoreDiameter: 1.99,
      microPoreArea: 1089.5,
      mesoPoreArea: 157.7,
      hempSource: 'Industrial Fiber',
      activationTemp: 850,
      kohRatio: 4.0,
      quality: 'excellent'
    },
    {
      id: 'HG002',
      batchName: 'Hemp-AC-002',
      date: '2025-01-18',
      surfaceArea: 982.4,
      poreVolume: 0.501,
      avgPoreDiameter: 2.04,
      microPoreArea: 801.2,
      mesoPoreArea: 181.2,
      hempSource: 'Industrial Fiber',
      activationTemp: 800,
      kohRatio: 3.0,
      quality: 'good'
    },
    {
      id: 'HG003',
      batchName: 'Hemp-AC-003',
      date: '2025-01-22',
      surfaceArea: 1456.8,
      poreVolume: 0.742,
      avgPoreDiameter: 2.03,
      microPoreArea: 1201.4,
      mesoPoreArea: 255.4,
      hempSource: 'Bast Fiber',
      activationTemp: 900,
      kohRatio: 5.0,
      quality: 'excellent'
    },
    {
      id: 'HG004',
      batchName: 'Hemp-AC-004',
      date: '2025-01-25',
      surfaceArea: 743.1,
      poreVolume: 0.381,
      avgPoreDiameter: 2.05,
      microPoreArea: 612.5,
      mesoPoreArea: 130.6,
      hempSource: 'Industrial Fiber',
      activationTemp: 750,
      kohRatio: 2.0,
      quality: 'average'
    }
  ];

  const getQualityColor = (quality: string) => {
    switch(quality) {
      case 'excellent': return '#d97706'; // copper-600
      case 'good': return '#92400e';     // copper-700
      case 'average': return '#f59e0b';  // amber-500
      case 'poor': return '#ef4444';     // red-500
      default: return '#6b7280';         // gray-500
    }
  };

  const QualityBadge = ({ quality }: { quality: string }) => (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
      quality === 'excellent' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200' :
      quality === 'good' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
      quality === 'average' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
      quality === 'poor' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
      'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
    }`}>
      {quality.charAt(0).toUpperCase() + quality.slice(1)}
    </span>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">BET Surface Area Analysis</h1>
        <p className="text-gray-600 dark:text-gray-400">Hemp-derived activated carbon characterization</p>
      </div>

      {/* View Toggle */}
      <div className="mb-6">
        <div className="flex space-x-2 bg-white dark:bg-gray-800 p-1 rounded-lg w-fit border border-gray-200 dark:border-gray-700">
          {['trends', 'correlation', 'batches'].map((view) => (
            <button
              key={view}
              onClick={() => setSelectedView(view)}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                selectedView === view 
                  ? 'bg-amber-600 text-white shadow-sm' 
                  : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {view.charAt(0).toUpperCase() + view.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart Area */}
        <div className="lg:col-span-2">
          {selectedView === 'trends' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Surface Area Trends</h3>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={betData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#6b7280"
                    tick={{ fill: '#6b7280' }}
                  />
                  <YAxis 
                    stroke="#6b7280"
                    tick={{ fill: '#6b7280' }}
                    label={{ value: 'Surface Area (m²/g)', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #d1d5db', 
                      borderRadius: '8px',
                      color: '#374151'
                    }} 
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="surfaceArea" 
                    stroke="#d97706" 
                    strokeWidth={3}
                    dot={{ fill: '#d97706', strokeWidth: 2, r: 6 }}
                    name="BET Surface Area"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="microPoreArea" 
                    stroke="#92400e" 
                    strokeWidth={2}
                    dot={{ fill: '#92400e', strokeWidth: 2, r: 4 }}
                    name="Micropore Area"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="mesoPoreArea" 
                    stroke="#f59e0b" 
                    strokeWidth={2}
                    dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                    name="Mesopore Area"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {selectedView === 'correlation' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Process Parameter Correlation</h3>
              <ResponsiveContainer width="100%" height={400}>
                <ScatterChart data={betData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="activationTemp" 
                    stroke="#6b7280"
                    tick={{ fill: '#6b7280' }}
                    label={{ value: 'Activation Temperature (°C)', position: 'insideBottom', offset: -10 }}
                  />
                  <YAxis 
                    stroke="#6b7280"
                    tick={{ fill: '#6b7280' }}
                    label={{ value: 'Surface Area (m²/g)', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #d1d5db', 
                      borderRadius: '8px',
                      color: '#374151'
                    }}
                    formatter={(value, name, props) => [
                      `${value} ${name === 'surfaceArea' ? 'm²/g' : ''}`,
                      name === 'surfaceArea' ? 'Surface Area' : name
                    ]}
                    labelFormatter={(value) => `Activation Temp: ${value}°C`}
                  />
                  <Scatter 
                    dataKey="surfaceArea" 
                    fill="#d97706"
                    r={8}
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          )}

          {selectedView === 'batches' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Batch Comparison</h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={betData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="batchName" 
                    stroke="#6b7280"
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                  />
                  <YAxis 
                    stroke="#6b7280"
                    tick={{ fill: '#6b7280' }}
                    label={{ value: 'Surface Area (m²/g)', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #d1d5db', 
                      borderRadius: '8px',
                      color: '#374151'
                    }} 
                  />
                  <Bar 
                    dataKey="surfaceArea" 
                    fill="#d97706"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Quality Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Quality Summary</h3>
            <div className="space-y-3">
              {betData.map((batch) => (
                <div key={batch.id} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">{batch.batchName}</span>
                  <QualityBadge quality={batch.quality} />
                </div>
              ))}
            </div>
          </div>

          {/* Key Metrics */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Key Metrics</h3>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Best Surface Area</div>
                <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                  {Math.max(...betData.map(b => b.surfaceArea)).toFixed(1)} m²/g
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Average Surface Area</div>
                <div className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {(betData.reduce((sum, b) => sum + b.surfaceArea, 0) / betData.length).toFixed(1)} m²/g
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Supercapacitor Ready</div>
                <div className="text-xl font-semibold text-green-600 dark:text-green-400">
                  {betData.filter(b => b.surfaceArea > 1000).length}/{betData.length} batches
                </div>
              </div>
            </div>
          </div>

          {/* Process Insights */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Process Insights</h3>
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded">
                <div className="font-medium text-green-800 dark:text-green-400">✓ Optimal Range</div>
                <div className="text-green-700 dark:text-green-300">850-900°C activation shows best results</div>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded">
                <div className="font-medium text-blue-800 dark:text-blue-400">ℹ Observation</div>
                <div className="text-blue-700 dark:text-blue-300">Bast fiber shows higher surface areas</div>
              </div>
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded">
                <div className="font-medium text-yellow-800 dark:text-yellow-400">⚠ Watch</div>
                <div className="text-yellow-700 dark:text-yellow-300">KOH ratio &gt;4.0 needed for supercap grade</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Add this to the imports at the top
import { ArrowUpTrayIcon } from '@heroicons/react/24/outline';

// Add this button in the header section (after line ~80, before the View Toggle):
      {/* Quick Import Button */}
      <div className="mb-4">
        <button 
          onClick={() => window.location.href = '/import'}
          className="inline-flex items-center px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-colors"
        >
          <ArrowUpTrayIcon className="h-4 w-4 mr-2" />
          Import BET Data
        </button>
      </div>
