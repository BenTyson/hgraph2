import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000/api/v1'

export const api = axios.create({
  baseURL: API_BASE_URL,
})

export interface GrapheneBatch {
  id: string
  name: string
  date_created: string
  oven: string | null
  species: number | null
  temperature: number | null
  shipped_to: string | null
  shipped_date: string | null
  is_oven_c_era: boolean
  analysis_count: number
  best_bet: number | null
  best_conductivity: number | null
  appearance: string | null
  quality_notes: string | null
  koh_ratio: number | null
  time_hours: number | null
  grinding_method: string | null
  gas_type: string | null
  shipped_weight: number | null
  shipment_notes: string | null
}

export interface DashboardSummary {
  oven_c_performance: {
    total_batches: number
    best_bet: number | null
    best_batch: string | null
    avg_bet_recent: number | null
  }
  shipments: {
    total_shipped: number
    pending: number
    recent_shipments: Array<{
      batch: string
      customer: string
      weight: number
      date: string | null
    }>
  }
  insights: string[]
}

export interface BatchPerformance {
  name: string
  date: string
  oven: string
  species: number
  temperature: number
  koh_ratio: number
  is_oven_c_era: boolean
  shipped: boolean
  shipped_to: string | null
  bet: number | null
  conductivity: number | null
}

export interface AnalysisResult {
  id: string
  graphene_batch_id: string
  date_analyzed: string
  bet_surface_area: number | null
  bet_langmuir: number | null
  conductivity: number | null
  conductivity_unit: string
  capacitance: number | null
  pore_size: number | null
  analysis_method: string | null
  instrument: string | null
  analyst: string | null
  comments: string | null
  created_at: string
  energy_storage_grade: string | null
}

// API functions
export const dashboardApi = {
  getSummary: () => api.get<DashboardSummary>('/dashboard/summary'),
  getBatchPerformance: () => api.get<BatchPerformance[]>('/dashboard/batch-performance'),
}

export const batchApi = {
  getGrapheneBatches: (params?: {
    oven?: string
    species?: number
    shipped_only?: boolean
    oven_c_era?: boolean
  }) => api.get<GrapheneBatch[]>('/batches/graphene', { params }),
  
  getGrapheneBatch: (id: string) => api.get<GrapheneBatch>(`/batches/graphene/${id}`),
}

export const analysisApi = {
  getBatchAnalysis: (batchId: string) => api.get<AnalysisResult[]>(`/analysis/batch/${batchId}`),
  createAnalysis: (data: Partial<AnalysisResult>) => api.post<AnalysisResult>('/analysis', data),
}
