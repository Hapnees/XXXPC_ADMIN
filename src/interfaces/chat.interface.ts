import { ChatStatus } from 'src/pages/ChatModel/ChatModel.interface'
import { Roles } from './roles.interface'

export type userChat = {
	id: number
	userId: number
	issue: string
	masterName: string
	user: { username: string }[]
	Message: {
		id: number
		text: string
		createdAt: string
		user: { role: Roles }
	}[]
	status: ChatStatus
	updatedAt: string
	createdAt: string
}

export interface Chat {
	id: number
	issue: string
	masterName: string
	user: { id: number; username: string }[]
	status: ChatStatus
	updatedAt: string
	createdAt: string
}
