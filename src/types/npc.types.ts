export type NpcStatus = 'vivo' | 'morto' | 'desaparecido' | 'desconhecido'

export type Faction =
  | 'Zhentarim'
  | 'Culto do Dragão'
  | 'Irmandade Carmesim'
  | 'Harpers'
  | 'Confraria da Lâmina Velada'
  | 'Independente'

export type NpcImagePosition = 'top' | 'center' | 'bottom'

export type Npc = {
  id: string
  name: string
  faction: Faction
  status: NpcStatus
  description: string
  notes: string
  location?: string
  currentActivity?: string
  imageUrl?: string
  imagePosition?: NpcImagePosition
  createdAt: string
  updatedAt: string
}
