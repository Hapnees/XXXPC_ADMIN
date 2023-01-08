import React, { FC } from 'react'
import { FaMinus } from 'react-icons/fa'
import cl from '../Buttons.module.scss'

interface IProps {
  onClickDelete: () => void
}

export const DeleteButton: FC<IProps> = ({ onClickDelete }) => {
  return (
    <button className={cl.button__delete} onClick={onClickDelete}>
      <p>Удалить</p>
      <FaMinus />
    </button>
  )
}
