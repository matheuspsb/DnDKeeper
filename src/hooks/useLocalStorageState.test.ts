import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useLocalStorageState } from './useLocalStorageState'

const KEY = 'test:key'

beforeEach(() => {
  localStorage.clear()
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('useLocalStorageState', () => {
  it('usa o valor inicial quando não há nada salvo', () => {
    const { result } = renderHook(() => useLocalStorageState(KEY, 'default'))
    expect(result.current[0]).toBe('default')
  })

  it('carrega o valor já salvo no localStorage (JSON por padrão)', () => {
    localStorage.setItem(KEY, JSON.stringify(['a', 'b']))
    const { result } = renderHook(() => useLocalStorageState<string[]>(KEY, []))
    expect(result.current[0]).toEqual(['a', 'b'])
  })

  it('setValue com valor direto atualiza o estado e persiste', () => {
    const { result } = renderHook(() => useLocalStorageState<number>(KEY, 0))

    act(() => result.current[1](42))

    expect(result.current[0]).toBe(42)
    expect(localStorage.getItem(KEY)).toBe('42')
  })

  it('setValue com função updater recebe o valor anterior', () => {
    const { result } = renderHook(() => useLocalStorageState<number>(KEY, 10))

    act(() => result.current[1]((prev) => prev + 5))

    expect(result.current[0]).toBe(15)
    expect(JSON.parse(localStorage.getItem(KEY)!)).toBe(15)
  })

  it('persiste entre remounts (simulando reload de página)', () => {
    const { result, unmount } = renderHook(() => useLocalStorageState<string[]>(KEY, []))
    act(() => result.current[1](['x']))
    unmount()

    const { result: second } = renderHook(() => useLocalStorageState<string[]>(KEY, []))
    expect(second.current[0]).toEqual(['x'])
  })

  it('serialize/deserialize customizados (valor cru, não JSON)', () => {
    const { result } = renderHook(() =>
      useLocalStorageState<number | null>(KEY, null, {
        serialize: String,
        deserialize: Number,
      }),
    )

    act(() => result.current[1](3.5))

    expect(localStorage.getItem(KEY)).toBe('3.5')

    const { result: reloaded } = renderHook(() =>
      useLocalStorageState<number | null>(KEY, null, {
        serialize: String,
        deserialize: Number,
      }),
    )
    expect(reloaded.current[0]).toBe(3.5)
  })

  it('cai no valor inicial quando o conteúdo salvo está corrompido', () => {
    localStorage.setItem(KEY, '{not valid json')
    const { result } = renderHook(() => useLocalStorageState(KEY, 'fallback'))
    expect(result.current[0]).toBe('fallback')
  })

  it('não quebra quando localStorage.setItem lança (modo privado / cota)', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('QuotaExceededError')
    })

    const { result } = renderHook(() => useLocalStorageState<number>(KEY, 0))

    expect(() => act(() => result.current[1](99))).not.toThrow()
    // mesmo sem conseguir persistir, o estado em memória atualiza
    expect(result.current[0]).toBe(99)
  })

  it('chaves diferentes não interferem entre si', () => {
    const { result: a } = renderHook(() => useLocalStorageState('key:a', 'A'))
    const { result: b } = renderHook(() => useLocalStorageState('key:b', 'B'))

    act(() => a.current[1]('A2'))

    expect(a.current[0]).toBe('A2')
    expect(b.current[0]).toBe('B')
  })
})
