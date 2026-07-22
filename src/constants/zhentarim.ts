import type { HierarchyTree } from './cult'

export const ZHENTARIM_TREE: HierarchyTree = {
  root: { label: 'Líder', faction: 'Zhentarim', name: 'Manshoon', status: 'vivo' },
  direction: 'right',
  children: [
    {
      id: 'zhent-general-1',
      label: 'General',
      name: 'Desconhecido',
      status: 'desconhecido',
      children: [
        {
          id: 'zhent-captain-1-1',
          label: 'Capitão',
          status: 'desconhecido',
          children: [
            {
              id: 'zhent-agent-1',
              label: 'Agente',
              name: 'Galdor',
              imageUrl: '/drive-img?id=1URH5CTIQyWOr6J3kE6SvdWWCHTvIpdPT&sz=w800',
              status: 'vivo',
              children: [
                { id: 'zhent-minor-1', label: 'Kandaelis', status: 'vivo' },
                { id: 'zhent-minor-2', label: 'Valeriana', status: 'vivo' },
              ],
            },
            { id: 'zhent-agent-2', label: 'Agente', name: 'Traitos', status: 'vivo' },
          ],
        },
        {
          id: 'zhent-captain-1-2',
          label: 'Capitão',
          status: 'desconhecido',
        },
      ],
    },
    {
      id: 'zhent-general-2',
      label: 'General',
      name: 'Desconhecido',
      status: 'desconhecido',
    },
    {
      id: 'zhent-general-3',
      label: 'General',
      name: 'Desconhecido',
      status: 'desconhecido',
    },
  ],
}
