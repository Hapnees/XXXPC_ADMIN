import React from 'react'
import Header from '@components/Header/Header'
import { Outlet } from 'react-router-dom'
import { useRefreshTokens } from '@hooks/useRefreshTokens'
import { useUpdateOnlineMutation } from '@api/user.api'

const MainLayout = () => {
  const [updateOnline] = useUpdateOnlineMutation()

  // Обновляем токены
  useRefreshTokens()

  return (
    <div>
      <Header />
      <Outlet />
    </div>
  )
}

export default MainLayout
