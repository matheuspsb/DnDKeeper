import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import logo from '../../assets/logo.png'
import ChevronRightIcon from '../atoms/icons/ChevronRightIcon'
import LogOutIcon from '../atoms/icons/LogOutIcon'
import SearchIcon from '../atoms/icons/SearchIcon'
import { ROUTES } from '../../constants/routes'
import { useAuth } from '../../contexts/AuthContext'

function Sidebar() {
  const [open, setOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <aside
      className={`
        relative flex flex-col bg-black-400 border-r border-black-200 h-full
        transition-all duration-300 ease-in-out shrink-0
        ${open ? 'w-56' : 'w-16'}
      `}
    >
      <div className="flex items-center gap-3 px-3 py-4 overflow-hidden border-b border-black-200">
        <img src={logo} alt="DnDKeeper logo" className="h-10 w-10 shrink-0" />
        {open && (
          <span className="text-white-100 text-base font-semibold tracking-wide whitespace-nowrap">
            DnDKeeper
          </span>
        )}
      </div>

      <nav className="flex flex-col gap-1 p-2 mt-2">
        <NavLink
          to="/search"
          title={!open ? 'Buscar' : undefined}
          className={({ isActive }) => `
            flex items-center gap-3 px-3 py-2.5 rounded-lg w-full
            transition-colors duration-150 overflow-hidden
            ${isActive
              ? 'bg-red-100/20 text-white'
              : 'text-white-300 hover:bg-black-300 hover:text-white-100'
            }
          `}
        >
          {({ isActive }) => (
            <>
              <span className="shrink-0"><SearchIcon size={18} /></span>
              {open && <span className="text-sm font-medium whitespace-nowrap">Buscar</span>}
              {isActive && <span className="ml-auto w-1 h-4 rounded-full bg-red-100 shrink-0" />}
            </>
          )}
        </NavLink>

        <div className="my-1 border-t border-black-200" />

        {ROUTES.filter((route) => !route.dmOnly || user?.role === 'dm').map((route) => (
          <NavLink
            key={route.id}
            to={route.path}
            title={!open ? route.label : undefined}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2.5 rounded-lg w-full
              transition-colors duration-150 overflow-hidden
              ${
                isActive
                  ? 'bg-red-100/20 text-white'
                  : 'text-white-300 hover:bg-black-300 hover:text-white-100'
              }
            `}
          >
            {({ isActive }) => (
              <>
                <span className="shrink-0">{route.icon}</span>
                {open && (
                  <span className="text-sm font-medium whitespace-nowrap">{route.label}</span>
                )}
                {isActive && <span className="ml-auto w-1 h-4 rounded-full bg-red-100 shrink-0" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto p-2 border-t border-black-200">
        <button
          onClick={handleLogout}
          title={!open ? 'Sair' : undefined}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-white-300 hover:bg-black-300 hover:text-red-100 transition-colors duration-150 overflow-hidden"
        >
          <LogOutIcon size={18} className="shrink-0" />
          {open && <span className="text-sm font-medium whitespace-nowrap">Sair</span>}
        </button>
      </div>

      <button
        onClick={() => setOpen(!open)}
        className="absolute -right-3 top-5 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-black-200 border border-black-100 text-white-300 hover:text-white-100 transition-colors"
        aria-label={open ? 'Fechar menu' : 'Abrir menu'}
      >
        <ChevronRightIcon
          size={12}
          strokeWidth={2.5}
          className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>
    </aside>
  )
}

export default Sidebar
