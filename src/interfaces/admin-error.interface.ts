import { UsersGetResponse } from './user'

export type AdminUsersGetType = Omit<UsersGetResponse, 'hash' | '_count'>

export interface AdminError {
  id: number
  errors: IError[]
}

export interface IError {
  msg: string
  key: string
  value: string
}
