import React, { FC, useState } from 'react'
import { IoClose } from 'react-icons/io5'
import cl from './OrderModelCreateWindow.module.scss'
import { useOrderUpdateMutation } from '@api/order.api'
import {
  IOrderUpdate,
  OrdersGetResponse,
  OrderStatus,
  OrderStatusView,
} from '@interfaces/order'
import customToast from '@utils/customToast'

const selectData = [
  { value: OrderStatus.PENDING, label: OrderStatusView.PENDING },
  { value: OrderStatus.PROCESSING, label: OrderStatusView.PROCESSING },
  { value: OrderStatus.COMPLETED, label: OrderStatusView.COMPLETED },
  { value: OrderStatus.STOPPED, label: OrderStatusView.STOPPED },
  { value: OrderStatus.REJECTED, label: OrderStatusView.REJECTED },
]

interface IProps {
  order: OrdersGetResponse
  username?: string
  toClose: () => void
}

const OrderModelCreateWindow: FC<IProps> = ({ order, username, toClose }) => {
  const [status, setStatus] = useState<OrderStatus>(order.status as OrderStatus)
  const [updateOrder] = useOrderUpdateMutation()

  const [isViewNote, setIsViewNote] = useState(false)
  const [note, setNote] = useState(order.note || '')

  const [price, setPrice] = useState(order.price || '')

  const onClickUpdate = () => {
    const data: IOrderUpdate = {
      id: order.id,
      status,
      note,
      price: parseInt(price.toString()),
    }

    if (!price) delete data.price

    updateOrder(data)
      .unwrap()
      .then(response => {
        customToast.success(response.message)
        toClose()
      })
  }

  return (
    <div className={cl.wrapper}>
      <div
        className={cl.container}
        style={{
          transform: isViewNote ? 'translateX(-200px)' : '',
          zIndex: 500,
        }}
      >
        <IoClose
          className='absolute right-2 top-2 p-1 cursor-pointer'
          size={30}
          onClick={toClose}
        />
        <div className='flex flex-col gap-2 mb-2'>
          <div className={cl.field}>
            <p>Заказ </p>
            <p className='text-[#7DD3FC]'>№ {order.id}</p>
          </div>
          <div className={cl.field}>
            <p>Пользователь</p>
            <p className='text-[#7DD3FC]'>{username || order.User.username}</p>
          </div>
          <div className={cl.field}>
            <p>Услуга</p>
            <p className='text-[#7DD3FC]'>{order.service.title}</p>
          </div>
        </div>
        <div className='flex flex-col items-center gap-4'>
          <select
            className={cl.select}
            value={status}
            onChange={event => setStatus(event.target.value as OrderStatus)}
          >
            {selectData.map((el, idx) => (
              <option key={idx} value={el.value} label={el.label}></option>
            ))}
          </select>
          <div className='flex items-center gap-2'>
            <input
              type='text'
              placeholder='Цена'
              className={cl.input}
              value={price}
              onChange={event => setPrice(event.target.value)}
            />
            <p className='text-[18px]'>руб</p>
          </div>
          <div className='w-full'>
            <p className={cl.comment__title}>Комментарий</p>
            <p className={cl.comment}>{order.comment}</p>
          </div>
        </div>
        <div className='flex flex-col gap-2 my-5'>
          <button className={cl.button} onClick={onClickUpdate}>
            Обновить
          </button>
          <button
            className={cl.button}
            onClick={() => setIsViewNote(!isViewNote)}
          >
            Открыть/закрыть записку
          </button>
        </div>
      </div>

      <div
        className={cl.container}
        style={{
          position: 'absolute',
          opacity: isViewNote ? 1 : 0,
          transform: isViewNote ? 'translateX(320px)' : '',
        }}
      >
        <IoClose
          className='absolute right-2 top-2 p-1 cursor-pointer'
          size={30}
          onClick={() => setIsViewNote(false)}
        />
        <div className='mb-2'>
          <p className={cl.field}>Записка к заказу</p>
        </div>

        <textarea
          className={cl.textarea}
          placeholder='Напишите записку к заказу'
          value={note}
          onChange={event => setNote(event.target.value)}
        />
      </div>
    </div>
  )
}

export default OrderModelCreateWindow
