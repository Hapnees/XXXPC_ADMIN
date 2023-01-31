import { Tabs, TabsView } from '@interfaces/tabs.interface'

export const tabTitleFormat = (tab: string) => {
	if (!tab) return ''

	const array = tab.split('/')
	const realTabs = Object.keys(Tabs)

	const result = array.map(el => {
		const tmp = realTabs.find(el2 => el2 === el)
		return TabsView[tmp as keyof typeof TabsView] || el
	})

	return result.join('/')
}
