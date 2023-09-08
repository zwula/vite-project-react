import SvgIcon from '@/components/svg-icon'
import './index.less'
import { Breadcrumb } from 'antd'

const classPrefix = 'left'
const Left = () => {
	return (
		<div className={classPrefix}>
			<SvgIcon
				className={`${classPrefix}-icon`}
				icon="fold"
				width="28px"
				height="28px"
			></SvgIcon>
			<Breadcrumb
				items={[
					{
						title: 'Home',
					},
					{
						title: <a href="">Application Center</a>,
					},
					{
						title: <a href="">Application List</a>,
					},
					{
						title: 'An Application',
					},
				]}
			/>
		</div>
	)
}

export default Left
