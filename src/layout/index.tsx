/*
 ** 仅仅是一个布局容器，和路由没有直接关系，和路由相关的视图都在views文件夹下
 */

import { Layout } from 'antd'

import Sider from './sider'
import Header from './header'
import Main from './main'
import Footer from './footer'

import './index.less'

const classPrefix = 'app-layout'
const AppLayout = () => {
	return (
		<div>
			<Layout className={classPrefix}>
				<Sider></Sider>
				<Layout>
					<Header></Header>
					<Main></Main>
					<Footer></Footer>
				</Layout>
			</Layout>
		</div>
	)
}

export default AppLayout
