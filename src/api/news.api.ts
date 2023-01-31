import { baseApi } from './baseApi'
import { INewsCreate } from '@interfaces/news/news-create.interface'
import { INewsGet } from '@interfaces/news/news-get.interface'
import { INewsUpdate } from '@interfaces/news/news-update.interface'

const baseApiWithTags = baseApi.enhanceEndpoints({ addTagTypes: ['News'] })

export const newsApi = baseApiWithTags.injectEndpoints({
	endpoints: build => ({
		createNews: build.mutation<{ message: string }, INewsCreate>({
			query: body => ({
				url: 'news/create',
				method: 'POST',
				body,
			}),
			invalidatesTags: [{ type: 'News', id: 'LIST' }],
		}),

		updateNews: build.mutation<{ message: string }, INewsUpdate>({
			query: body => ({
				url: 'news/update',
				method: 'PATCH',
				body,
			}),
			invalidatesTags: [{ type: 'News', id: 'LIST' }],
		}),

		getNews: build.query<INewsGet[], string | void>({
			query: search => ({
				url: 'news/get',
				params: { search },
			}),
			providesTags: [{ type: 'News', id: 'LIST' }],
		}),
	}),
})

export const {
	useCreateNewsMutation,
	useUpdateNewsMutation,
	useLazyGetNewsQuery,
} = newsApi
