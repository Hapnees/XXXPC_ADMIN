import { useLogoutMutation } from '@api/auth.api'
import { useActions } from '@hooks/useActions'
import React, { forwardRef } from 'react'
import cl from './PopupWindow.module.scss'

const PopupWindow = forwardRef<HTMLUListElement>((props, ref) => {
  const [logout] = useLogoutMutation()
  const { authLogout } = useActions()

  const onClickLogout = () => {
    logout()
      .unwrap()
      .then(() => authLogout())
  }

  return (
    <ul className={cl.menu} ref={ref}>
      <li>Профиль</li>
      <li onClick={onClickLogout}>Выйти</li>
    </ul>
  )
})

PopupWindow.displayName = 'PopupWindow'

export default PopupWindow
