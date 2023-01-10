import { useEffect } from 'react'
import { useRefreshTokensMutation } from '../api/auth.api'
import { useActions, useAuth } from '@hooks/index'
import { useUpdateOnlineMutation } from '@api/user.api'

export const useRefreshTokens = () => {
  const { setAuth, authSetIsNeeded } = useActions()
  const [refreshTokens] = useRefreshTokensMutation()
  const [updateOnline] = useUpdateOnlineMutation()
  const isAuth = useAuth()

  const handler = (event: BeforeUnloadEvent) => {
    event.preventDefault()
    updateOnline({ isOnline: false })
    return ''
  }

  // Обновляем токены при входе на сайт
  useEffect(() => {
    if (!isAuth) return
    updateOnline({ isOnline: true })

    authSetIsNeeded(true)
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
  }, [updateOnline])

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
    }, 60_000 * 15)

    return () => clearInterval(interval)
  }, [isAuth])
}
