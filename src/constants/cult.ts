import { NpcStatus } from '@/types/npc.types'

export type ImagePosition = 'top' | 'center' | 'bottom'

export interface HierarchyNode {
  id: string
  label: string
  name?: string
  imageUrl?: string
  imagePosition?: ImagePosition
  status: NpcStatus
}

export interface HierarchyTree {
  root: { label: string; faction: string }
  children: HierarchyNode[]
}

export const CULT_TREE: HierarchyTree = {
  root: { label: 'Mestre', faction: '' },
  children: [
    { id: 'asa-1', label: '1ª Asa', status: 'desconhecido' },
    {
      id: 'asa-2',
      label: '2ª Asa',
      name: 'Condessa',
      imageUrl: '/drive-img?id=1t8cUgCcC_MCJwtbIqwhvua7UnokJkISK&sz=w800',
      imagePosition: 'top',
      status: 'vivo',
    },
    { id: 'asa-3', label: '3ª Asa', status: 'desconhecido' },
    { id: 'asa-4', label: '4ª Asa', status: 'desconhecido' },
    { id: 'asa-5', label: '5ª Asa', status: 'desconhecido' },
    {
      id: 'asa-6',
      label: '6ª Asa',
      name: 'Vortak',
      imageUrl: '/drive-img?id=18d47EVYaO2d8VHgw-N95iwfd5cLlpn2q&sz=w800',
      status: 'vivo',
    },
    { id: 'asa-7', label: '7ª Asa', status: 'desconhecido' },
    {
      id: 'asa-8',
      label: '8ª Asa',
      name: 'Odin',
      imageUrl: '/drive-img?id=1cRQNaHtK1GvJ9ujdgYMPRVD5ApUY1mC3&sz=w800',
      imagePosition: 'top',
      status: 'vivo',
    },
    {
      id: 'asa-9',
      label: '9ª Asa',
      name: 'Nhalzir',
      imageUrl: '/drive-img?id=1oUUwIJsQH2VzvZr1yomil_1455fMtt3Q&sz=w800',
      status: 'vivo',
    },
    { id: 'asa-10', label: '10ª Asa', status: 'desconhecido' },
    {
      id: 'asa-11',
      label: '11ª Asa',
      name: 'Diaba',
      imageUrl: '/drive-img?id=1uA3kr2lxTh1SRaIm6G4V6E94gjxL7FmM&sz=w800',
      status: 'vivo',
    },
    {
      id: 'asa-12',
      label: '12ª Asa',
      name: "Ki'Narage",
      imageUrl: '/drive-img?id=1IcyMRxsvafvyBD7loA_MNUemFRrKuNa4&sz=w800',
      status: 'morto',
    },
  ],
}
