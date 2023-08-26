// import { defineConfig } from 'vite'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import react from '@vitejs/plugin-react'
import path from 'path'
import { UserConfigExport, ConfigEnv } from 'vite'
import { viteMockServe } from 'vite-plugin-mock'

// https://vitejs.dev/config/
export default ({ command }: ConfigEnv): UserConfigExport => {
	return {
		envDir: 'env',
		plugins: [
			react(),
			createSvgIconsPlugin({
				// icons文件路径
				iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
				// 使用svg图标时的格式，icon-为通用前缀
				symbolId: 'icon-[dir]-[name]',
			}),
			viteMockServe({
				// default
				localEnabled: command === 'serve', // 保证开发阶段可以使用mock，生产环境禁止开启
			}),
		],
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
	}
}
