import { useMemo } from 'react'
import { Roles } from '@interfaces/roles.interface'
import { useAppSelector } from './useAppSelector'

// Авторизован ли пользователь
export const useAuth = (role: Roles = Roles.USER) => {
  const {
    accessToken,
    refreshToken,
    user: { role: userRole },
  } = useAppSelector(state => state.auth)

  const result = useMemo(() => {
    const isExistTokens = !!accessToken && !!refreshToken
    if (isExistTokens && (userRole === role || userRole === Roles.ADMIN))
      return true

    return false
  }, [accessToken, userRole])

  return result
}
