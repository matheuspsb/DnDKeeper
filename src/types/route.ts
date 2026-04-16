import type { ReactElement } from 'react'

export interface AppRoute {
  id: string
  path: string
  label: string
  element: ReactElement
  icon: ReactElement
}
