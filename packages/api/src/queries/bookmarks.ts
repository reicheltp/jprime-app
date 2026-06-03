import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { UseQueryResult, UseMutationResult } from '@tanstack/react-query'
import AsyncStorage from '@react-native-async-storage/async-storage'

const STORAGE_KEY = '@jprime/bookmarks'
const QUERY_KEY = ['bookmarks'] as const

const BookmarkStore = {
  async load(): Promise<Set<string>> {
    const raw = await AsyncStorage.getItem(STORAGE_KEY)
    if (!raw) return new Set()
    const ids = JSON.parse(raw) as string[]
    return new Set(ids)
  },

  async toggle(sessionId: string): Promise<void> {
    const current = await BookmarkStore.load()
    if (current.has(sessionId)) {
      current.delete(sessionId)
    } else {
      current.add(sessionId)
    }
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([...current]))
  },
}

export function useBookmarks(): UseQueryResult<Set<string>> {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: BookmarkStore.load,
    staleTime: Infinity,
  })
}

export function useToggleBookmark(): UseMutationResult<void, Error, string> {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: BookmarkStore.toggle,

    onMutate: async (sessionId: string) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEY })
      const previous = queryClient.getQueryData<Set<string>>(QUERY_KEY)
      queryClient.setQueryData<Set<string>>(QUERY_KEY, (old) => {
        const next = new Set(old ?? [])
        if (next.has(sessionId)) {
          next.delete(sessionId)
        } else {
          next.add(sessionId)
        }
        return next
      })
      return { previous }
    },

    onError: (_err, _id, context) => {
      const ctx = context as { previous?: Set<string> } | undefined
      if (ctx?.previous !== undefined) {
        queryClient.setQueryData(QUERY_KEY, ctx.previous)
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
    },
  })
}
