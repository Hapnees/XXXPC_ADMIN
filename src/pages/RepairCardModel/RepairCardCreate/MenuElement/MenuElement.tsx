import React, { FC } from 'react'
import { IoClose } from 'react-icons/io5'
import { VscDebugBreakpointData } from 'react-icons/vsc'
import cl from './MenuElement.module.scss'

interface IProps {
  title: string
  onDelete: (event: React.ChangeEvent<any>) => void
}

const MenuElement: FC<IProps> = ({ title, onDelete }) => {
  return (
    <div className={cl.wrapper}>
      <div className='flex items-center gap-2'>
        <VscDebugBreakpointData size={30} color='#9e9e9e' />
        <p className='whitespace-nowrap overflow-hidden text-ellipsis w-[230px]'>
          {title}
        </p>
        <IoClose size={30} className='p-1 cursor-pointer' onClick={onDelete} />
      </div>
    </div>
  )
}

export default MenuElement
