import { useEffect } from 'react'
import { useRefreshTokensMutation } from '../api/auth.api'
import { useActions, useAuth } from '@hooks/index'

export const useRefreshTokens = () => {
  const { setAuth, authSetIsNeeded } = useActions()
  const [refreshTokens] = useRefreshTokensMutation()
  const isAuth = useAuth()

  // Обновляем токены при входе на сайт
  useEffect(() => {
    if (!isAuth) return

    authSetIsNeeded(true)
    refreshTokens()
      .unwrap()
      .then(response =>
        setAuth({
          accessToken: response.tokens.accessToken,
          refreshToken: response.tokens.refreshToken,
          user: { role: response.role },
        })
      )
  }, [])

  // Обновляем токены каждые 14 минут
  useEffect(() => {
    if (!isAuth) return

    const interval = setInterval(() => {
      authSetIsNeeded(true)
      refreshTokens()
        .unwrap()
        .then(response => {
          console.log('REFRESH TOKENS')
          setAuth({
            accessToken: response.tokens.accessToken,
            refreshToken: response.tokens.refreshToken,
            user: { role: response.role },
          })
        })
    }, 60_000 * 15)

    return () => clearInterval(interval)
  }, [isAuth])
}
