import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Box,
  VStack,
  HStack,
  Heading,
  Input,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Text,
  Card,
  CardBody,
  Spinner,
  Alert,
  AlertIcon,
  Checkbox,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons'
import { batchApi } from '../services/api'
import { format } from 'date-fns'

export function BatchExplorer() {
  const [filters, setFilters] = useState({
    search: '',
    oven: '',
    species: '',
    oven_c_era: false,
    shipped_only: false,
  })

  const { data: batches, isLoading, error } = useQuery({
    queryKey: ['graphene-batches', filters],
    queryFn: () => batchApi.getGrapheneBatches({
      oven: filters.oven || undefined,
      species: filters.species ? parseInt(filters.species) : undefined,
      oven_c_era: filters.oven_c_era || undefined,
      shipped_only: filters.shipped_only || undefined,
    }).then(res => res.data),
  })

  // Filter batches by search term
  const filteredBatches = batches?.filter(batch =>
    batch.name.toLowerCase().includes(filters.search.toLowerCase())
  ) || []

  const getBETGrade = (bet: number | null) => {
    if (!bet) return { label: 'No Data', color: 'gray' }
    if (bet >= 2000) return { label: 'Excellent', color: 'green' }
    if (bet >= 1500) return { label: 'Good', color: 'blue' }
    if (bet >= 1000) return { label: 'Acceptable', color: 'yellow' }
    return { label: 'Poor', color: 'red' }
  }

  if (isLoading) {
    return (
      <VStack spacing={4} align="center" justify="center" h="400px">
        <Spinner size="xl" color="gray.400" />
        <Text color="gray.400">Loading batches...</Text>
      </VStack>
    )
  }

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        Failed to load batch data
      </Alert>
    )
  }

  return (
    <VStack spacing={6} align="stretch">
      <Box>
        <Heading size="lg" mb={2} color="gray.50">
          Batch Explorer
        </Heading>
        <Text color="gray.400">
          Search and analyze all graphene batches
        </Text>
      </Box>

      {/* Filters */}
      <Card bg="gray.900" border="1px solid" borderColor="gray.700">
        <CardBody>
          <VStack spacing={4}>
            <HStack spacing={4} w="full" flexWrap="wrap">
              <InputGroup maxW="300px">
                <InputLeftElement>
                  <SearchIcon color="gray.400" />
                </InputLeftElement>
                <Input
                  placeholder="Search batch name..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  bg="gray.800"
                  borderColor="gray.600"
                />
              </InputGroup>

              <Select
                placeholder="All Ovens"
                value={filters.oven}
                onChange={(e) => setFilters({ ...filters, oven: e.target.value })}
                maxW="150px"
                bg="gray.800"
                borderColor="gray.600"
              >
                <option value="C">Oven C</option>
                <option value="AV1">AV1</option>
                <option value="AV5">AV5</option>
              </Select>

              <Select
                placeholder="All Species"
                value={filters.species}
                onChange={(e) => setFilters({ ...filters, species: e.target.value })}
                maxW="150px"
                bg="gray.800"
                borderColor="gray.600"
              >
                <option value="1">Species 1</option>
                <option value="2">Species 2</option>
              </Select>
            </HStack>

            <HStack spacing={6}>
              <Checkbox
                isChecked={filters.oven_c_era}
                onChange={(e) => setFilters({ ...filters, oven_c_era: e.target.checked })}
                colorScheme="gray"
              >
                Oven C Era Only
              </Checkbox>

              <Checkbox
                isChecked={filters.shipped_only}
                onChange={(e) => setFilters({ ...filters, shipped_only: e.target.checked })}
                colorScheme="gray"
              >
                Shipped Only
              </Checkbox>
            </HStack>
          </VStack>
        </CardBody>
      </Card>

      {/* Results Table */}
      <Card bg="gray.900" border="1px solid" borderColor="gray.700">
        <CardBody p={0}>
          <Box overflowX="auto">
            <Table variant="simple" size="sm">
              <Thead bg="gray.800">
                <Tr>
                  <Th color="gray.300">Batch</Th>
                  <Th color="gray.300">Date</Th>
                  <Th color="gray.300">Oven</Th>
                  <Th color="gray.300">Species</Th>
                  <Th color="gray.300">BET (m²/g)</Th>
                  <Th color="gray.300">Status</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredBatches.map((batch) => {
                  const betGrade = getBETGrade(batch.best_bet)
                  return (
                    <Tr key={batch.id} _hover={{ bg: 'gray.800' }}>
                      <Td>
                        <VStack align="start" spacing={1}>
                          <Text fontWeight="medium" color="gray.100">
                            {batch.name}
                          </Text>
                          {batch.is_oven_c_era && (
                            <Badge size="sm" colorScheme="green" variant="subtle">
                              Oven C Era
                            </Badge>
                          )}
                        </VStack>
                      </Td>
                      <Td color="gray.300">
                        {format(new Date(batch.date_created), 'MMM dd, yyyy')}
                      </Td>
                      <Td color="gray.300">{batch.oven || 'N/A'}</Td>
                      <Td color="gray.300">
                        {batch.species ? `Species ${batch.species}` : 'N/A'}
                      </Td>
                      <Td>
                        <VStack align="start" spacing={1}>
                          <Text color="gray.100">
                            {batch.best_bet?.toLocaleString() || 'N/A'}
                          </Text>
                          <Badge size="sm" colorScheme={betGrade.color} variant="subtle">
                            {betGrade.label}
                          </Badge>
                        </VStack>
                      </Td>
                      <Td>
                        {batch.shipped_to ? (
                          <Badge colorScheme="green" variant="subtle">
                            ✈️ {batch.shipped_to}
                          </Badge>
                        ) : (
                          <Badge colorScheme="gray" variant="subtle">
                            In Lab
                          </Badge>
                        )}
                      </Td>
                    </Tr>
                  )
                })}
              </Tbody>
            </Table>
          </Box>
        </CardBody>
      </Card>

      <Text fontSize="sm" color="gray.500">
        Found {filteredBatches.length} batches
      </Text>
    </VStack>
  )
}
