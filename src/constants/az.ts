import type { HierarchyTree } from './cult'
import azImg from '../assets/watermarks/az.jpeg'
import boffImg from '../assets/arts/4_boff.jpeg'
import buffImg from '../assets/arts/3_buff.jpeg'
import danteImg from '../assets/arts/1_dante.jpeg'
import samaelImg from '../assets/arts/1_samael.jpeg'
import garroshImg from '../assets/watermarks/garrosh.png'

export const AZ_TREE: HierarchyTree = {
  root: { label: 'Guilda AZ', faction: 'Guilda AZ', status: 'vivo', imageUrl: azImg, color: '#ECC83B' },
  direction: 'left',
  children: [
    { id: 'az-bof', label: 'Bof', status: 'vivo', imageUrl: boffImg },
    {
      id: 'az-buf',
      label: 'Buf',
      status: 'vivo',
      imageUrl: buffImg,
      children: [{ id: 'az-garrosh', label: 'Garrosh', status: 'vivo', imageUrl: garroshImg }],
    },
    { id: 'az-dante', label: 'Dante', status: 'morto', imageUrl: danteImg },
    {
      id: 'az-tuga',
      label: 'Tuga',
      status: 'vivo',
      imageUrl: '/drive-img?id=1W3ApJjqikuJXvVT8FAU-xmM1W2vSATFZ&sz=w800',
    },
    { id: 'az-samael', label: 'Samael', status: 'vivo', imageUrl: samaelImg },
  ],
}
