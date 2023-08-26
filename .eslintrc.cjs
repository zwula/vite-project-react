module.exports = {
	env: {
		browser: true,
		es2021: true,
		node: true,
	},
	settings: {
		react: {
			version: 'detect',
		},
		'import/resolver': {
			typescript: true, // this loads <rootdir>/tsconfig.json to eslint
			node: true,
		},
	},
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:react/recommended',
		'plugin:react/jsx-runtime',
		'plugin:import/recommended',
		'plugin:import/typescript',
		'plugin:prettier/recommended',
	],
	overrides: [
		{
			env: {
				node: true,
			},
			files: ['.eslintrc.{js,cjs}'],
			parserOptions: {
				sourceType: 'script',
			},
		},
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
	},
	plugins: ['@typescript-eslint', 'react'],
	rules: {
		'prettier/prettier': [
			'error',
			{
				singleQuote: true,
				endOfLine: 'auto',
				semi: false,
				useTabs: true,
				tabWidth: 4,
			},
		],
		'import/default': 0, // 关闭检测默认导出
		'import/no-absolute-path': 0, // 关闭禁止使用绝对路径导入模块
	},
}
