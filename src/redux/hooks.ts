import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from './store'

/*
 ** @see 在整个应用程序中使用 `useAppDispatch` 和 `useAppSelector` 代替 `useDispatch` 和 `useSelector`
 */
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
