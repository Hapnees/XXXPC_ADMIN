import { Chat } from '@interfaces/chat.interface'
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

		getUserChat: build.query<Chat, void>({
			query: () => ({
				url: 'chat/get',
			}),
			providesTags: [{ type: 'Chat', id: 'USER_CHAT' }],
		}),

		acceptChatRequest: build.mutation<{ message: string }, { chatId: number }>({
			query: body => ({
				url: 'chat/accept',
				method: 'PATCH',
				body,
			}),
			invalidatesTags: [{ type: 'Chat', id: 'LIST' }],
		}),
		sendChatMessage: build.mutation<void, { message: string; chatId: number }>({
			query: body => ({
				url: 'chat/send/message',
				method: 'POST',
				body,
			}),
			invalidatesTags: [{ type: 'Chat', id: 'USER_CHAT' }],
		}),
	}),
})

export const {
	useLazyGetChatsQuery,
	useAcceptChatRequestMutation,
	useSendChatMessageMutation,
	useGetUserChatQuery,
} = chatApi
