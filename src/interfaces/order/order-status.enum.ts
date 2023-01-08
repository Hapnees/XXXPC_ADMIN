export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  STOPPED = 'STOPPED',
  REJECTED = 'REJECTED',
}

export enum OrderStatusView {
  PENDING = 'На рассмотрении',
  PROCESSING = 'В процессе',
  COMPLETED = 'Завершён',
  STOPPED = 'Приостановлен',
  REJECTED = 'Отклонён',
}
