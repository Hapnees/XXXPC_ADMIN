import { OrderStatus, OrderStatusView } from '@interfaces/order'
import React, { FC, SetStateAction } from 'react'
import { IoClose } from 'react-icons/io5'
import cl from './ChangeStatusWindow.module.scss'

interface IProps {
  setStatus: React.Dispatch<SetStateAction<OrderStatus | undefined>>
  toClose: () => void
}

const statusValues = [
  {
    title: undefined,
    description: 'Очистить фильтр статуса',
    className: cl.status__clear,
  },
  {
    title: OrderStatus.PENDING,
    description: 'Заказ автоматически получает этот статус',
    className: cl.status__pending,
  },
  {
    title: OrderStatus.PROCESSING,
    description:
      'Присваиваем статус, когда устройство будет доставлено в сервис-центр',
    className: cl.status__in_process,
  },
  {
    title: OrderStatus.COMPLETED,
    description: 'Присваиваем статус, когда заказ полностью выполнен',
    className: cl.status__completed,
  },
  {
    title: OrderStatus.STOPPED,
    description:
      'Присваиваем статус, когда выполнение заказа приостановлено(укажите причину этого в записке)',
    className: cl.status__stopped,
  },
  {
    title: OrderStatus.REJECTED,
    description:
      '  Присваиваем статус, когда заказ был отклонён (укажите причину этого в записке)',
    className: cl.status__rejected,
  },
]

const ChangeStatusWindow: FC<IProps> = ({ setStatus, toClose }) => {
  return (
    <div className={cl.wrapper}>
      <IoClose
        className='absolute right-2 top-2 p-1 cursor-pointer'
        size={30}
        onClick={toClose}
      />
      <div>
        <p className={cl.title}>Выбор статуса</p>

        <div className='mt-4'>
          <div className='flex text-[18px] mb-2'>
            <p className={cl.status__title}>Статус</p>
            <p className={cl.description__title}>Описание</p>
          </div>
          <ul className='flex flex-col gap-2'>
            {statusValues.map((el, idx) => (
              <li key={idx} className='flex'>
                <p
                  className={el.className}
                  onClick={() => {
                    setStatus(el.title)
                    toClose()
                  }}
                >
                  {OrderStatusView[el.title as keyof typeof OrderStatusView] ||
                    'Очистить'}
                </p>
                <p className={cl.description__value}>{el.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default ChangeStatusWindow
