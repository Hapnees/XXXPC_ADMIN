import { Roles } from '@interfaces/roles.interface'

export interface IUserCreate {
  username: string
  email: string
  password: string
  role: Roles
  phone?: string
}
