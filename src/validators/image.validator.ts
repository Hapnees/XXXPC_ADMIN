import customToast from '@utils/customToast'
import { fileNameParser } from '@utils/filename.parser'

// Валидация изображения
export const ImageValidator = (fileName: string) => {
  const validExts = ['jpg', 'jpeg', 'png', 'PNG']
  const { ext } = fileNameParser(fileName)
  const isValidExt = validExts.some(el => el === ext)
  if (!isValidExt) {
    customToast.error(`Некорректный формат изображения .${ext}`)
    return
  }
}
