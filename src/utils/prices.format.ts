export const pricesFormat = (prices: number[]) => {
  if (prices.length === 2) {
    const min = Math.min(...prices)
    const max = Math.max(...prices)

    return `от ${min} руб до ${max} руб`
  } else if (prices.length === 1) {
    return `${prices[0]} руб`
  }

  return ''
}
