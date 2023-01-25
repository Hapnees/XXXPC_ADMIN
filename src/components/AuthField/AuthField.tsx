import React, { forwardRef } from 'react'
import SpecialInput from '@components/UI/AdminSpecialInput/SpecialInput'
import { CSSTransition } from 'react-transition-group'
import { IField } from './AuthField.interface'
import cl from './AuthField.module.scss'

const AuthField = forwardRef<HTMLInputElement, IField>(
	({ error, title, ...props }, ref) => {
		return (
			<>
				<p>{title}</p>
				<SpecialInput {...props} ref={ref} />
				<CSSTransition
					in={!!error?.message}
					timeout={300}
					classNames='alert'
					unmountOnExit
				>
					<div className={cl.error}>{error?.message}</div>
				</CSSTransition>
			</>
		)
	}
)

AuthField.displayName = 'AuthField'

export default AuthField
