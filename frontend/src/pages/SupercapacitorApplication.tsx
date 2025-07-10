// frontend/src/pages/SupercapacitorApplication.tsx
import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

export function SupercapacitorApplication() {
  const [selectedMetric, setSelectedMetric] = useState('surfaceArea');
  const [thresholdMode, setThresholdMode] = useState('view');

  // Hemp graphene data with supercapacitor performance metrics
  const hempGrapheneData = [
    {
      id: 'HG001',
      batchName: 'Hemp-AC-001',
      surfaceArea: 1247.2,
      capacitance: 245.8,
      conductivity: 12.4,
      esr: 0.85,
      cycleLife: 10000,
      supercapGrade: 'A',
      status: 'excellent'
    },
    {
      id: 'HG002', 
      batchName: 'Hemp-AC-002',
      surfaceArea: 982.4,
      capacitance: 189.3,
      conductivity: 8.7,
      esr: 1.24,
      cycleLife: 8500,
      supercapGrade: 'B',
      status: 'good'
    },
    {
      id: 'HG003',
      batchName: 'Hemp-AC-003', 
      surfaceArea: 1456.8,
      capacitance: 312.4,
      conductivity: 15.2,
      esr: 0.67,
      cycleLife: 12000,
      supercapGrade: 'A+',
      status: 'excellent'
    }
  ];

  // Commercial activated carbon benchmarks
  const benchmarkData = [
    {
      name: 'Hemp Graphene (Best)',
      surfaceArea: 1456.8,
      capacitance: 312.4,
      conductivity: 15.2,
      cost: 45,
      sustainability: 95
    },
    {
      name: 'Commercial AC (YP-50F)',
      surfaceArea: 1600,
      capacitance: 130,
      conductivity: 5.8,
      cost: 25,
      sustainability: 30
    },
    {
      name: 'Coconut Shell AC',
      surfaceArea: 1200,
      capacitance: 120,
      conductivity: 4.2,
      cost: 15,
      sustainability: 60
    },
    {
      name: 'Coal-based AC',
      surfaceArea: 1800,
      capacitance: 110,
      conductivity: 3.9,
      cost: 12,
      sustainability: 20
    }
  ];

  // Quality thresholds for supercapacitors
  const thresholds = {
    surfaceArea: { excellent: 1200, good: 800, minimum: 500 },
    capacitance: { excellent: 200, good: 150, minimum: 100 },
    conductivity: { excellent: 10, good: 5, minimum: 1 },
    esr: { excellent: 1.0, good: 2.0, maximum: 5.0 },
    cycleLife: { excellent: 10000, good: 5000, minimum: 1000 }
  };

  const getGradeColor = (grade: string) => {
    switch(grade) {
      case 'A+': return '#10b981';
      case 'A': return '#84cc16';  
      case 'B': return '#f59e0b';
      case 'C': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'excellent': return '#10b981';
      case 'good': return '#84cc16';
      case 'average': return '#f59e0b';
      case 'poor': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const ThresholdCard = ({ metric, label, unit, current, thresholds }: any) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
      <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">{label}</h4>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-green-600">Excellent</span>
          <span className="text-gray-900 dark:text-gray-100 font-mono">&gt;{thresholds.excellent} {unit}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-lime-600">Good</span>
          <span className="text-gray-900 dark:text-gray-100 font-mono">&gt;{thresholds.good} {unit}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-yellow-600">Minimum</span>
          <span className="text-gray-900 dark:text-gray-100 font-mono">&gt;{thresholds.minimum} {unit}</span>
        </div>
        {current && (
          <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-600">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Current Best</span>
              <span className="text-amber-600 dark:text-amber-400 font-mono font-bold">{current} {unit}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Supercapacitor Application Analysis</h1>
        <p className="text-gray-600 dark:text-gray-400">Hemp graphene performance vs commercial activated carbon</p>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Supercap Ready</p>
              <p className="text-2xl font-bold text-green-600">
                {hempGrapheneData.filter(b => b.supercapGrade.includes('A')).length}/{hempGrapheneData.length}
              </p>
            </div>
            <div className="h-12 w-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <span className="text-green-600 text-xl">⚡</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Best Capacitance</p>
              <p className="text-2xl font-bold text-amber-600">
                {Math.max(...hempGrapheneData.map(b => b.capacitance)).toFixed(1)} F/g
              </p>
            </div>
            <div className="h-12 w-12 bg-amber-100 dark:bg-amber-900 rounded-lg flex items-center justify-center">
              <span className="text-amber-600 text-xl">🔋</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Sustainability Score</p>
              <p className="text-2xl font-bold text-green-600">95%</p>
            </div>
            <div className="h-12 w-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <span className="text-green-600 text-xl">🌱</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Cost Advantage</p>
              <p className="text-2xl font-bold text-blue-600">+80%</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 text-xl">💰</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Comparison Chart */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Performance vs Commercial AC</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={benchmarkData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="name" 
                  stroke="#6b7280"
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  stroke="#6b7280"
                  tick={{ fill: '#6b7280' }}
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
                <Bar dataKey="capacitance" fill="#d97706" name="Capacitance (F/g)" />
                <Bar dataKey="conductivity" fill="#92400e" name="Conductivity (S/m)" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Hemp Graphene Batch Performance */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Hemp Graphene Batch Performance</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Batch</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Surface Area</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Capacitance</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">ESR</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Grade</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {hempGrapheneData.map((batch) => (
                    <tr key={batch.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750">
                      <td className="py-3 px-4 font-medium text-gray-900 dark:text-gray-100">{batch.batchName}</td>
                      <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{batch.surfaceArea} m²/g</td>
                      <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{batch.capacitance} F/g</td>
                      <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{batch.esr} Ω</td>
                      <td className="py-3 px-4">
                        <span 
                          className="px-2 py-1 rounded text-xs font-bold"
                          style={{ 
                            backgroundColor: getGradeColor(batch.supercapGrade) + '20',
                            color: getGradeColor(batch.supercapGrade)
                          }}
                        >
                          {batch.supercapGrade}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: getStatusColor(batch.status) }}
                        >




                        </div>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
         </div>
       </div>

       {/* Thresholds & Settings */}
       <div className="space-y-6">
         {/* Threshold Controls */}
         <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
           <div className="flex items-center justify-between mb-4">
             <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Quality Thresholds</h3>
             <button 
               onClick={() => setThresholdMode(thresholdMode === 'view' ? 'edit' : 'view')}
               className="text-amber-600 hover:text-amber-500 text-sm font-medium"
             >
               {thresholdMode === 'view' ? 'Edit' : 'Save'}
             </button>
           </div>
           
           <div className="space-y-4">
             <ThresholdCard 
               metric="surfaceArea"
               label="Surface Area"
               unit="m²/g"
               current={Math.max(...hempGrapheneData.map(b => b.surfaceArea)).toFixed(1)}
               thresholds={thresholds.surfaceArea}
             />
             
             <ThresholdCard 
               metric="capacitance"
               label="Capacitance"
               unit="F/g"
               current={Math.max(...hempGrapheneData.map(b => b.capacitance)).toFixed(1)}
               thresholds={thresholds.capacitance}
             />
             
             <ThresholdCard 
               metric="conductivity"
               label="Conductivity"
               unit="S/m"
               current={Math.max(...hempGrapheneData.map(b => b.conductivity)).toFixed(1)}
               thresholds={thresholds.conductivity}
             />
           </div>
         </div>

         {/* Market Position */}
         <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
           <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Market Position</h3>
           <div className="space-y-4">
             <div className="flex justify-between items-center">
               <span className="text-gray-700 dark:text-gray-300">Performance vs YP-50F</span>
               <span className="text-green-600 font-bold">+140% capacitance</span>
             </div>
             <div className="flex justify-between items-center">
               <span className="text-gray-700 dark:text-gray-300">Sustainability advantage</span>
               <span className="text-green-600 font-bold">+217% greener</span>
             </div>
             <div className="flex justify-between items-center">
               <span className="text-gray-700 dark:text-gray-300">Cost competitiveness</span>
               <span className="text-yellow-600 font-bold">+80% premium</span>
             </div>
             <div className="flex justify-between items-center">
               <span className="text-gray-700 dark:text-gray-300">Cycle life</span>
               <span className="text-green-600 font-bold">12,000+ cycles</span>
             </div>
           </div>
         </div>

         {/* Application Readiness */}
         <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
           <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Application Readiness</h3>
           <div className="space-y-3">
             <div className="flex items-center justify-between">
               <span className="text-sm text-gray-700 dark:text-gray-300">Consumer Electronics</span>
               <div className="flex items-center space-x-2">
                 <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                   <div className="bg-green-500 h-2 rounded-full" style={{width: '90%'}}></div>
                 </div>
                 <span className="text-green-600 text-xs">90%</span>
               </div>
             </div>
             
             <div className="flex items-center justify-between">
               <span className="text-sm text-gray-700 dark:text-gray-300">Electric Vehicles</span>
               <div className="flex items-center space-x-2">
                 <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                   <div className="bg-lime-500 h-2 rounded-full" style={{width: '85%'}}></div>
                 </div>
                 <span className="text-lime-600 text-xs">85%</span>
               </div>
             </div>
             
             <div className="flex items-center justify-between">
               <span className="text-sm text-gray-700 dark:text-gray-300">Grid Storage</span>
               <div className="flex items-center space-x-2">
                 <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                   <div className="bg-yellow-500 h-2 rounded-full" style={{width: '75%'}}></div>
                 </div>
                 <span className="text-yellow-600 text-xs">75%</span>
               </div>
             </div>
             
             <div className="flex items-center justify-between">
               <span className="text-sm text-gray-700 dark:text-gray-300">Industrial UPS</span>
               <div className="flex items-center space-x-2">
                 <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                   <div className="bg-green-500 h-2 rounded-full" style={{width: '95%'}}></div>
                 </div>
                 <span className="text-green-600 text-xs">95%</span>
               </div>
             </div>
           </div>
         </div>

         {/* Next Steps */}
         <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
           <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Optimization Targets</h3>
           <div className="space-y-3 text-sm">
             <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded">
               <div className="font-medium text-amber-800 dark:text-amber-400 mb-1">Priority: Capacitance</div>
               <div className="text-amber-700 dark:text-amber-300">Target: &gt;350 F/g for premium market</div>
             </div>
             
             <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded">
               <div className="font-medium text-blue-800 dark:text-blue-400 mb-1">Focus: ESR Reduction</div>
               <div className="text-blue-700 dark:text-blue-300">Target: &lt;0.5 Ω for high-power apps</div>
             </div>
             
             <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded">
               <div className="font-medium text-green-800 dark:text-green-400 mb-1">Opportunity: Scale</div>
               <div className="text-green-700 dark:text-green-300">Maintain quality at 10x production</div>
             </div>
           </div>
         </div>
       </div>
     </div>

     {/* Process Optimization Recommendations */}
     <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
       <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Process Optimization Recommendations</h3>
       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
           <h4 className="font-medium text-amber-600 mb-2">🔥 Temperature Tuning</h4>
           <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">Current best: 900°C activation</p>
           <p className="text-gray-600 dark:text-gray-400 text-xs">Try 925°C with extended hold time for higher surface area</p>
         </div>
         
         <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
           <h4 className="font-medium text-green-600 mb-2">⚗️ KOH Optimization</h4>
           <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">Current best: 5.0 ratio</p>
           <p className="text-gray-600 dark:text-gray-400 text-xs">Test 6.0 ratio with gradual heating for micropore development</p>
         </div>
         
         <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
           <h4 className="font-medium text-blue-600 mb-2">🌿 Fiber Selection</h4>
           <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">Current best: Bast fiber</p>
           <p className="text-gray-600 dark:text-gray-400 text-xs">Compare with hurds and different hemp varieties</p>
         </div>
       </div>
     </div>
   </div>
 );
}
