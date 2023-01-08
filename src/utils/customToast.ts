import React from 'react'
import { toast } from 'react-toastify'

const customToast = {
  success(msg: string | React.ReactNode, options = {}) {
    return toast.success(msg, {
      ...options,
      style: { backgroundColor: '#009d7b', fontFamily: 'Roboto' },
    })
  },
  error(msg: string | React.ReactNode, options = {}) {
    return toast.error(msg, {
      ...options,
      style: { backgroundColor: '#C10005', fontFamily: 'Roboto' },
    })
  },
  info(msg: string | React.ReactNode, options = {}) {
    return toast.info(msg, { ...options, style: { fontFamily: 'Roboto' } })
  },
}

export default customToast
