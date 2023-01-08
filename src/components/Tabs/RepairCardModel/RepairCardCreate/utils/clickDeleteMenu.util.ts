import { IRepairCardMenu } from '@interfaces/repair-card'

export const clickDeleteMenu =
  (
    setMenus: (value: React.SetStateAction<IRepairCardMenu[]>) => void,
    setMenuDeletedIds: (value: React.SetStateAction<number[]>) => void,
    menus: IRepairCardMenu[]
  ) =>
  (event: React.ChangeEvent<SVGImageElement>, id: number) => {
    event.stopPropagation()
    setMenus(prev => prev.filter(el => el.id !== id))
    const currentMenu = menus.find(el => el.id === id)
    if (currentMenu && !currentMenu.isCreated)
      setMenuDeletedIds(prev => [...prev, id])
  }
