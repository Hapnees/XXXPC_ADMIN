export const fileNameParser = (fileName: string) => {
  const temp = fileName.split('.')

  const name = temp.slice(0, temp.length - 1).join('.')
  const ext = temp.at(-1)

  return { name, ext }
}
