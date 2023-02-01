import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ITab, Tabs, TabsUrl } from '@interfaces/tabs.interface'

interface IState {
	currentTab: ITab
	tabs: ITab[]
}

const initialState: IState = {
	tabs: [],
	currentTab: { title: Tabs.MODELS, url: TabsUrl[Tabs.MODELS] },
}

export const tabSlice = createSlice({
	name: 'tab',
	initialState,
	reducers: {
		addTab: (state, action: PayloadAction<ITab>) => {
			if (!state.tabs.some(el => el.title === action.payload.title))
				state.tabs.push(action.payload)

			const tmp = state.tabs.map(el => el.title)
			const index = tmp.indexOf(action.payload.title)
			if (state.tabs[index].params !== action.payload.params)
				state.tabs[index].params = action.payload.params

			state.currentTab = action.payload
		},
		removeTab: (state, action: PayloadAction<ITab>) => {
			state.tabs = state.tabs.filter(el => el.title !== action.payload.title)
		},

		setCurrentTab: (state, action: PayloadAction<ITab>) => {
			state.currentTab = action.payload
		},
	},
})

export const tabReducer = tabSlice.reducer
export const tabActions = tabSlice.actions
