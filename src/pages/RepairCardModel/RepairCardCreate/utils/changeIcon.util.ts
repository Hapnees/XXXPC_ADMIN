import { ImageValidator } from '@validators/image.validator'

export const changeIcon =
  (
    setIcon: (value: React.SetStateAction<File | undefined>) => void,
    setIconUrl: (value: React.SetStateAction<string>) => void
  ) =>
  (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return

    const file = event.target.files[0]
    ImageValidator(file.name)

    setIcon(file)
    const url = URL.createObjectURL(file)
    setIconUrl(url)
  }
