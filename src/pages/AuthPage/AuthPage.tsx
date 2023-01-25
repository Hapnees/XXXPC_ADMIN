import React, { useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useLoginMutation } from '@api/auth.api'
import { ILoginForm } from '@interfaces/auth/loginForm.interface'
import { AdminAuthField } from '@components/UI'
import { useActions, useAuth } from '@hooks/index'
import { Roles } from '@interfaces/roles.interface'
import cl from './AuthPage.module.scss'
import customToast from '@utils/customToast'

const emailPattern =
	/^(([^<>()[\]\.,;:\s@"]+(\.[^<>()[\]\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

const AuthPage = () => {
	const navigte = useNavigate()
	const [loginAdmin] = useLoginMutation()
	const { setAuth } = useActions()
	const isAuth = useAuth(Roles.ADMIN)

	const {
		register,
		formState: { errors },
		handleSubmit,
	} = useForm<ILoginForm>({ mode: 'onBlur' })

	const onSubmit: SubmitHandler<ILoginForm> = async data => {
		loginAdmin(data)
			.unwrap()
			.then(response => {
				setAuth(response)
				navigte('/')
			})
	}

	useEffect(() => {
		if (!isAuth) return

		customToast.info('Вы уже авторизованы')
		setTimeout(() => {
			navigte('/')
		}, 1000)
	}, [])

	return (
		<div className={cl.wrapper}>
			<div className={cl.container}>
				<p className='text-[35px] font-bold text-[#edf2f7] text-center'>
					Авторизация
				</p>
				<form
					className='flex flex-col items-center gap-4'
					onSubmit={handleSubmit(onSubmit)}
				>
					<div className='flex flex-col gap-2'>
						<AdminAuthField
							type='email'
							placeholder='Почта'
							autoFocus
							{...register('email', {
								required: 'Обязательное поле',
								pattern: {
									value: emailPattern,
									message: 'Некорректная почта',
								},
							})}
							error={errors.email}
						/>
						<AdminAuthField
							type='password'
							placeholder='Пароль'
							{...register('password', {
								required: 'Обязательное поле',
								minLength: { value: 6, message: 'Минимум 6 символов' },
							})}
							error={errors.password}
						/>
					</div>

					<button className={cl.button}>Войти</button>
				</form>
			</div>
		</div>
	)
}

export default AuthPage
