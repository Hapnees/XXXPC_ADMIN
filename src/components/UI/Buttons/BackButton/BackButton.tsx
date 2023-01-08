import React, { FC } from 'react'
import cl from '../Buttons.module.scss'
import { BsArrowRight } from 'react-icons/bs'

interface IProps {
  onClickBack: () => void
}

const BackButton: FC<IProps> = ({ onClickBack }) => {
  return (
    <button className={cl.button__back} onClick={onClickBack}>
      <BsArrowRight className='rotate-180' />
      <p>Назад</p>
    </button>
  )
}

export default BackButton
