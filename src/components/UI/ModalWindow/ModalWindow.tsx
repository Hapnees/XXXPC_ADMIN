import React, { FC } from 'react'
import cl from './ModalWindow.module.scss'

interface IProps {
	children: React.ReactNode
	shadow?: boolean
}

const ModalWindow: FC<IProps> = ({ children, shadow = true }) => {
	const className = shadow ? cl.container : ''

	return (
		<div className={cl.wrapper}>
			<div className={className}>{children}</div>
		</div>
	)
}

export default ModalWindow
