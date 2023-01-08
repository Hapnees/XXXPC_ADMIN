import React, { forwardRef } from 'react'
import cl from './AdminAuthField.module.scss'
import { BiErrorCircle } from 'react-icons/bi'
import { IAdminField } from './AuthField.interface'

export const AdminAuthField = forwardRef<HTMLInputElement, IAdminField>(
  ({ error, className, ...props }, ref) => {
    return (
      <div>
        <input className={`${cl.input} ${className}`} ref={ref} {...props} />

        {error && (
          <div className={cl.wrapper__error}>
            <BiErrorCircle size={20} />
            <p>{error.message}</p>
          </div>
        )}
      </div>
    )
  }
)

AdminAuthField.displayName = 'AdminAuthField'
