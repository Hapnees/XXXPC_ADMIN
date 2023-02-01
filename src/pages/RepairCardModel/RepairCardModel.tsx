import React, { useCallback, useEffect, useState } from 'react'
import {
	useAdminDeleteRepairCardMutation,
	useLazyAdminGetRepairCardsQuery,
} from '@api/repairCard.api'
import { AdminLoader } from '@components/UI/index'
import mainCl from '../tabs.module.scss'
import RepairCardModelRow from './RepairCardModelRow/RepairCardModelRow'
import { CreateButton, DeleteButton } from '@components/UI/Buttons'
import {
	RepairCardSlug,
	RepairCardSlugView,
} from '@interfaces/repair-card/repair-card-slug.enum'
import customToast from '@utils/customToast'
import { IFieldMenuElement } from '@interfaces/fieldMenuElement.interface'
import Pagination from '@components/Pagination/Pagination'
import AdminFieldsPopup from '@components/AdminFieldsPopup/AdminFieldsPopup'
import { sortTitles, sortTitlesView } from './RepairCardModel.interface'
import PopupWindow from '@components/PopupWindow/PopupWindow'
import { CSSTransition } from 'react-transition-group'
import { useAppSelector } from '@hooks/useAppSelector'
import { useActions } from '@hooks/useActions'
import { Tabs } from '@interfaces/tabs.interface'
import { useNavigate, useSearchParams } from 'react-router-dom'
import SearchInputWithButton from '@components/SearchInputWithButton/SearchInputWithButton'

export enum CurrentWindowRCM {
	LIST = 'LIST',
	CREATE_MODEL = 'CREATE_MODEL',
	CREATE_SERVICE = 'CREATE_SERVICE',
}

const RepairCardModel = () => {
	const navigate = useNavigate()
	const { addTab } = useActions()
	const [isWaiting, setIsWaiting] = useState(true)

	const [searchParams, setSearchParams] = useSearchParams()

	const { isUpdatedOnline } = useAppSelector(state => state.auth)
	const [isOpenPopup, setIsOpenPopup] = useState(false)

	const search = searchParams.get('search')
	const fs = searchParams.get('fs') || ''
  const page =  parseInt(searchParams.get('page') || '1')

	const [searchValue, setSearchValue] = useState('')
	const [checkList, setCheckList] = useState<number[]>([])

	const [deleteCard] = useAdminDeleteRepairCardMutation()

	const [getRepairCards, { data: cardsData, isLoading }] =
		useLazyAdminGetRepairCardsQuery()

	const getRepairCardsWithParams = useCallback(
		() =>
			getRepairCards({
				search: search || '',
				fs: fs as RepairCardSlug,
				page,
			}),
		[getRepairCards, searchParams]
	)

	const slugs = cardsData?.usedSlugs || []

	const [checkFields, setCheckFields] = useState<IFieldMenuElement[]>(
		Object.keys(sortTitles)
			.map(el => ({ title: el, checked: true }))
			.map(el => ({
				...el,
				checked:
					el.title === sortTitles.DATE_CREATED ||
					el.title === sortTitles.DATE_UPDATED
						? false
						: true,
			}))
	)

	const onClickCreate = () => {
		const newUrl = '/repair-cards/create'
		addTab({ title: `${Tabs.REPAIRCARD}/Новая карточка`, url: newUrl })
		navigate(newUrl)
	}

	const onClickDelete = () => {
		if (!checkList.length) return

		deleteCard(checkList)
			.unwrap()
			.then(response => customToast.success(response.message))
	}

  const onClickPage = (page: number) => {
    searchParams.set('page', page.toString())
    setSearchParams(searchParams)
  }

	// Получаем данные о карточках
	useEffect(() => {
		if (!isUpdatedOnline) return

		setIsWaiting(true)
		getRepairCardsWithParams()
			.unwrap()
			.then(() => {
				setIsWaiting(false)
			})
	}, [isUpdatedOnline, searchParams])

	const onClickFilterSlug = (slug: RepairCardSlug) => {
		searchParams.set('fs', slug || '')
		setSearchParams(searchParams)
	}

	const onKeyDownEnter = (event: React.KeyboardEvent) => {
		if (event.key === 'Enter') {
			event.preventDefault()
			searchParams.set('search', searchValue)
			setSearchParams(searchParams)
		}
	}

	useEffect(() => {
		if (!search) searchParams.delete('search')
		if (!fs) searchParams.delete('fs')

		setSearchParams(searchParams)
	}, [searchParams])

	return (
		<>
			{isLoading || !isUpdatedOnline || isWaiting ? (
				<AdminLoader />
			) : (
				<div className={mainCl.wrapper}>
					<div className={mainCl.panel}>
						<div className='flex gap-2'>
							<p className='text-[20px]'>Карточки ремонта</p>
							<CreateButton onClickCreate={onClickCreate} />
							<DeleteButton onClickDelete={onClickDelete} />
						</div>
						<div className='flex items-center gap-2'>
							<div className='w-[400px]'>
								<SearchInputWithButton
									value={searchValue}
									placeholder='Поиск по названию'
									setValue={setSearchValue}
									onKeyDown={onKeyDownEnter}
									eventSearch={() => {
										searchParams.set('search', searchValue)
										setSearchParams(searchParams)
									}}
								/>
							</div>
						</div>
						<AdminFieldsPopup
							ruFields={sortTitlesView}
							checkFields={checkFields}
							setCheckFields={setCheckFields}
						/>
					</div>
					<div className={mainCl.container__menu}>
						<ul className={mainCl.top__menu}>
							{checkFields
								.filter(el => el.checked)
								.map((el, idx) => (
									<li
										key={idx}
										style={{
											backgroundColor:
												el.title === sortTitles.CATEGORY && (isOpenPopup || fs)
													? '#2d3748'
													: '',
										}}
										onClick={() =>
											el.title === sortTitles.CATEGORY &&
											setIsOpenPopup(!isOpenPopup)
										}
									>
										<p className='overflow-hidden text-ellipsis'>
											{el.title === sortTitles.CATEGORY && fs
												? RepairCardSlugView[
														fs as keyof typeof RepairCardSlugView
												  ]
												: sortTitlesView[
														el.title as keyof typeof sortTitlesView
												  ]}
										</p>

										{el.title === sortTitles.CATEGORY && (
											<CSSTransition
												in={isOpenPopup}
												timeout={300}
												classNames='popup'
												unmountOnExit
											>
												<PopupWindow
													ruArray={
														slugs?.map(
															el =>
																RepairCardSlugView[
																	el as keyof typeof RepairCardSlugView
																]
														) || []
													}
													array={slugs || []}
													setFilterValue={onClickFilterSlug}
												/>
											</CSSTransition>
										)}
									</li>
								))}
						</ul>
						<ul className={mainCl.content__menu}>
							{cardsData?.data.map(card => (
								<li key={card.id}>
									<RepairCardModelRow
										checkFieldsList={checkFields}
										card={card}
										checkList={checkList}
										setCheckList={setCheckList}
									/>
								</li>
							))}
						</ul>
					</div>

					<Pagination
						currentPage={page}
						setCurrentPage={onClickPage}
						totalCount={cardsData?.totalCount || 0}
					/>
				</div>
			)}
		</>
	)
}

export default RepairCardModel
