import Checkbox from '@components/UI/Checkbox/Checkbox'
import { IFieldMenuElement } from '@interfaces/fieldMenuElement.interface'
import { ServiceGetResponse } from '@interfaces/service'
import { dateFormat, pricesFormat } from '@utils/index'
import React, { FC } from 'react'
import mainCl from '../../tabs.module.scss'
import { sortTitles } from '../ServiceModel.interface'

interface IProps {
	service: ServiceGetResponse
	setCheckList: React.Dispatch<React.SetStateAction<number[]>>
	checkFieldsList: IFieldMenuElement[]
	checkList: number[]
}

const ServiceModelRow: FC<IProps> = ({
	service,
	checkList,
	setCheckList,
	checkFieldsList,
}) => {
	const value = checkList.includes(service.id)

	const onChangeCheck = (event: any) => {
		event.stopPropagation()
		if (value) {
			const newCheckList = [...checkList].filter(el => el !== service.id)
			setCheckList(newCheckList)
			return
		}
		setCheckList(prev => [...prev, service.id])
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
				<p>{service.id}</p>
			</li>
			{checkFieldsList.find(el => el.title === sortTitles.TITLE)?.checked && (
				<li>
					<p className='w-[180px] overflow-hidden text-ellipsis'>
						{service.title}
					</p>
				</li>
			)}
			{checkFieldsList.find(el => el.title === sortTitles.PRICES)?.checked && (
				<li>
					<p className='w-[180px] overflow-hidden text-ellipsis'>
						{pricesFormat(service.prices)}
					</p>
				</li>
			)}
			{checkFieldsList.find(el => el.title === sortTitles.ORDERS)?.checked && (
				<li className={mainCl.special}>
					<p
						style={{
							backgroundColor: value ? 'rgba(135, 30, 30, 0.505)' : '#2d3748',
						}}
					>
						{service._count.Order}
					</p>
					<p
						style={{
							backgroundColor: value ? 'rgba(177, 39, 39, 0.505)' : '#475264',
						}}
					>
						Заказы
					</p>
				</li>
			)}
			{checkFieldsList.find(el => el.title === sortTitles.DATE_UPDATED)
				?.checked && (
				<li className={mainCl.date__element}>
					<p>{dateFormat(service.updatedAt, { withTime: true })}</p>
				</li>
			)}
			{checkFieldsList.find(el => el.title === sortTitles.DATE_CREATED)
				?.checked && (
				<li className={mainCl.date__element}>
					<p>{dateFormat(service.createdAt, { withTime: true })}</p>
				</li>
			)}
		</ul>
	)
}

export default ServiceModelRow
