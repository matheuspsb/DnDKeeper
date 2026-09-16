import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { formatDate, formatRelativeTime, formatTimestamp } from './time'

describe('formatRelativeTime', () => {
  it('"agora" para menos de 5s', () => {
    expect(formatRelativeTime(0)).toBe('agora')
    expect(formatRelativeTime(4499)).toBe('agora')
  })

  it('segundos entre 5s e 59s', () => {
    expect(formatRelativeTime(5000)).toBe('há 5s')
    expect(formatRelativeTime(59000)).toBe('há 59s')
  })

  it('minutos a partir de 60s', () => {
    expect(formatRelativeTime(60000)).toBe('há 1 min')
    expect(formatRelativeTime(150000)).toBe('há 3 min')
  })

  it('nunca fica negativo mesmo com delta negativo', () => {
    expect(formatRelativeTime(-500)).toBe('agora')
  })
})

describe('formatDate', () => {
  it('formata sem pontuação e em minúsculas', () => {
    const result = formatDate('2026-03-12T12:00:00.000Z')
    expect(result).not.toMatch(/\./)
    expect(result).toBe(result.toLowerCase())
    expect(result).toContain('2026')
  })

  it('devolve string vazia para data inválida', () => {
    expect(formatDate('not-a-date')).toBe('')
    expect(formatDate('')).toBe('')
  })
})

describe('formatTimestamp', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-03-12T15:30:00'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('mostra só a hora quando é hoje', () => {
    const today = new Date('2026-03-12T09:15:00')
    expect(formatTimestamp(today.getTime())).toMatch(/^\d{2}:\d{2}$/)
  })

  it('mostra dia/mês + hora quando não é hoje', () => {
    const yesterday = new Date('2026-03-11T09:15:00')
    expect(formatTimestamp(yesterday.getTime())).toMatch(/^\d{2}\/\d{2},? \d{2}:\d{2}$/)
  })

  it('devolve string vazia para timestamp inválido', () => {
    expect(formatTimestamp(NaN)).toBe('')
  })
})
