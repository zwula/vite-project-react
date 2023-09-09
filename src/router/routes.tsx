import SvgIcon from '@/components/svg-icon'
import { Suspense, lazy } from 'react'
import { Navigate, type RouteObject } from 'react-router-dom'
import Loading from '@/components/loading'

// 路由懒加载方案
/*
 ** AppLayout仅为视图布局容器，和路由的组织毫无关系，完全可以根据路由需求灵活的使用AppLayout视图布局容器
 */
const AppLayout = lazy(() => import('@/layout/index'))

const Login = lazy(() => import('@/views/login'))
const NotFound = lazy(() => import('@/views/not-found'))
const Home = lazy(() => import('@/views/home'))
const Screen = lazy(() => import('@/views/screen'))
const User = lazy(() => import('@/views/acl/user'))
const Role = lazy(() => import('@/views/acl/role'))
const Permission = lazy(() => import('@/views/acl/permission'))
const Trademark = lazy(() => import('@/views/product/trademark'))
const Attr = lazy(() => import('@/views/product/attr'))
const Sku = lazy(() => import('@/views/product/sku'))
const Spu = lazy(() => import('@/views/product/spu'))

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
		id: 'HomeLayout',
		meta: {
			show: true,
		},
		children: [
			// "Index路由" --> 该子路由存在的意义是为了实现路由重定向,整体相当于之前的redirect:"/home"
			{
				index: true,
				element: <Navigate to={'home'} />,
				id: 'HomeIndex',
				meta: {
					show: false,
				},
			},
			{
				path: 'home',
				element: (
					<Suspense fallback={<Loading />}>
						<Home />
					</Suspense>
				),
				id: 'Home',
				meta: {
					show: true,
					key: 'home',
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
		id: 'AclLayout',
		meta: {
			show: true,
			key: '/acl',
			name: '权限管理',
			icon: <SvgIcon icon="lock" />,
		},
		children: [
			// 该子路由存在的意义是为了实现路由重定向
			{
				index: true,
				element: <Navigate to="user" />,
				id: 'AclIndex',
				meta: {
					show: false,
				},
			},
			{
				path: 'user',
				element: (
					<Suspense fallback={<Loading />}>
						<User />
					</Suspense>
				),
				id: 'User',
				meta: {
					show: true,
					key: 'user',
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
				// 测试多级路由表现情况
				children: [
					// 该子路由存在的意义是为了实现路由重定向
					{
						index: true,
						element: <Navigate to="user1" />,
						id: 'AclIndex1',
						meta: {
							show: false,
						},
					},
					{
						path: 'user1',
						element: (
							<Suspense fallback={<Loading />}>
								<User />
							</Suspense>
						),
						id: 'User1',
						meta: {
							show: true,
							key: 'user1',
							name: '用户管理',
							icon: <SvgIcon icon="user" />,
						},
					},
					{
						path: 'role1',
						element: (
							<Suspense fallback={<Loading />}>
								<Role />
							</Suspense>
						),
						id: 'Role1',
						meta: {
							show: true,
							key: 'role1',
							name: '角色管理',
							icon: <SvgIcon icon="role" />,
						},
					},
				],
			},
		],
	},
	{
		path: '/product',
		element: (
			<Suspense fallback={<Loading />}>
				<AppLayout />
			</Suspense>
		),
		id: 'ProductLayout',
		meta: {
			show: true,
			key: '/product',
			name: '商品管理',
			icon: <SvgIcon icon="product" />,
		},
		children: [
			// 该子路由存在的意义是为了实现路由重定向
			{
				index: true,
				element: <Navigate to="trademark" />,
				id: 'ProductIndex',
				meta: {
					show: false,
				},
			},
			{
				path: 'trademark',
				element: (
					<Suspense fallback={<Loading />}>
						<Trademark />
					</Suspense>
				),
				id: 'Trademark',
				meta: {
					show: true,
					key: 'trademark',
					name: '品牌管理',
					icon: <SvgIcon icon="trademark" />,
				},
			},
			{
				path: 'attr',
				element: (
					<Suspense fallback={<Loading />}>
						<Attr />
					</Suspense>
				),
				id: 'Attr',
				meta: {
					show: true,
					key: 'attr',
					name: '属性管理',
					icon: <SvgIcon icon="attr" />,
				},
			},
			{
				path: 'sku',
				element: (
					<Suspense fallback={<Loading />}>
						<Sku />
					</Suspense>
				),
				id: 'Sku',
				meta: {
					show: true,
					key: 'sku',
					name: 'sku管理',
					icon: <SvgIcon icon="sku" />,
				},
			},
			{
				path: 'spu',
				element: (
					<Suspense fallback={<Loading />}>
						<Spu />
					</Suspense>
				),
				id: 'Spu',
				meta: {
					show: true,
					key: 'spu',
					name: 'spu管理',
					icon: <SvgIcon icon="spu" />,
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
