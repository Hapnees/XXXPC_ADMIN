import { IRepairCardParagraph } from './repair-card-paragraph.interface'

export interface IRepairCardMenu {
  id?: number
  title: string
  paragraphs: IRepairCardParagraph[]
  isCreated?: boolean
}
