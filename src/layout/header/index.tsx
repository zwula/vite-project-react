import { Layout } from 'antd'
import './index.less'

const classPrefix = 'header'
const Header = () => {
	return (
		<Layout.Header className={classPrefix}>
			<div className={`${classPrefix}-left`}>123</div>
			<div className={`${classPrefix}-right`}>456</div>
		</Layout.Header>
	)
}

export default Header
