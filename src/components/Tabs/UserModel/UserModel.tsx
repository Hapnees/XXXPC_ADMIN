import React, { useCallback, useEffect, useRef, useState } from 'react'
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

const UserModel = () => {
	const isFirst = useRef(true)

	const { isNeededRefresh } = useAppSelector(state => state.auth)
	const [currentPage, setCurrentPage] = useState(1)
	const searchRef = useRef<HTMLInputElement>(null)
	const [deleteUsers] = useDeleteUsersMutation()

	const [isOpenWindow, setIsOpenWindow] = useState(false)
	const [isEditWindow, setIsOpenEditWindow] = useState(false)

	const [checkList, setCheckList] = useState<number[]>([])

	const [isOpenPopupRoles, setIsOpenPopupRoles] = useState(false)
	const [isOpenPopupOnline, setIsOpenPopupOnline] = useState(false)

	const [sortTitle, setSortTitle] = useState<sortTitles>(sortTitles.USERNAME)
	const [roleFilter, setRoleFilter] = useState<Roles>()

	const [onlineFilter, setOnlineFilter] = useState<Online>()

	const [isViewsOrders, setIsViewOrders] = useState(false)
	const [currentUser, setCurrentUser] = useState<IUserUpdate>()

	const headers = useHeaders()

	const [getUsers, { data: getUsersData, isLoading }] = useLazyGetUsersQuery()

	const getAndSetUsers = useCallback(
		() =>
			getUsers({
				headers,
				st: sortTitlesSend[sortTitle as keyof typeof sortTitlesSend],
				rf: roleFilter,
				of:
					onlineFilter === Online.ONLINE
						? true
						: onlineFilter === Online.OFFLINE
						? false
						: undefined,
				search: searchRef.current?.value,
				page: currentPage,
			}),
		[getUsers, currentPage, sortTitle, roleFilter, onlineFilter]
	)

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
			setSortTitle(title)
		}
	}

	const getPlaceholder =
		sortTitle === sortTitles.USERNAME
			? 'Поиск по имени'
			: sortTitle === sortTitles.EMAIL
			? 'Поиск по почте'
			: sortTitle === sortTitles.PHONE
			? 'Поиск по № телефона'
			: ''

	const onClickDelete = () => {
		if (!checkList.length) return

		deleteUsers(checkList)
			.unwrap()
			.then(response => customToast.success(response.message))
	}

	const onClickUserOrders = (user: IUserUpdate) => {
		setCurrentUser(user)
		setIsViewOrders(true)
	}

	const onKeyDownEnter = (event: React.KeyboardEvent) => {
		if (event.key === 'Enter') {
			event.preventDefault()
			getAndSetUsers()
		}
	}

	// Получаем и сетаем пользователей
	useEffect(() => {
		if (isNeededRefresh) return

		getAndSetUsers()
	}, [isNeededRefresh, currentPage, sortTitle, roleFilter, onlineFilter])

	if (isLoading || isNeededRefresh) return <AdminLoader />

	return (
		<>
			{isViewsOrders ? (
				<OrderModel
					userId={currentUser?.id}
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
								placeholder={getPlaceholder}
								searchRef={searchRef}
								onKeyDownEnter={onKeyDownEnter}
								getDataWithParams={getAndSetUsers}
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
												sortTitle === el.title ||
												(el.title === sortTitles.ROLE &&
													(isOpenPopupRoles || roleFilter)) ||
												(el.title === sortTitles.ONLINE &&
													(isOpenPopupOnline || onlineFilter))
													? '#2d3748'
													: '',
										}}
									>
										<p>
											{el.title === sortTitles.ROLE && roleFilter
												? RolesView[roleFilter]
												: el.title === sortTitles.ONLINE && onlineFilter
												? OnlineView[onlineFilter]
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
													setFilterValue={setRoleFilter}
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
													setFilterValue={setOnlineFilter}
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
						currentPage={currentPage}
						setCurrentPage={setCurrentPage}
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
