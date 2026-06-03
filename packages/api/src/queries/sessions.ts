import { useQuery } from '@tanstack/react-query'
import type { UseQueryResult } from '@tanstack/react-query'
import type { Session } from '@jprime/types'
import { apiFetch } from '../clients/apiClient'

const STALE_TIME = 60_000

export function useSessions(): UseQueryResult<Session[]> {
  return useQuery({
    queryKey: ['sessions'],
    queryFn: () => apiFetch<Session[]>('/api/v1/sessions'),
    staleTime: STALE_TIME,
  })
}

export function useSession(id: string): UseQueryResult<Session> {
  return useQuery({
    queryKey: ['sessions', id],
    queryFn: () => apiFetch<Session>(`/api/v1/sessions/${id}`),
    staleTime: STALE_TIME,
    enabled: id.length > 0,
  })
}
