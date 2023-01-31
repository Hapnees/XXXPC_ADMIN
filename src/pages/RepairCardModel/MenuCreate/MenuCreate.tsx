import React, { FC, useState } from 'react'
import ModalWindow from '@components/UI/ModalWindow/ModalWindow'
import cl from './MenuCreate.module.scss'
import { BsPlusLg } from 'react-icons/bs'
import Paragraph from './MenuElement/MenuElement'
import { IoClose } from 'react-icons/io5'
import { IRepairCardParagraph, IRepairCardMenu } from '@interfaces/repair-card'
import { sortById } from '@utils/index'
import customToast from '@utils/customToast'

interface IProps {
  setMenus: React.Dispatch<React.SetStateAction<IRepairCardMenu[]>>
  setParagraphDeletedIds: React.Dispatch<React.SetStateAction<number[]>>
  onClose: () => void
  isEditWindow?: boolean
  setIsNoOpenEdit: () => void
  menu?: IRepairCardMenu
}

const MenuCreate: FC<IProps> = ({
  onClose,
  setMenus,
  isEditWindow = false,
  menu,
  setIsNoOpenEdit,
  setParagraphDeletedIds,
}) => {
  const topTitle = isEditWindow ? 'Редактирование меню' : 'Добавление меню'
  const buttonTitle = isEditWindow ? 'Изменить' : 'Добавить'

  const [paragraphs, setParagraphs] = useState<IRepairCardParagraph[]>(
    menu ? menu.paragraphs : [{ id: Date.now(), title: '', isCreated: true }]
  )

  const [title, setTitle] = useState(menu?.title || '')

  const onClickDeleteElement = (id: number) => {
    setParagraphs(prev => prev.filter(el => el.id !== id))
    const currentParagraph = paragraphs.find(el => el.id === id)
    if (currentParagraph && !currentParagraph.isCreated)
      setParagraphDeletedIds(prev => [...prev, id])
  }

  const onClickCreateElement = () => {
    const newElement: IRepairCardParagraph = {
      id: Date.now(),
      title: '',
      isCreated: true,
    }
    setParagraphs(prev => [...prev, newElement])
  }

  const onClickAdd = (event: React.MouseEvent) => {
    event.preventDefault()
    if (!title) {
      customToast.error('Отсутствует название меню')
      return
    }

    const newMenu: IRepairCardMenu = {
      id: Date.now(),
      title,
      paragraphs: paragraphs,
      isCreated: true,
    }

    if (!isEditWindow) {
      setMenus(prev => [...prev, newMenu])
    } else {
      if (!menu) return

      setMenus(prev => {
        const tempMenu = [...prev].filter(el => el.id !== menu.id)
        tempMenu.push({
          id: menu.id,
          paragraphs: paragraphs,
          title,
          isCreated: menu.isCreated,
        })
        return sortById(tempMenu)
      })
    }

    onClose()
    setIsNoOpenEdit()
  }

  const onKeyDownTab = (event: React.KeyboardEvent) => {
    if (event.key === 'Tab') {
      onClickCreateElement()
    }
  }

  return (
    <ModalWindow>
      <div className={cl.wrapper} onKeyDown={event => onKeyDownTab(event)}>
        <IoClose
          size={30}
          className='absolute right-1 p-1 cursor-pointer'
          onClick={onClose}
        />
        <p className='text-center my-4'>{topTitle}</p>

        <div className='flex flex-col gap-4 grow mb-2'>
          <div>
            <input
              type='text'
              className={cl.input}
              placeholder='Название меню'
              value={title}
              onChange={event => setTitle(event.target.value)}
              autoFocus
            />
            <p></p>
          </div>

          <div className='flex flex-col gap-2 grow'>
            <div
              className={cl.wrapper__icon__add}
              onClick={onClickCreateElement}
            >
              <BsPlusLg className={cl.icon__add} size={30} />
              <p>Добавить пункт</p>
            </div>
            <ul className={cl.menu}>
              {paragraphs?.map(el => (
                <li key={el.id}>
                  <Paragraph
                    onClose={onClickDeleteElement}
                    id={el.id || 0}
                    title={
                      paragraphs.find(el2 => el2.id === el.id)?.title || ''
                    }
                    setParagraphs={setParagraphs}
                  />
                </li>
              ))}
            </ul>
          </div>
          <button className={cl.button} onClick={event => onClickAdd(event)}>
            {buttonTitle}
          </button>
        </div>
      </div>
    </ModalWindow>
  )
}

export default MenuCreate
