import React from 'react'
import ReactDOM from 'react-dom/client'

/*
 ** SVG图标
 */
// eslint-disable-next-line import/no-unresolved
import 'virtual:svg-icons-register'

/*
 ** react-router-dom
 */
import { RouterProvider } from 'react-router-dom'
import router from './router'

/*
 ** redux-tookit
 */
import { Provider } from 'react-redux'
import store from './redux/store'

import '@/assets/styles/reset.less'

// eslint-disable-next-line import/no-named-as-default-member
ReactDOM.createRoot(document.getElementById('root')!).render(
	<Provider store={store}>
		<React.StrictMode>
			<RouterProvider router={router} />
		</React.StrictMode>
	</Provider>,
)
