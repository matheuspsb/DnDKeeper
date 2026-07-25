import { useState } from 'react'
import logo from '../../assets/logo.png'
import ChevronRightIcon from '../atoms/icons/ChevronRightIcon'
import MenuIcon from '../atoms/icons/MenuIcon'
import XIcon from '../atoms/icons/XIcon'
import { NavItems } from './NavItems'

function Sidebar() {
  const [open, setOpen] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-4 right-4 z-40 flex h-9 w-9 items-center justify-center rounded-lg bg-black-400 border border-black-200 text-white-300 hover:text-white-100 transition-colors"
        aria-label="Abrir menu"
      >
        <MenuIcon size={16} />
      </button>

      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/60"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`md:hidden fixed inset-0 z-50 flex flex-col bg-black-400 transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-black-200 shrink-0">
          <div className="flex items-center gap-3">
            <img src={logo} alt="DnDKeeper logo" className="h-10 w-10 shrink-0" />
            <span className="text-white-100 text-base font-semibold tracking-wide">DnDKeeper</span>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white-300 hover:text-white-100 hover:bg-black-300 transition-colors"
            aria-label="Fechar menu"
          >
            <XIcon size={20} />
          </button>
        </div>
        <NavItems open onNavigate={() => setMobileOpen(false)} />
      </aside>

      <aside
        className={`
          hidden md:flex flex-col bg-black-400 border-r border-black-200 h-full
          relative transition-all duration-300 ease-in-out shrink-0
          ${open ? 'w-56' : 'w-16'}
        `}
      >
        <div className="flex items-center gap-3 px-3 py-4 overflow-hidden border-b border-black-200 shrink-0">
          <img src={logo} alt="DnDKeeper logo" className="h-10 w-10 shrink-0" />
          {open && (
            <span className="text-white-100 text-base font-semibold tracking-wide whitespace-nowrap">
              DnDKeeper
            </span>
          )}
        </div>

        <NavItems open={open} />

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
    </>
  )
}

export default Sidebar
