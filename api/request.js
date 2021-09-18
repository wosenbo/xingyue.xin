/**
 * 通用uni-app网络请求
 * 基于 Promise 对象实现更简单的 request 使用方式，支持请求和响应拦截
 */
import store from '../store/index';
import {baseUrl} from './global.js'
import {statusOverdue,showToast} from '@/utils/common.js'

export default {
	config: {
		// 请求的公共url
		baseUrl: baseUrl, 
		header: {
			// 'Content-Type': 'application/json;charset=UTF-8'
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		data: {},
		method: "GET",
		dataType: "json",
		/* 如设为json，会对返回的数据做一次 JSON.parse */
		responseType: "text",
		success() {},
		fail() {},
		complete() {}
	},
	// 请求拦截器
	interceptor: {
		request: null,
		response: null
	},
	request(options,token) {
		if (!options) {
			options = {}
		}
		// 获取登录后存储在本地的token信息
		let requestType = options.url.split('/')
		let typeVal = requestType[requestType.length - 1]
		if (typeVal !== 'login' && typeVal !== 'register') {
			this.config.header.Authorization = `Bearer ${token ? token : store.state.userInfo.token}`;
		} else {
			delete this.config.header.Authorization
		}
		options.baseUrl = options.baseUrl || this.config.baseUrl
		options.dataType = options.dataType || this.config.dataType
		options.url = options.baseUrl + options.url
		options.data = options.data || {}
		options.method = options.method || this.config.method
		// 基于 Promise 的网络请求
		return new Promise((resolve, reject) => {
			(options.url.indexOf("uplprofile")==-1 && options.url.indexOf("user_log")==-1) && showToast("正在拼命加载","loading")
			let _config = null
			options.complete = (response) => {
				setTimeout(()=>{
					uni.hideLoading()
				},1000)
				let statusCode = response.statusCode
				response.config = _config
				if (this.interceptor.response) {
					let newResponse = this.interceptor.response(response)
					if (newResponse) {
						response = newResponse
					}
				}
				
				let {
					code,
					msg
				} = response.data
				
				if (response.data.code == 401) {
					//如果登录状态过期
					if(response.data.hasOwnProperty("err") && response.data.err.message == "Authentication Error"){
						statusOverdue()
					}
				}else if (response.data.code == 412 ||
				 response.data.code == 403) {
					showToast(response.data.message);
					resolve(response.data)
				}else {
					resolve(response.data)
				}
			}
			_config = Object.assign({}, this.config, options)
			_config.requestId = new Date().getTime()

			if (this.interceptor.request) {
				this.interceptor.request(_config)
			}
			uni.request(_config);
		});
	},
	// get请求
	get(url, data, options) {
		if (!options) {
			options = {}
		}
		options.url = url
		options.data = data
		options.method = 'GET'
		return this.request(options)
	},
	// post请求
	post(url, data, options) {
		if (!options) {
			options = {}
		}
		options.url = url
		options.data = data
		options.method = 'POST'
		return this.request(options)
	},
	// put请求
	put(url, data, options) {
		if (!options) {
			options = {}
		}
		options.url = url
		options.data = data
		options.method = 'PUT'
		return this.request(options)
	},
	// delete请求
	delete(url, data, options) {
		if (!options) {
			options = {}
		}
		options.url = url
		options.data = data
		options.method = 'DELETE'
		return this.request(options)
	}
}
