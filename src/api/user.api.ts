import { UsersGetResponse, IUserUpdate } from '@interfaces/user'
import { IUserCreate } from '@interfaces/user/user-create.interface'
import { baseApi } from './baseApi'

const apiWithTags = baseApi.enhanceEndpoints({ addTagTypes: ['Users'] })

const userApi = apiWithTags.injectEndpoints({
  endpoints: build => ({
    deleteUsers: build.mutation<{ message: string }, number[]>({
      query: body => ({
        url: 'user/delete/admin',
        method: 'DELETE',
        body,
      }),
      invalidatesTags: [{ type: 'Users', id: 'LIST' }],
    }),

    updateUser: build.mutation<{ message: string }, IUserUpdate>({
      query: body => ({
        url: 'user/update/admin',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: [{ type: 'Users', id: 'LIST' }],
    }),

    getUsers: build.query<
      { data: UsersGetResponse[]; totalCount: number },
      {
        search?: string
        st?: string
        rf?: string
        of?: boolean
        limit?: number
        page?: number
        headers: any
      }
    >({
      query: ({ headers, search, st, rf, of, limit = 15, page }) => ({
        url: 'user/get',
        params: { search, st, rf, of, limit, page },
        headers,
      }),
      providesTags: [{ type: 'Users', id: 'LIST' }],
    }),

    createUser: build.mutation<{ message: string }, IUserCreate>({
      query: body => ({
        url: 'user/create/admin',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Users', id: 'LIST' }],
    }),
  }),
})

export const {
  useLazyGetUsersQuery,
  useDeleteUsersMutation,
  useCreateUserMutation,
  useUpdateUserMutation,
} = userApi
