import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { dmLoginSchema, guestSchema } from '../schemas/auth'
import type { DmLoginInput, GuestInput } from '../schemas/auth'
import logo from '../assets/logo.png'
import Input from '../components/atoms/Input'

function Login() {
  const { user, isLoading, dmLogin, guestLogin } = useAuth()
  const navigate = useNavigate()

  const [dmError, setDmError] = useState<string | null>(null)
  const [guestError, setGuestError] = useState<string | null>(null)

  const dmForm = useForm<DmLoginInput>({
    resolver: zodResolver(dmLoginSchema),
    defaultValues: { username: '', password: '' },
  })

  const guestForm = useForm<GuestInput>({
    resolver: zodResolver(guestSchema),
    defaultValues: { name: '' },
  })

  if (isLoading) return null
  if (user) return <Navigate to="/sons" replace />

  async function handleDmLogin(data: DmLoginInput) {
    setDmError(null)
    try {
      await dmLogin(data.username, data.password)
      navigate('/sons', { replace: true })
    } catch {
      setDmError('Usuário ou senha inválidos')
    }
  }

  async function handleGuestLogin(data: GuestInput) {
    setGuestError(null)
    try {
      await guestLogin(data.name)
      navigate('/sons', { replace: true })
    } catch {
      setGuestError('Não foi possível entrar como convidado')
    }
  }

  return (
    <div className="min-h-screen bg-black-500 flex items-center justify-center p-4">
      <div className="w-full max-w-sm flex flex-col gap-6">
        <div className="flex flex-col items-center gap-3">
          <img src={logo} alt="DnDKeeper" className="h-16 w-16" />
          <h1 className="text-white-100 text-2xl font-bold tracking-wide">DnDKeeper</h1>
        </div>

        {/* DM Login */}
        <div className="bg-black-300 border border-black-100 rounded-xl p-6 flex flex-col gap-4">
          <p className="text-white-300 text-xs font-semibold uppercase tracking-wider">Mestre</p>

          <form onSubmit={dmForm.handleSubmit(handleDmLogin)} className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <Input
                {...dmForm.register('username')}
                placeholder="Usuário"
                autoComplete="username"
                className="w-full bg-black-400 rounded-lg px-4 py-2.5"
              />
              {dmForm.formState.errors.username && (
                <span className="text-red-100 text-xs">
                  {dmForm.formState.errors.username.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Input
                {...dmForm.register('password')}
                type="password"
                placeholder="Senha"
                autoComplete="current-password"
                className="w-full bg-black-400 rounded-lg px-4 py-2.5"
              />
              {dmForm.formState.errors.password && (
                <span className="text-red-100 text-xs">
                  {dmForm.formState.errors.password.message}
                </span>
              )}
            </div>

            {dmError && <p className="text-red-100 text-xs text-center">{dmError}</p>}

            <button
              type="submit"
              disabled={dmForm.formState.isSubmitting}
              className="w-full h-10 rounded-lg bg-linear-to-b from-btn-from to-btn-to border border-btn-border text-white-100 text-sm font-semibold transition-opacity disabled:opacity-50"
            >
              {dmForm.formState.isSubmitting ? 'Entrando…' : 'Entrar como Mestre'}
            </button>
          </form>
        </div>

        {/* Separador */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-black-100" />
          <span className="text-white-300/40 text-xs">ou</span>
          <div className="flex-1 h-px bg-black-100" />
        </div>

        {/* Guest Login */}
        <form onSubmit={guestForm.handleSubmit(handleGuestLogin)} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <Input
              {...guestForm.register('name')}
              placeholder="Seu nome"
              autoComplete="nickname"
              className="w-full bg-black-400 rounded-lg px-4 py-2.5"
            />
            {guestForm.formState.errors.name && (
              <span className="text-red-100 text-xs">
                {guestForm.formState.errors.name.message}
              </span>
            )}
          </div>

          {guestError && <p className="text-red-100 text-xs text-center">{guestError}</p>}

          <button
            type="submit"
            disabled={guestForm.formState.isSubmitting}
            className="w-full h-10 rounded-lg border border-btn-secondary-border text-btn-secondary-text text-sm font-semibold transition-opacity disabled:opacity-50 hover:bg-red-100/10"
          >
            {guestForm.formState.isSubmitting ? 'Entrando…' : 'Entrar como Convidado'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
