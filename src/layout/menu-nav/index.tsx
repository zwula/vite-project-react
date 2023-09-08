import { useEffect, useState } from 'react'
import { Menu } from 'antd'
import type { MenuProps } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'
import routes, { enhancedRouteObject } from '@/router/routes'

import './index.less'

type MenuItem = Required<MenuProps>['items'][number]
interface MenuInfo {
	key: string
	keyPath: string[]
	/** @deprecated This will not support in future. You should avoid to use this */
	item: React.ReactInstance
	domEvent: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>
}

const classPrefix = 'menu-nav'

const getPath = (pathArray: string[]) => {
	let path = ''
	const newPathArray = pathArray.reverse()
	newPathArray.forEach((pathItem) => {
		if (pathItem) {
			if (pathItem.startsWith('/')) {
				path += pathItem
			} else {
				path += '/' + pathItem
			}
		}
	})
	return path
}

const getDefaultSelectedKey = (pathname: string): string => {
	const stringArr = pathname.split('/')
	return stringArr[stringArr.length - 1]
}

const getDefaultOpenKey = (pathname: string): string => {
	const stringArr = pathname.split('/')
	let defaultOpenKey = '/'
	for (let index = 0; index < stringArr.length - 1; index++) {
		const element = stringArr[index]
		if (element) {
			defaultOpenKey += element
		}
	}
	return defaultOpenKey
}

const MenuNav = () => {
	const navigate = useNavigate()
	const { pathname } = useLocation()
	const [menuItems, setMenuItems] = useState<MenuItem[]>()
	/* 获取一个menuItem数据 */
	const getMenuItem = (
		label: React.ReactNode,
		key: React.Key,
		icon?: React.ReactNode,
		children?: MenuItem[],
		type?: 'group',
	): MenuItem => {
		return {
			label,
			key,
			icon,
			children,
			type,
		} as MenuItem
	}
	/* 获取所有menuItems */
	const getMenuItmesRecursively = (
		routes: enhancedRouteObject[],
		items: MenuItem[],
	) => {
		routes.forEach((route) => {
			// 需要作为菜单显示
			if (route.meta.show) {
				let menuItem
				// 如果当前路由存在子路由
				/*
				 ** 1. 只有一个子路由，且该子路由不是"Index路由"，则不显示父路由，只显示仅有的子路由
				 */
				if (route.children && route.children.length === 1) {
					menuItem = getMenuItem(
						route.children[0].meta.name,
						route.children[0].meta.key as string,
						route.children[0].meta.icon,
					)
					items.push(menuItem)
					return
				}
				/*
				 ** 2. 有二个子路由，但是第一个子路由是"Index路由"，即用来做路由重定向的"假路由"，则不显示父路由，只显示第二个非"Index路由"
				 */
				if (
					route.children &&
					route.children.length === 2 &&
					route.children[0].meta.show === false
				) {
					menuItem = getMenuItem(
						route.children[1].meta.name,
						route.children[1].meta.key as string,
						route.children[1].meta.icon,
					)
					items.push(menuItem)
					return
				}
				/*
				 ** 3. 存在多个子路由，且第一个子路由不是"Index路由"，则既显示父路由，又显示所有子路由 (这里的子路由指的是非Index路由)
				 */
				if (route.children && route.children.length > 1) {
					// 先获取子路由的数组
					const subRoutesItems: MenuItem[] = []
					getMenuItmesRecursively(route.children, subRoutesItems)
					menuItem = getMenuItem(
						route.meta.name,
						route.meta.key as string,
						route.meta.icon,
						subRoutesItems,
					)
					items.push(menuItem)
					return
				}
				// 如果不存在子路由,则只显示父路由
				menuItem = getMenuItem(
					route.meta.name,
					route.meta.key as string,
					route.meta.icon,
				)
				items.push(menuItem)
			}
		})
	}

	useEffect(() => {
		// 组件初始化时，渲染菜单列表
		const items: MenuItem[] = []
		getMenuItmesRecursively(routes, items)
		setMenuItems(items)
	}, [])

	/* 
		!todo MenuInfo如何引入(虽然目前使用自定义的方式解决了相应的报错，但是并不是最优解)
	*/
	const handleMenuItemClick = (info: MenuInfo) => {
		console.log(
			'🔥 >> file: index.tsx:132 >> handleMenuItemClick >> info:',
			info,
		)
		/* 
			!todo 获取当前选中的路由，修改自定义图标的颜色
		*/

		const { keyPath } = info
		const path = getPath(keyPath)
		navigate(path)
	}

	return (
		<Menu
			defaultOpenKeys={[getDefaultOpenKey(pathname)]}
			defaultSelectedKeys={[getDefaultSelectedKey(pathname)]} // 刷新默认显示首页
			className={classPrefix}
			mode="inline"
			items={menuItems}
			onClick={handleMenuItemClick}
		/>
	)
}

export default MenuNav
