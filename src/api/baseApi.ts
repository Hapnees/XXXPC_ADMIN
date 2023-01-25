import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { TypeRootState } from 'src/redux/store'

export const baseApi = createApi({
	reducerPath: 'api',
	baseQuery: fetchBaseQuery({
		baseUrl: 'http://localhost:4000/api',
		prepareHeaders: (headers, { getState }) => {
			const isNeededRefresh = (getState() as TypeRootState).auth.isNeededRefresh
			const { accessToken, refreshToken } = (getState() as TypeRootState).auth
			const token = isNeededRefresh ? refreshToken : accessToken

			if (token) {
				headers.set('authorization', `Bearer ${token}`)
			}

			return headers
		},
	}),
	endpoints: () => ({}),
})
