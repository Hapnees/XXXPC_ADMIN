import Checkbox from '@components/UI/Checkbox/Checkbox'
import { IFieldMenuElement } from '@interfaces/fieldMenuElement.interface'
import {
	OrdersGetResponse,
	OrderStatus,
	OrderStatusView,
} from '@interfaces/order'
import { dateFormat, pricesFormat } from '@utils/index'
import React, { FC } from 'react'
import mainCl from '../../tabs.module.scss'
import { sortTitles } from '../OrderModel.interface'

interface IProps {
	order: OrdersGetResponse
	userId?: number
	setCheckList: React.Dispatch<React.SetStateAction<number[]>>
	checkList: number[]
	checkFieldsList: IFieldMenuElement[]
}

const OrderModelRow: FC<IProps> = ({
	order,
	userId,
	checkList,
	setCheckList,
	checkFieldsList,
}) => {
	const value = checkList.includes(order.id)

	const onChangeCheck = (event: any) => {
		event.stopPropagation()
		if (value) {
			const newCheckList = [...checkList].filter(el => el !== order.id)
			setCheckList(newCheckList)
			return
		}
		setCheckList(prev => [...prev, order.id])
	}

	return (
		<ul
			className={mainCl.menu}
			style={{
				backgroundColor: value ? 'rgba(177, 39, 39, 0.505)' : '',
			}}
		>
			<li
				className={`${mainCl.not_input} ${mainCl.short__element}`}
				onClick={event => onChangeCheck(event)}
			>
				<Checkbox isShow={value} setIsShow={event => onChangeCheck(event)} />
			</li>
			<li className={mainCl.short__element}>
				<p>{order.id}</p>
			</li>
			{checkFieldsList.find(el => el.title === sortTitles.COMMENT)?.checked && (
				<li>
					<p className='w-[180px] overflow-hidden text-ellipsis'>
						{order.comment}
					</p>
				</li>
			)}
			{checkFieldsList.find(el => el.title === sortTitles.STATUS)?.checked && (
				<li
					style={{
						backgroundColor:
							order.status === OrderStatus.PENDING
								? 'rgba(159, 149, 1, 0.706)'
								: order.status === OrderStatus.PROCESSING
								? 'rgba(168, 222, 18, 0.501)'
								: order.status === OrderStatus.COMPLETED
								? 'rgba(63, 205, 50, 0.615)'
								: order.status === OrderStatus.STOPPED
								? 'rgba(50, 197, 205, 0.615)'
								: order.status === OrderStatus.REJECTED
								? 'rgba(205, 50, 50, 0.615)'
								: '',
					}}
				>
					<p>{OrderStatusView[order.status as keyof typeof OrderStatusView]}</p>
				</li>
			)}
			{checkFieldsList.find(el => el.title === sortTitles.PRICE)?.checked && (
				<li>
					<div className='flex gap-2 w-[180px] overflow-hidden text-ellipsis px-2'>
						{order.price ? (
							<p>{order.price} руб</p>
						) : (
							order.priceRange?.length && (
								<p>{pricesFormat(order.priceRange)}</p>
							)
						)}
					</div>
				</li>
			)}

			{!userId &&
				checkFieldsList.find(el => el.title === sortTitles.NAME)?.checked && (
					<li>
						<p>{order?.User.username}</p>
					</li>
				)}
			{checkFieldsList.find(el => el.title === sortTitles.SERVICE_TITLE)
				?.checked && (
				<li>
					<p className='w-[180px] overflow-hidden text-ellipsis'>
						{order.service.title}
					</p>
				</li>
			)}
			{checkFieldsList.find(el => el.title === sortTitles.DATE_UPDATED)
				?.checked && (
				<li className={mainCl.date__element}>
					<p>{dateFormat(order.updatedAt, { withTime: true })}</p>
				</li>
			)}
			{checkFieldsList.find(el => el.title === sortTitles.DATE_CREATED)
				?.checked && (
				<li className={mainCl.date__element}>
					<p>{dateFormat(order.createdAt, { withTime: true })}</p>
				</li>
			)}
		</ul>
	)
}

export default OrderModelRow
