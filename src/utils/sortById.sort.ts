export const sortById = <T extends { id?: number }>(array: T[]) => {
  return array
    .sort((a, b) => {
      if (a.id) {
        if (b.id) return a.id - b.id
        else return a.id
      }
      return b.id ? b.id : 0
    })
    .sort((a, b) => {
      if (a.id) {
        if (b.id) return a.id - b.id
        else return a.id
      }
      return b.id ? b.id : 0
    })
}
