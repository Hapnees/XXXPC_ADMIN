import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  useAdminDeleteRepairCardMutation,
  useLazyAdminGetRepairCardsQuery,
} from '@api/repairCard.api'
import { AdminLoader } from '@components/UI/index'
import mainCl from '../tabs.module.scss'
import RepairCardModelRow from './RepairCardModelRow/RepairCardModelRow'
import RepairCardCreate from './RepairCardCreate/RepairCardCreate'
import { RepairCardsGetResponse } from '@interfaces/repair-card'
import ServiceCreate from '../ServiceModel/ServiceCreate/ServiceCreate'
import { CreateButton, DeleteButton } from '@components/UI/Buttons'
import {
  RepairCardSlug,
  RepairCardSlugView,
} from '@interfaces/repair-card/repair-card-slug.enum'
import SpecialInput from '@components/UI/AdminSpecialInput/SpecialInput'
import { HiSearch } from 'react-icons/hi'
import customToast from '@utils/customToast'
import { IFieldMenuElement } from '@interfaces/fieldMenuElement.interface'
import Pagination from '@components/Pagination/Pagination'
import { useAppSelector } from '@hooks/useAppSelector'
import AdminFieldsPopup from '@components/AdminFieldsPopup/AdminFieldsPopup'
import { sortTitles, sortTitlesView } from './RepairCardModel.interface'
import PopupWindow from '../../PopupWindow/PopupWindow'
import { CSSTransition } from 'react-transition-group'

export enum CurrentWindowRCM {
  LIST = 'LIST',
  CREATE_MODEL = 'CREATE_MODEL',
  CREATE_SERVICE = 'CREATE_SERVICE',
}

const selectData = [
  { value: RepairCardSlug.PC, label: RepairCardSlugView.PC },
  { value: RepairCardSlug.LAPTOP, label: RepairCardSlugView.LAPTOP },
  { value: RepairCardSlug.PHONE, label: RepairCardSlugView.PHONE },
]

const RepairCardModel = () => {
  const { isNeededRefresh } = useAppSelector(state => state.auth)

  const [isOpenPopup, setIsOpenPopup] = useState(false)
  const [filterSlug, setFilterSlug] = useState<RepairCardSlug>()

  const [currentPage, setCurrentPage] = useState(1)
  const searchRef = useRef<HTMLInputElement>(null)
  const [checkList, setCheckList] = useState<number[]>([])

  const [deleteCard] = useAdminDeleteRepairCardMutation()

  const [getRepairCards, { data: cardsData, isLoading }] =
    useLazyAdminGetRepairCardsQuery()

  const getRepairCardsWithParams = useCallback(
    () =>
      getRepairCards({
        search: searchRef.current?.value,
        fs: filterSlug,
        page: currentPage,
      }),
    [getRepairCards, filterSlug, currentPage]
  )

  const slugs = cardsData?.data.map(el => el.slug)

  const [currentCard, setCurrentCard] = useState<RepairCardsGetResponse>()
  const [currentWindow, setCurrentWindow] = useState<CurrentWindowRCM>(
    CurrentWindowRCM.LIST
  )

  const currentSlugs = selectData?.filter(
    el => !slugs?.includes(el.value) || el.value === currentCard?.slug
  )

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
    if (!currentSlugs || !currentSlugs.length) {
      customToast.error('Все категории заняты!')
      return
    }

    setCurrentWindow(CurrentWindowRCM.CREATE_MODEL)
    setCurrentCard(undefined)
  }

  const onClickDelete = () => {
    deleteCard(checkList)
      .unwrap()
      .then(response => customToast.success(response.message))
  }

  // Получаем данные о карточках
  useEffect(() => {
    getRepairCardsWithParams()
  }, [currentPage, filterSlug])

  const onKeyDownEnter = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      getRepairCardsWithParams()
    }
  }

  return (
    <>
      {currentWindow === CurrentWindowRCM.CREATE_MODEL ? (
        <RepairCardCreate
          id={currentCard?.id || 0}
          setCurrentWindow={setCurrentWindow}
          repairCardModelRefetch={getRepairCardsWithParams}
          slugs={currentSlugs || []}
        />
      ) : currentWindow === CurrentWindowRCM.CREATE_SERVICE ? (
        <ServiceCreate
          title={currentCard?.title || ''}
          repairCardId={currentCard?.id || 0}
          toBack={() => setCurrentWindow(CurrentWindowRCM.CREATE_MODEL)}
        />
      ) : isLoading || isNeededRefresh ? (
        <AdminLoader />
      ) : (
        <div className={mainCl.wrapper}>
          <div>
            <div className='flex items-center gap-2 mb-2 ml-2'>
              <div className='flex gap-2'>
                <p className='text-[20px]'>Карточки ремонта</p>
                <CreateButton onClickCreate={onClickCreate} />
                <DeleteButton onClickDelete={onClickDelete} />
              </div>
              <div className='flex items-center gap-2'>
                <div className='w-[400px]'>
                  <SpecialInput
                    placeholder='Поиск по названию'
                    ref={searchRef}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      if (searchRef.current?.value)
                        searchRef.current.value = event.target.value
                    }}
                    onKeyDown={event => onKeyDownEnter(event)}
                  />
                </div>
                <HiSearch
                  className='bg-[#434e62] w-[70px] h-[35px] p-1 rounded-md cursor-pointer'
                  onClick={getRepairCardsWithParams}
                />
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
                          el.title === sortTitles.CATEGORY &&
                          (isOpenPopup || filterSlug)
                            ? '#2d3748'
                            : '',
                      }}
                      onClick={() =>
                        el.title === sortTitles.CATEGORY &&
                        setIsOpenPopup(!isOpenPopup)
                      }
                    >
                      {el.title === sortTitles.CATEGORY && filterSlug
                        ? filterSlug
                        : sortTitlesView[
                            el.title as keyof typeof sortTitlesView
                          ]}
                      {el.title === sortTitles.CATEGORY && (
                        <CSSTransition
                          in={isOpenPopup}
                          timeout={300}
                          classNames='popup'
                          unmountOnExit
                        >
                          <PopupWindow
                            ruArray={
                              slugs?.map(el => RepairCardSlugView[el]) || []
                            }
                            array={slugs || []}
                            setFilterValue={setFilterSlug}
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
                      setCurrentCard={setCurrentCard}
                      viewCreateWindow={() =>
                        setCurrentWindow(CurrentWindowRCM.CREATE_MODEL)
                      }
                      card={card}
                      checkList={checkList}
                      setCheckList={setCheckList}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Pagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalCount={cardsData?.totalCount || 0}
          />
        </div>
      )}
    </>
  )
}

export default RepairCardModel
