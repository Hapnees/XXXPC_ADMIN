import { IRepairCardMenu } from './repair-card-menu.interface'
import { RepairCardSlug } from './repair-card-slug.enum'

export interface IRepairCardCreate {
  title: string
  description: string
  menus: IRepairCardMenu[]
  slug: RepairCardSlug
  paragraphDeletedIds?: number[]
  menuDeletedIds?: number[]
}
