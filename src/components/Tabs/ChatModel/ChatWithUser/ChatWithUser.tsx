import React, { FC, useEffect, useState } from 'react'
import cl from './ChatWithUser.module.scss'
import { IoSend } from 'react-icons/io5'
import { useLazyGetUserChatQuery } from '@api/chat.api'
import { Roles } from '@interfaces/roles.interface'
import { io, Socket } from 'socket.io-client'
import { useAppSelector } from '@hooks/useAppSelector'

interface IProps {
	userIdFromAdmin?: number
	setUserIdFromAdmin: React.Dispatch<React.SetStateAction<number | undefined>>
}

interface Message {
	text: string
	role: Roles
	userId: number
	chatId: number
}

const ChatWithUser: FC<IProps> = ({ userIdFromAdmin, setUserIdFromAdmin }) => {
	const [getUserChat, { data: userChatData }] = useLazyGetUserChatQuery()
	const {
		user: { role, id },
	} = useAppSelector(state => state.auth)

	const [message, setMessage] = useState('')
	const [socket, setSocket] = useState<Socket>()

	const [listMessages, setListMessages] = useState<Message[]>([])

	const sendMessage = () => {
		if (!userChatData) return

		socket?.emit(`message`, {
			text: message,
			role,
			chatId: userChatData.id,
			userId: id,
		})
		setMessage('')
	}

	const messageListenter = (message: Message) => {
		setListMessages([...listMessages, message])
	}

	useEffect(() => {
		if (!(userChatData && id)) return

		setListMessages(
			userChatData.Message.map(el => ({
				text: el.text,
				role: el.user.role,
				chatId: el.id,
				userId: id,
			}))
		)
	}, [userChatData])

	useEffect(() => {
		if (!userChatData) return
		socket?.emit('join', userChatData?.id)
	}, [userChatData])

	useEffect(() => {
		if (!userIdFromAdmin) return

		getUserChat({ userIdFromAdmin })
	}, [userIdFromAdmin])

	useEffect(() => {
		const newSocket = io('http://localhost:8001')
		setSocket(newSocket)
	}, [setSocket])

	useEffect(() => {
		if (!userChatData) return

		socket?.on(`message`, messageListenter)

		return () => {
			socket?.off(`message`)
		}
	}, [messageListenter, userChatData])

	return (
		<div className='mt-[20px] flex flex-col'>
			<div className={cl.container}>
				<div className={cl.header}>Пользователь Никита</div>
				<div className='grow'>
					<ul className={cl.message__list}>
						{listMessages.map((el, idx) => (
							<li
								key={idx}
								className={
									el.role === Roles.USER
										? cl.user__message
										: el.role === Roles.ADMIN
										? cl.master__message
										: ''
								}
							>
								{el.text}
							</li>
						))}
					</ul>
				</div>
				<div className={cl.input__message}>
					<textarea
						className={cl.input}
						placeholder='Введите сообщение'
						value={message}
						onChange={event => setMessage(event.target.value)}
					/>
					<IoSend className={cl.icon__send} onClick={sendMessage} />
				</div>
			</div>
			<button
				className={cl.button}
				onClick={() => setUserIdFromAdmin(undefined)}
			>
				Назад
			</button>
		</div>
	)
}

export default ChatWithUser
