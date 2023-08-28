import type { RouteObject } from 'react-router-dom'

import Home from '@/views/home'
import Login from '@/views/login'
import NotFound from '@/views/not-found'

const routes = [
	{
		path: '/',
		element: <Home />,
	},
	{
		path: '/login',
		element: <Login />,
	},
	{
		path: '/*',
		element: <NotFound />,
	},
] as RouteObject[]

export default routes
