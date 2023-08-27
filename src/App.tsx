import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
// eslint-disable-next-line import/no-unresolved
import viteLogo from '/vite.svg'
import '@/App.less'
import SvgIcon from './components/svg-icon'
import request from '@/utils/request'

function App() {
	const [count, setCount] = useState(0)

	useEffect(() => {
		request
			.post('/user/login1', {
				username: 'admin',
				password: 'admin1231',
			})
			.then((res) => {
				console.log('🔥 >> file: App.tsx:17 >> useEffect >> res:', res)
			})
	}, [])

	return (
		<>
			<div>
				<a href="https://vitejs.dev" target="_blank" rel="noreferrer">
					<img src={viteLogo} className="logo" alt="Vite logo" />
				</a>
				<a href="https://react.dev" target="_blank" rel="noreferrer">
					<img
						src={reactLogo}
						className="logo react"
						alt="React logo"
					/>
				</a>
			</div>
			<h1>Vite + React</h1>
			<div className="card">
				<button onClick={() => setCount((count) => count + 1)}>
					count is {count}
				</button>
				<p>
					Edit <code>src/App.tsx</code> and save to test HMR
				</p>
			</div>
			<p className="read-the-docs">
				Click on the Vite and React logos to learn more
			</p>
			<SvgIcon icon="download" color="red" />
		</>
	)
}

export default App
