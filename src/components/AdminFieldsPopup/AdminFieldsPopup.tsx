import React, { FC, SetStateAction, useState } from 'react'
import { MdKeyboardArrowDown } from 'react-icons/md'
import { CSSTransition } from 'react-transition-group'
import { IFieldMenuElement } from '@interfaces/fieldMenuElement.interface'
import cl from './AdminFieldsPopup.module.scss'

interface IProps {
  checkFields: IFieldMenuElement[]
  setCheckFields: React.Dispatch<SetStateAction<IFieldMenuElement[]>>
  ruFields: object
}

const AdminFieldsPopup: FC<IProps> = ({
  checkFields,
  setCheckFields,
  ruFields,
}) => {
  const onChangeCheckFields = (title: string) => {
    const tempArray = [...checkFields]
    const currentElement = tempArray.find(el => el.title === title)
    if (!currentElement) return

    currentElement.checked = !currentElement.checked
    setCheckFields(tempArray)
  }

  const [isOpenPopup, setIsOpenPopup] = useState(false)

  return (
    <div className='relative z-[1000]'>
      <div
        className={cl.button}
        onClick={() => setIsOpenPopup(!isOpenPopup)}
        style={{ backgroundColor: isOpenPopup ? '#2d3748' : '' }}
      >
        <p>Поля</p>
        <MdKeyboardArrowDown
          size={20}
          className={cl.icon}
          style={{ transform: isOpenPopup ? 'rotate(180deg)' : '' }}
        />
      </div>
      <CSSTransition
        in={isOpenPopup}
        timeout={300}
        classNames='popup'
        unmountOnExit
      >
        <ul className={cl.menu}>
          {checkFields
            .filter(el => !['ID', 'CHECK'].includes(el.title))
            .map((el, idx) => (
              <li
                key={idx}
                onClick={() => onChangeCheckFields(el.title)}
                style={{ backgroundColor: el.checked ? '#434e62' : '' }}
              >
                <input
                  type='checkbox'
                  className='cursor-pointer'
                  checked={el.checked}
                  onChange={() => onChangeCheckFields(el.title)}
                />
                <p>{ruFields[el.title as keyof typeof ruFields]}</p>
              </li>
            ))}
        </ul>
      </CSSTransition>
    </div>
  )
}

export default AdminFieldsPopup
