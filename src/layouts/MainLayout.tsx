import React from 'react'
import Header from '@components/Header/Header'
import { Outlet } from 'react-router-dom'
import { useRefreshTokens } from '@hooks/useRefreshTokens'

const MainLayout = () => {
  useRefreshTokens()

  return (
    <div>
      <Header />
      <Outlet />
    </div>
  )
}

export default MainLayout
