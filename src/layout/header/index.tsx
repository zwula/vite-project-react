import { Layout } from 'antd'
import Left from './Left'
import Right from './Right'
import './index.less'

const classPrefix = 'header'
const Header = () => {
	return (
		<Layout.Header className={classPrefix}>
			<Left />
			<Right />
		</Layout.Header>
	)
}

export default Header
