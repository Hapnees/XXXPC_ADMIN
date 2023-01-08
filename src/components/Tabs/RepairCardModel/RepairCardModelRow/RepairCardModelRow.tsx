import React, { FC } from 'react'
import mainCl from '../../tabs.module.scss'
import {
  RepairCardsGetResponse,
  RepairCardSlugView,
} from '@interfaces/repair-card'
import { dateFormat } from '@utils/date.format'
import { IFieldMenuElement } from '@interfaces/fieldMenuElement.interface'
import { sortTitles } from '../RepairCardModel.interface'

interface IProps {
  card: RepairCardsGetResponse
  setCheckList: React.Dispatch<React.SetStateAction<number[]>>
  setCurrentCard: React.Dispatch<
    React.SetStateAction<RepairCardsGetResponse | undefined>
  >
  checkList: number[]
  checkFieldsList: IFieldMenuElement[]
  viewCreateWindow: () => void
}

const RepairCardModelRow: FC<IProps> = ({
  card,
  checkList,
  setCheckList,
  viewCreateWindow,
  setCurrentCard,
  checkFieldsList,
}) => {
  const value = checkList.includes(card.id)

  const onChangeCheck = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.MouseEvent<HTMLLIElement, MouseEvent>
  ) => {
    event.stopPropagation()
    if (value) {
      const newCheckList = [...checkList].filter(el => el !== card.id)
      setCheckList(newCheckList)
      return
    }
    setCheckList(prev => [...prev, card.id])
  }

  const onClickRow = (
    event: React.MouseEvent<HTMLUListElement, MouseEvent>
  ) => {
    event.stopPropagation()
    viewCreateWindow()
    setCurrentCard(card)
  }

  return (
    <div>
      <ul
        className={mainCl.menu}
        style={{
          backgroundColor: value ? 'rgba(177, 39, 39, 0.505)' : '',
        }}
        onClick={event => onClickRow(event)}
      >
        <li
          className={`${mainCl.not_input} ${mainCl.short__element}`}
          onClick={event => onChangeCheck(event)}
        >
          <input
            type='checkbox'
            className={mainCl.checkbox}
            checked={value}
            onChange={event => onChangeCheck(event)}
          />
        </li>
        <li className={mainCl.short__element}>{card.id}</li>
        {checkFieldsList.find(el => el.title === sortTitles.TITLE)?.checked && (
          <li>
            <p className='overflow-hidden'>{card.title}</p>
          </li>
        )}
        {checkFieldsList.find(el => el.title === sortTitles.CATEGORY)
          ?.checked && (
          <li>
            <p className='overflow-hidden'>{RepairCardSlugView[card.slug]}</p>
          </li>
        )}
        {checkFieldsList.find(el => el.title === sortTitles.ICON)?.checked && (
          <a
            href={card.iconPath}
            target='_blank'
            rel='noreferrer'
            onClick={event => {
              event.stopPropagation()
            }}
          >
            <li>
              <p>{card.iconPath}</p>
            </li>
          </a>
        )}

        {checkFieldsList.find(el => el.title === sortTitles.SERVICE_TITLE)
          ?.checked && (
          <li className={mainCl.special}>
            <p
              style={{
                backgroundColor: value ? 'rgba(135, 30, 30, 0.505)' : '#2d3748',
              }}
            >
              {card._count.services}
            </p>
            <p
              style={{
                backgroundColor: value ? 'rgba(177, 39, 39, 0.505)' : '#475264',
              }}
            >
              Услуги
            </p>
          </li>
        )}
        {checkFieldsList.find(el => el.title === sortTitles.DATE_UPDATED)
          ?.checked && (
          <li className={mainCl.date__element}>
            {dateFormat(card.updatedAt, { withTime: true })}
          </li>
        )}
        {checkFieldsList.find(el => el.title === sortTitles.DATE_CREATED)
          ?.checked && (
          <li className={mainCl.date__element}>
            {dateFormat(card.createdAt, { withTime: true })}
          </li>
        )}
      </ul>
    </div>
  )
}

export default RepairCardModelRow
