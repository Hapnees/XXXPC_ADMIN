import React, { FC } from 'react'
import cl from './ConfirmBlock.module.scss'

interface IProps {
	buttonAction: () => void
}

const ConfirmBlock: FC<IProps> = ({ buttonAction }) => {
	return (
		<div>
			<p className='mb-2'>Изменения не обновлены</p>
			<button className={cl.button} onClick={buttonAction}>
				Всё равно перейти
			</button>
		</div>
	)
}

export default ConfirmBlock
