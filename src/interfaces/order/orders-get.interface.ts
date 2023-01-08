export interface OrdersGetResponse {
  id: number
  comment: string
  status: string
  note: string
  price?: number
  priceRange?: number[]
  updatedAt: string
  createdAt: string
  User: {
    username: string
  }
  service: {
    title: string
  }
}
