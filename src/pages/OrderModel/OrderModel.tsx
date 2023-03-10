import React, { FC, useCallback, useEffect, useState } from 'react'
import { useLazyGetOrdersQuery, useOrderDeleteMutation } from '@api/order.api'
import { AdminLoader } from '@components/UI'
import mainCl from '../tabs.module.scss'
import BackButton from '@components/UI/Buttons/BackButton/BackButton'
import { DeleteButton } from '@components/UI/Buttons'
import OrderModelRow from './OrderModelRow/OrderModelRow'
import ModalWindow from '@components/UI/ModalWindow/ModalWindow'
import { CSSTransition } from 'react-transition-group'
import OrderModelCreateWindow from './OrderModelCreateWindow/OrderModelCreateWindow'
import {
	OrdersGetResponse,
	OrderStatus,
	OrderStatusView,
} from '@interfaces/order'
import customToast from '@utils/customToast'
import { IFieldMenuElement } from '@interfaces/fieldMenuElement.interface'
import AdminFieldsPopup from '@components/AdminFieldsPopup/AdminFieldsPopup'
import Pagination from '@components/Pagination/Pagination'
import {
	sortTitles,
	sortTitlesSend,
	sortTitlesView,
} from './OrderModel.interface'
import { SortDirect } from '@interfaces/order/order-sort.enum'
import { MdOutlineDoubleArrow } from 'react-icons/md'
import SearchInputWithButton from '@components/SearchInputWithButton/SearchInputWithButton'
import { useAppSelector } from '@hooks/useAppSelector'
import ChangeStatusWindow from './ChangeStatusWindow/ChangeStatusWindow'
import { useParams, useSearchParams } from 'react-router-dom'

interface IProps {
	username?: string
	toBack?: () => void
}

const OrderModel: FC<IProps> = ({ username, toBack }) => {
	const params = useParams()
	const userId = params.userId ? parseInt(params.userId) : undefined

  const [searchParams, setSearchParams] = useSearchParams()
	const [isWaiting, setIsWaiting] = useState(true)
	const { isUpdatedOnline } = useAppSelector(state => state.auth)

	const [isOpenChangeStatus, setIsOpenChangeStatus] = useState(false)

	const search = searchParams.get('search') || ''
  const st = searchParams.get('st') || ''
  const sd = searchParams.get('sd') || ''
  const fs = searchParams.get('fs') || ''
  const page =  parseInt(searchParams.get('page') || '1')

	const [searchValue, setSearchValue] = useState('')
	const [getOrders, { data: ordersData, isLoading }] = useLazyGetOrdersQuery()

	const getOrdersWithParams = useCallback(
		() =>
			getOrders({
				id: userId,
				search,
				st: sortTitlesSend[st as keyof typeof sortTitlesSend],
				sd: sd as SortDirect,
				fs: fs as OrderStatus,
				page,
			}),
		[getOrders, searchParams]
	)

	const [deleteOrders] = useOrderDeleteMutation()

	const [isViewCreateWindow, setIsViewCreateWindow] = useState(false)
	const [currentOrder, setCurrentOrder] = useState<OrdersGetResponse>()
	const [checkList, setCheckList] = useState<number[]>([])

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

	const onClickOrder = (order: OrdersGetResponse) => {
		setIsViewCreateWindow(true)
		setCurrentOrder(order)
	}

	const onClickDelete = () => {
		if (!checkList.length) return

		deleteOrders(checkList)
			.unwrap()
			.then(response => customToast.success(response.message))
	}

	const onKeyDownEnter = (event: React.KeyboardEvent) => {
		if (event.key === 'Enter') {
      searchParams.set('search', searchValue)
      setSearchParams(searchParams)
		}
	}

	const onClickMenuElement = (title: sortTitles) => {
		if (title === st) {
      searchParams.delete('st')
      searchParams.delete('sd')
      setSearchParams(searchParams)
		} else if (title === sortTitles.PRICE) {
      searchParams.set('st', title)
      searchParams.delete('sd')
      setSearchParams(searchParams)
		} else if (title === sortTitles.STATUS) {
			setIsOpenChangeStatus(!isOpenChangeStatus)
		}
	}

  const onClickFilterStatus = (status: OrderStatus | undefined) => {
    searchParams.set('fs', status || '')
    setSearchParams(searchParams)
  }

  const onClickPage = (page: number) => {
    searchParams.set('page', page.toString())
    setSearchParams(searchParams)
  }

	// ???????????????? ????????????
	useEffect(() => {
		if (!isUpdatedOnline) return

		if (st !== '' && sd === ''){
      return
    }

		setIsWaiting(true)
		getOrdersWithParams()
			.unwrap()
			.then(() => {
				setIsWaiting(false)
			})
	}, [isUpdatedOnline, searchParams])

	if (isLoading || !isUpdatedOnline || isWaiting) return <AdminLoader />

	return (
		<div className={mainCl.wrapper}>
			{!!username && (
				<div className='flex gap-2 text-[20px] mb-4 ml-2'>
					<p>????????????????????????</p>
					<p className='text-[#7DD3FC]'>{username}</p>
				</div>
			)}
			<div className={mainCl.panel}>
				<div className='flex gap-2'>
					<p className='text-[20px]'>????????????</p>
					{toBack && <BackButton onClickBack={toBack} />}
					<DeleteButton onClickDelete={onClickDelete} />
				</div>

				<SearchInputWithButton
					placeholder='?????????? ???? ??????????????????????'
					value={searchValue}
					setValue={setSearchValue}
					onKeyDown={onKeyDownEnter}
					eventSearch={() => {
            searchParams.set('search', searchValue)
            setSearchParams(searchParams)
          }}
				/>

				<AdminFieldsPopup
					ruFields={sortTitlesView}
					checkFields={
						userId
							? checkFields.filter(el => el.title !== sortTitles.NAME)
							: checkFields
					}
					setCheckFields={setCheckFields}
				/>
			</div>

			<div className={mainCl.container__menu}>
				<ul className={mainCl.top__menu}>
					{checkFields
						.filter(el => el.checked)
						.filter(el => {
							if (userId) return el.title !== sortTitles.NAME
							return true
						})
						.map((el, idx) => (
							<li
								key={idx}
								onClick={() => onClickMenuElement(el.title as sortTitles)}
								style={{
									backgroundColor:
										el.title === st ||
										(el.title === sortTitles.STATUS && !! fs)
											? '#2d3748'
											: '',
								}}
							>
								{el.title === st && (
									<MdOutlineDoubleArrow
										className={mainCl.arrow__up}
										style={{
											opacity: sd === SortDirect.UP ? 1 : '',
										}}
										onClick={event => {
											event.stopPropagation()
                      searchParams.set('sd', SortDirect.UP)
                      setSearchParams(searchParams)
										}}
									/>
								)}
								{el.title === sortTitles.STATUS && !!fs ? (
									<p>
										{
											OrderStatusView[
												fs as keyof typeof OrderStatusView
											]
										}
									</p>
								) : (
									<p>
										{sortTitlesView[el.title as keyof typeof sortTitlesView]}
									</p>
								)}
								{el.title === st && (
									<MdOutlineDoubleArrow
										className={mainCl.arrow__down}
										style={{
											opacity: sd === SortDirect.DOWN ? 1 : '',
										}}
										onClick={event => {
											event.stopPropagation()
                      searchParams.set('sd', SortDirect.DOWN)
                      setSearchParams(searchParams)
										}}
									/>
								)}
							</li>
						))}
				</ul>
				<ul className={mainCl.content__menu}>
					{ordersData?.data.map(order => (
						<li key={order.id} onClick={() => onClickOrder(order)}>
							<OrderModelRow
								checkFieldsList={
									userId
										? checkFields.filter(el => el.title !== sortTitlesView.NAME)
										: checkFields
								}
								checkList={checkList}
								setCheckList={setCheckList}
								userId={userId}
								order={order}
							/>
						</li>
					))}
				</ul>
			</div>
			<CSSTransition
				in={isViewCreateWindow}
				timeout={300}
				classNames='popup'
				unmountOnExit
			>
				<ModalWindow>
					{currentOrder && (
						<OrderModelCreateWindow
							order={currentOrder}
							username={username}
							toClose={() => setIsViewCreateWindow(false)}
						/>
					)}
				</ModalWindow>
			</CSSTransition>

			<Pagination
				currentPage={page}
				setCurrentPage={onClickPage}
				totalCount={ordersData?.totalCount || 0}
			/>
			<CSSTransition
				in={isOpenChangeStatus}
				timeout={300}
				classNames='popup'
				unmountOnExit
			>
				<ModalWindow>
					<ChangeStatusWindow
						setStatus={onClickFilterStatus}
						toClose={() => setIsOpenChangeStatus(false)}
					/>
				</ModalWindow>
			</CSSTransition>
		</div>
	)
}
export default OrderModel
