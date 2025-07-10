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
      w="260px"
      h="100vh"
      bg="white"
      borderRight="1px solid"
      borderColor="gray.200"
      p={6}
    >
      {/* Header */}
      <Box mb={10}>
        <Text fontSize="24px" fontWeight="700" color="gray.900" mb={1}>
          HGraph2
        </Text>
        <Text fontSize="13px" color="gray.500" fontWeight="400">
          Hemp Graphene Analytics
        </Text>
      </Box>
      
      {/* Navigation */}
      <VStack spacing={1} align="stretch">
        <Button
          as={Link}
          to="/"
          variant={isActive('/') ? 'solid' : 'ghost'}
          justifyContent="flex-start"
          size="md"
          h="40px"
          fontSize="14px"
          fontWeight="500"
          borderRadius="8px"
        >
          Dashboard
        </Button>
        
        <Button
          as={Link}
          to="/batches"
          variant={isActive('/batches') ? 'solid' : 'ghost'}
          justifyContent="flex-start"
          size="md"
          h="40px"
          fontSize="14px"
          fontWeight="500"
          borderRadius="8px"
        >
          Batch Explorer
        </Button>
      </VStack>
      
      {/* Footer */}
      <Box position="absolute" bottom={6} left={6} right={6}>
        <Text fontSize="11px" color="gray.400" textTransform="uppercase" letterSpacing="0.05em">
          Production Analytics
        </Text>
        <Text fontSize="11px" color="gray.400" mt={1}>
          Version 1.0.0
        </Text>
      </Box>
    </Box>
  )
}
