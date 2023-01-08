import { InputHTMLAttributes } from 'react'
import { FieldError } from 'react-hook-form'

interface IAdminAuthInput {
  error?: FieldError
  width?: number
  background?: string
}

type TypeInputPropsField = InputHTMLAttributes<HTMLInputElement> &
  IAdminAuthInput

export interface IAdminField extends TypeInputPropsField {}
