import { NpcStatus } from '@/types/npc.types'

export type ImagePosition = 'top' | 'center' | 'bottom'

export interface HierarchyNode {
  id: string
  label: string
  name?: string
  imageUrl?: string
  imagePosition?: ImagePosition
  status: NpcStatus
  children?: HierarchyNode[]
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
    { id: 'asa-6', label: '6ª Asa', status: 'desconhecido' },
    {
      id: 'asa-5',
      label: '5ª Asa',
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
      children: [
        {
          id: 'asa-12-1',
          label: 'Kiaransalee',
          imageUrl: '/drive-img?id=1GZ7yRBeUnWe9qN52_LtRnshlEnRWkJFl&sz=w800',
          status: 'morto',
        },
        {
          id: 'asa-12-2',
          label: 'Kimatira',
          imageUrl: '/drive-img?id=1XZOjPA22_9rvdkLS-xQr9ilK7Co8bUxP&sz=w800',
          status: 'morto',
        },
        {
          id: 'asa-12-3',
          label: 'Caldrous',
          imageUrl: '/drive-img?id=1RdAFCB5lcCTYaciom8CYMvWn7Dwjy8nV&sz=w800',
          status: 'morto',
          children: [
            {
              id: 'asa-12-3-0',
              label: 'Derek Duas Facas',
              imageUrl: '/drive-img?id=11BhJk4Fe_8cBJVFugpx-J4uk06kJ__Wb&sz=w800',
              imagePosition: 'top',
              status: 'morto',
            },
            {
              id: 'asa-12-3-4',
              label: 'Quitara',
              imageUrl: '/drive-img?id=1kPvIrlOuYD8jGForrghXJ7wI41T3-fCl&sz=w800',
              status: 'morto',
            },
            {
              id: 'asa-12-3-1',
              label: 'Desconhecido',
              imageUrl: '/drive-img?id=1BaRnaVUgWcuH-1i5VN_0hpbWnEYR1t5b&sz=w800',
              imagePosition: 'top',
              status: 'morto',
            },
            {
              id: 'asa-12-3-2',
              label: 'Desconhecido',
              imageUrl: '/drive-img?id=19WFCZvDNDXTeAkmHxO1TXERGSF6WVv_E&sz=w800',
              imagePosition: 'top',
              status: 'morto',
            },
            {
              id: 'asa-12-3-3',
              label: 'Desconhecido',
              imageUrl: '/drive-img?id=1cG_i81YGPy_RFQXma0TxPQtynWbUadFq&sz=w800',
              status: 'morto',
            },
          ],
        },
        {
          id: 'asa-12-4',
          label: 'Eilistraee',
          imageUrl: '/drive-img?id=1ZzFwkR7unFdexcFdc7_Bdbvo_Q1pwHhA&sz=w800',
          status: 'morto',
        },
        {
          id: 'asa-12-7',
          label: 'Skarnoth',
          imageUrl: '/drive-img?id=1PwLfNDF3ePjlM07eO1sDcI5-s7pcu4dW&sz=w800',
          imagePosition: 'top',
          status: 'morto',
        },
        {
          id: 'asa-12-8',
          label: 'Thalian',
          imageUrl: '/drive-img?id=1g80xzL0Dn5u17K78MhcRXlbW-oi9dt16&sz=w800',
          status: 'morto',
        },
        {
          id: 'asa-12-9',
          label: 'Thimtek',
          imageUrl: '/drive-img?id=1jd3iWwclP_OuRT6cNI2ghUw2xIDAmQE1&sz=w800',
          imagePosition: 'top',
          status: 'morto',
        },
        {
          id: 'asa-12-6',
          label: 'Golg',
          imageUrl: '/drive-img?id=1N9tqciSFM1xBo_ERg7jqYtx9nLpRdMHd&sz=w800',
          status: 'morto',
        },
        {
          id: 'asa-12-5',
          label: 'Fumaça',
          imageUrl: '/drive-img?id=1fwXdVFwThJ23dguqwrf94pH32cBaKjj7&sz=w800',
          status: 'morto',
        },
      ],
    },
  ],
}
