import React, { FC } from 'react'
import cl from './ModeLayout.module.scss'

interface IProps {
  children: React.ReactNode
}

const ModelLayout: FC<IProps> = ({ children }) => {
  return (
    <div className={cl.wrapper}>
      <div className='flex gap-2 pl-[5px] mb-2'>{children}</div>
    </div>
  )
}

export default ModelLayout
