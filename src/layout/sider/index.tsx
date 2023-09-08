import { Layout } from 'antd'
import Logo from './logo'
import MenuNav from './menu-nav'
import './index.less'

const classPrefix = 'sider'

const Sider = () => {
	return (
		<Layout.Sider className={classPrefix}>
			<Logo />
			<MenuNav />
		</Layout.Sider>
	)
}

export default Sider
