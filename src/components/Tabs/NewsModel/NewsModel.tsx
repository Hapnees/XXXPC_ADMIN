import React, { useEffect, useState } from 'react'
import AdminFieldsPopup from '@components/AdminFieldsPopup/AdminFieldsPopup'
import SearchInputWithButton from '@components/SearchInputWithButton/SearchInputWithButton'
import { CreateButton, DeleteButton } from '@components/UI/Buttons'
import { CSSTransition } from 'react-transition-group'
import mainCl from '../tabs.module.scss'
import NewModelCreateWindow from './NewModelCreateWindow/NewModelCreateWindow'
import ModalWindow from '@components/UI/ModalWindow/ModalWindow'
import { IFieldMenuElement } from '@interfaces/fieldMenuElement.interface'
import {
	sortTitles,
	sortTitlesView,
} from './NewModelCreateWindow/NewsModel.interface'
import { useLazyGetNewsQuery } from '@api/news.api'
import NewsModelRow from './NewModelCreateWindow/NewsModelRow/NewsModelRow'
import { INewsUpdate } from '@interfaces/news/news-update.interface'
import { AdminLoader } from '@components/UI'
import { useAppSelector } from '@hooks/useAppSelector'

const NewsModel = () => {
	const [isWaiting, setIsWaiting] = useState(true)
	const { isNeededRefresh } = useAppSelector(state => state.auth)
	const [isOpen, setIsOpen] = useState(false)
	const [getNews, { data: newsData, isLoading }] = useLazyGetNewsQuery()

	const [currentNews, setCurrentNews] = useState<INewsUpdate | undefined>()

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

	const onClickNews = (news: INewsUpdate) => {
		setCurrentNews(news)
		setIsOpen(true)
	}

	const onClickCreate = () => {
		setCurrentNews(undefined)
		setIsOpen(true)
	}

	useEffect(() => {
		if (isNeededRefresh) return

		setIsWaiting(true)
		getNews()
			.unwrap()
			.then(() => {
				setIsWaiting(false)
			})
	}, [isNeededRefresh])

	if (isLoading || isWaiting) return <AdminLoader />

	return (
		<div className={mainCl.wrapper}>
			<div className={mainCl.panel}>
				<div className='flex items-center gap-2'>
					<p className='text-[20px]'>Новости</p>
					<CreateButton onClickCreate={onClickCreate} />
					<DeleteButton onClickDelete={() => {}} />
					{/* <SearchInputWithButton
						placeholder='По заголовку'
						searchRef={searchRef}
						onKeyDownEnter={onKeyDownEnter}
						getDataWithParams={getAndSetUsers}
					/> */}
					<AdminFieldsPopup
						ruFields={sortTitlesView}
						checkFields={checkFields}
						setCheckFields={setCheckFields}
					/>
				</div>
			</div>
			<div className={mainCl.container__menu} style={{ minWidth: 1800 }}>
				<ul className={mainCl.top__menu}>
					{checkFields
						.filter(el => el.checked)
						.map((el, idx) => (
							<li
								key={idx}
								style={{
									minWidth:
										el.title === sortTitles.TITLE
											? 300
											: el.title === sortTitles.BODY
											? 400
											: '',
								}}
							>
								<p
									style={{
										minWidth:
											el.title === sortTitles.TITLE
												? 300
												: el.title === sortTitles.BODY
												? 400
												: '',
									}}
								>
									{sortTitlesView[el.title as keyof typeof sortTitlesView]}
								</p>
							</li>
						))}
				</ul>
				<ul>
					{newsData?.map(el => (
						<li key={el.id}>
							<NewsModelRow
								news={el}
								checkList={checkList}
								checkFieldsList={checkFields}
								setCheckList={setCheckList}
								openNews={() => onClickNews(el)}
							/>
						</li>
					))}
				</ul>
			</div>

			<CSSTransition in={isOpen} timeout={300} classNames='popup' unmountOnExit>
				<ModalWindow shadow={false}>
					<NewModelCreateWindow
						toClose={() => setIsOpen(false)}
						news={currentNews}
					/>
				</ModalWindow>
			</CSSTransition>
		</div>
	)
}

export default NewsModel
