import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../providers/AuthProvider'
import {
  getProfile,
  updateProfile,
  type ProfileUpdate,
} from '../lib/profileClient'

const PROFILE_KEY = 'profile'

export function useProfile() {
  const { session } = useAuth()
  return useQuery({
    queryKey: [PROFILE_KEY, session?.user.id],
    queryFn: () => getProfile(session!.token),
    enabled: !!session,
  })
}

export function useUpdateProfile() {
  const { session } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (update: ProfileUpdate) => {
      if (!session) throw new Error('Not authenticated')
      return updateProfile(session.token, update)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [PROFILE_KEY] })
    },
  })
}
