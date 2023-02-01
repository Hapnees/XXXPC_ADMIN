import SpecialInput from '@components/UI/AdminSpecialInput/SpecialInput'
import React, { FC, HTMLAttributes, SetStateAction } from 'react'
import { HiSearch } from 'react-icons/hi'

interface IProps {
	value: string
	setValue: React.Dispatch<SetStateAction<string>>
	onKeyDown: (event: React.KeyboardEvent) => void
	eventSearch: () => void
}

const SearchInputWithButton: FC<IProps & HTMLAttributes<HTMLInputElement>> = ({
	setValue,
	value,
	onKeyDown,
	eventSearch,
	...props
}) => {
	return (
		<div className='flex items-center gap-2'>
			<div className='w-[400px]'>
				<SpecialInput
					value={value}
					onChange={event => setValue(event.target.value)}
					onKeyDown={event => onKeyDown(event)}
					autoFocus={true}
					{...props}
				/>
			</div>
			<HiSearch
				className='bg-[#434e62] w-[70px] h-[35px] p-1 rounded-md cursor-pointer'
				onClick={eventSearch}
			/>
		</div>
	)
}

export default SearchInputWithButton
