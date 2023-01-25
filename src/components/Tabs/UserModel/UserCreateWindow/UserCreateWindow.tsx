import React, { FC, useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { IUserCreate } from '@interfaces/user/user-create.interface'
import AuthField from '@components/AuthField/AuthField'
import cl from './UserCreateWindow.module.scss'
import { Roles, RolesView } from '@interfaces/roles.interface'
import { useCreateUserMutation, useUpdateUserMutation } from '@api/user.api'
import customToast from '@utils/customToast'
import { IoClose } from 'react-icons/io5'
import { IUserUpdate } from '@interfaces/user'
import { Obj } from 'reselect/es/types'
import { objectCompare } from '@utils/objectCompare.util'

const emailPattern =
	/^(([^<>()[\]\.,;:\s@"]+(\.[^<>()[\]\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

const options = Object.keys(Roles).filter(el => el !== Roles.VISITOR)

interface IProps {
	toBack: () => void
	isEdit?: boolean
	user?: IUserUpdate
}

const UserCreateWindow: FC<IProps> = ({ toBack, isEdit, user }) => {
	const [create] = useCreateUserMutation()
	const [update] = useUpdateUserMutation()

	const title = isEdit ? 'Редактирование пользователя' : 'Создание пользователя'
	const titlePassword = isEdit ? 'Новый пароль' : 'Пароль'
	const titleButton = isEdit ? 'Обновить' : 'Создать'

	const passwordParams = () => {
		const result: Obj<any> = {
			minLength: { value: 6, message: 'Минимум 6 символов' },
		}

		if (!isEdit) {
			result['required'] = 'Обязательное поле'
		}

		return result
	}

	const {
		register,
		formState: { errors },
		handleSubmit,
		setValue,
	} = useForm<IUserCreate>({ mode: 'onBlur' })

	const onSubmit: SubmitHandler<IUserCreate | IUserUpdate> = data => {
		if (!data.phone) delete data.phone
		if (!data.password) delete data.password

		if (isEdit && user?.id) {
			if (objectCompare(user, data as IUserUpdate))
				update({ ...data, id: user.id })
					.unwrap()
					.then(response => {
						customToast.success(response.message)
					})

			toBack()
			return
		}

		create(data as IUserCreate)
			.unwrap()
			.then(response => {
				customToast.success(response.message)
				toBack()
			})
	}

	useEffect(() => {
		if (!user) return

		setValue('username', user.username)
		setValue('email', user.email)
		setValue('phone', user.phone)

		if (user.role) setValue('role', user.role)
	}, [user])

	return (
		<form
			className='relative bg-prisma-blue flex flex-col px-4 py-2'
			onSubmit={handleSubmit(onSubmit)}
		>
			<IoClose
				className='absolute right-2 top-2 cursor-pointer p-1'
				size={30}
				onClick={toBack}
			/>
			<p className='text-[22px] tracking-wide text-center'>{title}</p>

			<ul className={cl.menu}>
				<li>
					<AuthField
						title='Имя пользователя'
						placeholder='Имя пользователя'
						type='text'
						autoFocus
						{...register('username', {
							required: 'Обязательное поле',
							minLength: { value: 3, message: 'Минимум 3 символа' },
						})}
						error={errors.username}
					/>
				</li>
				<li>
					<AuthField
						title='Почта'
						placeholder='Почта'
						type='email'
						{...register('email', {
							required: 'Обязательное поле',
							pattern: {
								value: emailPattern,
								message: 'Некорректный email',
							},
						})}
						error={errors.email}
					/>
				</li>
				<li>
					<AuthField
						title={titlePassword}
						placeholder={titlePassword}
						type='password'
						{...register('password', passwordParams())}
						error={errors.password}
					/>
				</li>
				<li>
					<AuthField
						title='№ телефона'
						placeholder='№ телефона'
						{...register('phone', {
							minLength: { value: 6, message: 'Минимум 6 символов' },
						})}
						error={errors.phone}
					/>
				</li>
				<li>
					<p>Роль</p>
					<select
						className={cl.select}
						defaultValue={Roles.USER}
						{...register('role')}
					>
						{options.map(el => (
							<option key={el} value={el}>
								{RolesView[el as keyof typeof RolesView]}
							</option>
						))}
					</select>
				</li>
			</ul>
			<button className={cl.button}>{titleButton}</button>
		</form>
	)
}

export default UserCreateWindow
