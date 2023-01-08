import { IRepairCardCreate } from '@interfaces/repair-card'

export const makeMenusForRequest = (repairCard: IRepairCardCreate) => {
  const result = repairCard.menus.map(menu => {
    const { id, isCreated, ...menuWithoutId } = menu
    const paragraphsForRequest = menu.paragraphs.map(p => {
      const { id, isCreated, ...paragraphWithoutId } = p
      return p.isCreated ? paragraphWithoutId : p
    })
    menuWithoutId.paragraphs = paragraphsForRequest

    return menu.isCreated ? menuWithoutId : { id: menu.id, ...menuWithoutId }
  })

  return result
}
