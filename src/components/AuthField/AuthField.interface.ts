import { InputHTMLAttributes } from 'react'
import { FieldError } from 'react-hook-form'

interface IAuthInput {
  error?: FieldError
  title: string
}

type TypeInputPropsField = InputHTMLAttributes<HTMLInputElement> & IAuthInput

export interface IField extends TypeInputPropsField {}
