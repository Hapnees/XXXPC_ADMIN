import { Roles } from '@interfaces/roles.interface'

export interface UsersGetResponse {
  id: number
  role?: Roles
  username: string
  email: string
  hash?: string
  isOnline: boolean
  avatarPath: string
  phone?: string
  updatedAt?: string
  createdAt?: string
  _count?: {
    orders: number
  }
}
