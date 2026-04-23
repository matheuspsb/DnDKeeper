import type { Faction, NpcStatus } from '../types/npc.types'
import type { RelationType } from '../types/npcRelation.types'
import zhentarimImg from '../assets/watermarks/zhentarim.webp'
import cultoImg from '../assets/watermarks/culto.png'
import irmandadeImg from '../assets/watermarks/irmandade.png'
import harperImg from '../assets/watermarks/harper.png'
import confrariImg from '../assets/watermarks/confraria.png'

export const FACTIONS: Faction[] = [
  'Zhentarim',
  'Culto do Dragão',
  'Irmandade Carmesim',
  'Harpers',
  'Confraria da Lâmina Velada',
  'Independente',
]

export const NPC_STATUS_LABEL: Record<NpcStatus, string> = {
  vivo: 'Vivo',
  morto: 'Morto',
  desaparecido: 'Desaparecido',
  desconhecido: 'Desconhecido',
}

export const NPC_STATUS_COLOR: Record<NpcStatus, string> = {
  vivo: '#4ade80',
  morto: '#ef4444',
  desaparecido: '#facc15',
  desconhecido: '#94a3b8',
}

export const FACTION_IMAGE: Partial<Record<Faction, string>> = {
  Zhentarim: zhentarimImg,
  'Culto do Dragão': cultoImg,
  'Irmandade Carmesim': irmandadeImg,
  Harpers: harperImg,
  'Confraria da Lâmina Velada': confrariImg,
}

export const FACTION_COLOR: Record<Faction, string> = {
  Zhentarim: '#eab308',
  'Culto do Dragão': '#7c3aed',
  'Irmandade Carmesim': '#D72334',
  Harpers: '#3b82f6',
  'Confraria da Lâmina Velada': '#64748b',
  Independente: '#6b7280',
}

export const RELATION_TYPE_LABEL: Record<RelationType, string> = {
  familiar: 'Familiar',
  aliado: 'Aliado',
  inimigo: 'Inimigo',
  neutro: 'Neutro',
  subordinado: 'Subordinado',
}

export const RELATION_TYPE_COLOR: Record<RelationType, string> = {
  familiar: '#f97316',
  aliado: '#22c55e',
  inimigo: '#ef4444',
  neutro: '#94a3b8',
  subordinado: '#a855f7',
}
