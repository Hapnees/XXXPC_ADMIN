import React from 'react'
import cl from './AdminLoader.module.scss'

export const AdminLoader = () => {
  return (
    <div className={cl.rect}>
      <div className={cl.rect1}></div>
      <div className={cl.rect2}></div>
      <div className={cl.rect3}></div>
      <div className={cl.rect4}></div>
      <div className={cl.rect5}></div>
    </div>
  )
}
