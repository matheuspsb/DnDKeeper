import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useCombatantImagePicker } from './useCombatantImagePicker'

describe('useCombatantImagePicker', () => {
  it('começa fechado, sem valor', () => {
    const { result } = renderHook(() => useCombatantImagePicker(vi.fn()))
    expect(result.current.isOpen).toBe(false)
    expect(result.current.value).toBe('')
  })

  it('open abre o input limpando o valor anterior', () => {
    const { result } = renderHook(() => useCombatantImagePicker(vi.fn()))
    act(() => result.current.setValue('lixo'))
    act(() => result.current.open())
    expect(result.current.isOpen).toBe(true)
    expect(result.current.value).toBe('')
  })

  it('confirm chama onSetImageUrl com a URL resolvida e fecha o input', () => {
    const onSetImageUrl = vi.fn()
    const { result } = renderHook(() => useCombatantImagePicker(onSetImageUrl))
    act(() => result.current.open())
    act(() => result.current.setValue('  https://exemplo.com/foo.png  '))

    act(() => result.current.confirm())

    expect(onSetImageUrl).toHaveBeenCalledWith('https://exemplo.com/foo.png')
    expect(result.current.isOpen).toBe(false)
  })

  it('confirm resolve link do Google Drive pro formato de thumbnail', () => {
    const onSetImageUrl = vi.fn()
    const { result } = renderHook(() => useCombatantImagePicker(onSetImageUrl))
    act(() => result.current.open())
    act(() => result.current.setValue('https://drive.google.com/file/d/abc123/view'))

    act(() => result.current.confirm())

    expect(onSetImageUrl).toHaveBeenCalledWith('/drive-img?id=abc123&sz=w800')
  })

  it('confirm com valor vazio (ou só espaços) não chama onSetImageUrl, mas fecha o input', () => {
    const onSetImageUrl = vi.fn()
    const { result } = renderHook(() => useCombatantImagePicker(onSetImageUrl))
    act(() => result.current.open())
    act(() => result.current.setValue('   '))

    act(() => result.current.confirm())

    expect(onSetImageUrl).not.toHaveBeenCalled()
    expect(result.current.isOpen).toBe(false)
  })

  it('close fecha sem chamar onSetImageUrl', () => {
    const onSetImageUrl = vi.fn()
    const { result } = renderHook(() => useCombatantImagePicker(onSetImageUrl))
    act(() => result.current.open())
    act(() => result.current.setValue('https://exemplo.com/foo.png'))

    act(() => result.current.close())

    expect(onSetImageUrl).not.toHaveBeenCalled()
    expect(result.current.isOpen).toBe(false)
  })
})
