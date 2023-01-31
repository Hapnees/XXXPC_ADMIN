import React from 'react'
import ChatModel from 'src/pages/ChatModel/ChatModel'
import NewsModel from './pages/NewsModel/NewsModel'
import OrderModel from 'src/pages/OrderModel/OrderModel'
import RepairCardModel from './pages/RepairCardModel/RepairCardModel'
import ServiceModel from './pages/ServiceModel/ServiceModel'
import UserModel from 'src/pages/UserModel/UserModel'
import { Route, Routes } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import AuthPage from './pages/AuthPage/AuthPage'
import OpenModelForm from './pages/OpenModel/OpenModelForm'
import RepairCardCreate from './pages/RepairCardModel/RepairCardCreate/RepairCardCreate'
import ChatWithUser from './pages/ChatModel/ChatWithUser/ChatWithUser'

function App() {
	return (
		<Routes>
			<Route path='/' element={<MainLayout />}>
				<Route path='' element={<OpenModelForm />} />
				<Route path='users' element={<UserModel />} />
				<Route path='repair-cards' element={<RepairCardModel />} />
				<Route
					path='repair-cards/repair-card-id/:repairCardId'
					element={<RepairCardCreate />}
				/>
				<Route path='repair-cards/create' element={<RepairCardCreate />} />
				<Route path='services' element={<ServiceModel />} />
				<Route
					path='services/repair-card-id/:repairCardId'
					element={<ServiceModel />}
				/>
				<Route path='orders' element={<OrderModel />} />
				<Route path='orders/userId/:userId' element={<OrderModel />} />
				<Route path='news' element={<NewsModel />} />
				<Route path='chats' element={<ChatModel />} />
				<Route path='chats/user/:userId' element={<ChatWithUser />} />
				<Route path='auth' element={<AuthPage />} />
			</Route>
		</Routes>
	)
}

export default App
