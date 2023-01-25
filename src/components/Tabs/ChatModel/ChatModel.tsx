import React, { useEffect, useRef, useState } from 'react'
import { CreateButton, DeleteButton } from '@components/UI/Buttons'
import { IFieldMenuElement } from '@interfaces/fieldMenuElement.interface'
import mainCl from '../tabs.module.scss'
import { sortTitles, sortTitlesView } from './ChatModel.interface'
import { useLazyGetChatsQuery } from '@api/chat.api'
import { useAppSelector } from '@hooks/useAppSelector'
import ChatModelRow from './ChatModelRow/ChatModelRow'
import AdminFieldsPopup from '@components/AdminFieldsPopup/AdminFieldsPopup'
import { AdminLoader } from '@components/UI'
import ChatWithUser from './ChatWithUser/ChatWithUser'

const ChatModel = () => {
	const [isFirst, setIsFirst] = useState(true)

	const [isViewChat, setIsViewChat] = useState(true)

	const { isNeededRefresh } = useAppSelector(state => state.auth)
	const [getChats, { data: chatData, isLoading }] = useLazyGetChatsQuery()

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

	useEffect(() => {
		if (isNeededRefresh) return

		getChats()
			.unwrap()
			.then(() => setIsFirst(false))
	}, [isNeededRefresh])

	if (isLoading || isFirst) return <AdminLoader />

	return (
		<>
			{isViewChat ? (
				<ChatWithUser />
			) : (
				<div className={mainCl.wrapper}>
					<div className={mainCl.panel}>
						<div className='flex items-center gap-2'>
							<p className='text-[20px]'>Чаты</p>
							<CreateButton onClickCreate={() => {}} />
							<DeleteButton onClickDelete={() => {}} />
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
								<li key={chat.id}>
									<ChatModelRow
										chat={chat}
										checkList={checkList}
										checkFieldsList={checkFields}
										setCheckList={setCheckList}
									/>
								</li>
							))}
						</ul>
					</div>
				</div>
			)}
		</>
	)
}

export default ChatModel
