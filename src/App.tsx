import { useState } from 'react'
import reactLogo from './assets/react.svg'
// eslint-disable-next-line import/no-unresolved
import viteLogo from '/vite.svg'
import '@/App.less'

function App() {
	const [count, setCount] = useState(0)

	console.log(import.meta.env)
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
			<svg style={{ width: '22px', height: '22px' }}>
				<use href="#icon-download" fill="red"></use>
			</svg>
		</>
	)
}

export default App
