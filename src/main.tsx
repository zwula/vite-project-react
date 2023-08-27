import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
// eslint-disable-next-line import/no-unresolved
import 'virtual:svg-icons-register'
import '@/assets/styles/reset.less'

const router = createBrowserRouter([
	{
		path: '/',
		element: <div>Hello world!</div>,
	},
])

// eslint-disable-next-line import/no-named-as-default-member
ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>,
)
