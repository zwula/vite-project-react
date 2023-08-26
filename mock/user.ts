import { MockMethod } from 'vite-plugin-mock'

const createUsers = () => {
	return [
		{
			id: 1,
			username: 'admin',
			password: 'admin123',
			avatar: '',
			desc: '平台管理员',
			roles: ['平台管理员'],
			buttons: ['cuser.detail'],
			routes: ['home'],
			token: 'admin token',
		},
		{
			id: 2,
			username: 'system',
			password: 'system123',
			avatar: '',
			desc: '系统管理员',
			roles: ['系统管理员'],
			buttons: ['cuser.detail', 'cuser.user'],
			routes: ['home'],
			token: 'system token',
		},
	]
}

export default [
	{
		url: '/api/user/login',
		method: 'post',
		response: ({ body }) => {
			const { username, password } = body
			const checkUser = createUsers().find((user) => {
				return user.username === username && user.password === password
			})
			if (!checkUser) {
				return {
					status: 201,
					msg: '用户名或密码不正确',
				}
			}
			return {
				status: 200,
				data: {
					token: checkUser.token,
				},
			}
		},
	},
] as MockMethod[]
