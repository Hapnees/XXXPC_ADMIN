import React, { forwardRef } from 'react'
import { IField } from './AuthField.interface'
import cl from './AuthField.module.scss'
import { BiErrorCircle } from 'react-icons/bi'

export const AuthField = forwardRef<HTMLInputElement, IField>(
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

AuthField.displayName = 'AuthField'
