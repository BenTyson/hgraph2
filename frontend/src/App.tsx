import { Routes, Route } from 'react-router-dom'
import { Sidebar } from './components/Sidebar'
import { Dashboard } from './pages/Dashboard'
import { BatchExplorer } from './pages/BatchExplorer'
import { BatchDetail } from './pages/BatchDetail'
import { AnalysisResults } from './pages/AnalysisResults'
import { Reports } from './pages/Reports'
import { DataImport } from './pages/DataImport'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main className="ml-64 p-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/batches" element={<BatchExplorer />} />
          <Route path="/batch/:batchId" element={<BatchDetail />} />
          <Route path="/analysis" element={<AnalysisResults />} />
          <Route path="/import" element={<DataImport />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
