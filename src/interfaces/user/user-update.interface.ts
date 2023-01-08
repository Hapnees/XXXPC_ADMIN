import { Roles } from '@interfaces/roles.interface'

export interface IUserUpdate {
  id: number
  role?: Roles
  username: string
  email: string
  password?: string
  phone?: string
}
