import React, { useEffect, useRef, useState } from 'react'
import { CreateButton, DeleteButton } from '@components/UI/Buttons'
import { IFieldMenuElement } from '@interfaces/fieldMenuElement.interface'
import mainCl from '../tabs.module.scss'
import { ChatStatus, sortTitles, sortTitlesView } from './ChatModel.interface'
import { useLazyGetChatsQuery } from '@api/chat.api'
import { useAppSelector } from '@hooks/useAppSelector'
import ChatModelRow from './ChatModelRow/ChatModelRow'
import AdminFieldsPopup from '@components/AdminFieldsPopup/AdminFieldsPopup'
import { AdminLoader } from '@components/UI'
import { io, Socket } from 'socket.io-client'
import customToast from '@utils/customToast'
import SearchInputWithButton from '@components/SearchInputWithButton/SearchInputWithButton'
import { useActions } from '@hooks/useActions'
import { Tabs } from '@interfaces/tabs.interface'
import { useNavigate } from 'react-router-dom'

const ChatModel = () => {
	const navigate = useNavigate()
	const { addTab } = useActions()
	const searchRef = useRef<HTMLInputElement>(null)
	const [isFirst, setIsFirst] = useState(true)

	const { isUpdatedOnline } = useAppSelector(state => state.auth)
	const [getChats, { data: chatData, isLoading }] = useLazyGetChatsQuery()

	const getChatsWithparams = () => {
		getChats({ search: searchRef.current?.value })
	}

	const [checkList, setCheckList] = useState<number[]>([])
	const [checkFields, setCheckFields] = useState<IFieldMenuElement[]>(
		Object.keys(sortTitles)
			.map(el => ({ title: el, checked: true }))
			.map(el => ({
				...el,
				checked:
					el.title === sortTitles.DATE_UPDATED ||
					el.title === sortTitles.DATE_CREATED
						? false
						: true,
			}))
	)

	const [socket, setSocket] = useState<Socket>()

	const onClickChatRow = (userId: number, username: string) => {
		const checkStatus = chatData?.filter(el =>
			el.user.find(el2 => el2.id === userId)
		)[0].status

		if (checkStatus === ChatStatus.PENDING) {
			customToast.error('Сначала примите запрос')
			return
		}

		const newUrl = `/chats/user/${userId}`
		addTab({ title: `${Tabs.CHAT}/${username}`, url: newUrl })
		navigate(newUrl)
	}

	const chatRequestListener = (data: { isSendedRequest: boolean }) => {
		if (!data.isSendedRequest) return

		getChats()
	}

	const onKeyDownEnter = (event: React.KeyboardEvent) => {
		if (event.key === 'Enter') {
			getChatsWithparams()
		}
	}

	useEffect(() => {
		// setCurrentTab(Tabs.CHAT)
	}, [])

	useEffect(() => {
		if (!isUpdatedOnline) return

		getChats()
			.unwrap()
			.then(() => setIsFirst(false))
	}, [isUpdatedOnline])

	useEffect(() => {
		socket?.on('chat-request', chatRequestListener)
	}, [chatRequestListener])

	useEffect(() => {
		const newSocket = io('http://localhost:8001')
		setSocket(newSocket)
	}, [setSocket])

	if (isLoading || isFirst || !isUpdatedOnline) return <AdminLoader />

	return (
		<div className={mainCl.wrapper}>
			<div className={mainCl.panel}>
				<div className='flex items-center gap-2'>
					<p className='text-[20px]'>Чаты</p>
					<CreateButton onClickCreate={() => {}} />
					<DeleteButton onClickDelete={() => {}} />
					<SearchInputWithButton
						placeholder='По имени пользователя'
						searchRef={searchRef}
						onKeyDown={onKeyDownEnter}
						getDataWithParams={getChatsWithparams}
					/>
					<AdminFieldsPopup
						ruFields={sortTitlesView}
						checkFields={checkFields}
						setCheckFields={setCheckFields}
					/>
				</div>
			</div>
			<div className={mainCl.container__menu}>
				<ul className={mainCl.top__menu}>
					{checkFields
						.filter(el => el.checked)
						.map((el, idx) => (
							<li key={idx}>
								{sortTitlesView[el.title as keyof typeof sortTitles]}
							</li>
						))}
				</ul>
				<ul>
					{chatData?.map(chat => (
						<li
							key={chat.id}
							onClick={() =>
								onClickChatRow(chat.user[0].id, chat.user[0].username)
							}
						>
							<ChatModelRow
								getChats={getChats}
								chat={chat}
								checkList={checkList}
								checkFieldsList={checkFields}
								setCheckList={setCheckList}
								socket={socket}
							/>
						</li>
					))}
				</ul>
			</div>
		</div>
	)
}

export default ChatModel
