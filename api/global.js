let baseUrl, socketUrl, screenUrl, imgUrl
// 项目环境 生产"produce" || 本地"development"
let NODE_ENV = "produce"

//#ifdef H5
	NODE_ENV = location.host.includes("xingyue.xin") ? "produce" : "development"
//#endif
//#ifndef H5
	NODE_ENV = "produce"
//#endif

//不同环境的请求地址
if (NODE_ENV == "produce") {
	baseUrl = `https://www.xingyue.xin/xingyue/api/v1`;
	socketUrl = `wss://www.xingyue.xin/xy_ysj`
	imgUrl = `https://www.xingyue.xin/image/profile/`
} else {
	// #ifdef  H5
		baseUrl = `/guoshao/xingyue/api/v1`;
	// #endif
	// #ifndef  H5
		baseUrl = `http://gs520.natapp1.cc/xingyue/api/v1`;
	// #endif
	socketUrl = "ws://192.168.88.36:8866"
	imgUrl = `http://gs520.natapp1.cc/yunshouji/file/profile/`
}

//测试环境和生产环境都是这个地址
screenUrl = `https://www.xingyue.xin/apis/apis/screen/?ip=`

export {
	baseUrl,
	socketUrl,
	screenUrl,
	imgUrl
}
