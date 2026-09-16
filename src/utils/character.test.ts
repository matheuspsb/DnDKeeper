import { describe, expect, it } from 'vitest'
import { hpPercent, resolveHpBarColor } from './character'

describe('hpPercent', () => {
  it('calcula o percentual arredondado', () => {
    expect(hpPercent(50, 100)).toBe(50)
    expect(hpPercent(33, 100)).toBe(33)
    expect(hpPercent(1, 3)).toBe(33)
  })

  it('devolve 0 quando maxHp é 0 ou negativo', () => {
    expect(hpPercent(10, 0)).toBe(0)
    expect(hpPercent(10, -5)).toBe(0)
  })

  it('limita a 100 quando currentHp excede maxHp', () => {
    expect(hpPercent(150, 100)).toBe(100)
  })

  it('limita a 0 quando currentHp é negativo', () => {
    expect(hpPercent(-10, 100)).toBe(0)
  })

  it('100/100 dá exatamente 100', () => {
    expect(hpPercent(100, 100)).toBe(100)
  })

  it('0/100 dá exatamente 0', () => {
    expect(hpPercent(0, 100)).toBe(0)
  })
})

describe('resolveHpBarColor', () => {
  it('verde acima de 75%', () => {
    expect(resolveHpBarColor(76)).toBe('#22c55e')
    expect(resolveHpBarColor(100)).toBe('#22c55e')
  })

  it('exatamente 75% já cai no âmbar (limite é > 75, não >=)', () => {
    expect(resolveHpBarColor(75)).toBe('#ECC83B')
  })

  it('âmbar entre 26% e 75%', () => {
    expect(resolveHpBarColor(26)).toBe('#ECC83B')
    expect(resolveHpBarColor(50)).toBe('#ECC83B')
  })

  it('exatamente 25% já cai no vermelho (limite é > 25, não >=)', () => {
    expect(resolveHpBarColor(25)).toBe('#D72334')
  })

  it('vermelho em 0% e valores negativos', () => {
    expect(resolveHpBarColor(0)).toBe('#D72334')
    expect(resolveHpBarColor(-10)).toBe('#D72334')
  })
})
