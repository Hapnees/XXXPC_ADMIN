import React, { FC, useEffect, useState } from 'react'
import cl from './RepairCardCreate.module.scss'
import { BsPlusLg } from 'react-icons/bs'
import { CSSTransition } from 'react-transition-group'
import MenuCreate from '../MenuCreate/MenuCreate'
import MenuElement from './MenuElement/MenuElement'
import { BsArrowRight } from 'react-icons/bs'
import { BsGearFill } from 'react-icons/bs'
import { useAdminGetRepairCardDetailsQuery } from '@api/repairCard.api'
import { AdminLoader } from '@components/UI'
import { changeIcon, clickDeleteMenu, makeMenusForRequest } from './utils'
import { useUpdateCard } from './hooks/useUpdateCard'
import { useCreateCard } from './hooks/useCreateCard'
import { CurrentWindowRCM } from '../RepairCardModel'
import {
	IRepairCardCreate,
	IRepairCardMenu,
	RepairCardsGetResponse,
	RepairCardSlug,
	RepairCardSlugView,
} from '@interfaces/repair-card'
import { objectCompare } from '@utils/objectCompare.util'
import customToast from '@utils/customToast'
import ConfirmBlock from './ConfirmBlock/ConfirmBlock'

// FIXME: REWORK UPDATECARD

interface IProps {
	id: number
	setCurrentWindow: React.Dispatch<React.SetStateAction<CurrentWindowRCM>>
	repairCardModelRefetch: () => void
	slugs: {
		value: RepairCardSlug
		label: RepairCardSlugView
	}[]
}

const RepairCardCreate: FC<IProps> = ({
	id,
	setCurrentWindow,
	repairCardModelRefetch,
	slugs,
}) => {
	const isEdit = !!id

	const {
		data: cardData,
		isLoading: isLoadingCardData,
		refetch,
	} = useAdminGetRepairCardDetailsQuery(id, { skip: !isEdit })
	const buttonTitle = isEdit ? 'Обновить' : 'Создать'

	const [slug, setSlug] = useState<RepairCardSlug>(slugs[0].value)

	const [title, setTitle] = useState<string>('')
	const [description, setDescription] = useState<string>(
		cardData?.description || ''
	)

	const [iconUrl, setIconUrl] = useState<string>('')
	const [icon, setIcon] = useState<File>()

	const [isOpen, setIsOpen] = useState(false)

	const [paragraphDeletedIds, setParagraphDeletedIds] = useState<number[]>([])
	const [menuDeletedIds, setMenuDeletedIds] = useState<number[]>([])

	const [menus, setMenus] = useState<IRepairCardMenu[]>([])

	const [menuId, setMenuId] = useState<number | undefined>(undefined)
	const [isOpenEdit, setIsOpenEdit] = useState(false)

	const createCard = useCreateCard(icon)
	const updateCard = useUpdateCard(
		cardData,
		icon,
		refetch,
		repairCardModelRefetch
	)

	const repairCard: IRepairCardCreate = {
		title,
		description,
		menus,
		slug,
		menuDeletedIds,
		paragraphDeletedIds,
	}

	// Сетаем полученные данные
	useEffect(() => {
		if (!cardData) return
		setTitle(cardData.title)
		setDescription(cardData.description)
		setIconUrl(cardData.iconPath)
		setMenus(cardData.menus)
		setSlug(cardData.slug)
	}, [cardData])

	const onChangeIcon = changeIcon(setIcon, setIconUrl)
	const onClickDeleteMenu = clickDeleteMenu(setMenus, setMenuDeletedIds, menus)

	const onClickCreate = () => {
		setMenuId(undefined)
		setIsOpen(true)
		setIsOpenEdit(false)
	}

	const onClickEdit = (id: number) => {
		setMenuId(id)
		setIsOpenEdit(true)
		setIsOpen(true)
	}

	const onClickGoBack = () => {
		if (isEdit) {
			if (!cardData) return

			if (objectCompare(cardData, repairCard as RepairCardsGetResponse)) {
				customToast.info(
					<ConfirmBlock
						buttonAction={() => setCurrentWindow(CurrentWindowRCM.LIST)}
					/>
				)
				return
			}
		}

		setCurrentWindow(CurrentWindowRCM.LIST)
	}

	const onClickGoCreateServices = () => {
		if (isEdit) {
			if (!cardData) return

			if (objectCompare(cardData, repairCard as RepairCardsGetResponse)) {
				customToast.info(
					<ConfirmBlock
						buttonAction={() =>
							setCurrentWindow(CurrentWindowRCM.CREATE_SERVICE)
						}
					/>
				)
				return
			}
			setCurrentWindow(CurrentWindowRCM.CREATE_SERVICE)
		}
	}

	const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		// Убираем поля id из менюшек и параграфов
		repairCard.menus = makeMenusForRequest(repairCard)

		if (isEdit) {
			if (!cardData) return

			if (
				objectCompare(cardData, repairCard as RepairCardsGetResponse) ||
				!!icon
			)
				updateCard(repairCard)

			return
		}

		createCard(repairCard)
	}

	if (isLoadingCardData) return <AdminLoader />

	return (
		<div>
			<div className={cl.wrapper}>
				<form className={cl.form} onSubmit={event => onSubmit(event)}>
					<div>
						<input
							type='file'
							id='icon'
							className='hidden'
							accept='.jpg, .png, .jped, .PNG'
							onChange={event => onChangeIcon(event)}
						/>
						<label
							htmlFor='icon'
							className='flex items-center justify-between gap-2 text-[18px]'
						>
							<p>Иконка</p>
							<img
								src={iconUrl}
								className={cl.icon}
								alt=''
								style={{ border: iconUrl ? '' : '1px solid #4f5d87a4' }}
							/>
						</label>
					</div>
					<div className='flex flex-col gap-2 px-2'>
						<select
							className='bg-prisma-blue py-1 px-2 cursor-pointer'
							value={slug}
							onChange={event => setSlug(event.target.value as RepairCardSlug)}
						>
							{slugs.map((opt, idx) => (
								<option key={idx} value={opt.value} label={opt.label}></option>
							))}
						</select>

						<input
							type='text'
							className={cl.input}
							placeholder='Название карточки'
							value={title}
							onChange={event => setTitle(event.target.value)}
						/>
						<textarea
							placeholder='Описаник карточки'
							className={cl.textarea}
							rows={3}
							value={description}
							onChange={event => setDescription(event.target.value)}
						/>
					</div>
					<div className='grow'>
						<div className={cl.wrapper__icon__add} onClick={onClickCreate}>
							<BsPlusLg className={cl.icon__add} size={30} />
							<p>Добавить меню</p>
						</div>
						<ul className={cl.menu__list}>
							{menus?.map(menu => (
								<li key={menu.id} onClick={() => onClickEdit(menu.id || 0)}>
									<MenuElement
										title={menu.title}
										onDelete={event => onClickDeleteMenu(event, menu.id || 0)}
									/>
								</li>
							))}
						</ul>
					</div>
					<CSSTransition
						in={isOpen}
						timeout={300}
						classNames='popup'
						unmountOnExit
					>
						<MenuCreate
							setParagraphDeletedIds={setParagraphDeletedIds}
							onClose={() => {
								setIsOpen(false)
								setIsOpenEdit(false)
							}}
							setMenus={setMenus}
							menu={menus.find(el => el.id === menuId)}
							isEditWindow={isOpenEdit}
							setIsNoOpenEdit={() => setIsOpenEdit(false)}
						/>
					</CSSTransition>
					<button className={cl.button}>{buttonTitle}</button>
				</form>

				{/* Превью карточки */}
				<div>
					<div className={cl.card}>
						<div className={cl.card__top__content}>
							<img
								src={iconUrl}
								className={`${cl.icon} ${cl.icon__preview}`}
								alt=''
								style={{ border: iconUrl ? '' : '1px solid #4f5d87a4' }}
							/>
							<p className='text-[20px]'>{title}</p>
						</div>
						<div className={cl.body}>
							<p className={cl.description}>{description}</p>
							<div>
								<ul className='flex flex-col gap-4 h-[320px] overflow-auto px-2'>
									{menus?.map(menu => (
										<li key={menu.id}>
											<p className='mb-2'>{menu.title}</p>
											<ul className='flex flex-col gap-1'>
												{menu?.paragraphs?.map(paragraph => (
													<li
														key={paragraph.id}
														className='text-[#81ffe4ce] flex gap-2'
													>
														<BsGearFill className='shrink-0 mt-[3px]' />
														<p>{paragraph.title}</p>
													</li>
												))}
											</ul>
										</li>
									))}
								</ul>
							</div>
						</div>
						<button className={cl.button__preview}>Подробнее</button>
					</div>
				</div>
			</div>
			<div className='flex justify-between'>
				<BsArrowRight className={cl.arrow} onClick={onClickGoBack} />
				<div className={cl.arrow__right} onClick={onClickGoCreateServices}>
					<p className='text-[20px]'>Услуги</p>
					<BsArrowRight size={28} />
				</div>
			</div>
		</div>
	)
}

export default RepairCardCreate
