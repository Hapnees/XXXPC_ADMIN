import React, { useEffect, useState } from 'react'
import { useActions, useAppSelector } from '@hooks/index'
import { Tabs, TabsUrl } from '@interfaces/tabs.interface'
import cl from './OpenModelForm.module.scss'
import { FaUser } from 'react-icons/fa'
import { BsFillGearFill, BsChatSquareDotsFill } from 'react-icons/bs'
import { RiPencilFill, RiSdCardFill } from 'react-icons/ri'
import { BiNews } from 'react-icons/bi'
import { io, Socket } from 'socket.io-client'
import { useLazyGetChatRequstsCountQuery } from '@api/chat.api'
import customToast from '@utils/customToast'
import { useNavigate } from 'react-router-dom'

const OpenModelForm = () => {
	const navgite = useNavigate()

	const [getChatRequestsCount, { data: chatReqeustsCount }] =
		useLazyGetChatRequstsCountQuery()

	const [socket, setSocket] = useState<Socket>()
	const { setCurrentTab, addTab } = useActions()
	const { isNeededRefresh } = useAppSelector(state => state.auth)
	const { tabs } = useAppSelector(state => state.tab)

	const styleBG = (tab: Tabs) => ({
		backgroundColor: tabs.some(el => el.title === tab) ? '#10131b' : '',
	})
	const styleColor = (tab: Tabs) => ({
		color: tabs.some(el => el.title === tab) ? '#79849f' : '',
	})

	const onClickTab = (newTab: Tabs) => {
		if (tabs.some(tab => tab.title === newTab)) {
			setCurrentTab({ title: newTab, url: TabsUrl[newTab] })
			navgite(TabsUrl[newTab])
			return
		}

		addTab({ title: newTab, url: TabsUrl[newTab] })
		navgite(TabsUrl[newTab])
		setCurrentTab({ title: newTab, url: TabsUrl[newTab] })
	}

	const chatReqeustListener = (data: { isSendedRequest: boolean }) => {
		if (!data.isSendedRequest) return

		getChatRequestsCount()
			.unwrap()
			.then(() => {
				customToast.info('Новый запрос на чат')
			})
	}

	useEffect(() => {
		if (isNeededRefresh) return

		getChatRequestsCount()
	}, [isNeededRefresh])

	useEffect(() => {
		const newSocket = io('http://localhost:8001')
		setSocket(newSocket)
	}, [setSocket])

	useEffect(() => {
		socket?.on('chat-request', chatReqeustListener)

		//TODO: REWORK!
		return () => {
			socket?.off('chat-request')
		}
	}, [chatReqeustListener])

	return (
		<div className={cl.wrapper}>
			<div className={cl.container}>
				<div className={cl.top__content}>
					<p className='text-[25px] font-semibold tracking-wide text-center'>
						Открыть модель
					</p>
				</div>

				<div className={cl.container__menu}>
					<ul className={cl.menu}>
						<li
							onClick={() => onClickTab(Tabs.USER)}
							style={styleBG(Tabs.USER)}
						>
							<div>
								<FaUser className={cl.icon} style={styleColor(Tabs.USER)} />
								<p style={styleColor(Tabs.USER)}>Пользователи</p>
							</div>
						</li>
						<li
							onClick={() => onClickTab(Tabs.REPAIRCARD)}
							style={styleBG(Tabs.REPAIRCARD)}
						>
							<div>
								<RiSdCardFill
									className={cl.icon}
									style={styleColor(Tabs.REPAIRCARD)}
								/>
								<p style={styleColor(Tabs.REPAIRCARD)}>Карточки ремонта</p>
							</div>
						</li>
						<li
							onClick={() => onClickTab(Tabs.SERVICE)}
							style={styleBG(Tabs.SERVICE)}
						>
							<div>
								<BsFillGearFill
									className={cl.icon}
									style={styleColor(Tabs.SERVICE)}
								/>
								<p style={styleColor(Tabs.SERVICE)}>Услуги</p>
							</div>
						</li>
						<li
							onClick={() => onClickTab(Tabs.ORDER)}
							style={styleBG(Tabs.ORDER)}
						>
							<div>
								<RiPencilFill
									className={cl.icon}
									style={styleColor(Tabs.ORDER)}
								/>
								<p style={styleColor(Tabs.ORDER)}>Заказы</p>
							</div>
						</li>
						<li
							onClick={() => onClickTab(Tabs.NEWS)}
							style={styleBG(Tabs.NEWS)}
						>
							<div>
								<BiNews className={cl.icon} style={styleColor(Tabs.NEWS)} />
								<p style={styleColor(Tabs.NEWS)}>Новости</p>
							</div>
						</li>
						<li
							onClick={() => onClickTab(Tabs.CHAT)}
							style={styleBG(Tabs.CHAT)}
						>
							<div>
								<div className={cl.icon__chat__container}>
									<BsChatSquareDotsFill
										className={cl.icon__chat}
										style={styleColor(Tabs.CHAT)}
									/>
									<p className={cl.chat__counter}>{chatReqeustsCount}</p>
								</div>
								<p style={styleColor(Tabs.CHAT)}>Чаты</p>
							</div>
						</li>
					</ul>
				</div>
			</div>
		</div>
	)
}

export default OpenModelForm
