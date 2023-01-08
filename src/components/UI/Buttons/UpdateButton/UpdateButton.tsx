import React from 'react'
import { IoMdCreate } from 'react-icons/io'
import cl from '../Buttons.module.scss'

export const UpdateButton = () => {
  return (
    <button className={cl.button__update}>
      <p>Обновить</p>
      <IoMdCreate />
    </button>
  )
}
