import {
	FullscreenOutlined,
	RedoOutlined,
	SettingOutlined,
} from '@ant-design/icons'
import { Button, Avatar, Dropdown } from 'antd'
import type { MenuProps } from 'antd'

import './index.less'

const classPrefix = 'right'
const Right = () => {
	const onClick: MenuProps['onClick'] = ({ key }) => {
		console.log('🔥 >> file: index.tsx:14 >> Right >> key:', key)
	}

	const items: MenuProps['items'] = [
		{
			label: '退出登录',
			key: '1',
		},
	]

	return (
		<div className={classPrefix}>
			<Button shape="circle" icon={<RedoOutlined />} />
			<Button shape="circle" icon={<FullscreenOutlined />} />
			<Button shape="circle" icon={<SettingOutlined />} />
			<Avatar shape="circle" src={'../../../../public/vite.svg'} />
			<Dropdown menu={{ items, onClick }}>
				<div>早上好，Tommy</div>
			</Dropdown>
		</div>
	)
}

export default Right
