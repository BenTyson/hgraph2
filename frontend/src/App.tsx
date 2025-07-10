import { Routes, Route } from 'react-router-dom'
import { Sidebar } from './components/Sidebar'
import { Dashboard } from './pages/Dashboard'
import { BatchExplorer } from './pages/BatchExplorer'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main className="ml-64 p-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/batches" element={<BatchExplorer />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
