import React, { useCallback, useEffect, useState } from 'react'
import { useHeaders } from '@hooks/useHeaders'
import { AdminLoader } from '@components/UI'
import mainCl from '../tabs.module.scss'
import UserModelRow from './UserModelRow/UserModelRow'
import { useDeleteUsersMutation, useLazyGetUsersQuery } from '@api/user.api'
import { Roles, RolesView } from '@interfaces/roles.interface'
import { CreateButton, DeleteButton } from '@components/UI/Buttons'
import OrderModel from '../OrderModel/OrderModel'
import { IUserUpdate } from '@interfaces/user'
import { IFieldMenuElement } from '@interfaces/fieldMenuElement.interface'
import Pagination from '@components/Pagination/Pagination'
import { useAppSelector } from '@hooks/useAppSelector'
import AdminFieldsPopup from '@components/AdminFieldsPopup/AdminFieldsPopup'
import {
	sortTitles,
	sortTitlesView,
	sortTitlesSend,
	OnlineView,
	Online,
} from './UserModel.interface'
import SearchInputWithButton from '@components/SearchInputWithButton/SearchInputWithButton'
import PopupWindow from '@components/PopupWindow/PopupWindow'
import { CSSTransition } from 'react-transition-group'
import UserCreateWindow from './UserCreateWindow/UserCreateWindow'
import ModalWindow from '@components/UI/ModalWindow/ModalWindow'
import customToast from '@utils/customToast'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useActions } from '@hooks/useActions'
import { Tabs, TabsUrl } from '@interfaces/tabs.interface'

const UserModel = () => {
	const navigate = useNavigate()
	const { addTab } = useActions()
	const [isWaiting, setIsWaiting] = useState(true)

	const location = useLocation()
	const [searchParams, setSearchParams] = useSearchParams()

	const search = searchParams.get('search') || ''
	const st = searchParams.get('st')
	const rf = searchParams.get('rf') || ''
	const of = searchParams.get('of') || ''
  const page =  parseInt(searchParams.get('page') || '1')

	const { isUpdatedOnline } = useAppSelector(state => state.auth)

	const [searchValue, setSearchValue] = useState('')
	const [deleteUsers] = useDeleteUsersMutation()

	const [isOpenWindow, setIsOpenWindow] = useState(false)
	const [isEditWindow, setIsOpenEditWindow] = useState(false)

	const [checkList, setCheckList] = useState<number[]>([])

	const [isOpenPopupRoles, setIsOpenPopupRoles] = useState(false)
	const [isOpenPopupOnline, setIsOpenPopupOnline] = useState(false)

	const [isViewsOrders, setIsViewOrders] = useState(false)
	const [currentUser, setCurrentUser] = useState<IUserUpdate>()

	const headers = useHeaders()

	const [getUsers, { data: getUsersData, isLoading }] = useLazyGetUsersQuery()

	const getAndSetUsers = useCallback(() => {
		return getUsers({
			headers,
			st: st
				? sortTitlesSend[st as keyof typeof sortTitlesSend]
				: sortTitlesSend.USERNAME,
			rf,
			of:
				of === Online.ONLINE ? true : of === Online.OFFLINE ? false : undefined,
			search,
			page,
		})
	}, [getUsers, searchParams])

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

	const onClickMenuElement = (title: sortTitles) => {
		if (title === sortTitles.ROLE) setIsOpenPopupRoles(!isOpenPopupRoles)
		else if (title === sortTitles.ONLINE)
			setIsOpenPopupOnline(!isOpenPopupOnline)

		if (Object.keys(sortTitlesSend).includes(title)) {
			searchParams.set('st', title)
			setSearchParams(searchParams)
		}
	}

	const getPlaceholder =
		searchParams.get('st') === sortTitles.USERNAME
			? 'Поиск по имени'
			: searchParams.get('st') === sortTitles.EMAIL
			? 'Поиск по почте'
			: searchParams.get('st') === sortTitles.PHONE
			? 'Поиск по № телефона'
			: 'Поиск по имени'

	const onClickDelete = () => {
		if (!checkList.length) return

		deleteUsers(checkList)
			.unwrap()
			.then(response => customToast.success(response.message))
	}

	const onClickUserOnline = (isOnline: Online) => {
		searchParams.set('of', isOnline || '')
		setSearchParams(searchParams)
	}

	const onClickUserRoles = (role: Roles) => {
		searchParams.set('rf', role || '')
		setSearchParams(searchParams)
	}

	const onClickUserOrders = (user: IUserUpdate) => {
		const newUrl = `/orders/userId/${user.id}`
		navigate(newUrl)
		addTab({
			title: `${Tabs.USER}/${user.username}/${Tabs.ORDER}`,
			url: newUrl,
		})
	}

	const onKeyDownEnter = (event: React.KeyboardEvent) => {
		if (event.key === 'Enter') {
			event.preventDefault()
			searchParams.set('search', searchValue)
			setSearchParams(searchParams)
			if (!searchValue) {
				searchParams.delete('st')
				setSearchParams(searchParams)
			} else if (!st) {
				searchParams.set('st', sortTitles.USERNAME)
				setSearchParams(searchParams)
			}
		}
	}

  const onClickPage = (page: number) => {
    searchParams.set('page', page.toString())
    setSearchParams(searchParams)
  }

	useEffect(() => {
		addTab({
			title: Tabs.USER,
			url: TabsUrl[Tabs.USER],
			params: location.search !== '?search=' ? location.search : '',
		})
	}, [location.search])

	useEffect(() => {
		if (!isUpdatedOnline) return

		setSearchValue(search || '')

		setIsWaiting(true)
		getAndSetUsers()
			.unwrap()
			.then(() => {
				setIsWaiting(false)
			})
	}, [searchParams, isUpdatedOnline])

	useEffect(() => {
		if (!search) searchParams.delete('search')
		if (!st) searchParams.delete('st')
		if (!rf) searchParams.delete('rf')
		if (!of) searchParams.delete('of')
    if(search && page !== 1) searchParams.set('page', '1')

    setSearchParams(searchParams)

		setSearchParams(searchParams)
	}, [searchParams])

	if (isLoading || !isUpdatedOnline || isWaiting) return <AdminLoader />

	return (
		<>
			{isViewsOrders ? (
				<OrderModel
					username={currentUser?.username}
					toBack={() => setIsViewOrders(false)}
				/>
			) : (
				<div className={mainCl.wrapper}>
					<div className={mainCl.panel}>
						<div className='flex items-center gap-2'>
							<p className='text-[20px]'>Пользователи</p>
							<CreateButton
								onClickCreate={() => {
									setIsOpenEditWindow(false)
									setCurrentUser(undefined)
									setIsOpenWindow(true)
								}}
							/>
							<DeleteButton onClickDelete={onClickDelete} />
							<SearchInputWithButton
								value={searchValue}
								setValue={setSearchValue}
								placeholder={getPlaceholder}
								onKeyDown={onKeyDownEnter}
								eventSearch={() => {
									searchParams.set('search', searchValue)
									setSearchParams(searchParams)
								}}
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
									<li
										key={idx}
										onClick={() => onClickMenuElement(el.title as sortTitles)}
										style={{
											backgroundColor:
												st === el.title ||
												(el.title === sortTitles.ROLE &&
													(isOpenPopupRoles || rf)) ||
												(el.title === sortTitles.ONLINE &&
													(isOpenPopupOnline || of))
													? '#2d3748'
													: '',
										}}
									>
										<p>
											{el.title === sortTitles.ROLE && rf
												? RolesView[rf as keyof typeof RolesView]
												: el.title === sortTitles.ONLINE && of
												? OnlineView[of as keyof typeof OnlineView]
												: sortTitlesView[
														el.title as keyof typeof sortTitlesView
												  ]}
										</p>

										{el.title === sortTitles.ROLE && (
											<CSSTransition
												in={isOpenPopupRoles}
												timeout={300}
												classNames='popup'
												unmountOnExit
											>
												<PopupWindow
													ruArray={Object.keys(Roles)
														.filter(el => el !== Roles.VISITOR)
														.map(el => RolesView[el as keyof typeof RolesView])}
													array={Object.keys(Roles).filter(
														el => el !== Roles.VISITOR
													)}
													setFilterValue={onClickUserRoles}
												/>
											</CSSTransition>
										)}

										{el.title === sortTitles.ONLINE && (
											<CSSTransition
												in={isOpenPopupOnline}
												timeout={300}
												classNames='popup'
												unmountOnExit
											>
												<PopupWindow
													ruArray={Object.keys(Online).map(
														el => OnlineView[el as keyof typeof OnlineView]
													)}
													array={Object.keys(Online)}
													setFilterValue={onClickUserOnline}
												/>
											</CSSTransition>
										)}
									</li>
								))}
						</ul>
						<ul>
							{getUsersData?.data?.map(user => (
								<li key={user.id} onClick={() => setCurrentUser(user)}>
									<UserModelRow
										user={user}
										key={user.id}
										setCheckList={setCheckList}
										checkList={checkList}
										checkFieldsList={checkFields}
										onClickUserOrders={() => onClickUserOrders(user)}
										openEditWindow={() => {
											setIsOpenEditWindow(true)
											setIsOpenWindow(true)
										}}
									/>
								</li>
							))}
						</ul>
					</div>

					<Pagination
						totalCount={getUsersData?.totalCount || 0}
						currentPage={page}
						setCurrentPage={onClickPage}
					/>
					<CSSTransition
						in={isOpenWindow}
						timeout={300}
						classNames='popup'
						unmountOnExit
					>
						<ModalWindow>
							<UserCreateWindow
								user={currentUser}
								isEdit={isEditWindow}
								toBack={() => setIsOpenWindow(false)}
							/>
						</ModalWindow>
					</CSSTransition>
				</div>
			)}
		</>
	)
}

export default UserModel
