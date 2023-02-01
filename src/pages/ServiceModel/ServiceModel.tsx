import React, { FC, useCallback, useEffect, useState } from 'react'
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
import { useParams, useSearchParams } from 'react-router-dom'

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
	const [searchValue, setSearchValue] = useState('')
	const [searchParams, setSearchParams] = useSearchParams()

	const search = searchParams.get('search')
  const st = searchParams.get('st') || ''
  const sd = searchParams.get('sd') || ''
  const page =  parseInt(searchParams.get('page') || '1')

	const [currentService, setCurrentService] = useState<ServiceGetResponse>()
	const [isViewCreateWindow, setIsViewCreateWindow] = useState(false)

	const [getServices, { data: serviceData, isLoading }] =
		useLazyGetServicesQuery()

	const getServicesWithParams = useCallback(
		() =>
			getServices({
				search: search || '',
				st: sortTitlesSend[st as keyof typeof sortTitlesSend],
				sd,
				id: repairCardId,
				page,
			}),
		[getServices, repairCardId, searchParams]
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
			searchParams.set('search', searchValue)
			setSearchParams(searchParams)
		}
	}

	const onClickMenuElement = (title: sortTitles) => {
		if (title === st) {
      searchParams.delete('st')
      searchParams.delete('sd')
      setSearchParams(searchParams)
		} else if ([sortTitles.TITLE, sortTitles.PRICES].includes(title)) {
      searchParams.set('st', title)
      setSearchParams(searchParams)
      searchParams.delete('sd')
		}
	}

  const onClickPage = (page: number) => {
    searchParams.set('page', page.toString())
    setSearchParams(searchParams)
  }

	// Получаем сервисы
	useEffect(() => {

    setIsWaiting(false)
		if (
			(st !== '' && sd === '') ||
			!isUpdatedOnline
		)
			return

		setIsWaiting(true)
		getServicesWithParams()
			.unwrap()
			.then(() => {
				setIsWaiting(false)
			})
	}, [isUpdatedOnline, searchParams])

  useEffect(() => {
    if(!search) searchParams.delete('search')
    if(search && page !== 1) searchParams.set('page', '1')

    setSearchParams(searchParams)
  }, [searchParams]) 

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
									backgroundColor: el.title === st ? '#2d3748' : '',
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
								{sortTitlesView[el.title as keyof typeof sortTitlesView]}
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
				currentPage={page}
				setCurrentPage={onClickPage}
			/>
		</div>
	)
}

export default ServiceModel
