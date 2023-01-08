import { RepairCardSlug } from '../repair-card/repair-card-slug.enum'

export interface IServiceCreate {
  title: string
  prices: number[]
  repairCardId?: number
  repairCardSlug?: RepairCardSlug
}
