import { useEffect, useState } from 'react'
import { Menu } from 'antd'
import type { MenuProps } from 'antd'
import { useNavigate } from 'react-router-dom'
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

const MenuNav = () => {
	const navigate = useNavigate()
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
				if (route.children && route.children.length === 1) {
					// 有且只有一个子路由，则不显示父路由，只显示仅有的子路由
					menuItem = getMenuItem(
						route.children[0].meta.name,
						route.children[0].meta.key as string,
						route.children[0].meta.icon,
					)
					items.push(menuItem)
					return
				}
				if (route.children && route.children.length > 1) {
					// 存在多个子路由，则既显示父路由，又显示所有子路由

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
		setMenuItems(items)
	}

	useEffect(() => {
		// 组件初始化时，渲染菜单列表
		const items: MenuItem[] = []
		getMenuItmesRecursively(routes, items)
	}, [])

	/* 
		!todo MenuInfo如何引入
	*/
	const handleMenuItemClick = (info: MenuInfo) => {
		const { keyPath } = info
		const path = getPath(keyPath)
		navigate(path)
	}

	return (
		<Menu
			className={classPrefix}
			mode="inline"
			items={menuItems}
			onClick={handleMenuItemClick}
		/>
	)
}

export default MenuNav
