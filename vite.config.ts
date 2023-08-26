import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
	envDir: 'env',
	plugins: [react()],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
			'@xxx': path.resolve(__dirname, './src/xxx'),
		},
	},
	css: {
		preprocessorOptions: {
			less: {
				// 引入全局变量
				additionalData: `@import "@/assets/styles/global.less";`,
			},
		},
	},
})
