export const objectCompare = <T extends { id: number }>(
  objOld: T,
  objNew: T
) => {
  const changes = {} as T
  const { id: idOld, ...currentObjOld } = objOld
  const { id: idNew, ...currentObjNew } = objNew

  let key: keyof typeof currentObjOld
  for (key in currentObjOld) {
    if (currentObjOld[key] !== currentObjNew[key]) {
      changes[key] = currentObjNew[key]
    }
  }

  return {
    id: idOld,
    changes,
  }
}
