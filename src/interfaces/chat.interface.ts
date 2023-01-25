import { ChatStatus } from '@components/Tabs/ChatModel/ChatModel.interface'
import { Roles } from './roles.interface'

export interface Chat {
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
