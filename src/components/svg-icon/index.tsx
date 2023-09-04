import React from 'react'
import { NativeProps, withNativeProps } from '@/utils/native-props'
import useMergeProps from '@/hooks/use-merge-props'

const classPrefix = `com-SvgIcon`

export type SvgIconProps = {
	color?: string
	iconPrefix?: string
	icon: string
	width?: string
	height?: string
} & NativeProps

const defaultProps = {
	color: 'rgba(255,255,255,0.65)',
	iconPrefix: '#icon-',
	icon: '',
	width: '16px',
	height: '16px',
}
type RequireType = keyof typeof defaultProps

const SvgIcon: React.FC<SvgIconProps> = (comProps: SvgIconProps) => {
	const props = useMergeProps<SvgIconProps, RequireType>(
		comProps,
		defaultProps,
	)
	const { ...ret } = props

	return withNativeProps(
		ret,
		<div className={classPrefix}>
			<svg style={{ width: props.width, height: props.height }}>
				<use
					href={props.iconPrefix + props.icon}
					fill={props.color}
				></use>
			</svg>
		</div>,
	)
}

export default SvgIcon
