import { useQuery } from '@tanstack/react-query'
import type { UseQueryResult } from '@tanstack/react-query'
import type { Speaker } from '@jprime/types'
import { apiFetch } from '../clients/apiClient'

const STALE_TIME = 60_000

export function useSpeakers(): UseQueryResult<Speaker[]> {
  return useQuery({
    queryKey: ['speakers'],
    queryFn: () => apiFetch<Speaker[]>('/api/v1/speakers'),
    staleTime: STALE_TIME,
  })
}

export function useSpeaker(id: string): UseQueryResult<Speaker> {
  return useQuery({
    queryKey: ['speakers', id],
    queryFn: () => apiFetch<Speaker>(`/api/v1/speakers/${id}`),
    staleTime: STALE_TIME,
    enabled: id.length > 0,
  })
}
