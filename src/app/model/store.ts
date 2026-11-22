import { configureStore } from '@reduxjs/toolkit'

// Redux rejects an empty reducer map, so the store starts with a no-op reducer.
// The first real slice replaces it in the next stage.
const emptyReducer = (state: Record<string, never> = {}) => state

export const store = configureStore({
  reducer: emptyReducer,
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
