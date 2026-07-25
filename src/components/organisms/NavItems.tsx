import { NavLink, useNavigate } from 'react-router-dom'
import LogOutIcon from '../atoms/icons/LogOutIcon'
import SearchIcon from '../atoms/icons/SearchIcon'
import { ROUTES } from '../../constants/routes'
import { useAuth } from '../../contexts/AuthContext'

interface NavItemsProps {
  open: boolean
  onNavigate?: () => void
}

export function NavItems({ open, onNavigate }: NavItemsProps) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/login', { replace: true })
  }

  const linkClass = (isActive: boolean) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-lg w-full transition-colors duration-150 overflow-hidden ${
      isActive
        ? 'bg-red-100/20 text-white'
        : 'text-white-300 hover:bg-black-300 hover:text-white-100'
    }`

  return (
    <>
      <nav className="flex flex-col gap-1 p-2 mt-2 flex-1">
        <NavLink
          to="/search"
          title={!open ? 'Buscar' : undefined}
          onClick={onNavigate}
          className={({ isActive }) => linkClass(isActive)}
        >
          {({ isActive }) => (
            <>
              <span className="shrink-0">
                <SearchIcon size={18} />
              </span>
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
            onClick={onNavigate}
            className={({ isActive }) => linkClass(isActive)}
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

      <div className="p-2 border-t border-black-200">
        <button
          onClick={handleLogout}
          title={!open ? 'Sair' : undefined}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-white-300 hover:bg-black-300 hover:text-red-100 transition-colors duration-150 overflow-hidden"
        >
          <LogOutIcon size={18} className="shrink-0" />
          {open && <span className="text-sm font-medium whitespace-nowrap">Sair</span>}
        </button>
      </div>
    </>
  )
}
