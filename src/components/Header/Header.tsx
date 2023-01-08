import React, { useRef, useState } from 'react'
import cl from './Header.module.scss'
import { MdKeyboardArrowDown } from 'react-icons/md'
import PopupWindow from './PopupWindow/PopupWindow'
import { CSSTransition } from 'react-transition-group'
import { useAuth, useAppSelector, useActions } from '@hooks/index'
import { Roles } from '@interfaces/roles.interface'
import { HiPlus } from 'react-icons/hi'
import { Tabs } from '@interfaces/tabs.interface'
import { IoClose } from 'react-icons/io5'

const Header = () => {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLUListElement>(null)
  const isAuth = useAuth(Roles.ADMIN)
  const { tabs, currentTab } = useAppSelector(state => state.tab)
  const { setCurrentTab, removeTab } = useActions()
  const {
    user: { username },
  } = useAppSelector(state => state.auth)

  const onClose = (event: React.MouseEvent, tab: Tabs) => {
    event.stopPropagation()
    setCurrentTab(tabs[tabs.indexOf(tab) - 1] || Tabs.MODELS)
    removeTab(tab)
  }

  return (
    <div className={cl.wrapper}>
      <div className='flex gap-6 h-full'>
        <p className={cl.title}>админ панель</p>

        <div className='flex grow'>
          <div className='h-full flex items-center'>
            <input
              type='radio'
              id='plus'
              name='tabs'
              className={cl.radio}
              checked={currentTab === Tabs.MODELS}
              onChange={() => setCurrentTab(Tabs.MODELS)}
            />
            <label htmlFor='plus' onClick={() => setCurrentTab(Tabs.MODELS)}>
              <HiPlus className={cl.plus} />
            </label>
          </div>

          <ul className={cl.menu}>
            {tabs.map(tab => (
              <li key={tab}>
                <input
                  type='radio'
                  id={tab}
                  name='tabs'
                  className={cl.radio__tabs}
                  checked={currentTab === tab}
                  onChange={() => setCurrentTab(tab)}
                />
                <label htmlFor={tab} onClick={() => setCurrentTab(tab)}>
                  <p>{tab}</p>
                  <IoClose
                    className='p-1'
                    size={30}
                    onClick={event => onClose(event, tab)}
                  />
                </label>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {isAuth && (
        <div onClick={() => setIsOpen(!isOpen)}>
          <div
            className={cl.popup__button}
            style={{
              borderBottomLeftRadius: `${isOpen ? '0' : '6px'}`,
              borderBottomRightRadius: `${isOpen ? '0' : '6px'}`,
            }}
          >
            <p>{username}</p>
            <MdKeyboardArrowDown
              size={20}
              className={cl.arrow__icon}
              style={{ transform: `rotate(${isOpen ? 180 : 0}deg)` }}
            />
          </div>
          <CSSTransition
            in={isOpen}
            timeout={300}
            classNames='popup'
            nodeRef={ref}
            unmountOnExit
          >
            <PopupWindow ref={ref} />
          </CSSTransition>
        </div>
      )}
    </div>
  )
}

export default Header
