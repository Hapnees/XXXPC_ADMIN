import { OrderStatus } from './order-status.enum'

export interface IOrderUpdate {
  id: number
  status?: OrderStatus
  note?: string
  price?: number
}
