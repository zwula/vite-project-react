import { useAppSelector, useAppDispatch } from '@/redux/hooks'
import { increment, userSelector } from '@/redux/reducers/user-slice'

const Login = () => {
	const user = useAppSelector(userSelector)
	const dispatch = useAppDispatch()
	const handleClick = () => {
		dispatch(increment())
	}
	return <div onClick={handleClick}>Login {user.value}</div>
}

export default Login
