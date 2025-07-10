import { Scatter } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend)

interface ProcessData {
  batch: string
  temperature: number
  bet: number
  kohRatio: number
  isOvenC: boolean
}

interface ProcessCorrelationChartProps {
  data: ProcessData[]
  xAxis: 'temperature' | 'kohRatio'
  title: string
}

export function ProcessCorrelationChart({ data, xAxis, title }: ProcessCorrelationChartProps) {
  const ovenCData = data.filter(d => d.isOvenC)
  const preOvenCData = data.filter(d => !d.isOvenC)
  
  const chartData = {
    datasets: [
      {
        label: 'Oven C Era',
        data: ovenCData.map(d => ({
          x: d[xAxis],
          y: d.bet,
          batch: d.batch,
        })),
        backgroundColor: 'rgba(37, 99, 235, 0.7)',
        borderColor: '#2563eb',
        pointRadius: 8,
        pointHoverRadius: 10,
      },
      {
        label: 'Pre-Oven C',
        data: preOvenCData.map(d => ({
          x: d[xAxis],
          y: d.bet,
          batch: d.batch,
        })),
        backgroundColor: 'rgba(156, 163, 175, 0.7)',
        borderColor: '#9ca3af',
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          color: '#374151',
          font: {
            size: 12,
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        callbacks: {
          label: function(context: any) {
            const point = context.raw
            return [
              `${point.batch}`,
              `${xAxis === 'temperature' ? 'Temperature' : 'KOH Ratio'}: ${point.x}${xAxis === 'temperature' ? '°C' : ''}`,
              `BET: ${point.y.toLocaleString()} m²/g`
            ]
          }
        }
      }
    },
    scales: {
      x: {
        type: 'linear' as const,
        position: 'bottom' as const,
        title: {
          display: true,
          text: xAxis === 'temperature' ? 'Temperature (°C)' : 'KOH Ratio',
          color: '#374151',
          font: {
            size: 14,
            weight: 'bold',
          }
        },
        grid: {
          color: '#f3f4f6',
        },
        ticks: {
          color: '#6b7280',
        }
      },
      y: {
        title: {
          display: true,
          text: 'BET Surface Area (m²/g)',
          color: '#374151',
          font: {
            size: 14,
            weight: 'bold',
          }
        },
        grid: {
          color: '#f3f4f6',
        },
        ticks: {
          color: '#6b7280',
        }
      },
    },
  }

  return (
    <div className="h-80">
      <Scatter data={chartData} options={options} />
    </div>
  )
}
