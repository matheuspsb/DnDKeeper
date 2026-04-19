import MusicIcon from '../components/atoms/icons/MusicIcon'
import ImageIcon from '../components/atoms/icons/ImageIcon'
import UsersIcon from '../components/atoms/icons/UsersIcon'
import SwordsIcon from '../components/atoms/icons/SwordsIcon'
import DiceIcon from '../components/atoms/icons/DiceIcon'
import StarIcon from '../components/atoms/icons/StarIcon'
import Sounds from '../pages/Sounds'
import Artes from '../pages/Artes'
import Characters from '../pages/Characters'
import Initiative from '../pages/Initiative'
import RandomTables from '../pages/RandomTables'
import Encounter from '../pages/Encounter'
import type { AppRoute } from '../types/route'

export const ROUTES: AppRoute[] = [
  {
    id: 'sons',
    path: '/sons',
    label: 'Sons',
    element: <Sounds />,
    icon: <MusicIcon />,
    dmOnly: true,
  },
  {
    id: 'artes',
    path: '/artes',
    label: 'Artes',
    element: <Artes />,
    icon: <ImageIcon />,
  },
  {
    id: 'personagens',
    path: '/personagens',
    label: 'Personagens',
    element: <Characters />,
    icon: <UsersIcon />,
    dmOnly: true,
  },
  {
    id: 'iniciativa',
    path: '/iniciativa',
    label: 'Iniciativa',
    element: <Initiative />,
    icon: <SwordsIcon />,
    dmOnly: true,
  },
  {
    id: 'tabelas',
    path: '/tabelas',
    label: 'Tabelas',
    element: <RandomTables />,
    icon: <DiceIcon />,
    dmOnly: true,
  },
  {
    id: 'encontro',
    path: '/encontro',
    label: 'Encontro',
    element: <Encounter />,
    icon: <StarIcon />,
    dmOnly: true,
  },
]
