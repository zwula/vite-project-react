import settings from '@/settings'
import './index.less'

const classPrefix = 'logo'

const Logo = () => {
	return (
		<div className={classPrefix}>
			{settings.logo.show && (
				<img
					className={`${classPrefix}-img`}
					src={settings.logo.url}
					alt=""
				/>
			)}
			<span className={`${classPrefix}-title`}>
				{settings.logo.title}
			</span>
		</div>
	)
}

export default Logo
