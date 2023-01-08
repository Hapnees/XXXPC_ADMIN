import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Tabs } from '@interfaces/tabs.interface'

interface IState {
  currentTab: Tabs
  tabs: Tabs[]
}

const initialState: IState = { tabs: [], currentTab: Tabs.MODELS }

export const tabSlice = createSlice({
  name: 'tab',
  initialState,
  reducers: {
    addTab: (state, action: PayloadAction<Tabs>) => {
      state.tabs.push(action.payload)
    },
    removeTab: (state, action: PayloadAction<Tabs>) => {
      state.tabs = state.tabs.filter(el => el !== action.payload)
    },

    setCurrentTab: (state, action: PayloadAction<Tabs>) => {
      state.currentTab = action.payload
    },
  },
})

export const tabReducer = tabSlice.reducer
export const tabActions = tabSlice.actions
