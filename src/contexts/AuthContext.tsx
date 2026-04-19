import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import backendApi from '../services/backendApi'

export interface JwtPayload {
  sub: string
  role: 'dm' | 'guest'
  guestName?: string
}

interface AuthContextValue {
  user: JwtPayload | null
  isLoading: boolean
  dmLogin: (username: string, password: string) => Promise<void>
  guestLogin: (name: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<JwtPayload | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    backendApi
      .get<JwtPayload>('/api/auth/me')
      .then(res => {
        const data = res.data
        if (data?.role === 'dm' || data?.role === 'guest') {
          setUser(data)
        } else {
          setUser(null)
        }
      })
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false))
  }, [])

  const dmLogin = useCallback(async (username: string, password: string) => {
    const res = await backendApi.post<JwtPayload>('/api/auth/dm/login', { username, password })
    setUser(res.data)
  }, [])

  const guestLogin = useCallback(async (name: string) => {
    const res = await backendApi.post<JwtPayload>('/api/auth/guest', { name })
    setUser(res.data)
  }, [])

  const logout = useCallback(async () => {
    await backendApi.post('/api/auth/logout')
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, isLoading, dmLogin, guestLogin, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider')
  return ctx
}
