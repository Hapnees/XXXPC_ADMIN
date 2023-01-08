import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Roles, RolesView } from '@interfaces/roles.interface'

interface IState {
  user: {
    id?: number
    username?: string
    avatarPath?: string
    role?: Roles
  }
  accessToken: string
  refreshToken: string
  isNeededRefresh: boolean
}

const initialState: IState = {
  accessToken: '',
  refreshToken: '',
  user: { username: '', avatarPath: '', id: 0, role: Roles.VISITOR },
  isNeededRefresh: true,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<Partial<IState>>) => {
      state.user.username = action.payload.user?.username || state.user.username
      state.user.avatarPath =
        action.payload.user?.avatarPath || state.user.avatarPath
      state.user.role = action.payload.user?.role || state.user.role
      state.user.id = action.payload.user?.id ?? state.user.id
      state.accessToken = action.payload.accessToken || state.accessToken
      state.refreshToken = action.payload.refreshToken || state.refreshToken
      state.isNeededRefresh = false
    },
    authLogout: state => {
      state.user = {
        username: '',
        avatarPath: '',
        id: 0,
        role: Roles.VISITOR,
      }
      state.accessToken = ''
      state.refreshToken = ''
      state.isNeededRefresh = true
    },

    authSetIsNeeded: (state, action: PayloadAction<boolean>) => {
      state.isNeededRefresh = action.payload
    },
  },
})

export const authReducer = authSlice.reducer
export const authActions = authSlice.actions
