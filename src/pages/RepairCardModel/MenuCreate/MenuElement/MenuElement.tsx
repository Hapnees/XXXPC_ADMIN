import { IRepairCardParagraph } from '@interfaces/repair-card'
import React, { FC, useState } from 'react'
import { BsGearFill } from 'react-icons/bs'
import { IoClose } from 'react-icons/io5'
import ReactTextareaAutosize from 'react-textarea-autosize'
import cl from './MenuElement.module.scss'

interface IProps {
  id: number
  onClose: (id: number) => void
  title: string
  setParagraphs: React.Dispatch<React.SetStateAction<IRepairCardParagraph[]>>
}

const Paragraph: FC<IProps> = ({ onClose, id, title, setParagraphs }) => {
  const [isHover, setIsHover] = useState(false)
  const [isFocus, setIsFocus] = useState(false)

  const onChangeCurrentTitle = (currentTitle: string) => {
    setParagraphs(prev => {
      const tempParagraphList = [...prev]
      const tempParagraph = tempParagraphList.find(el => el.id === id)
      const tempParagraphListWithoutCurrentElem = tempParagraphList.filter(
        el => el.id !== id
      )
      let resultParagraphList: IRepairCardParagraph[] = tempParagraphList

      if (tempParagraph) {
        resultParagraphList = [
          ...tempParagraphListWithoutCurrentElem,
          { id, title: currentTitle, isCreated: tempParagraph.isCreated },
        ].sort((a, b) => {
          if (a.id) {
            if (b.id) return a.id - b.id
            else return a.id
          }
          return b.id ? b.id : 0
        })
      }

      return resultParagraphList
    })
  }

  return (
    <div
      className={cl.wrapper}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      style={{
        backgroundColor: isHover || isFocus ? '#232a34' : 'transparent',
      }}
    >
      <BsGearFill />
      <ReactTextareaAutosize
        placeholder='Пункт меню'
        className={cl.menu__input}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        maxRows={2}
        value={title}
        onChange={event => onChangeCurrentTitle(event.target.value)}
        autoFocus
      />
      <IoClose size={20} onClick={() => onClose(id)} />
    </div>
  )
}

export default Paragraph
