import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from 'react'
import {
  type AuthSession,
  type AuthUser,
  clearSession,
  loadSession,
} from '../lib/authClient'

interface AuthContextType {
  session: AuthSession | null
  user: AuthUser | null
  isLoading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  isLoading: true,
  signOut: async () => {},
})

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<AuthSession | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadSession()
      .then(setSession)
      .finally(() => setIsLoading(false))
  }, [])

  const signOut = async () => {
    await clearSession()
    setSession(null)
  }

  return (
    <AuthContext.Provider
      value={{ session, user: session?.user ?? null, isLoading, signOut }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
