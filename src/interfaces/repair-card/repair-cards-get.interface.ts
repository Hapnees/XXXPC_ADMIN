import { IRepairCardMenu } from './repair-card-menu.interface'
import { RepairCardSlug } from './repair-card-slug.enum'

export interface RepairCardsGetResponse {
  id: number
  iconPath: string
  title: string
  description: string
  updatedAt: string
  createdAt: string
  menus: IRepairCardMenu[]
  slug: RepairCardSlug
  _count: {
    services: number
  }
}
