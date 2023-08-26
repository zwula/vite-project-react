import React from 'react'
import ReactDOM from 'react-dom/client'
// eslint-disable-next-line import/no-unresolved
import 'virtual:svg-icons-register'
import App from './App.tsx'
import './index.css'

// eslint-disable-next-line import/no-named-as-default-member
ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
)
