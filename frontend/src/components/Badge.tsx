interface BadgeProps {
  children: React.ReactNode
  variant?: 'green' | 'blue' | 'yellow' | 'red' | 'gray'
  size?: 'sm' | 'md'
  className?: string
}

export function Badge({ children, variant = 'gray', size = 'md', className = '' }: BadgeProps) {
  const variants = {
    green: 'badge-green',
    blue: 'badge-blue',
    yellow: 'badge-yellow',
    red: 'badge-red',
    gray: 'badge-gray'
  }

  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1'
  }

  return (
    <span className={`badge ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  )
}
