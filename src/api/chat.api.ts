import { Chat, userChat } from '@interfaces/chat.interface'
import { baseApi } from './baseApi'

const baseApiWithTags = baseApi.enhanceEndpoints({ addTagTypes: ['Chat'] })

export const chatApi = baseApiWithTags.injectEndpoints({
	endpoints: build => ({
		getChats: build.query<Chat[], void>({
			query: () => ({
				url: 'chat/get/chats',
			}),
			providesTags: [{ type: 'Chat', id: 'LIST' }],
		}),

		getUserChat: build.query<userChat, { userIdFromAdmin: number }>({
			query: ({ userIdFromAdmin }) => ({
				url: 'chat/get',
				params: { userIdFromAdmin },
			}),
			providesTags: [{ type: 'Chat', id: 'USER_CHAT' }],
		}),

		// acceptChatRequest: build.mutation<{ message: string }, { chatId: number }>({
		// 	query: body => ({
		// 		url: 'chat/accept',
		// 		method: 'PATCH',
		// 		body,
		// 	}),
		// 	invalidatesTags: [{ type: 'Chat', id: 'LIST' }],
		// }),
	}),
})

export const {
	useLazyGetChatsQuery,
	// useAcceptChatRequestMutation,
	useGetUserChatQuery,
} = chatApi
