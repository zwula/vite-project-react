import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'

export interface UserState {
	value: number
}

const initialState: UserState = {
	value: 0,
}

export const userSlice = createSlice({
	name: 'global',
	initialState,
	/*
	 ** 同步修改状态的方法
	 */
	reducers: {
		increment: (state) => {
			state.value += 1
		},
		decrement: (state) => {
			state.value -= 1
		},
		incrementByAmount: (state, action: PayloadAction<number>) => {
			state.value += action.payload
		},
	},
})

// 导出reducer给store进行注册
export default userSlice.reducer
export const userSelector = (state: RootState) => state.user
// 导出改变状态的同步方法
export const { increment, decrement, incrementByAmount } = userSlice.actions
