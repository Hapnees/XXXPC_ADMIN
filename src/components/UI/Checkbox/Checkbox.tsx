import React, { FC, SetStateAction } from 'react'
import { BsCheckLg } from 'react-icons/bs'
import cl from './Checkbox.module.scss'

interface IProps {
	isShow: boolean
	setIsShow: React.Dispatch<SetStateAction<boolean>>
	title?: string
}

const Checkbox: FC<IProps> = ({ isShow, setIsShow, title }) => {
	return (
		<div className={cl.wrapper}>
			<input
				type='checkbox'
				id='checkbox'
				className='hidden'
				checked={isShow}
				onChange={() => setIsShow(!isShow)}
			/>
			<div className={cl.checkbox}>
				<BsCheckLg className={cl.mark} />
			</div>
			{!!title && (
				<label htmlFor='checkbox' className={cl.label}>
					{title}
				</label>
			)}
		</div>
	)
}

export default Checkbox
