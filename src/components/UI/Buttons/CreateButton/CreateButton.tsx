import React, { FC } from 'react'
import { BsPlusLg } from 'react-icons/bs'
import cl from '../Buttons.module.scss'

interface IProps {
  onClickCreate: () => void
}

export const CreateButton: FC<IProps> = ({ onClickCreate }) => {
  return (
    <button className={cl.button__create} onClick={onClickCreate}>
      <p>Создать</p>
      <BsPlusLg />
    </button>
  )
}
