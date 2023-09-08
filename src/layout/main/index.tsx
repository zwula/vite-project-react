import { Layout } from 'antd'
import { Outlet } from 'react-router-dom'

import './index.less'

const classPrefix = 'main'
const Main = () => {
	return (
		<Layout.Content className={classPrefix}>
			<Outlet />
		</Layout.Content>
	)
}

export default Main
