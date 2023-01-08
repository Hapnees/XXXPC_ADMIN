import { IRepairCardMenu } from './repair-card-menu.interface'
import { ISerivce } from '../service/service.interface'

export interface RepairCardResponse {
  id: number
  slug: string
  title: string
  createdAt: string
  updatedAt: string
  menus: IRepairCardMenu[]
  services: ISerivce[]
}
