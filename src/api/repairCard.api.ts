import {
	IRepairCardCreate,
	RepairCardSlug,
	RepairCardsGetResponse,
} from '@interfaces/repair-card'
import { baseApi } from './baseApi'

const baseApiWithTags = baseApi.enhanceEndpoints({
	addTagTypes: ['RepairCards'],
})

const repairApi = baseApiWithTags.injectEndpoints({
	endpoints: build => ({
		getUnusedRepairCardSlugs: build.query<RepairCardSlug[], number | void>({
			query: repairCardId => ({
				url: 'repair/get/card/unused-slugs',
				params: { repairCardId },
			}),
		}),

		adminDeleteRepairCard: build.mutation<{ message: string }, number[]>({
			query: body => ({
				url: 'repair/delete',
				method: 'DELETE',
				body,
			}),
			invalidatesTags: [{ type: 'RepairCards', id: 'LIST_ALL' }],
		}),

		adminGetRepairCardDetails: build.query<RepairCardsGetResponse, number>({
			query: id => ({
				url: `repair/get/card/${id}`,
			}),
			providesTags: [{ type: 'RepairCards', id: 'LIST_ALL' }],
		}),

		adminGetRepairCards: build.query<
			{
				data: RepairCardsGetResponse[]
				totalCount: number
			},
			{ search?: string; fs?: RepairCardSlug; limit?: number; page?: number }
		>({
			query: ({ search, fs, limit = 15, page }) => ({
				url: 'repair/get',
				params: { search, fs, limit, page },
			}),
			providesTags: [{ type: 'RepairCards', id: 'LIST_ALL' }],
		}),

		adminUpdateRepairCard: build.mutation<
			{ message: string },
			Partial<IRepairCardCreate & { id: number; iconPath?: string }>
		>({
			query: body => ({
				url: 'repair/update',
				method: 'PATCH',
				body,
			}),
			invalidatesTags: [{ type: 'RepairCards', id: 'LIST_ALL' }],
		}),

		adminCreateRepairCard: build.mutation<
			{ message: string; cardId: number },
			IRepairCardCreate
		>({
			query: body => ({
				url: 'repair/create',
				method: 'POST',
				body,
			}),
			invalidatesTags: [{ type: 'RepairCards', id: 'LIST_ALL' }],
		}),
	}),
})

export const {
	useLazyAdminGetRepairCardsQuery,
	useAdminUpdateRepairCardMutation,
	useAdminCreateRepairCardMutation,
	useLazyAdminGetRepairCardDetailsQuery,
	useAdminDeleteRepairCardMutation,
	useLazyGetUnusedRepairCardSlugsQuery,
} = repairApi
