import SvgIcon from '@/components/svg-icon'
import { Suspense, lazy } from 'react'
import type { RouteObject } from 'react-router-dom'
import Loading from '@/components/loading'

// 路由懒加载方案
const Login = lazy(() => import('@/views/login'))
const AppLayout = lazy(() => import('@/layout/index'))
const NotFound = lazy(() => import('@/views/not-found'))
const Home = lazy(() => import('@/views/home'))
const Screen = lazy(() => import('@/views/screen'))
const User = lazy(() => import('@/views/acl/user'))
const Role = lazy(() => import('@/views/acl/role'))
const Permission = lazy(() => import('@/views/acl/permission'))

type metaObject = {
	show: boolean // 当前路由是否需要显示在menu中, 如果需要子路由显示，则父路由必须显示
	key?: string // 当前路由在menu中对应的路径
	name?: string // 当前路由在menu中对应的名称
	icon?: React.ReactNode // 当前路由在menu中对应的icon
}
/* 
	相较于RouteObject拓展了meta属性
*/
export type enhancedRouteObject = {
	meta: metaObject // 元数据
	children: enhancedRouteObject[]
} & RouteObject

const routes = [
	// 一级路由
	{
		path: '/login',
		element: (
			<Suspense fallback={<Loading />}>
				<Login />
			</Suspense>
		),
		id: 'Login',
		meta: {
			show: false,
		},
	},
	{
		path: '/',
		element: (
			<Suspense fallback={<Loading />}>
				<AppLayout />
			</Suspense>
		),
		id: 'Index',
		meta: {
			show: true,
		},
		children: [
			{
				index: true,
				element: (
					<Suspense fallback={<Loading />}>
						<Home />
					</Suspense>
				),
				id: 'Home',
				meta: {
					show: true,
					key: '/',
					name: '首页',
					icon: <SvgIcon icon="home" />,
				},
			},
		],
	},
	{
		path: '/screen',
		element: (
			<Suspense fallback={<Loading />}>
				<Screen />
			</Suspense>
		),
		id: 'Screen',
		meta: {
			show: true,
			key: '/screen',
			name: '数据大屏',
			icon: <SvgIcon icon="screen" />,
		},
	},
	{
		path: '/acl',
		element: (
			<Suspense fallback={<Loading />}>
				<AppLayout />
			</Suspense>
		),
		id: 'Acl',
		meta: {
			show: true,
			key: '/acl',
			name: '权限管理',
			icon: <SvgIcon icon="lock" />,
		},
		children: [
			{
				index: true,
				element: (
					<Suspense fallback={<Loading />}>
						<User />
					</Suspense>
				),
				id: 'User',
				meta: {
					show: true,
					key: '',
					name: '用户管理',
					icon: <SvgIcon icon="user" />,
				},
			},
			{
				path: 'role',
				element: (
					<Suspense fallback={<Loading />}>
						<Role />
					</Suspense>
				),
				id: 'Role',
				meta: {
					show: true,
					key: 'role',
					name: '角色管理',
					icon: <SvgIcon icon="role" />,
				},
			},
			{
				path: 'permission',
				element: (
					<Suspense fallback={<Loading />}>
						<Permission />
					</Suspense>
				),
				id: 'Permission',
				meta: {
					show: true,
					key: 'permission',
					name: '菜单管理',
					icon: <SvgIcon icon="permission" />,
				},
			},
		],
	},
	{
		path: '/*',
		element: <NotFound />,
		id: 'NotFound',
		meta: {
			show: false,
		},
	},
] as enhancedRouteObject[]

export default routes
