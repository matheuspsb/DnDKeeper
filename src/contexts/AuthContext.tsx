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
  guestLogin: (name: string) => void
  logout: () => Promise<void>
}

const GUEST_SESSION_KEY = 'dndkeeper_guest'

function loadGuest(): JwtPayload | null {
  try {
    const raw = sessionStorage.getItem(GUEST_SESSION_KEY)
    return raw ? (JSON.parse(raw) as JwtPayload) : null
  } catch {
    return null
  }
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<JwtPayload | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const guest = loadGuest()
    if (guest) {
      setUser(guest)
      setIsLoading(false)
      return
    }

    backendApi
      .get<JwtPayload>('/api/auth/me')
      .then((res) => {
        const data = res.data
        if (data?.role === 'dm' || data?.role === 'guest') setUser(data)
        else setUser(null)
      })
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false))
  }, [])

  const dmLogin = useCallback(async (username: string, password: string) => {
    const res = await backendApi.post<JwtPayload>('/api/auth/dm/login', { username, password })
    setUser(res.data)
  }, [])

  const guestLogin = useCallback((name: string) => {
    const guest: JwtPayload = { sub: name, role: 'guest', guestName: name }
    sessionStorage.setItem(GUEST_SESSION_KEY, JSON.stringify(guest))
    setUser(guest)
  }, [])

  const logout = useCallback(async () => {
    if (user?.role === 'guest') {
      sessionStorage.removeItem(GUEST_SESSION_KEY)
      setUser(null)
      return
    }
    await backendApi.post('/api/auth/logout')
    setUser(null)
  }, [user])

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
