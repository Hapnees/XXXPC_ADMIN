export const objectCompare = <T extends object, P extends T>(
	objOld: T,
	objNew: P
) => {
	const keysOld = Object.keys(objOld)
	const keysNew = Object.keys(objNew)

	const result = []
	for (let i = 0; i < keysOld.length; i++) {
		const currentKey = keysOld[i] as keyof typeof objOld
		if (keysNew.includes(currentKey as string)) {
			if (Array.isArray(objOld[currentKey])) {
				if (
					JSON.stringify(objOld[currentKey]) !==
					JSON.stringify(objNew[currentKey])
				) {
					// console.log(objOld[currentKey])
					// console.log(objNew[currentKey])

					result.push(currentKey)
				}
			} else if (objOld[currentKey] !== objNew[currentKey]) {
				// console.log(objOld[currentKey])
				// console.log(objNew[currentKey])

				result.push(currentKey)
			}
		}
	}

	return !!result.length
}
