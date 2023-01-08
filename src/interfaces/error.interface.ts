export interface IError {
  status: number
  data: {
    error: string
    messages?: string[]
    message?: string
    statusCode: number
  }
}
