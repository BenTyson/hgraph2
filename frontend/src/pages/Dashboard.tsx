import { useQuery } from '@tanstack/react-query'
import {
  Box,
  Grid,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Text,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  VStack,
  HStack,
  Badge,
  Spinner,
  Alert,
  AlertIcon,
} from '@chakra-ui/react'
import { dashboardApi } from '../services/api'

export function Dashboard() {
  const { data: summary, isLoading, error } = useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: () => dashboardApi.getSummary().then(res => res.data),
  })

  if (isLoading) {
    return (
      <VStack spacing={4} align="center" justify="center" h="400px">
        <Spinner size="xl" color="gray.400" />
        <Text color="gray.400">Loading dashboard...</Text>
      </VStack>
    )
  }

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        Failed to load dashboard data
      </Alert>
    )
  }

  return (
    <VStack spacing={6} align="stretch">
      {/* Header */}
      <Box>
        <Heading size="lg" mb={2} color="gray.50">
          HGraph2 Material Status
        </Heading>
        <Text color="gray.400">
          Hemp-derived graphene production and analysis overview
        </Text>
      </Box>

      {/* Key Performance Cards */}
      <Grid templateColumns="repeat(auto-fit, minmax(280px, 1fr))" gap={6}>
        {/* Latest Oven C Performance */}
        <Card bg="gray.900" border="1px solid" borderColor="gray.700">
          <CardHeader pb={3}>
            <Heading size="md" color="gray.100">
              🔥 Latest Oven C Performance
            </Heading>
          </CardHeader>
          <CardBody pt={0}>
            <VStack align="stretch" spacing={3}>
              <Stat>
                <StatLabel color="gray.400">Best BET Surface Area</StatLabel>
                <StatNumber color="gray.50">
                  {summary?.oven_c_performance.best_bet?.toLocaleString() || 'N/A'} m²/g
                </StatNumber>
                <StatHelpText color="gray.500">
                  {summary?.oven_c_performance.best_batch || 'No data'}
                </StatHelpText>
              </Stat>
              
              <Stat>
                <StatLabel color="gray.400">Recent Average</StatLabel>
                <StatNumber color="gray.50">
                  {summary?.oven_c_performance.avg_bet_recent?.toLocaleString() || 'N/A'} m²/g
                </StatNumber>
                <StatHelpText color="green.400">
                  ↗️ +15% vs pre-Oven C
                </StatHelpText>
              </Stat>
            </VStack>
          </CardBody>
        </Card>

        {/* Shipment Tracker */}
        <Card bg="gray.900" border="1px solid" borderColor="gray.700">
          <CardHeader pb={3}>
            <Heading size="md" color="gray.100">
              📦 Shipment Tracker
            </Heading>
          </CardHeader>
          <CardBody pt={0}>
            <VStack align="stretch" spacing={3}>
              <HStack justify="space-between">
                <Text color="gray.400">Total Shipped:</Text>
                <Badge colorScheme="green" variant="subtle">
                  {summary?.shipments.total_shipped || 0} batches
                </Badge>
              </HStack>
              
              <HStack justify="space-between">
                <Text color="gray.400">Pending Shipment:</Text>
                <Badge colorScheme="orange" variant="subtle">
                  {summary?.shipments.pending || 0} batches
                </Badge>
              </HStack>

              {summary?.shipments.recent_shipments?.slice(0, 3).map((shipment, i) => (
                <Box key={i} p={2} bg="gray.800" borderRadius="md">
                  <HStack justify="space-between">
                    <Text fontSize="sm" color="gray.200">
                      {shipment.batch}
                    </Text>
                    <Text fontSize="sm" color="gray.400">
                      {shipment.weight}g → {shipment.customer}
                    </Text>
                  </HStack>
                </Box>
              ))}
            </VStack>
          </CardBody>
        </Card>

        {/* Key Insights */}
        <Card bg="gray.900" border="1px solid" borderColor="gray.700">
          <CardHeader pb={3}>
            <Heading size="md" color="gray.100">
              📈 Key Insights
            </Heading>
          </CardHeader>
          <CardBody pt={0}>
            <VStack align="stretch" spacing={2}>
              {summary?.insights?.map((insight, i) => (
                <Text key={i} fontSize="sm" color="gray.300">
                  • {insight}
                </Text>
              )) || [
                <Text key="1" fontSize="sm" color="gray.300">
                  • Oven C era shows significant improvement
                </Text>,
                <Text key="2" fontSize="sm" color="gray.300">
                  • Species 1 consistently outperforming Species 2
                </Text>,
                <Text key="3" fontSize="sm" color="gray.300">
                  • 800°C temperature range most effective
                </Text>
              ]}
            </VStack>
          </CardBody>
        </Card>
      </Grid>
    </VStack>
  )
}
