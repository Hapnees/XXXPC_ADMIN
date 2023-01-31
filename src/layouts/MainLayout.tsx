import React, { useEffect } from 'react'
import Header from '@components/Header/Header'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useRefreshTokens } from '@hooks/useRefreshTokens'
import { useAuth } from '@hooks/useAuth'
import customToast from '@utils/customToast'

import ModelLayout from './ModelLayout/ModelLayout'
import { AdminLoader } from '@components/UI'

const MainLayout = () => {
	// Обновляем токены
	useRefreshTokens()

	const navigate = useNavigate()
	const location = useLocation()
	const isAuth = useAuth()

	useEffect(() => {
		if (!isAuth) {
			customToast.error('Вы не являетесь администратором')
			setTimeout(() => navigate('/auth'), 1500)
		}
	}, [isAuth])

	if (!isAuth && location.pathname !== '/auth') return <AdminLoader />

	return (
		<div>
			<Header />
			<ModelLayout>
				<Outlet />
			</ModelLayout>
		</div>
	)
}

export default MainLayout
