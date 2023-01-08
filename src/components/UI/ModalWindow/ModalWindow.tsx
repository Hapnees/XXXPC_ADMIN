import React, { FC } from 'react'
import cl from './ModalWindow.module.scss'

interface IProps {
  children: React.ReactNode
}

const ModalWindow: FC<IProps> = ({ children }) => {
  return (
    <div className={cl.wrapper}>
      <div className={cl.container}>{children}</div>
    </div>
  )
}

export default ModalWindow
