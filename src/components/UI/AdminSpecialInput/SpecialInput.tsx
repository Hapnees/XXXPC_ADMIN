import React, { forwardRef, HTMLProps } from 'react'
import cl from './SpecialInput.module.scss'

const SpecialInput = forwardRef<HTMLInputElement, HTMLProps<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return <input className={`${cl.input} ${className}`} {...props} ref={ref} />
  }
)

SpecialInput.displayName = 'SpecialInput'

export default SpecialInput
