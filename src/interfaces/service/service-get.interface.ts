export interface ServiceGetResponse {
  id: number
  title: string
  prices: number[]
  updatedAt: string
  createdAt: string
  _count: {
    Order: number
  }
}
