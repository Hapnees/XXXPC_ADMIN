export interface OrderGetResponse {
  id: number
  comment: string
  status: string
  price?: number
  priceRange?: number[]
  createdAt: string
  service: {
    title: string
  }
}
