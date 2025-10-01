import { createSlice } from '@reduxjs/toolkit'

export interface UiState {
  theme: 'light' | 'dark'
}

const initialState: UiState = {
  theme: 'light',
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme(state) {
      state.theme = state.theme === 'light' ? 'dark' : 'light'
    },
    setTheme(state, action: { payload: UiState['theme'] }) {
      state.theme = action.payload
    },
  },
})

export const { toggleTheme, setTheme } = uiSlice.actions
export default uiSlice.reducer


