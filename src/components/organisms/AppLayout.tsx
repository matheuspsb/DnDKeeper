import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

function AppLayout() {
  return (
    <div className="h-screen bg-black-500 flex overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto flex flex-col">
        <Outlet />
      </main>
    </div>
  )
}

export default AppLayout
