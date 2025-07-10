import { useState } from 'react'
import { ArrowDownTrayIcon, DocumentTextIcon, TableCellsIcon } from '@heroicons/react/24/outline'
import { LoadingSpinner } from './LoadingSpinner'

interface ExportControlsProps {
  data: any[]
  filename?: string
  title?: string
}

export function ExportControls({ data, filename = 'hgraph2_export', title = 'Export Data' }: ExportControlsProps) {
  const [isExporting, setIsExporting] = useState(false)

  const exportToCSV = async () => {
    setIsExporting(true)
    
    try {
      // Convert data to CSV format
      if (data.length === 0) {
        alert('No data to export')
        return
      }

      const headers = Object.keys(data[0])
      const csvContent = [
        headers.join(','),
        ...data.map(row => 
          headers.map(header => {
            const value = row[header]
            // Handle values that might contain commas or quotes
            if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
              return `"${value.replace(/"/g, '""')}"`
            }
            return value || ''
          }).join(',')
        )
      ].join('\n')

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Export failed:', error)
      alert('Export failed. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  const exportToJSON = async () => {
    setIsExporting(true)
    
    try {
      const jsonContent = JSON.stringify(data, null, 2)
      const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.json`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Export failed:', error)
      alert('Export failed. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-500">{title}:</span>
      
      <button
        onClick={exportToCSV}
        disabled={isExporting || data.length === 0}
        className="btn btn-secondary px-3 py-1 text-xs flex items-center space-x-1"
      >
        {isExporting ? (
          <LoadingSpinner size="sm" />
        ) : (
          <TableCellsIcon className="h-3 w-3" />
        )}
        <span>CSV</span>
      </button>

      <button
        onClick={exportToJSON}
        disabled={isExporting || data.length === 0}
        className="btn btn-secondary px-3 py-1 text-xs flex items-center space-x-1"
      >
        {isExporting ? (
          <LoadingSpinner size="sm" />
        ) : (
          <DocumentTextIcon className="h-3 w-3" />
        )}
        <span>JSON</span>
      </button>

      <div className="text-xs text-gray-400">
        ({data.length} records)
      </div>
    </div>
  )
}
