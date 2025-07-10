import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { format } from 'date-fns'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

interface BETTrendData {
  date: string
  batch: string
  bet: number
  isOvenC: boolean
}

interface BETTrendChartProps {
  data: BETTrendData[]
}

export function BETTrendChart({ data }: BETTrendChartProps) {
  const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  
  const chartData = {
    labels: sortedData.map(d => format(new Date(d.date), 'MMM dd')),
    datasets: [
      {
        label: 'BET Surface Area',
        data: sortedData.map(d => d.bet),
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.3,
        pointBackgroundColor: sortedData.map(d => d.isOvenC ? '#2563eb' : '#9ca3af'),
        pointBorderColor: sortedData.map(d => d.isOvenC ? '#1d4ed8' : '#6b7280'),
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
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#374151',
        borderWidth: 1,
        callbacks: {
          label: function(context: any) {
            const dataPoint = sortedData[context.dataIndex]
            return [
              `${dataPoint.batch}: ${context.parsed.y.toLocaleString()} m²/g`,
              dataPoint.isOvenC ? 'Oven C Era' : 'Pre-Oven C'
            ]
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 12,
          }
        }
      },
      y: {
        beginAtZero: false,
        grid: {
          color: '#f3f4f6',
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 12,
          },
          callback: function(value: any) {
            return `${value.toLocaleString()} m²/g`
          }
        }
      },
    },
  }

  return (
    <div className="h-80">
      <Line data={chartData} options={options} />
    </div>
  )
}
