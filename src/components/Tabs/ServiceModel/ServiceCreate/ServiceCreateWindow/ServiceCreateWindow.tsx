import SpecialInput from '@components/UI/AdminSpecialInput/SpecialInput'
import React, { FC, useEffect, useState } from 'react'
import cl from './ServiceCreateWindow.module.scss'
import { IoClose } from 'react-icons/io5'
import {
  useCreateServiceMutation,
  useUpdateServiceMutation,
} from '@api/service.api'
import { IServiceCreate } from '@interfaces/service/service-create.interface'
import { useHeaders } from '@hooks/useHeaders'
import { ServiceGetResponse } from '@interfaces/service'
import { IServiceUpdate } from '@interfaces/service/service.update.interface'
import {
  RepairCardSlug,
  RepairCardSlugView,
} from '@interfaces/repair-card/repair-card-slug.enum'
import { useGetUsedRepairCardSlugsQuery } from '@api/repairCard.api'
import customToast from '@utils/customToast'

enum Radio {
  ONE = 'ONE',
  TWO = 'TWO',
}

const selectData = [
  { value: RepairCardSlug.PC, label: RepairCardSlugView.PC },
  { value: RepairCardSlug.LAPTOP, label: RepairCardSlugView.LAPTOP },
  { value: RepairCardSlug.PHONE, label: RepairCardSlugView.PHONE },
]

interface IProps {
  toClose: () => void
  repairCardId?: number
  currentService?: ServiceGetResponse
  setCurrentService: React.Dispatch<
    React.SetStateAction<ServiceGetResponse | undefined>
  >
}

const ServiceCreateWindow: FC<IProps> = ({
  toClose,
  repairCardId,
  currentService,
  setCurrentService,
}) => {
  const isEdit = !!currentService
  const topTitle = isEdit ? 'Изменение услуги' : 'Создание услуги'
  const buttonTitle = isEdit ? 'Обновить' : 'Создать'

  const { data: usedSlugsData } = useGetUsedRepairCardSlugsQuery(undefined, {
    skip: !!repairCardId,
  })

  const [currentSlug, setCurrentSlug] = useState<RepairCardSlug>()

  const [updateService] = useUpdateServiceMutation()
  const [createService] = useCreateServiceMutation()
  const [radioVal, setRadioVal] = useState(
    currentService
      ? currentService.prices.length === 1
        ? Radio.ONE
        : currentService.prices.length === 2 && Radio.TWO
      : Radio.ONE
  )

  const [title, setTitle] = useState(currentService?.title || '')

  const [price, setPrice] = useState<string>(
    currentService && currentService.prices.length === 1
      ? currentService.prices[0].toString()
      : ''
  )
  const [range, setRange] = useState<{ min: string; max: string }>(
    currentService && currentService.prices.length === 2
      ? {
          min: currentService.prices[0].toString(),
          max: currentService.prices[1].toString(),
        }
      : {
          min: '',
          max: '',
        }
  )

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault()

    if (isEdit) {
      const intPrice = parseInt(price)
      const data: IServiceUpdate = {
        id: currentService.id,
        title,
        prices: intPrice
          ? [intPrice]
          : [parseInt(range.min), parseInt(range.max)],
      }
      updateService(data)
        .unwrap()
        .then(response => {
          customToast.success(response.message)
          setCurrentService(undefined)
          toClose()
        })

      return
    }

    if (!repairCardId && !usedSlugsData) {
      customToast.error('Карточка не найдена')
      return
    }

    const intPrice = parseInt(price)
    const data: IServiceCreate = {
      title,
      prices: intPrice
        ? [intPrice]
        : range && range.min && range.max
        ? [parseInt(range.min), parseInt(range.max)]
        : [],
      repairCardId,
      repairCardSlug: currentSlug,
    }
    createService(data)
      .unwrap()
      .then(response => {
        customToast.success(response.message)
        toClose()
      })
  }

  useEffect(() => {
    usedSlugsData &&
      usedSlugsData.slugs.length &&
      setCurrentSlug(usedSlugsData.slugs[0] as RepairCardSlug)
  }, [usedSlugsData])

  return (
    <div className={cl.wrapper}>
      <IoClose
        className='absolute right-2 top-2 p-1 cursor-pointer'
        size={30}
        onClick={toClose}
      />
      <p className='text-center mb-2 text-[20px]'>{topTitle}</p>

      <form className='flex flex-col gap-4' onSubmit={event => onSubmit(event)}>
        {!repairCardId && (
          <select
            className='bg-prisma-blue py-1 px-2 cursor-pointer'
            value={currentSlug}
            onChange={event =>
              setCurrentSlug(event.target.value as RepairCardSlug)
            }
          >
            {selectData
              ?.filter(el => usedSlugsData?.slugs.includes(el.value))
              .map((el, idx) => (
                <option value={el.value} label={el.label} key={idx}></option>
              ))}
          </select>
        )}
        <SpecialInput
          placeholder='Название услуги'
          value={title}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setTitle(event.target.value)
          }}
          autoFocus
        />

        <div className='flex justify-center'>
          <input
            type='radio'
            id={Radio.ONE}
            name='price'
            className={cl.radio}
            checked={radioVal === Radio.ONE}
            onChange={() => {
              setRadioVal(Radio.ONE)
              setRange({ min: '', max: '' })
            }}
          />
          <label htmlFor={Radio.ONE} className={cl.label}>
            Конкретная цена
          </label>
          <input
            type='radio'
            id={Radio.TWO}
            name='price'
            className={cl.radio}
            checked={radioVal === Radio.TWO}
            onChange={() => {
              setRadioVal(Radio.TWO)
              setPrice('')
            }}
          />
          <label htmlFor={Radio.TWO} className={cl.label}>
            Диапазон цен
          </label>
        </div>

        <div className='flex flex-col items-center'>
          {radioVal === Radio.ONE ? (
            <div className='flex items-center gap-3'>
              <SpecialInput
                type='text'
                className={cl.price}
                placeholder='Цена'
                value={price}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setPrice(event.target.value)
                }
              />
              <p className={cl.price__wallet}>руб</p>
            </div>
          ) : (
            radioVal === Radio.TWO && (
              <div className='flex items-center gap-3'>
                <div className='flex gap-2'>
                  <SpecialInput
                    className={cl.price}
                    placeholder='От'
                    value={range.min}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      setRange(prev => ({
                        ...prev,
                        min: event.target.value,
                      }))
                    }
                  />
                  <SpecialInput
                    className={cl.price}
                    placeholder='До'
                    value={range.max}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      setRange(prev => ({
                        ...prev,
                        max: event.target.value,
                      }))
                    }
                  />
                </div>
                <p className={cl.price__wallet}>руб</p>
              </div>
            )
          )}
        </div>

        <button className={cl.button}>{buttonTitle}</button>
      </form>
    </div>
  )
}

export default ServiceCreateWindow
