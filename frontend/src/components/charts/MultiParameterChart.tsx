import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Bar, Area } from 'recharts';

interface MultiParameterChartProps {
  batchData: any;
  selectedParameters: string[];
}

export function MultiParameterChart({ batchData, selectedParameters }: MultiParameterChartProps) {
  // Sample data for demonstration - replace with your real batch data
  const chartData = [
    {
      name: 'Test 1',
      surfaceArea: 1247.2,
      conductivity: 12.4,
      mesoporosity: 15.7,
      temperature: 850,
      kohRatio: 4.0
    },
    {
      name: 'Test 2', 
      surfaceArea: 1456.8,
      conductivity: 15.2,
      mesoporosity: 18.3,
      temperature: 900,
      kohRatio: 5.0
    },
    {
      name: 'Test 3',
      surfaceArea: 982.4,
      conductivity: 8.7,
      mesoporosity: 12.1,
      temperature: 800,
      kohRatio: 3.0
    }
  ];

  const getParameterColor = (param: string) => {
    const colors = {
      surfaceArea: '#cd4b35',    // copper-600
      conductivity: '#92400e',   // amber-800  
      mesoporosity: '#f59e0b',   // amber-500
      temperature: '#10b981',    // emerald-500
      kohRatio: '#3b82f6'        // blue-500
    };
    return colors[param as keyof typeof colors] || '#6b7280';
  };

  const getParameterUnit = (param: string) => {
    const units = {
      surfaceArea: 'm²/g',
      conductivity: 'S/m', 
      mesoporosity: '%',
      temperature: '°C',
      kohRatio: 'ratio'
    };
    return units[param as keyof typeof units] || '';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Multi-Parameter Analysis
        </h3>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Batch ID: {batchData?.id || 'HG001'}
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={500}>
        <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="name" 
            stroke="#6b7280"
            tick={{ fill: '#6b7280' }}
          />
          <YAxis 
            yAxisId="left"
            stroke="#6b7280"
            tick={{ fill: '#6b7280' }}
            label={{ value: 'Primary Metrics', angle: -90, position: 'insideLeft' }}
          />
          <YAxis 
            yAxisId="right" 
            orientation="right"
            stroke="#6b7280"
            tick={{ fill: '#6b7280' }}
            label={{ value: 'Secondary Metrics', angle: 90, position: 'insideRight' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(0, 0, 0, 0.9)', 
              border: 'none', 
              borderRadius: '8px',
              color: '#ffffff'
            }}
            formatter={(value, name) => [
              `${value} ${getParameterUnit(name as string)}`,
              name
            ]}
          />
          <Legend />
          
          {/* Primary metrics - left axis */}
          {selectedParameters.includes('surfaceArea') && (
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="surfaceArea" 
              stroke={getParameterColor('surfaceArea')}
              strokeWidth={3}
              dot={{ fill: getParameterColor('surfaceArea'), strokeWidth: 2, r: 6 }}
              name="Surface Area (m²/g)"
            />
          )}
          
          {selectedParameters.includes('conductivity') && (
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="conductivity" 
              stroke={getParameterColor('conductivity')}
              strokeWidth={3}
              dot={{ fill: getParameterColor('conductivity'), strokeWidth: 2, r: 6 }}
              name="Conductivity (S/m)"
            />
          )}
          
          {selectedParameters.includes('mesoporosity') && (
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="mesoporosity"
              stroke={getParameterColor('mesoporosity')}
              fill={getParameterColor('mesoporosity')}
              fillOpacity={0.3}
              name="Mesoporosity (%)"
            />
          )}
          
          {/* Secondary metrics - right axis */}
          {selectedParameters.includes('temperature') && (
            <Bar 
              yAxisId="right"
              dataKey="temperature" 
              fill={getParameterColor('temperature')}
              opacity={0.7}
              name="Temperature (°C)"
            />
          )}
          
          {selectedParameters.includes('kohRatio') && (
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="kohRatio" 
              stroke={getParameterColor('kohRatio')}
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: getParameterColor('kohRatio'), strokeWidth: 2, r: 4 }}
              name="KOH Ratio"
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
      
      {/* Parameter Controls */}
      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
          Visible Parameters
        </h4>
        <div className="flex flex-wrap gap-2">
          {['surfaceArea', 'conductivity', 'mesoporosity', 'temperature', 'kohRatio'].map((param) => (
            <span
              key={param}
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                selectedParameters.includes(param)
                  ? 'bg-copper-100 text-copper-800 dark:bg-copper-900 dark:text-copper-200'
                  : 'bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-300'
              }`}
              style={{
                backgroundColor: selectedParameters.includes(param) 
                  ? getParameterColor(param) + '20' 
                  : undefined,
                color: selectedParameters.includes(param) 
                  ? getParameterColor(param) 
                  : undefined
              }}
            >
              {param.charAt(0).toUpperCase() + param.slice(1).replace(/([A-Z])/g, ' $1')}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
