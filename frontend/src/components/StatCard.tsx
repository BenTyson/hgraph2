interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  trend?: {
    direction: 'up' | 'down' | 'neutral'
    value: string
  }
  icon?: React.ReactNode
  className?: string
}

export function StatCard({ title, value, subtitle, trend, icon, className = '' }: StatCardProps) {
  const trendColors = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-gray-600'
  }

  return (
    <div className={`card ${className}`}>
      <div className="card-body">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="stat-label">{title}</p>
            <p className="stat-value mt-1">{value}</p>
            {subtitle && (
              <p className="stat-help mt-1">{subtitle}</p>
            )}
            {trend && (
              <div className={`flex items-center mt-2 text-sm ${trendColors[trend.direction]}`}>
                {trend.direction === 'up' && (
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                )}
                {trend.direction === 'down' && (
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
                <span>{trend.value}</span>
              </div>
            )}
          </div>
          {icon && (
            <div className="flex-shrink-0 ml-4">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                {icon}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
