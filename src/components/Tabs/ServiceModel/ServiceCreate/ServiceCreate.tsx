import React, { FC } from 'react'
import ServiceModel from '../ServiceModel'

interface IProps {
  title: string
  repairCardId: number
  toBack: () => void
}

const ServiceCreate: FC<IProps> = ({ title, repairCardId, toBack }) => {
  return (
    <div>
      <p className='text-[30px] text-[#7DD3FC] mb-4 text-center'>{title}</p>

      <div>
        <ServiceModel repairCardId={repairCardId} toBack={toBack} />
      </div>
    </div>
  )
}

export default ServiceCreate
