import { configureStore } from '@reduxjs/toolkit'
import * as reducer from './slices'

const store = configureStore({
	reducer: {
		...reducer, // 注册redecer
	},
})

export default store

/*
 ** 导出相关类型
    RootState： 包含store中所有被注册的State
    AppGetState： getState方法的类型
    AppDispatch:  dispatch方法的类型
 */
export type RootState = ReturnType<typeof store.getState>
export type AppGetState = typeof store.getState
export type AppDispatch = typeof store.dispatch
