export type RelationType = 'familiar' | 'aliado' | 'inimigo' | 'neutro' | 'subordinado'

export type NpcRelation = {
  id: string
  sourceId: string
  targetId: string
  type: RelationType
  label?: string
}
