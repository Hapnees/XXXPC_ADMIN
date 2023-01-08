export const dateFormat = (
  date: string | undefined,
  { withTime }: { withTime: boolean } = { withTime: false }
) => {
  if (!date) return ''

  const temp = date.split('T')[0]
  const splittedDate = temp.split('-')
  const result = splittedDate.reverse().join('.')

  if (withTime) {
    const time = date.split('T')[1]
    const timeResult = time.split(':').slice(0, 2).join(':')

    return `${result} ${timeResult}`
  }
  return result
}
