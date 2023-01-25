import React, { FC, useState } from 'react'
import cl from './ChatWithUser.module.scss'
import { IoSend } from 'react-icons/io5'
import { useGetUserChatQuery, useSendChatMessageMutation } from '@api/chat.api'
import { Roles } from '@interfaces/roles.interface'

interface IProps {
	chat: {
		username: string
	}
}

const ChatWithUser = () => {
	const { data: userChatData } = useGetUserChatQuery()
	const [sendMessage] = useSendChatMessageMutation()

	const [message, setMessage] = useState('')

	return (
		<div>
			<div className={cl.container}>
				<div className={cl.header}>Пользователь Никита</div>
				<div className='grow'>
					<ul className='flex flex-col'>
						{userChatData?.Message.map(message => (
							<li
								key={message.id}
								className={
									message.user.role === Roles.USER
										? cl.user__message
										: message.user.role === Roles.ADMIN
										? cl.master__message
										: ''
								}
							>
								{message.text}
							</li>
						))}
						{/* <li className={cl.user__message}>Здравствуйте!</li>
						<li className={cl.master__message}>Здравствуйте!</li> */}
					</ul>
				</div>
				<div className={cl.input__message}>
					<textarea
						className={cl.input}
						placeholder='Введите сообщение'
						value={message}
						onChange={event => setMessage(event.target.value)}
					/>
					<IoSend
						className={cl.icon__send}
						onClick={() => {
							if (!userChatData) return

							sendMessage({ message, chatId: userChatData.id })
						}}
					/>
				</div>
			</div>
		</div>
	)
}

export default ChatWithUser
