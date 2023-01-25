import React, { FC } from 'react'
import { INewsGet } from '@interfaces/news/news-get.interface'
import mainCl from '../../../tabs.module.scss'
import { IFieldMenuElement } from '@interfaces/fieldMenuElement.interface'
import { sortTitles } from '../NewsModel.interface'
import { dateFormat } from '@utils/date.format'

interface IProps {
	news: INewsGet
	setCheckList: React.Dispatch<React.SetStateAction<number[]>>
	checkList: number[]
	checkFieldsList: IFieldMenuElement[]
	openNews: () => void
}

const NewsModelRow: FC<IProps> = ({
	news,
	checkList,
	setCheckList,
	checkFieldsList,
	openNews,
}) => {
	const value = checkList.includes(news.id)

	const onChangeCheck = (event: any) => {
		event.stopPropagation()
		if (value) {
			const newCheckList = [...checkList].filter(el => el !== news.id)
			setCheckList(newCheckList)
			return
		}
		setCheckList(prev => [...prev, news.id])
	}

	return (
		<ul
			className={mainCl.menu}
			style={{
				backgroundColor: value ? 'rgba(177, 39, 39, 0.505)' : '',
			}}
			onClick={openNews}
		>
			<li
				onClick={event => onChangeCheck(event)}
				className={mainCl.short__element}
			>
				<input
					type='checkbox'
					className={mainCl.checkbox}
					checked={value}
					onChange={event => onChangeCheck(event)}
				/>
			</li>
			<li className={mainCl.short__element}>{news.id}</li>
			{checkFieldsList.find(el => el.title === sortTitles.TITLE)?.checked && (
				<li style={{ minWidth: 300 }}>
					<p style={{ minWidth: 300 }}>{news.title}</p>
				</li>
			)}
			{checkFieldsList.find(el => el.title === sortTitles.BODY)?.checked && (
				<li style={{ minWidth: 400 }}>
					<p style={{ minWidth: 400 }}>{news.body}</p>
				</li>
			)}
			{checkFieldsList.find(el => el.title === sortTitles.DATE_UPDATED)
				?.checked && (
				<li className={mainCl.date__element}>
					<p>{dateFormat(news.updatedAt, { withTime: true })}</p>
				</li>
			)}
			{checkFieldsList.find(el => el.title === sortTitles.DATE_CREATED)
				?.checked && (
				<li className={mainCl.date__element}>
					<p>{dateFormat(news.createdAt, { withTime: true })}</p>
				</li>
			)}
		</ul>
	)
}

export default NewsModelRow
