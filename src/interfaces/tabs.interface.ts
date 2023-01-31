export enum Tabs {
	MODELS = 'MODELS',
	USER = 'USER',
	REPAIRCARD = 'REPAIRCARD',
	SERVICE = 'SERVICE',
	ORDER = 'ORDER',
	NEWS = 'NEWS',
	CHAT = 'CHAT',
}

export enum TabsView {
	MODELS = 'Модели',
	USER = 'Пользователи',
	REPAIRCARD = 'Карточки ремонта',
	SERVICE = 'Услуги',
	ORDER = 'Заказы',
	NEWS = 'Новости',
	CHAT = 'Чаты',
}

export enum TabsUrl {
	MODELS = '/',
	USER = 'users',
	REPAIRCARD = 'repair-cards',
	SERVICE = 'services',
	ORDER = 'orders',
	NEWS = 'news',
	CHAT = 'chats',
}

// export enum TabsFromUrl {
// 	models = 'MODELS',
// 	users = 'USER',
// 	'repair-cards' = 'REPAIRCARD',
// 	services = 'SERVICE',
// 	orders = 'ORDER',
// 	news = 'NEWS',
// 	chats = 'CHAT',
// }

export interface ITab {
	title: string
	url: string
}
