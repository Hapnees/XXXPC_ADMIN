import React, { FC, useEffect, useState } from 'react'
import { Chat } from '@interfaces/chat.interface'
import { IFieldMenuElement } from '@interfaces/fieldMenuElement.interface'
import mainCl from '../../tabs.module.scss'
import { ChatStatus, ChatStatusView, sortTitles } from '../ChatModel.interface'
import { dateFormat } from '@utils/date.format'
import customToast from '@utils/customToast'
import { Socket } from 'socket.io-client'
import { useAppSelector } from '@hooks/useAppSelector'

interface IProps {
	chat: Chat
	setCheckList: React.Dispatch<React.SetStateAction<number[]>>
	checkList: number[]
	checkFieldsList: IFieldMenuElement[]
	socket?: Socket
	getChats: () => any
}

const ChatModelRow: FC<IProps> = ({
	chat,
	checkFieldsList,
	checkList,
	setCheckList,
	socket,
	getChats,
}) => {
	const value = checkList.includes(chat.id)
	const {
		user: { id, role },
	} = useAppSelector(state => state.auth)

	const onChangeCheck = (event: any) => {
		event.stopPropagation()
		if (value) {
			const newCheckList = [...checkList].filter(el => el !== chat.id)
			setCheckList(newCheckList)
			return
		}
		setCheckList(prev => [...prev, chat.id])
	}

	const acceptListener = (data: { isAccepted: boolean }) => {
		if (!data.isAccepted) return

		getChats()
			.unwrap()
			.then(() => {
				socket?.off('chat-accept')
			})
	}

	const onClickStatus = (event: any) => {
		event.stopPropagation()

		if (chat.status === ChatStatus.ACCEPTED) return

		socket?.on('chat-accept', acceptListener)
		socket?.emit('chat-accept', { masterId: id, chatId: chat.id, role })
	}

	return (
		<ul
			className={mainCl.menu}
			style={{
				backgroundColor: value ? 'rgba(177, 39, 39, 0.505)' : '',
			}}
		>
			<li
				onClick={event => onChangeCheck(event)}
				className={mainCl.short__element}
			>
				<input
					type='checkbox'
					className={mainCl.checkbox}
					checked={value}
					onChange={event => onChangeCheck(event)}
				/>
			</li>
			<li className={mainCl.short__element}>{chat.id}</li>
			{checkFieldsList.find(el => el.title === sortTitles.USERNAME)
				?.checked && (
				<li>
					<p>{chat.user[0].username}</p>
				</li>
			)}
			{checkFieldsList.find(el => el.title === sortTitles.MASTERNAME)
				?.checked && (
				<li>
					<p>{chat.masterName}</p>
				</li>
			)}
			{checkFieldsList.find(el => el.title === sortTitles.ISSUE)?.checked && (
				<li>
					<p>{chat.issue}</p>
				</li>
			)}
			{checkFieldsList.find(el => el.title === sortTitles.STATUS)?.checked && (
				<li
					style={{
						position: 'relative',
						backgroundColor:
							chat.status === ChatStatus.PENDING
								? 'rgba(168, 222, 18, 0.501)'
								: chat.status === ChatStatus.ACCEPTED
								? 'rgba(63, 205, 50, 0.615)'
								: '',
					}}
					onClick={event => onClickStatus(event)}
				>
					<p>{ChatStatusView[chat.status]}</p>
				</li>
			)}
			{checkFieldsList.find(el => el.title === sortTitles.DATE_UPDATED)
				?.checked && (
				<li className={mainCl.date__element}>
					<p>{dateFormat(chat.updatedAt, { withTime: true })}</p>
				</li>
			)}
			{checkFieldsList.find(el => el.title === sortTitles.DATE_CREATED)
				?.checked && (
				<li className={mainCl.date__element}>
					<p>{dateFormat(chat.createdAt, { withTime: true })}</p>
				</li>
			)}
		</ul>
	)
}

export default ChatModelRow
