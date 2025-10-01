import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { ConfigProvider, App as AntApp, theme as antdTheme } from 'antd'
import { store, persistor } from './store'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import 'antd/dist/reset.css'
import './style.css'

import { useSelector } from 'react-redux'
import type { RootState } from './store'

const Root = () => {
  const mode = useSelector((s: RootState) => s.ui.theme)
  const algorithm = mode === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm
  document.documentElement.setAttribute('data-theme', mode)
  return (
    <ConfigProvider theme={{ algorithm }}>
      <AntApp>
        <RouterProvider router={router} />
      </AntApp>
    </ConfigProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Root />
      </PersistGate>
    </Provider>
  </React.StrictMode>
)


