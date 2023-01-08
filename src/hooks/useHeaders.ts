import { useAppSelector } from './useAppSelector'

// Возвращаем хедер с аксесс-токеном
export const useHeaders = (token?: string) => {
  const { accessToken } = useAppSelector(state => state.auth)
  const headers = { authorization: `Bearer ${token || accessToken}` }

  return headers
}
