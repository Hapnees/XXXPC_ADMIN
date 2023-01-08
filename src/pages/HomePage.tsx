import React, { useEffect, useMemo } from 'react'
import OpenModelForm from '@components/Tabs/OpenModel/OpenModelForm'
import UserModel from '@components/Tabs/UserModel/UserModel'
import RepairCardModel from '@components/Tabs/RepairCardModel/RepairCardModel'
import ServiceModel from '@components/Tabs/ServiceModel/ServiceModel'
import OrderModel from '@components/Tabs/OrderModel/OrderModel'
import { useAppSelector } from '@hooks/useAppSelector'
import { Tabs } from '@interfaces/tabs.interface'
import ModelLayout from '@layouts/ModelLayout/ModelLayout'
import { useAuth } from '@hooks/useAuth'
import { Roles } from '@interfaces/roles.interface'
import { useNavigate } from 'react-router-dom'
import customToast from '@utils/customToast'
import { AdminLoader } from '@components/UI'

const HomePage = () => {
  const { currentTab } = useAppSelector(state => state.tab)

  const isAuth = useAuth(Roles.ADMIN)
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuth) {
      customToast.error('Вы не являетесь администратором')
      setTimeout(() => navigate('/auth'), 1500)
    }
  }, [isAuth])

  const viewTab = useMemo(() => {
    switch (currentTab) {
      case Tabs.MODELS:
        return <OpenModelForm />
      case Tabs.USER:
        return <UserModel />
      case Tabs.REPAIRCARD:
        return <RepairCardModel />
      case Tabs.SERVICE:
        return <ServiceModel />
      case Tabs.ORDER:
        return <OrderModel />
    }
  }, [currentTab])

  if (!isAuth) return <AdminLoader />

  return <ModelLayout>{viewTab}</ModelLayout>
}

export default HomePage
