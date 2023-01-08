import React from 'react'
import { useActions, useAppSelector } from '@hooks/index'
import { Tabs } from '@interfaces/tabs.interface'
import cl from './OpenModelForm.module.scss'
import { FaUser } from 'react-icons/fa'
import { BsFillGearFill } from 'react-icons/bs'
import { RiPencilFill, RiSdCardFill } from 'react-icons/ri'

const OpenModelForm = () => {
  const { setCurrentTab, addTab } = useActions()
  const { tabs } = useAppSelector(state => state.tab)

  const styleBG = (tab: Tabs) => ({
    backgroundColor: tabs.some(el => el === tab) ? '#10131b' : '',
  })
  const styleColor = (tab: Tabs) => ({
    color: tabs.some(el => el === tab) ? '#79849f' : '',
  })

  const onClickTab = (newTab: Tabs) => {
    if (tabs.some(tab => tab === newTab)) {
      setCurrentTab(newTab)
      return
    }

    addTab(newTab)
    setCurrentTab(newTab)
  }

  return (
    <div className={cl.wrapper}>
      <div className={cl.container}>
        <div className={cl.top__content}>
          <p className='text-[25px] font-semibold tracking-wide text-center'>
            Открыть модель
          </p>
        </div>

        <div className={cl.container__menu}>
          <ul className={cl.menu}>
            <li
              onClick={() => onClickTab(Tabs.USER)}
              style={styleBG(Tabs.USER)}
            >
              <FaUser className={cl.icon} style={styleColor(Tabs.USER)} />
              <p style={styleColor(Tabs.USER)}>Пользователи</p>
            </li>
            <li
              onClick={() => onClickTab(Tabs.REPAIRCARD)}
              style={styleBG(Tabs.REPAIRCARD)}
            >
              <RiSdCardFill
                className={cl.icon}
                style={styleColor(Tabs.REPAIRCARD)}
              />
              <p style={styleColor(Tabs.REPAIRCARD)}>Карточки ремонта</p>
            </li>
            <li
              onClick={() => onClickTab(Tabs.SERVICE)}
              style={styleBG(Tabs.SERVICE)}
            >
              <BsFillGearFill
                className={cl.icon}
                style={styleColor(Tabs.SERVICE)}
              />
              <p style={styleColor(Tabs.SERVICE)}>Услуги</p>
            </li>
            <li
              onClick={() => onClickTab(Tabs.ORDER)}
              style={styleBG(Tabs.ORDER)}
            >
              <RiPencilFill
                className={cl.icon}
                style={styleColor(Tabs.ORDER)}
              />
              <p style={styleColor(Tabs.ORDER)}>Заказы</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default OpenModelForm
