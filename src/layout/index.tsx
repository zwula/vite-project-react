/*
 ** 仅仅是一个布局容器，和路由没有直接关系，和路由相关的视图都在views文件夹下
 */

import { Layout } from 'antd'
import { Outlet } from 'react-router-dom'
import Logo from './logo'
import MenuNav from './menu-nav'

import './index.less'

const { Header, Footer, Sider, Content } = Layout

const classPrefix = 'app-layout'
const AppLayout = () => {
	return (
		<div>
			<Layout className={classPrefix}>
				<Sider className={`${classPrefix}-sider`}>
					<Logo />
					<MenuNav />
				</Sider>
				<Layout>
					<Header className={`${classPrefix}-header`}>Header</Header>
					<Content className={`${classPrefix}-content`}>
						<Outlet />
					</Content>
					<Footer className={`${classPrefix}-footer`}>Footer</Footer>
				</Layout>
			</Layout>
		</div>
	)
}

export default AppLayout
