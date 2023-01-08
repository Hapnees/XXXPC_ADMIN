import React from 'react'
import { Route, Routes } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import AuthPage from './pages/AuthPage/AuthPage'
import HomePage from './pages/HomePage'

function App() {
  return (
    <Routes>
      <Route path='/' element={<MainLayout />}>
        <Route path='' element={<HomePage />} />
        <Route path='auth' element={<AuthPage />} />
      </Route>
    </Routes>
  )
}

export default App
