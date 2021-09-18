import http from './request.js'
const apiList = {
	// 接口地址
	// 登录
	user_login: (data) => {
		return http.request({
			url: '/user/login',
			method: 'POST',
			data
		})
	},
	// 退出登录
	user_logoff: (data) => {
		return http.request({
			url: '/user/logoff',
			method: 'POST',
			data
		})
	},
	// 注册
	user_register: (data) => {
		return http.request({
			url: '/user/register',
			method: 'POST',
			data
		})
	},
	//微信 -->服务器返回code
	user_wechatcode: (data) => {
		return http.request({
			url: `/user/wechat/code`,
			method: 'POST',
			data
		})
	},
	//微信 -->获取用户的隐私数据
	user_wechatdecrypt: (data) => {
		return http.request({
			url: `/user/wechat/decrypt`,
			method: 'POST',
			data
		})
	},
	//微信 -->判断用户是否已注册微信
	user_wxisregister:(data) => {
		return http.request({
			url: `/user/wechat/isregister`,
			method: 'POST',
			data
		})
	},
	//微信 -->登录
	user_wxlogin:(data) => {
		return http.request({
			url: `/user/wechat/login`,
			method: 'POST',
			data
		})
	},
	//微信 -->注册
	user_wxregister:(data) => {
		return http.request({
			url: `/user/wechat/register`,
			method: 'POST',
			data
		})
	},
	// 获取个人当前状态
	user_userstatus: (data) => {
		return http.request({
			url: '/user/userstatus',
			method: 'GET',
			data
		})
	},
	//发送短信验证码
	user_usersendsms: (data) => {
		return http.request({
			url: '/user/usersendsms',
			method: 'POST',
			data
		})
	},
	//编辑昵称
	user_updnickname: (data) => {
		return http.request({
			url: '/user/updnickname',
			method: 'PUT',
			data
		})
	},
	//上传图片
	user_uploadimg: (data) => {
		return http.request({
			url: '/user/uploadimg',
			method: 'POST',
			data
		})
	},
	//找回密码--设置安全问题
	user_setsafety: (data) => {
		return http.request({
			url: '/user/setsafety',
			method: 'PUT',
			data
		})
	},
	//找回密码--比对安全问题是否成立
	user_verisafety: (data) => {
		return http.request({
			url: '/user/verisafety',
			method: 'POST',
			data
		})
	},
	//找回密码--比对手机号验证是否成立
	user_veritelephone: (data) => {
		return http.request({
			url: '/user/veritelephone',
			method: 'POST',
			data
		})
	},
	//找回密码--密码重置
	user_resetpass: (data, token) => {
		return http.request({
			url: '/user/resetpass',
			method: 'PUT',
			data,
		}, token)
	},
	//修改密码
	user_updpass: (data) => {
		return http.request({
			url: '/user/updpass',
			method: 'PUT',
			data
		})
	},
	//绑定手机号
	user_bindtele: (data) => {
		return http.request({
			url: '/user/bindtele',
			method: 'PUT',
			data
		})
	},
	//取消体验资格
	user_overexperience: (data) => {
		return http.request({
			url: '/user/overexperience',
			method: 'PUT',
			data
		})
	},
	//恢复体验资格
	user_recoverexperience: (data) => {
		return http.request({
			url: '/user/recoverexperience',
			method: 'POST',
			data
		})
	},
	//生成随机昵称
	user_getnumnickname: (data) => {
		return http.request({
			url: '/user/getnumnickname',
			method: 'GET',
			data
		})
	},
	//抽奖后 --修改用户云币
	user_updbalance: (data) => {
		return http.request({
			url: '/user/updbalance',
			method: 'PUT',
			data
		})
	},
	//获取用户列表
	user_list: (data) => {
		return http.request({
			url: '/user/list',
			method: 'GET',
			data
		})
	},
	//提交订单
	user_order_create: (data) => {
		return http.request({
			url: '/user/order/create/',
			method: 'POST',
			data
		})
	},
	//查询某条订单的所有记录
	user_order_detail: (id, data) => {
		return http.request({
			url: '/user/order/details/' + id,
			method: 'GET',
			data
		})
	},
	//编辑到期时间
	user_order_update: (id, data) => {
		return http.request({
			url: '/user/order/update/' + id,
			method: 'PUT',
			data
		})
	},
	//获取云游戏 
	game_list: (data) => {
		return http.request({
			url: '/game/list/',
			method: 'GET',
			data
		})
	},
	//获取空闲设备
	game_phonefree: (gameId, data) => {
		return http.request({
			url: '/game/phonefree/' + gameId,
			method: 'GET',
			data
		})
	},
	//查询当前游戏下的所有设备
	game_phonelist:(gameId, data) => {
		return http.request({
			url: '/game/phonelist/' + gameId,
			method: 'GET',
			data
		})
	},
	//获取用户设备列表
	gamep_userphone: (data) => {
		return http.request({
			url: '/game_phone/userphone/',
			method: 'GET',
			data
		})
	},
	//查看单一的设备数据
	gamep_detail: (id,data) => {
		return http.request({
			url: `/game_phone/detail/${id}`,
			method: 'GET',
			data
		})
	},
	//购买设备
	gamep_buyphone: (phone_id, data) => {
		return http.request({
			url: '/game_phone/buyphone/' + phone_id,
			method: 'PUT',
			data
		})
	},
	//修改设备备注
	gamep_update: (id, data) => {
		return http.request({
			url: '/game_phone/update/' + id,
			method: 'PUT',
			data
		})
	},
	//回收设备
	gamep_resetphone: (id, data) => {
		return http.request({
			url: '/game_phone/resetphone/' + id,
			method: 'PUT',
			data
		})
	},
	//获取价格列表
	phonep_list: (data) => {
		return http.request({
			url: '/phoneprice/list/',
			method: 'GET',
			data
		})
	},
	//获取公告列表
	announce_list: (data) => {
		return http.request({
			url: '/announce/list/',
			method: 'GET',
			data
		})
	},
	//添加用户日志
	userlog_create : (data) => { 
		return http.request({
			url: '/user_log/create',
			method: 'POST',
			data 
		})
	},
	//添加用户日志
	user_getveri : () => { 
		return http.request({
			url: '/user/getveri',
			method: 'GET',
			data 
		})
	}
}

export default apiList
