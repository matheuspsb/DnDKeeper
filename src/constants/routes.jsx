import MusicIcon from '../components/atoms/icons/MusicIcon'
import ImageIcon from '../components/atoms/icons/ImageIcon'
import UsersIcon from '../components/atoms/icons/UsersIcon'
import Sons from '../pages/Sons'
import Artes from '../pages/Artes'
import Personagens from '../pages/Personagens'

export const ROUTES = [
  {
    id: 'sons',
    path: '/sons',
    label: 'Sons',
    element: <Sons />,
    icon: <MusicIcon />,
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
    element: <Personagens />,
    icon: <UsersIcon />,
  },
]
