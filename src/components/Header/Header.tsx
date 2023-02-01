import React, { useRef, useState } from 'react'
import { MdKeyboardArrowDown } from 'react-icons/md'
import PopupWindow from './PopupWindow/PopupWindow'
import { CSSTransition } from 'react-transition-group'
import { useAuth, useAppSelector, useActions } from '@hooks/index'
import { Roles } from '@interfaces/roles.interface'
import { HiPlus } from 'react-icons/hi'
import { ITab, Tabs } from '@interfaces/tabs.interface'
import { IoClose } from 'react-icons/io5'
import { Link, useNavigate } from 'react-router-dom'
import cl from './Header.module.scss'
import { tabTitleFormat } from '@utils/tab-title.formatter'

const Header = () => {
	const [isOpen, setIsOpen] = useState(false)
	const ref = useRef<HTMLUListElement>(null)
	const isAuth = useAuth(Roles.ADMIN)
	const { tabs, currentTab } = useAppSelector(state => state.tab)
	const { setCurrentTab, removeTab } = useActions()
	const {
		user: { username },
	} = useAppSelector(state => state.auth)

	const navigate = useNavigate()

	const onClose = (event: React.MouseEvent, tab: ITab) => {
		event.preventDefault()
		event.stopPropagation()

		removeTab(tab)
		const index = tabs.indexOf(tab)
		const nextTab =
			tabs.length > 1
				? index >= 1
					? tabs[index - 1]
					: tabs[index + 1]
				: { title: Tabs.MODELS, url: '/' }

		setCurrentTab(nextTab)
		navigate(nextTab.url)
	}

	return (
		<div className={cl.wrapper}>
			<div className='flex gap-6 h-full'>
				<p className={cl.title}>админ панель</p>

				<div className='flex grow'>
					<div
						className='h-full flex items-center'
						style={{
							backgroundColor:
								currentTab.title === Tabs.MODELS ? '#2d3748' : '',
						}}
					>
						<Link
							to='/'
							onClick={() => {
								setCurrentTab({ title: Tabs.MODELS, url: '/' })
							}}
						>
							<HiPlus className={cl.plus} />
						</Link>
					</div>

					<ul className={cl.menu}>
						{tabs.map(tab => (
							<li key={tab.title}>
								<Link
									to={{
										pathname: tab.url,
										search: tab.params ? `${tab.params}` : '',
									}}
									className={cl.tab__link}
									onClick={() => {
										setCurrentTab({
											title: tab.title,
											url: tab.url,
											params: tab.params,
										})
									}}
								>
									<div
										className={cl.tab}
										style={{
											backgroundColor:
												currentTab.title === tab.title ? '#2d3748' : '',
										}}
									>
										<p className='whitespace-nowrap'>
											{tabTitleFormat(tab.title)}
										</p>
										<IoClose
											className='p-1'
											size={30}
											onClick={event => onClose(event, tab)}
										/>
									</div>
								</Link>
							</li>
						))}
					</ul>
				</div>
			</div>

			{isAuth && (
				<div onClick={() => setIsOpen(!isOpen)}>
					<div
						className={cl.popup__button}
						style={{
							borderBottomLeftRadius: `${isOpen ? '0' : '6px'}`,
							borderBottomRightRadius: `${isOpen ? '0' : '6px'}`,
						}}
					>
						<p>{username}</p>
						<MdKeyboardArrowDown
							size={20}
							className={cl.arrow__icon}
							style={{ transform: `rotate(${isOpen ? 180 : 0}deg)` }}
						/>
					</div>
					<CSSTransition
						in={isOpen}
						timeout={300}
						classNames='popup'
						nodeRef={ref}
						unmountOnExit
					>
						<PopupWindow ref={ref} />
					</CSSTransition>
				</div>
			)}
		</div>
	)
}

export default Header
