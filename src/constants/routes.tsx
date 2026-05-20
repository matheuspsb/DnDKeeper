import MusicIcon from '../components/atoms/icons/MusicIcon'
import ImageIcon from '../components/atoms/icons/ImageIcon'
import MapIcon from '../components/atoms/icons/MapIcon'
import UsersIcon from '../components/atoms/icons/UsersIcon'
import SwordsIcon from '../components/atoms/icons/SwordsIcon'
import DiceIcon from '../components/atoms/icons/DiceIcon'
import StarIcon from '../components/atoms/icons/StarIcon'
import MaskIcon from '../components/atoms/icons/MaskIcon'
import NetworkIcon from '../components/atoms/icons/NetworkIcon'
import ScrollIcon from '../components/atoms/icons/ScrollIcon'
import Sounds from '../pages/Sounds'
import Arts from '../pages/Arts'
import Map from '../pages/Map'
import Characters from '../pages/Characters'
import Initiative from '../pages/Initiative'
import RandomTables from '../pages/RandomTables'
import Encounter from '../pages/Encounter'
import Npcs from '../pages/Npcs'
import Connections from '../pages/Connections'
import Letters from '../pages/Letters'
import type { AppRoute } from '../types/route.types'

export const ROUTES: AppRoute[] = [
  {
    id: 'npcs',
    path: '/npcs',
    label: 'NPCs',
    element: <Npcs />,
    icon: <MaskIcon />,
  },
  {
    id: 'mapa',
    path: '/mapa',
    label: 'Mapa',
    element: <Map />,
    icon: <MapIcon />,
  },
  {
    id: 'artes',
    path: '/artes',
    label: 'Artes',
    element: <Arts />,
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
  {
    id: 'arvore',
    path: '/arvore',
    label: 'Conexões',
    element: <Connections />,
    icon: <NetworkIcon />,
  },
  {
    id: 'cartas',
    path: '/cartas',
    label: 'Cartas',
    element: <Letters />,
    icon: <ScrollIcon />,
    dmOnly: true,
  },
  {
    id: 'sons',
    path: '/sons',
    label: 'Sons',
    element: <Sounds />,
    icon: <MusicIcon />,
    dmOnly: true,
  },
]
