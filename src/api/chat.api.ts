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

		getChatRequstsCount: build.query<number, void>({
			query: () => ({
				url: 'chat/get/chat-requests-count',
			}),
		}),
	}),
})

export const {
	useLazyGetChatsQuery,
	useLazyGetChatRequstsCountQuery,
	useLazyGetUserChatQuery,
} = chatApi
