import { ILoginForm } from '@interfaces/auth/loginForm.interface'
import { IAuthResponse } from '@interfaces/auth/auth-response.interface'
import { ITokens } from '@interfaces/auth/tokens.interface'
import { Roles } from '@interfaces/roles.interface'
import { baseApi } from './baseApi'

const authApi = baseApi.injectEndpoints({
  endpoints: build => ({
    register: build.mutation<IAuthResponse, void>({
      query: () => ({
        url: 'auth/register',
        method: 'POST',
      }),
    }),
    login: build.mutation<IAuthResponse, ILoginForm>({
      query: body => ({
        url: 'auth/login',
        method: 'POST',
        body,
      }),
    }),
    logout: build.mutation<void, void>({
      query: () => ({
        url: 'auth/logout',
        method: 'POST',
      }),
    }),
    refreshTokens: build.mutation<{ tokens: ITokens; role: Roles }, void>({
      query: () => ({
        url: 'auth/refresh',
        method: 'POST',
      }),
    }),
  }),
})

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useRefreshTokensMutation,
} = authApi
