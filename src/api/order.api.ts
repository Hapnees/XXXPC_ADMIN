import {
	OrdersGetResponse,
	IOrderUpdate,
	OrderStatus,
	IOrderForm,
	OrderCreateResponse,
	OrderGetResponse,
} from '@interfaces/order'
import { SortDirect } from '@interfaces/order/order-sort.enum'
import { baseApi } from './baseApi'

const baseApiWithTags = baseApi.enhanceEndpoints({ addTagTypes: ['Orders'] })

export const orderApi = baseApiWithTags.injectEndpoints({
	endpoints: build => ({
		getNote: build.query<{ note: string }, number>({
			query: id => ({
				url: 'order/get/note',
				params: { id },
			}),
		}),

		orderDelete: build.mutation<{ message: string }, number[]>({
			query: body => ({
				url: 'order/delete/admin',
				method: 'DELETE',
				body,
			}),
			invalidatesTags: [{ type: 'Orders', id: 'LIST' }],
		}),

		orderUpdate: build.mutation<{ message: string }, IOrderUpdate>({
			query: body => ({
				url: 'order/update/admin',
				method: 'PATCH',
				body,
			}),
			invalidatesTags: [{ type: 'Orders', id: 'LIST' }],
		}),

		getOrders: build.query<
			{ data: OrdersGetResponse[]; totalCount: number },
			{
				id?: number
				search?: string
				st?: string
				sd?: SortDirect
				fs?: OrderStatus
				limit?: number
				page?: number
			}
		>({
			query: ({ search, limit = 15, st, sd, fs, page, id }) => ({
				url: 'order/get/admin',
				params: { search, st, sd, fs, id, limit, page },
			}),
			providesTags: [{ type: 'Orders', id: 'LIST' }],
		}),

		createOrder: build.mutation<OrderCreateResponse, IOrderForm>({
			query: body => ({
				url: 'order/create',
				method: 'POST',
				body,
			}),
			invalidatesTags: [{ type: 'Orders', id: 'USER_LIST' }],
		}),
		getOrderByUser: build.query<
			{ data: OrderGetResponse[]; totalCount: number },
			{
				search?: string
				limit?: number
				page?: number
				st?: string
				sd?: SortDirect
				fs?: OrderStatus
			}
		>({
			query: ({ search, limit = 15, page = 1, st, sd, fs }) => ({
				url: 'order/get',
				params: { search, limit, page, st, sd, fs },
			}),
			providesTags: [{ type: 'Orders', id: 'USER_LIST' }],
		}),
	}),
})

export const {
	useCreateOrderMutation,
	useLazyGetOrderByUserQuery,
	useLazyGetOrdersQuery,
	useOrderUpdateMutation,
	useOrderDeleteMutation,
	useGetNoteQuery,
} = orderApi
