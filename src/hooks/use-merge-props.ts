import { useMemo } from 'react'
import omit from '@/utils/omit'

export type MergePropsOptions = {
	_ignorePropsFromGlobal?: boolean
}

/** 将某些属性变为必选 */
type RequireKey<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: T[P] }

export default function useMergeProps<PropsType, K extends keyof PropsType>(
	componentProps: PropsType & MergePropsOptions,
	defaultProps: Partial<PropsType>,
	globalComponentConfig: Partial<PropsType> = {},
): RequireKey<PropsType, K> {
	const { _ignorePropsFromGlobal } = componentProps
	const _defaultProps = useMemo(() => {
		return {
			...defaultProps,
			...(_ignorePropsFromGlobal ? {} : globalComponentConfig),
		}
	}, [defaultProps, globalComponentConfig, _ignorePropsFromGlobal])

	const props = useMemo(() => {
		const mProps = omit(componentProps, [
			'_ignorePropsFromGlobal',
		]) as PropsType

		for (const propName in _defaultProps) {
			if (mProps[propName] === undefined) {
				mProps[propName] = _defaultProps[propName]!
			}
		}

		return mProps
	}, [componentProps, _defaultProps])

	return props as RequireKey<PropsType, K>
}
