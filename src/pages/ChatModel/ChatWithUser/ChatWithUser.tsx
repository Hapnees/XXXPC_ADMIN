import React, { FC, useEffect, useRef, useState } from 'react'
import cl from './ChatWithUser.module.scss'
import { IoSend } from 'react-icons/io5'
import { useLazyGetUserChatQuery } from '@api/chat.api'
import { Roles } from '@interfaces/roles.interface'
import { io, Socket } from 'socket.io-client'
import { useAppSelector } from '@hooks/useAppSelector'
import Checkbox from '@components/UI/Checkbox/Checkbox'
import { dateFormat } from '@utils/date.format'
import { useParams } from 'react-router-dom'

interface Message {
	text: string
	role: Roles
	userId: number
	chatId: number
	createdAt: string
}

const ChatWithUser = () => {
	const params = useParams()
	const userIdFromAdmin = params.userId ? parseInt(params.userId) : undefined
	const chatRef = useRef<HTMLUListElement | null>(null)
	const [getUserChat, { data: userChatData }] = useLazyGetUserChatQuery()
	const {
		user: { role, id },
	} = useAppSelector(state => state.auth)

	const [isShowDate, setIsShowDate] = useState(false)

	const [message, setMessage] = useState('')
	const [socket, setSocket] = useState<Socket>()

	const [listMessages, setListMessages] = useState<Message[]>([])

	const onClickShiftEnter = (event: React.KeyboardEvent) => {
		if (event.key === 'Enter' && event.shiftKey) {
			event.preventDefault()
			sendMessage()
		}
	}

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
		chatRef.current?.lastElementChild?.scrollIntoView()
	}, [listMessages])

	useEffect(() => {
		if (!(userChatData && id)) return

		setListMessages(
			userChatData.Message.map(el => ({
				text: el.text,
				role: el.user.role,
				chatId: el.id,
				userId: id,
				createdAt: el.createdAt,
			}))
		)
	}, [userChatData])

	useEffect(() => {
		if (!userChatData) return
		socket?.emit('join-room', userChatData?.id)
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
					<ul className={cl.message__list} ref={chatRef}>
						{listMessages.map((el, idx) => (
							<li
								key={idx}
								className={
									el.role === Roles.USER
										? 'flex flex-col ml-2 gap-2 self-start'
										: el.role === Roles.ADMIN
										? 'flex flex-col mr-2 gap-2 self-end'
										: ''
								}
							>
								<div
									className={
										el.role === Roles.USER
											? cl.user__message
											: el.role === Roles.ADMIN
											? cl.master__message
											: ''
									}
								>
									{el.text}
								</div>
								<div
									className={cl.date}
									style={{
										display: isShowDate ? 'block' : 'none',
										alignSelf:
											el.role === Roles.USER
												? 'self-start'
												: el.role === Roles.ADMIN
												? 'self-end'
												: '',
									}}
								>
									{dateFormat(el.createdAt, { withTime: true })}
								</div>
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
						onKeyDown={event => onClickShiftEnter(event)}
					/>
					<IoSend className={cl.icon__send} onClick={sendMessage} />
				</div>
			</div>
			<div className='flex justify-end items-center gap-6'>
				<Checkbox
					isShow={isShowDate}
					setIsShow={setIsShowDate}
					title='Показать дату'
				/>
			</div>
		</div>
	)
}

export default ChatWithUser
