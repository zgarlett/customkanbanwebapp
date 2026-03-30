import { configureStore } from '@reduxjs/toolkit'
import appReducer from './slices/appSlice'
import boardsReducer from './slices/boardsSlice'
import tasksReducer from './slices/tasksSlice'
import uiReducer from './slices/uiSlice'

export const store = configureStore({
  reducer: {
    app: appReducer,
    boards: boardsReducer,
    tasks: tasksReducer,
    ui: uiReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
