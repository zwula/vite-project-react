import classNames from 'classnames'
import type { CSSProperties, ReactElement } from 'react'
import { cloneElement } from 'react'

export type NativeProps<S extends string = never> = {
	className?: string
	style?: CSSProperties & Partial<Record<S, string>>
}

export function withNativeProps<P extends NativeProps>(
	props: P,
	element: ReactElement,
) {
	const p = {
		...element.props,
	}
	if (props.className) {
		p.className = classNames(element.props.className, props.className)
	}
	if (props.style) {
		p.style = {
			...p.style,
			...props.style,
		}
	}
	return cloneElement(element, p)
}
