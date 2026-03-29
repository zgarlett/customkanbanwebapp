import { createSlice } from '@reduxjs/toolkit'

interface AppState {
  theme: 'light' | 'dark'
  isLoading: boolean
}

const initialState: AppState = {
  theme: 'light',
  isLoading: false,
}

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light'
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload
    },
  },
})

export const { toggleTheme, setIsLoading } = appSlice.actions
export default appSlice.reducer
