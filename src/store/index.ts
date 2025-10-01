import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import sessionReducer from './sessionSlice'
import candidatesReducer from './candidatesSlice'
import uiReducer from './uiSlice'

const rootReducer = combineReducers({
  session: sessionReducer,
  candidates: candidatesReducer,
  ui: uiReducer,
})

const persistedReducer = persistReducer(
  {
    key: 'ai-interview-assistant',
    storage,
    whitelist: ['session', 'candidates', 'ui'],
  },
  rootReducer
)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefault) => getDefault({ serializableCheck: false }),
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch


