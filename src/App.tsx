import { Navigate, Route, Routes } from 'react-router-dom'
import type { ReactElement } from 'react'
import AuthGuard from './components/organisms/AuthGuard'
import Login from './pages/Login'
import Search from './pages/Search'
import { ROUTES } from './constants/routes'
import { useAuth } from './contexts/AuthContext'

function DmOnly({ children }: { children: ReactElement }) {
  const { user } = useAuth()
  if (user?.role === 'guest') return <Navigate to="/artes" replace />
  return children
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<AuthGuard />}>
        <Route index element={<Navigate to="/artes" replace />} />
        <Route path="/search" element={<Search />} />
        {ROUTES.map((route) => (
          <Route
            key={route.id}
            path={route.path}
            element={route.dmOnly ? <DmOnly>{route.element}</DmOnly> : route.element}
          />
        ))}
      </Route>
    </Routes>
  )
}

export default App
