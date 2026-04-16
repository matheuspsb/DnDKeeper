import { Navigate, Route, Routes } from 'react-router-dom'
import Sidebar from './components/organisms/Sidebar'
import { ROUTES } from './constants/routes'

function App() {
  return (
    <div className="min-h-screen bg-black-500 flex">
      <Sidebar />
      <main className="flex-1">
        <Routes>
          <Route index element={<Navigate to="/sons" replace />} />
          {ROUTES.map((route) => (
            <Route key={route.id} path={route.path} element={route.element} />
          ))}
        </Routes>
      </main>
    </div>
  )
}

export default App
