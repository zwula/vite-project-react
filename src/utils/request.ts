import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'

class Request {
	baseRequest: AxiosInstance
	defaultConfig: AxiosRequestConfig = {
		baseURL: import.meta.env.VITE_API_BASE_URL,
		timeout: 1000,
	}

	constructor(config: AxiosRequestConfig) {
		config = { ...this.defaultConfig, ...config }
		this.baseRequest = axios.create(config)

		// 请求拦截器
		this.baseRequest.interceptors.request.use((config) => {
			// 统一携带请求信息
			return config
		})

		// 响应拦截器
		this.baseRequest.interceptors.response.use(
			(rawResponse) => {
				/* 
					当axios与服务器建立通信成功之后，会进入第一个响应拦截器onFullfilled中,但是这个数据仅仅表示和服务器成功通信，接收到了服务器返回的结果，并不一定是我们想要的业务逻辑数据，需要我们进行判断
					1.如果接受到的数据，确实是我们需要的业务数据
						此时，我们进入正常的业务逻辑的书写，返回处理后的数据
						return processedResponse
					2.如果接受到的数据，并不是我们需要的业务数据
						此时，我们需要进行错误处理，为了实现错误的统一处理，我们需要将其交给下一个响应拦截器，与网络层面的错误一并进行错误的统一处理。
						return Promise.reject(processedResponse)
				*/
				return rawResponse
			},
			(rawError) => {
				/* 
					当axios与服务器建立通信失败之后，会进入第一个响应拦截器onRejected中,error表示网络层面的错误，例如：
					1. 超时
					2. 请求的地址不存在，404 not found


					对于这些网络层面的错误，我们不做任何处理，直接传递给下一个响应拦截器，和业务逻辑层面的错误一起进行处理。
					注意： 如果想要传递给下一个拦截器的onRejectd中，就必须返回Promise.reject(error)
				*/
				return Promise.reject(rawError)
			},
		)
		// 响应拦截器 - 统一的错误处理
		this.baseRequest.interceptors.response.use(
			(processedResponse) => {
				/* 直接返回从第一个响应拦截器接受到的处理后的结果 response ，什么都不需要做 */
				return processedResponse
			},
			(processedError) => {
				console.log('interceptors2-rejected')
				/* 
					第二个响应拦截器onRejected中,会接受到两种类型的错误：
					1. 从第一个响应拦截器中onRejected中，传递过来的网络层面的错误
					2. 从第一个响应拦截器中onFullfilled中，传递过来的业务逻辑层面的错误

					我们将在这里对这些错误进行统一处理
				*/
				return processedError
			},
		)
	}

	public get(url: string, config?: AxiosRequestConfig) {
		return this.baseRequest.get(url, config)
	}
	public post(url: string, data?: unknown, config?: AxiosRequestConfig) {
		return this.baseRequest.post(url, data, config)
	}
}

// 默认导出Request的一个实例对象
export default new Request({})
