const allowPM = 'pnpm'
const execpath = process.env.npm_execpath || ''
if (!new RegExp(`${allowPM}`).test(execpath)) {
	console.warn(
		`\u001b[33m This repository requires using ${allowPM} as the package manager for scripts to work properly.\u001b[39m\n`,
	)
	process.exit(1)
}
