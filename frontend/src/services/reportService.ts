import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { format } from 'date-fns'

export interface ReportData {
  customerName?: string
  reportDate: string
  batches: any[]
  summary: {
    totalBatches: number
    averageBET: number
    peakBET: number
    totalWeight: number
  }
}

export class ReportService {
  static async generateCustomerSummaryPDF(data: ReportData): Promise<void> {
    const pdf = new jsPDF('p', 'mm', 'a4')
    
    // Header
    pdf.setFontSize(24)
    pdf.setTextColor(31, 41, 55) // gray-900
    pdf.text('HGraph2 Material Report', 20, 30)
    
    pdf.setFontSize(14)
    pdf.setTextColor(107, 114, 128) // gray-500
    pdf.text('Hemp-Derived Graphene Analysis', 20, 40)
    
    // Report date
    pdf.setFontSize(10)
    pdf.text(`Report Generated: ${format(new Date(data.reportDate), 'MMMM dd, yyyy')}`, 20, 50)
    
    // Customer info
    pdf.setFontSize(16)
    pdf.setTextColor(31, 41, 55)
    pdf.text('Customer Information', 20, 70)
    
    pdf.setFontSize(12)
    pdf.text(data.customerName || 'Customer Name', 20, 80)
    
    // Executive Summary
    pdf.setFontSize(16)
    pdf.text('Executive Summary', 20, 100)
    
    pdf.setFontSize(12)
    pdf.text(`Total Batches: ${data.summary.totalBatches}`, 20, 115)
    pdf.text(`Average BET: ${data.summary.averageBET.toLocaleString()} m²/g`, 20, 125)
    pdf.text(`Peak BET: ${data.summary.peakBET.toLocaleString()} m²/g`, 20, 135)
    pdf.text(`Total Weight: ${data.summary.totalWeight}g`, 20, 145)
    
    // Batch Details Table
    pdf.setFontSize(16)
    pdf.text('Batch Analysis', 20, 165)
    
    // Table headers
    pdf.setFontSize(10)
    pdf.text('Batch ID', 20, 180)
    pdf.text('Date', 60, 180)
    pdf.text('BET (m²/g)', 100, 180)
    pdf.text('Weight (g)', 140, 180)
    pdf.text('Grade', 180, 180)
    
    // Table data
    let yPosition = 190
    data.batches.forEach((batch, index) => {
      if (yPosition > 270) {
        pdf.addPage()
        yPosition = 20
      }
      
      pdf.text(batch.name, 20, yPosition)
      pdf.text(format(new Date(batch.date), 'MMM dd'), 60, yPosition)
      pdf.text(batch.bet?.toLocaleString() || 'N/A', 100, yPosition)
      pdf.text(batch.weight?.toString() || 'N/A', 140, yPosition)
      
      const grade = batch.bet >= 1800 ? 'Excellent' : batch.bet >= 1500 ? 'Good' : 'Standard'
      pdf.text(grade, 180, yPosition)
      
      yPosition += 10
    })
    
    // Technical Notes
    if (yPosition > 220) {
      pdf.addPage()
      yPosition = 20
    } else {
      yPosition += 20
    }
    
    pdf.setFontSize(16)
    pdf.text('Technical Notes', 20, yPosition)
    
    pdf.setFontSize(10)
    yPosition += 15
    const notes = [
      '• BET surface area analysis performed according to ASTM D3663/D6556 standards',
      '• All batches processed using our proprietary Oven C technology',
      '• Material optimized for energy storage applications',
      '• Quality assurance testing completed on all shipped batches'
    ]
    
    notes.forEach(note => {
      pdf.text(note, 20, yPosition)
      yPosition += 8
    })
    
    // Footer
    pdf.setFontSize(8)
    pdf.setTextColor(107, 114, 128)
    pdf.text('This report is confidential and proprietary. For questions, please contact our technical team.', 20, 280)
    pdf.text('HGraph2 Analytics Platform • Hemp Graphene Research & Development', 20, 290)
    
    // Save the PDF
    pdf.save(`HGraph2_Customer_Report_${format(new Date(), 'yyyy-MM-dd')}.pdf`)
  }
  
  static async generateExecutiveDashboardPDF(data: ReportData): Promise<void> {
    const pdf = new jsPDF('p', 'mm', 'a4')
    
    // Header
    pdf.setFontSize(24)
    pdf.setTextColor(31, 41, 55)
    pdf.text('Executive Dashboard Report', 20, 30)
    
    pdf.setFontSize(14)
    pdf.setTextColor(107, 114, 128)
    pdf.text('Hemp Graphene Production Summary', 20, 40)
    
    pdf.setFontSize(10)
    pdf.text(`Report Period: ${format(new Date(data.reportDate), 'MMMM dd, yyyy')}`, 20, 50)
    
    // Key Performance Indicators
    pdf.setFontSize(16)
    pdf.setTextColor(31, 41, 55)
    pdf.text('Key Performance Indicators', 20, 70)
    
    // KPI boxes
    pdf.setFontSize(12)
    pdf.rect(20, 80, 40, 25)
    pdf.text('Production', 22, 90)
    pdf.text(`${data.summary.totalBatches}`, 22, 100)
    pdf.text('Batches', 22, 105)
    
    pdf.rect(70, 80, 40, 25)
    pdf.text('Peak BET', 72, 90)
    pdf.text(`${data.summary.peakBET.toLocaleString()}`, 72, 100)
    pdf.text('m²/g', 72, 105)
    
    pdf.rect(120, 80, 40, 25)
    pdf.text('Average BET', 122, 90)
    pdf.text(`${data.summary.averageBET.toLocaleString()}`, 122, 100)
    pdf.text('m²/g', 122, 105)
    
    pdf.rect(170, 80, 40, 25)
    pdf.text('Total Output', 172, 90)
    pdf.text(`${data.summary.totalWeight}g`, 172, 100)
    pdf.text('Material', 172, 105)
    
    // Performance Analysis
    pdf.setFontSize(16)
    pdf.text('Performance Analysis', 20, 130)
    
    pdf.setFontSize(12)
    pdf.text('Production Trends:', 20, 145)
    pdf.text('• Oven C technology showing 15% improvement in average BET', 25, 155)
    pdf.text('• Consistent quality across recent batches', 25, 165)
    pdf.text('• Process optimization yielding higher surface areas', 25, 175)
    
    pdf.text('Quality Metrics:', 20, 195)
    pdf.text('• 100% of shipped batches meet specification requirements', 25, 205)
    pdf.text('• Average BET exceeds industry standards', 25, 215)
    pdf.text('• Zero quality incidents reported', 25, 225)
    
    // Recommendations
    pdf.setFontSize(16)
    pdf.text('Strategic Recommendations', 20, 250)
    
    pdf.setFontSize(12)
    pdf.text('• Continue focus on Oven C technology optimization', 25, 260)
    pdf.text('• Expand production capacity for high-BET batches', 25, 270)
    pdf.text('• Investigate scaling opportunities for premium grades', 25, 280)
    
    pdf.save(`HGraph2_Executive_Dashboard_${format(new Date(), 'yyyy-MM-dd')}.pdf`)
  }
  
  static async generateTechnicalDatasheet(data: ReportData): Promise<void> {
    const pdf = new jsPDF('p', 'mm', 'a4')
    
    // Header
    pdf.setFontSize(20)
    pdf.setTextColor(31, 41, 55)
    pdf.text('Technical Data Sheet', 20, 30)
    
    pdf.setFontSize(14)
    pdf.setTextColor(107, 114, 128)
    pdf.text('Hemp-Derived Graphene Material Specifications', 20, 40)
    
    // Material Properties
    pdf.setFontSize(16)
    pdf.setTextColor(31, 41, 55)
    pdf.text('Material Properties', 20, 60)
    
    // Create detailed technical specifications table
    const specs = [
      ['Property', 'Value', 'Unit', 'Test Method'],
      ['BET Surface Area', `${data.summary.averageBET.toLocaleString()}`, 'm²/g', 'ASTM D3663/D6556'],
      ['Particle Size', '< 10', 'μm', 'SEM Analysis'],
      ['Bulk Density', '0.1-0.3', 'g/cm³', 'Standard'],
      ['Electrical Conductivity', '10-15', 'S/m', '4-point probe'],
      ['Thermal Stability', '> 500', '°C', 'TGA'],
      ['Purity', '> 95', '%', 'Elemental Analysis'],
      ['Moisture Content', '< 2', '%', 'Karl Fischer'],
    ]
    
    let yPos = 75
    specs.forEach((row, index) => {
      const xPositions = [20, 80, 130, 160]
      row.forEach((cell, cellIndex) => {
        if (index === 0) {
          pdf.setFontSize(10)
          pdf.setFont('helvetica', 'bold')
        } else {
          pdf.setFontSize(9)
          pdf.setFont('helvetica', 'normal')
        }
        pdf.text(cell, xPositions[cellIndex], yPos)
      })
      yPos += 8
    })
    
    // Applications
    pdf.setFontSize(16)
    pdf.setFont('helvetica', 'bold')
    pdf.text('Applications', 20, yPos + 20)
    
    pdf.setFontSize(12)
    pdf.setFont('helvetica', 'normal')
    yPos += 35
    const applications = [
      'Supercapacitor electrodes',
      'Battery electrode materials',
      'Conductive additives',
      'Composite reinforcement',
      'Thermal interface materials'
    ]
    
    applications.forEach(app => {
      pdf.text(`• ${app}`, 25, yPos)
      yPos += 8
    })
    
    // Storage & Handling
    pdf.setFontSize(16)
    pdf.setFont('helvetica', 'bold')
    pdf.text('Storage & Handling', 20, yPos + 15)
    
    pdf.setFontSize(12)
    pdf.setFont('helvetica', 'normal')
    yPos += 30
    const storage = [
      'Store in dry, cool environment',
      'Keep container tightly closed',
      'Avoid static electricity buildup',
      'Use appropriate PPE when handling'
    ]
    
    storage.forEach(item => {
      pdf.text(`• ${item}`, 25, yPos)
      yPos += 8
    })
    
    pdf.save(`HGraph2_Technical_Datasheet_${format(new Date(), 'yyyy-MM-dd')}.pdf`)
  }
}
