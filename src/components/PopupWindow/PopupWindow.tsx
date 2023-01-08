import React, { FC, SetStateAction } from 'react'
import cl from './PopupWindow.module.scss'

interface IProps {
  ruArray: any[]
  array: any[]
  setFilterValue: React.Dispatch<SetStateAction<any | undefined>>
}

const PopupWindow: FC<IProps> = ({ array, ruArray, setFilterValue }) => {
  // const modSlugs = ['Очистить', ...array]

  const modSlugs = [
    { value: undefined, view: 'Очистить' },
    ...array.map((el, idx) => ({ value: el, view: ruArray[idx] })),
  ]

  return (
    <ul className={cl.wrapper}>
      {modSlugs.map(el => (
        <li key={el.value} onClick={() => setFilterValue(el.value)}>
          <p className='text-center'>{el.view}</p>
        </li>
      ))}
    </ul>
  )
}

export default PopupWindow
