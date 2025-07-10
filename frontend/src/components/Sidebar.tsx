import { Box, VStack, Text, Button } from '@chakra-ui/react'
import { Link, useLocation } from 'react-router-dom'

export function Sidebar() {
  const location = useLocation()
  
  const isActive = (path: string) => location.pathname === path

  return (
    <Box
      position="fixed"
      left={0}
      top={0}
      w="250px"
      h="100vh"
      bg="gray.900"
      borderRight="1px solid"
      borderColor="gray.700"
      p={6}
    >
      <Text fontSize="xl" fontWeight="bold" mb={8} color="gray.50">
        HGraph2
      </Text>
      
      <VStack spacing={2} align="stretch">
        <Button
          as={Link}
          to="/"
          variant={isActive('/') ? 'solid' : 'ghost'}
          justifyContent="flex-start"
          size="sm"
        >
          📊 Dashboard
        </Button>
        
        <Button
          as={Link}
          to="/batches"
          variant={isActive('/batches') ? 'solid' : 'ghost'}
          justifyContent="flex-start"
          size="sm"
        >
          🧪 Batch Explorer
        </Button>
      </VStack>
      
      <Box position="absolute" bottom={6} left={6} right={6}>
        <Text fontSize="xs" color="gray.500">
          Hemp-derived graphene analysis
        </Text>
        <Text fontSize="xs" color="gray.600">
          v1.0.0
        </Text>
      </Box>
    </Box>
  )
}
