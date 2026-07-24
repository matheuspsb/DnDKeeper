import type { HierarchyTree } from './cult'

export const HARPERS_TREE: HierarchyTree = {
  root: {
    label: 'Harpers',
    faction: 'Harpers',
    status: 'vivo',
    imageUrl: '/drive-img?id=1gkQf8vuFFp8DZABqNlbcku-2HIgCyEgv&sz=w800',
  },
  direction: 'right',
  children: [
    {
      id: 'harper-luas-1',
      label: 'Lua da Informação',
      name: 'Ellyn Moonwhisper',
      status: 'vivo',
      imageUrl: '/drive-img?id=1pidXSvJTOH6JpzX5-ITq3bJAWslURWpG&sz=w800',
      children: [
        {
          id: 'harper-triple-1',
          label: 'Triple String',
          name: 'Beleor',
          status: 'morto',
          imageUrl: '/drive-img?id=1fcWECwSwg-6-2BY7NLlq2-Q1Ax0Z5lQ4&sz=w800',
          children: [
            {
              id: 'harper-double-1',
              label: 'Double String',
              name: 'Patrichia',
              status: 'vivo',
              imageUrl: '/drive-img?id=1IG-XOpRRdxLLCnuJPnX0OU30Ax8layDv&sz=w800',
              children: [
                {
                  id: 'harper-single-1',
                  label: 'Single String',
                  name: 'Bela',
                  status: 'morto',
                  imageUrl: '/drive-img?id=1h_lIGTrjy_0KNNenCWRF2Gdir7V4430r&sz=w800',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'harper-luas-2',
      label: 'Lua do Equilíbrio',
      name: 'Elowen Glass',
      status: 'vivo',
      imageUrl: '/drive-img?id=1fY2VgChrAmYZH3hyshvP1csGFanCGg3m&sz=w800',
      imagePosition: 'top',
    },
    {
      id: 'harper-luas-3',
      label: 'Lua da Diplomacia',
      name: 'Cylyria Dragonbreast',
      status: 'vivo',
      imageUrl: '/drive-img?id=1KvAA0bdpS3D4T8KSn6zaZDBPhs7Vaa_L&sz=w800',
      imagePosition: 'top',
    },
    {
      id: 'harper-luas-4',
      label: 'Luas',
      status: 'vivo',
    },
    {
      id: 'harper-luas-5',
      label: 'Luas',
      status: 'vivo',
    },
    {
      id: 'harper-luas-6',
      label: 'Luas',
      status: 'vivo',
    },
  ],
}
