import { TypedUseSelectorHook, useSelector } from 'react-redux'
import { TypeRootState } from '../redux/store'

export const useAppSelector: TypedUseSelectorHook<TypeRootState> = useSelector
