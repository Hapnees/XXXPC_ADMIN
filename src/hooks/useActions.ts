import { bindActionCreators } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import { authActions } from '../redux/slices/auth.slice'
import { tabActions } from '../redux/slices/tab.slice'

const allActions = {
  ...authActions,
  ...tabActions,
}

export const useActions = () => {
  const dispatch = useDispatch()

  return bindActionCreators(allActions, dispatch)
}
