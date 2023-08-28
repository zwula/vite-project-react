import React from 'react'
import ReactDOM from 'react-dom/client'

// eslint-disable-next-line import/no-unresolved
import 'virtual:svg-icons-register'

import { RouterProvider } from 'react-router-dom'
import router from './router'

import '@/assets/styles/reset.less'

// eslint-disable-next-line import/no-named-as-default-member
ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>,
)
