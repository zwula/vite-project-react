import { Spin } from 'antd'
import './index.less'

const classPrefix = `loading`

const Loading = () => {
	return (
		<div className={classPrefix}>
			<Spin className={`${classPrefix}-spin`} size="large" />
		</div>
	)
}

export default Loading
