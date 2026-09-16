import { Navigate, Route, Routes } from 'react-router-dom'
import type { ReactElement } from 'react'
import AuthGuard from './components/organisms/AuthGuard'
import AppLayout from './components/organisms/AppLayout'
import Login from './pages/Login'
import Table from './pages/Table'
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
      <Route path="/mesa" element={<Table />} />
      <Route element={<AuthGuard />}>
        <Route element={<AppLayout />}>
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
      </Route>
    </Routes>
  )
}

export default App
