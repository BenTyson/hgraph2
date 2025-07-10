// frontend/src/App.tsx - Updated with new routes
import { Routes, Route } from 'react-router-dom'
import { Sidebar } from './components/Sidebar'
import { Dashboard } from './pages/Dashboard'
import { BatchExplorer } from './pages/BatchExplorer'
import { BatchDetail } from './pages/BatchDetail'
import { AnalysisResults } from './pages/AnalysisResults'
import { QualityControl } from './pages/QualityControl'
import { Reports } from './pages/Reports'
import { DataImport } from './pages/DataImport'
import { UserManagement } from './pages/UserManagement'
// NEW IMPORTS
import { BETAnalysis } from './pages/BETAnalysis'
import { SupercapacitorApplication } from './pages/SupercapacitorApplication'

function App() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar />
      <main className="ml-64 p-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/batches" element={<BatchExplorer />} />
          <Route path="/batch/:batchId" element={<BatchDetail />} />
          <Route path="/analysis" element={<AnalysisResults />} />
          <Route path="/quality" element={<QualityControl />} />
          <Route path="/import" element={<DataImport />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/users" element={<UserManagement />} />
          {/* NEW ROUTES */}
          <Route path="/bet-analysis" element={<BETAnalysis />} />
          <Route path="/supercapacitor" element={<SupercapacitorApplication />} />
        </Routes>
      </main>
    </div>
  )
}

export default App