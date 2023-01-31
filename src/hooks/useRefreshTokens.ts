import { useEffect } from 'react'
import { useRefreshTokensMutation } from '../api/auth.api'
import { useActions, useAppSelector, useAuth } from '@hooks/index'
import { useUpdateOnlineMutation } from '@api/user.api'

export const useRefreshTokens = () => {
	const { setAuth, authSetIsNeeded, setUpdatedOnline } = useActions()
	const [refreshTokens] = useRefreshTokensMutation()
	const [updateOnline] = useUpdateOnlineMutation()
	const isAuth = useAuth()
	const { isNeededRefresh } = useAppSelector(state => state.auth)

	const handler = (event: BeforeUnloadEvent) => {
		event.preventDefault()
		updateOnline({ isOnline: false })
	}

	// Обновляем токены при входе на сайт
	useEffect(() => {
		if (!isAuth) return

		// authSetIsNeeded(true)
		refreshTokens()
			.unwrap()
			.then(response => {
				window.addEventListener('beforeunload', handler)

				setAuth({
					accessToken: response.tokens.accessToken,
					refreshToken: response.tokens.refreshToken,
					user: { role: response.role },
				})
			})

		return () => window.removeEventListener('beforeunload', handler)
	}, [])

	useEffect(() => {
		if (isNeededRefresh) return

		updateOnline({ isOnline: true })
			.unwrap()
			.then(() => {
				setUpdatedOnline(true)
			})
	}, [isNeededRefresh])

	// Обновляем токены каждые 14 минут
	useEffect(() => {
		if (!isAuth) return

		const interval = setInterval(() => {
			authSetIsNeeded(true)
			refreshTokens()
				.unwrap()
				.then(response => {
					setAuth({
						accessToken: response.tokens.accessToken,
						refreshToken: response.tokens.refreshToken,
						user: { role: response.role },
					})
				})
		}, 60_000 * 14)

		return () => clearInterval(interval)
	}, [isAuth])
}
