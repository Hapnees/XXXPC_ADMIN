import React, { FC, useState } from 'react'
import cl from './NewModelCreateWindow.module.scss'
import SpecialInput from '@components/UI/AdminSpecialInput/SpecialInput'
import { useCreateNewsMutation, useUpdateNewsMutation } from '@api/news.api'
import { INewsCreate } from '@interfaces/news/news-create.interface'
import { IoClose } from 'react-icons/io5'
import customToast from '@utils/customToast'
import { INewsUpdate } from '@interfaces/news/news-update.interface'

interface IProps {
	toClose: () => void
	news?: INewsUpdate
}

const NewModelCreateWindow: FC<IProps> = ({ toClose, news }) => {
	const [title, setTitle] = useState<string>(news?.title || '')
	const [body, setBody] = useState<string>(news?.body || '')

	const isEdit = !!news
	const buttonText = isEdit ? 'Обновить' : 'Создать'

	const [createNews] = useCreateNewsMutation()
	const [updateNews] = useUpdateNewsMutation()

	const onClickButton = () => {
		const currentNews: INewsCreate = { title, body }

		if (isEdit) {
			updateNews({ ...currentNews, id: news.id })
				.unwrap()
				.then(response => customToast.success(response.message))

			return
		}

		createNews(currentNews)
			.unwrap()
			.then(response => customToast.success(response.message))
	}

	return (
		<div className={cl.container}>
			{/* EDITR WINDOW */}
			<div className='relative bg-prisma-blue p-4 h-[343px]'>
				<IoClose
					className='absolute right-1 top-1 p-1 cursor-pointer'
					size={30}
					onClick={toClose}
				/>
				<p className='text-[20px] text-center'>Новость</p>
				<ul className={cl.menu}>
					<li>
						<p className='text-[18px]'>Заголовок</p>
						<div className='w-[400px]'>
							<SpecialInput
								value={title}
								onChange={event => setTitle(event.target.value)}
							/>
						</div>
					</li>
					<li>
						<p className='text-[18px]'>Содержимое</p>

						<textarea
							className={cl.textarea}
							rows={3}
							value={body}
							onChange={event => setBody(event.target.value)}
						/>
					</li>
				</ul>
				<button className={cl.button} onClick={onClickButton}>
					{buttonText}
				</button>
			</div>
			{/* PREVIEW WINDOW */}
			<div className='bg-prisma-blue py-4 px-6'>
				<p className='text-[20px] text-center'>Превью новости</p>
				<div className={cl.preview__container}>
					<p className={cl.title}>{title}</p>
					<p className={cl.body}>{body}</p>
				</div>
			</div>
		</div>
	)
}

export default NewModelCreateWindow
