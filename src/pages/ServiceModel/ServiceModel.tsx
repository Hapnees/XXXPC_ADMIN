import React, { FC, useCallback, useEffect, useRef, useState } from 'react'
import {
	useDeleteServicesMutation,
	useLazyGetServicesQuery,
} from '@api/service.api'
import mainCl from '../tabs.module.scss'
import ServiceModelRow from './ServiceModelRow/ServiceModelRow'
import { AdminLoader } from '@components/UI'
import { CreateButton, DeleteButton } from '@components/UI/Buttons'
import BackButton from '@components/UI/Buttons/BackButton/BackButton'
import { CSSTransition } from 'react-transition-group'
import ModalWindow from '@components/UI/ModalWindow/ModalWindow'
import ServiceCreateWindow from './ServiceCreate/ServiceCreateWindow/ServiceCreateWindow'
import { ServiceGetResponse } from '@interfaces/service'
import customToast from '@utils/customToast'
import { IFieldMenuElement } from '@interfaces/fieldMenuElement.interface'
import AdminFieldsPopup from '@components/AdminFieldsPopup/AdminFieldsPopup'
import Pagination from '@components/Pagination/Pagination'
import { MdOutlineDoubleArrow } from 'react-icons/md'
import { SortDirect } from '@interfaces/order/order-sort.enum'
import {
	sortTitles,
	sortTitlesSend,
	sortTitlesView,
} from './ServiceModel.interface'
import SearchInputWithButton from '@components/SearchInputWithButton/SearchInputWithButton'
import { useAppSelector } from '@hooks/useAppSelector'
import { useParams } from 'react-router-dom'

interface IProps {
	setCurrentService?: React.Dispatch<
		React.SetStateAction<ServiceGetResponse | undefined>
	>
	toBack?: () => void
}

const ServiceModel: FC<IProps> = ({ toBack }) => {
	const params = useParams()
	const repairCardId = params.repairCardId
		? parseInt(params.repairCardId)
		: undefined
	const [isWaiting, setIsWaiting] = useState(true)

	const { isUpdatedOnline } = useAppSelector(state => state.auth)
	const searchRef = useRef<HTMLInputElement>(null)

	const [sortTitle, setSortTitle] = useState<sortTitles>()
	const [sortDirect, setSortDirect] = useState<SortDirect>()

	const [currentService, setCurrentService] = useState<ServiceGetResponse>()
	const [isViewCreateWindow, setIsViewCreateWindow] = useState(false)
	const [currentPage, setCurrentPage] = useState(1)

	const [getServices, { data: serviceData, isLoading }] =
		useLazyGetServicesQuery()

	const getServicesWithParams = useCallback(
		() =>
			getServices({
				search: searchRef.current?.value,
				st: sortTitlesSend[sortTitle as keyof typeof sortTitlesSend],
				sd: sortDirect,
				id: repairCardId,
				page: currentPage,
			}),
		[getServices, currentPage, sortDirect, sortTitle, repairCardId]
	)

	const [deleteServices] = useDeleteServicesMutation()
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

	const onClickDelete = () => {
		if (!checkList.length) return

		deleteServices(checkList)
			.unwrap()
			.then(response => customToast.success(response.message))
	}

	const onKeyDownEnter = (event: React.KeyboardEvent) => {
		if (event.key === 'Enter') {
			getServicesWithParams()
		}
	}

	const onClickMenuElement = (title: sortTitles) => {
		if (title === sortTitle) {
			setSortTitle(undefined)
			setSortDirect(undefined)
		} else if ([sortTitles.TITLE, sortTitles.PRICES].includes(title)) {
			setSortTitle(title)
			setSortDirect(undefined)
		}
	}

	// Получаем сервисы
	useEffect(() => {
		if (
			(sortTitle !== undefined && sortDirect === undefined) ||
			!isUpdatedOnline
		)
			return

		setIsWaiting(true)
		getServicesWithParams()
			.unwrap()
			.then(() => {
				setIsWaiting(false)
			})
	}, [currentPage, sortDirect, isUpdatedOnline, getServicesWithParams])

	if (isLoading || !isUpdatedOnline || isWaiting) return <AdminLoader />

	return (
		<div className={mainCl.wrapper}>
			<div className={mainCl.panel}>
				<div className='flex gap-2'>
					<p className='text-[20px]'>Услуги</p>
					{toBack && <BackButton onClickBack={toBack} />}
					<CreateButton
						onClickCreate={() => {
							setCurrentService(undefined)
							setIsViewCreateWindow(true)
						}}
					/>
					<DeleteButton onClickDelete={onClickDelete} />
				</div>

				<SearchInputWithButton
					placeholder='Поиск по названию'
					searchRef={searchRef}
					onKeyDown={onKeyDownEnter}
					getDataWithParams={getServicesWithParams}
				/>

				<AdminFieldsPopup
					ruFields={sortTitlesView}
					checkFields={checkFields.map(el => ({
						...el,
						title: el.title,
					}))}
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
								onClick={() => onClickMenuElement(el.title as sortTitles)}
								style={{
									backgroundColor: el.title === sortTitle ? '#2d3748' : '',
								}}
							>
								{el.title === sortTitle && (
									<MdOutlineDoubleArrow
										className={mainCl.arrow__up}
										style={{
											opacity: sortDirect === SortDirect.UP ? 1 : '',
										}}
										onClick={event => {
											event.stopPropagation()
											setSortDirect(SortDirect.UP)
										}}
									/>
								)}
								{sortTitlesView[el.title as keyof typeof sortTitlesView]}
								{el.title === sortTitle && (
									<MdOutlineDoubleArrow
										className={mainCl.arrow__down}
										style={{
											opacity: sortDirect === SortDirect.DOWN ? 1 : '',
										}}
										onClick={event => {
											event.stopPropagation()
											setSortDirect(SortDirect.DOWN)
										}}
									/>
								)}
							</li>
						))}
				</ul>
				<ul>
					{serviceData?.data.map(service => (
						<li
							key={service.id}
							onClick={() => {
								setCurrentService(service)
								setIsViewCreateWindow(true)
							}}
						>
							<ServiceModelRow
								checkFieldsList={checkFields}
								service={service}
								checkList={checkList}
								setCheckList={setCheckList}
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
					<ServiceCreateWindow
						toClose={() => setIsViewCreateWindow(false)}
						repairCardId={repairCardId}
						currentService={currentService}
						setCurrentService={setCurrentService}
					/>
				</ModalWindow>
			</CSSTransition>

			<Pagination
				totalCount={serviceData?.totalCount || 0}
				currentPage={currentPage}
				setCurrentPage={setCurrentPage}
			/>
		</div>
	)
}

export default ServiceModel
