import { Routes, Route } from 'react-router-dom'
import { Box, Flex } from '@chakra-ui/react'
import { Sidebar } from './components/Sidebar'
import { Dashboard } from './pages/Dashboard'
import { BatchExplorer } from './pages/BatchExplorer'

function App() {
  return (
    <Flex minH="100vh">
      <Sidebar />
      <Box flex="1" ml="250px" p={6}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/batches" element={<BatchExplorer />} />
        </Routes>
      </Box>
    </Flex>
  )
}

export default App
