import { describe, expect, it } from 'vitest'
import { DRIVE_FULL_SIZE, DRIVE_THUMB_SIZE, driveIdFromUrl, driveImageUrl, resolveDriveUrl } from './driveUrl'

describe('driveIdFromUrl', () => {
  it('extrai o ID de uma URL de compartilhamento completa', () => {
    expect(driveIdFromUrl('https://drive.google.com/file/d/ABC123/view?usp=sharing')).toBe(
      'ABC123',
    )
  })

  it('extrai o ID de um caminho curto /d/{id}', () => {
    expect(driveIdFromUrl('/d/XYZ-789_abc')).toBe('XYZ-789_abc')
  })

  it('devolve null para uma URL que não é do Drive', () => {
    expect(driveIdFromUrl('https://example.com/image.png')).toBeNull()
  })

  it('devolve null para string vazia', () => {
    expect(driveIdFromUrl('')).toBeNull()
  })
})

describe('driveImageUrl', () => {
  it('monta a URL do proxy com o tamanho padrão', () => {
    expect(driveImageUrl('ABC123')).toBe(`/drive-img?id=ABC123&sz=${DRIVE_THUMB_SIZE}`)
  })

  it('aceita um tamanho customizado', () => {
    expect(driveImageUrl('ABC123', DRIVE_FULL_SIZE)).toBe('/drive-img?id=ABC123&sz=w2000')
  })
})

describe('resolveDriveUrl', () => {
  it('converte um link de compartilhamento do Drive pro proxy', () => {
    expect(resolveDriveUrl('https://drive.google.com/file/d/ABC123/view')).toBe(
      '/drive-img?id=ABC123&sz=w800',
    )
  })

  it('devolve a entrada inalterada quando não é um link do Drive', () => {
    expect(resolveDriveUrl('https://example.com/image.png')).toBe('https://example.com/image.png')
  })

  it('devolve a entrada inalterada para string vazia', () => {
    expect(resolveDriveUrl('')).toBe('')
  })

  it('já resolvido pro proxy (sem /d/) passa direto', () => {
    expect(resolveDriveUrl('/drive-img?id=ABC123&sz=w800')).toBe('/drive-img?id=ABC123&sz=w800')
  })
})
