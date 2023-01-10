import React, { FC } from 'react'
import { UsersGetResponse } from '@interfaces/user'
import { dateFormat } from '@utils/date.format'
import { IFieldMenuElement } from '@interfaces/fieldMenuElement.interface'
import { OnlineView, sortTitles } from '../UserModel.interface'
import { RolesView } from '@interfaces/roles.interface'
import mainCl from '../../tabs.module.scss'

interface IProps {
  user: UsersGetResponse
  setCheckList: React.Dispatch<React.SetStateAction<number[]>>
  checkList: number[]
  checkFieldsList: IFieldMenuElement[]
  onClickUserOrders: () => void
  openEditWindow: () => void
}

const UserModelRow: FC<IProps> = ({
  user,
  setCheckList,
  checkList,
  onClickUserOrders,
  checkFieldsList,
  openEditWindow,
}) => {
  const value = checkList.includes(user.id)

  const onChangeCheck = (event: any) => {
    event.stopPropagation()
    if (value) {
      const newCheckList = [...checkList].filter(el => el !== user.id)
      setCheckList(newCheckList)
      return
    }
    setCheckList(prev => [...prev, user.id])
  }

  return (
    <div onClick={openEditWindow}>
      <ul
        className={mainCl.menu}
        style={{
          backgroundColor: value ? 'rgba(177, 39, 39, 0.505)' : '',
        }}
      >
        <li
          onClick={event => onChangeCheck(event)}
          className={mainCl.short__element}
        >
          <input
            type='checkbox'
            className={mainCl.checkbox}
            checked={value}
            onChange={event => onChangeCheck(event)}
          />
        </li>
        <li className={mainCl.short__element}>{user.id}</li>
        {checkFieldsList.find(el => el.title === sortTitles.USERNAME)
          ?.checked && (
          <li>
            <p>{user.username}</p>
          </li>
        )}
        {checkFieldsList.find(el => el.title === sortTitles.EMAIL)?.checked && (
          <li>
            <p>{user.email}</p>
          </li>
        )}
        {checkFieldsList.find(el => el.title === sortTitles.ROLE)?.checked && (
          <li className={mainCl.not_input}>
            <p>{RolesView[user.role as keyof typeof RolesView]}</p>
          </li>
        )}

        {checkFieldsList.find(el => el.title === sortTitles.ONLINE)
          ?.checked && (
          <li
            className={mainCl.not_input}
            style={{
              backgroundColor: user.isOnline ? 'rgba(63, 205, 50, 0.615)' : '',
            }}
          >
            <p>{user.isOnline ? OnlineView.ONLINE : OnlineView.OFFLINE}</p>
          </li>
        )}
        {checkFieldsList.find(el => el.title === sortTitles.AVATAR)
          ?.checked && (
          <li>
            <p>{user.avatarPath}</p>
          </li>
        )}
        {checkFieldsList.find(el => el.title === sortTitles.PHONE)?.checked && (
          <li>
            <p>{user.phone}</p>
          </li>
        )}
        {checkFieldsList.find(el => el.title === sortTitles.ORDERS)
          ?.checked && (
          <li
            className={mainCl.special}
            onClick={event => {
              event.stopPropagation()
              onClickUserOrders()
            }}
          >
            <p
              style={{
                backgroundColor: value ? 'rgba(135, 30, 30, 0.505)' : '#2d3748',
              }}
            >
              {user._count?.orders || 0}
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
            <p>{dateFormat(user.updatedAt, { withTime: true })}</p>
          </li>
        )}
        {checkFieldsList.find(el => el.title === sortTitles.DATE_CREATED)
          ?.checked && (
          <li className={mainCl.date__element}>
            <p>{dateFormat(user.createdAt, { withTime: true })}</p>
          </li>
        )}
      </ul>
    </div>
  )
}

export default UserModelRow
