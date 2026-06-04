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
  saveSession,
} from '../lib/authClient'

interface AuthContextType {
  session: AuthSession | null
  user: AuthUser | null
  isLoading: boolean
  signIn: (session: AuthSession) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  isLoading: true,
  signIn: async () => {},
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

  const signIn = async (session: AuthSession) => {
    await saveSession(session)
    setSession(session)
  }

  const signOut = async () => {
    await clearSession()
    setSession(null)
  }

  return (
    <AuthContext.Provider
      value={{ session, user: session?.user ?? null, isLoading, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
