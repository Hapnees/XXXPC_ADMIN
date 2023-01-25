import {
	IServiceCreate,
	IServiceUpdate,
	ServiceGetResponse,
} from '@interfaces/service'
import { baseApi } from './baseApi'

const baseApiWithTags = baseApi.enhanceEndpoints({ addTagTypes: ['Service'] })

export const serviceApi = baseApiWithTags.injectEndpoints({
	endpoints: build => ({
		updateService: build.mutation<{ message: string }, IServiceUpdate>({
			query: body => ({
				url: 'service/update',
				method: 'PATCH',
				body,
			}),
			invalidatesTags: [{ type: 'Service', id: 'LIST' }],
		}),

		deleteServices: build.mutation<{ message: string }, number[]>({
			query: body => ({
				url: 'service/delete',
				method: 'DELETE',
				body,
			}),
			invalidatesTags: [{ type: 'Service', id: 'LIST' }],
		}),

		createService: build.mutation<{ message: string }, IServiceCreate>({
			query: body => ({
				url: 'service/create',
				method: 'POST',
				body,
			}),
			invalidatesTags: [{ type: 'Service', id: 'LIST' }],
		}),

		getServices: build.query<
			{ data: ServiceGetResponse[]; totalCount: any },
			{
				id?: number
				search?: string
				st?: string
				sd?: string
				limit?: number
				page?: number
			}
		>({
			query: ({ id, search, st, sd, limit = 15, page }) => ({
				url: 'service/get',
				params: { search, st, sd, limit, page, id },
			}),
			providesTags: [{ type: 'Service', id: 'LIST' }],
		}),
	}),
})

export const {
	useLazyGetServicesQuery,
	useCreateServiceMutation,
	useDeleteServicesMutation,
	useUpdateServiceMutation,
} = serviceApi
