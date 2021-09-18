import html2canvas from '@/utils/html2canvas.min.js'
// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
// 例子： 
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
Date.prototype.Format = function(fmt) {
	var o = {
		"M+": this.getMonth() + 1, //月份 
		"d+": this.getDate(), //日 
		"H+": this.getHours(), //小时 
		"m+": this.getMinutes(), //分 
		"s+": this.getSeconds(), //秒 
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度 
		"S": this.getMilliseconds() //毫秒 
	};
	if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o)
		if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[
			k]).substr(("" + o[k]).length)));
	return fmt;
}

//表单数据校验
export const validateData = (_this, params) => {
	_this.logining = true;
	//用户名正则，4到16位（字母，数字，下划线，减号）
	var uPattern = /^[a-zA-Z0-9_-]{4,20}$/;
	//密码正则，6到20位（字母，数字，下划线，减号）
	var pPattern = /^[a-zA-Z0-9_-]{6,20}$/;
	//IP地址正则
	var regexIP = /^((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))$/;
	//手机号正则，9位以上数字
	var reTele = /^1[3456789]\d{9}$/;
	//验证码正则，6位数字
	var reVerify = /^\d{6}$/;

	let valiList = [{
			prop: "username",
			vali: uPattern,
			message: "用户名是4到20位数字、字母或下划线！"
		},
		{
			prop: "password",
			vali: pPattern,
			message: "密码是6到20位数字、字母或下划线！"
		},
		{
			prop: "password_old",
			vali: pPattern,
			message: "原密码是6到20位数字、字母或下划线！"
		},
		{
			prop: "password_new",
			vali: pPattern,
			message: "新密码是6到20位数字、字母或下划线！"
		},
		{
			prop: "password_new2",
			vali: pPattern,
			message: "请再次输入6到20位数字、字母或下划线的密码！"
		},
		{
			prop: "phone_ip",
			vali: regexIP,
			message: "请输入格式正确的ip地址！"
		},
		{
			prop: "telephone",
			vali: reTele,
			message: "请输入格式正确的手机号！"
		},
		{
			prop: "verify_code",
			vali: reVerify,
			message: "请输入6位数字的验证码！"
		},
	]

	//公用部分检测
	for (let key in params) {
		for (let i = 0; i < valiList.length; i++) {
			if (key == valiList[i].prop) {
				if (!valiList[i].vali.test(params[key])) {
					_this.$api.msg(valiList[i].message);
					_this.logining = false;
					return false
				}
			}
		}
	}

	//修改密码检测
	if (params.hasOwnProperty("password_old") && params.hasOwnProperty("password_new")) {
		//如果输入的旧密码和新密码一致
		if (params.password_old == params.password_new) {
			_this.$api.msg("旧密码不能与新密码一致！");
			_this.logining = false;
			return false
		}
	}

	//重置密码检测
	if (params.hasOwnProperty("password_new") && params.hasOwnProperty("password_new2")) {
		//如果两次输入的新密码不一致
		if (params.password_new != params.password_new2) {
			_this.$api.msg("两次输入的新密码不一致！");
			_this.logining = false;
			return false
		}
	}
	_this.logining = false;
	return true
}


//验证码模块
var allowClick1 = true

export const identifying_Code = (_this) => {

	let clock = '';
	let nums = 60;
	let btn;

	if (!allowClick1) {
		_this.$api.msg("请稍后再次点击获取！");
		return false
	}
	sendCode()

	function sendCode() {
		allowClick1 = false; //将按钮置为不可点击
		_this.btntext = "等待" + nums + '秒';
		clock = setInterval(doLoop, 1000); //一秒执行一次
	}

	function doLoop() {
		nums--;
		if (nums > 0) {
			_this.btntext = "等待" + nums + '秒';
		} else {
			clearInterval(clock); //清除js定时器
			allowClick1 = true;
			_this.btntext = '发送验证码';
			nums = 60; //重置时间
		}
	}
	return true
}

//小程序|APP获取当前界面的路由
export const getPageRouter = () => {
	let pages = getCurrentPages(); // 获取当前页面栈的实例，以数组形式按栈的顺序给出，第一个元素为首页，最后一个元素为当前页面
	let page = pages[pages.length - 1];
	let currentPage = page.route; // 当前的页面路由（小程序可以，H5也可以）
	return currentPage
}

// 日志模块
//每3分钟允许发送一次日志
var allowClick2 = true
export const userLog_Insert = (_this, isOff = false) => {
	let clock = '';
	let nums = 60 * 3;
	let btn;

	if (!isOff && !allowClick2) {
		console.log("现在还没到时间")
		return false
	}
	eventTimer()

	function eventTimer() {
		allowClick2 = false;
		clock = setInterval(doLoop, 1000); //一秒执行一次
	}

	function doLoop() {
		//如果不在设备界面，清除定时器
		if (!getPageRouter().includes("operate")) {
			clearInterval(clock)
			allowClick2 = true
		}
		nums--;
		if (nums > 0) {
			console.log(`等待${nums}秒`)
		} else {
			clearInterval(clock); //清除js定时器
			allowClick2 = true;
			nums = 60 * 3; //重置时间
		}
	}

	return true
}

// 广告模块
//每90秒允许观看一次广告
var allowClick3 = true
export const watchTheadsInter = () => {
	let clock = '';
	let nums = 90;
	let btn;

	if (!allowClick3) {
		console.log("现在还没到时间")
		return false
	}
	eventTimer()

	function eventTimer() {
		allowClick3 = false;
		clock = setInterval(doLoop, 1000); //一秒执行一次
	}

	function doLoop() {
		// //如果不在购买界面和设备界面，清除定时器
		// if (!getPageRouter().includes("buy") && !getPageRouter().includes("phone")) {
		// 	clearInterval(clock)
		// 	allowClick3 = true
		// }
		nums--;
		if (nums > 0) {
			console.log(`等待${nums}秒`)
		} else {
			clearInterval(clock); //清除js定时器
			allowClick3 = true;
			nums = 90; //重置时间
		}
	}

	return true
}

//随机数
export const randomNum = (n) => {
	var t = '';
	for (var i = 0; i < n; i++) {
		t += Math.floor(Math.random() * 10);
	}
	return t;
}

//生成从minNum到maxNum的随机数
export const randomNumRan = (Min, Max) => {
	var Range = Max - Min;
	var Rand = Math.random();
	var num = Min + Math.round(Rand * Range); //四舍五入
	return num;
}

//复制内容
export const copyContent = (value) => {
	var input = document.createElement("input"); // 直接构建input
	input.value = value; // 设置内容
	document.body.appendChild(input); // 添加临时实例
	input.select(); // 选择实例内容
	document.execCommand("Copy"); // 执行复制
	document.body.removeChild(input); // 删除临时实例
}

//转换日期格式
export const formatDateTime = (date, reducehour = 0, isAfter = true) => {
	var y = date.getFullYear();
	var m = date.getMonth() + 1;
	m = m < 10 ? ('0' + m) : m;
	var d = date.getDate();
	d = d < 10 ? ('0' + d) : d;
	var h = date.getHours();
	h = (h - reducehour) < 10 ? ('0' + (h - reducehour)) : (h - reducehour);
	var minute = date.getMinutes();
	minute = minute < 10 ? ('0' + minute) : minute;
	var second = date.getSeconds();
	second = second < 10 ? ('0' + second) : second;
	return y + '-' + m + '-' + d + ' ' + h + (isAfter ? (':' + minute + ':' + second) : '');
}

//封装原生JS将二进制文件流转换为图片  
export const binaryToblob = (url, callBack) => {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open(
		"GET",
		url,
		true
	);
	xmlhttp.responseType = "blob";
	xmlhttp.onload = function() {
		if (this.status == 200) {
			callBack && callBack(this.response)
		}
		if (this.status == 403) {
			callBack && callBack("no")
		}
	};
	xmlhttp.send();
}

//截取两字符串中间的字符串
export const getSubstr = (str, firstStr, secondStr) => {
	if (str == "" || str == null || str == undefined) { // "",null,undefined
		return "";
	}
	if (!str.includes(firstStr)) {
		return "";
	}
	var subFirstStr = str.substring(str.indexOf(firstStr) + firstStr.length, str.length);
	var subSecondStr = subFirstStr.substring(0, subFirstStr.indexOf(secondStr));
	return subSecondStr;
}

//重新渲染设备数据
export const reloadPhone = () => {
	let page = getCurrentPages().pop(); //跳转页面成功之后
	// #ifdef  H5
	if (page) {
		setTimeout(() => {
			page.empty = false
			page.myphones = []
			page.getMyPhoneList && page.getMyPhoneList()
		}, 1000)
	}
	// #endif
	// #ifndef H5
	page.onShow()
	// #endif
}

let timer
//判定设备是否到期 --实现方法
function expirtimes(_this, id, expirtime,e) {
	let curTimeDate = new Date().getTime()
	let expirTimeDate = new Date(parseInt(expirtime)).getTime()
	console.log("这里了--------------------------->", expirTimeDate)
	//如果所剩余的时间少于60分钟了
	if (expirTimeDate - curTimeDate < 60000 * 60) {
		if (curTimeDate > expirTimeDate) {
			//如果过期时间大于2天,就回收设备
			if (curTimeDate > expirTimeDate + (24 * 60000 * 60) * 2) {
				_this.$api.msg("设备已到期,且给的2天期限已过！", "none", 3000);
				setTimeout(() => {
					_this.$api.msg("如果您游戏还挂在云手机上未退出,请联系微信群哦", "none", 3000);
					setTimeout(() => {
						_this.$api.msg("系统正在自动回收设备中,请稍后...", "none", 3000);
						setTimeout(async () => {
							_this.$apis.gamep_resetphone(id).then(res => {
								if (res.code == 200) {
									_this.$api.msg(`编号为${id}的云设备已回收,正在跳转！`);
									setTimeout(() => {
										uni.switchTab({
											url: "/pages/phone/phone",
											success() {
												reloadPhone()
												clearInterval(timer)
												showModal("请前往购买界面后，点击左下角的【看广告】后，即可再次购买体验版哦！！！", false)
											}
										});
									}, 2000)
								}
							})
						}, 3500)
					}, 3500)
				}, 3500)
			} else {
				_this.$api.msg("设备已到期,系统给您最后2天时间哦！", "none", 3000);
				setTimeout(() => {
					_this.$api.msg("为了防止您游戏还未退出,就被系统回收,", "none", 3000);
					setTimeout(() => {
						_this.$api.msg("所以若不再使用,请及时退出游戏哦！", "none", 3000);
						//如果是在操作界面
						//跳转出来，强制用户只有观看广告才能继续使用
						//#ifdef H5
						if (location.href.includes("phone")) {
							setInterval(() => {
								showModal("请点击上面返回按钮退出后，看广告才可继续使用哦！！", false)
							}, 3000)
						}
						//#endif
					}, 3500)
				}, 3500)
			}
		} else {
			let minutes = (parseInt(expirTimeDate - curTimeDate) / 60000).toFixed(2)
			_this.$api.msg(`编号为${id}的云设备还有${minutes}分钟到期，请立即续费！`)
		}
	}
}

//判定设备是否到期 --检测主方法
export const veriExpirtimes = (_this, id, expirtime) => {
	expirtimes(_this, id, expirtime)
	//每过3分钟检测一次
	timer = setInterval(async () => {
		expirtimes(_this, id, expirtime)
	}, 60000 * 5)
}

//------------------------------广告模块------------------------------
let isClickadver = false
//判定设备是否到期 --点击进入操作的时候
export const veriExpirClick = (_this, id, expirtime) => {
	let curTimeDate = new Date().getTime()
	let expirTimeDate = new Date(parseInt(expirtime)).getTime()
	//如果还有2天期限，弹出广告提示
	if (!isClickadver && curTimeDate > (expirTimeDate - (24 * 60000 * 60) * 2)) {
		showModal('使用快到期了哦，通过观看广告可以一直使用哦', true, (e) => {
			if (e.confirm) {
				console.log("快到期了---观看广告")
				isClickadver = true;
				_this.showRewardedVideoAd();
			}
		})
		return false
	} else {
		if (curTimeDate > expirTimeDate) {
			showModal('观看广告后，即可继续使用哦', true, (e) => {
				if (e.confirm) {
					console.log("到期了---观看广告")
					_this.showRewardedVideoAd();
				}
			})
			return false
		}
	}
	return true
}

//弹窗提示1
export const showToast = (title, icon = 'none', duration = 1500, mask = false) => {
	//统一提示方便全局修改
	if (Boolean(title) === false) {
		return;
	}
	uni.showToast({
		title,
		duration,
		mask,
		icon
	});
}

//弹窗提示2
export const showModal = (content, showCancel = true, callBack) => {
	uni.showModal({
		content,
		showCancel,
		success: (e) => {
			callBack && callBack(e)
		}
	})
}

/*
  复制按钮的实现
*/
export const copyText = (value, text) => {
	//提示模板
	uni.showModal({
		content: value, //模板中提示的内容
		confirmText: '复制内容',
		success: () => { //点击复制内容的后调函数
			//uni.setClipboardData方法就是讲内容复制到粘贴板
			// API `setClipboardData` is not yet implemented
			//意思是H5端没有这个接口！！！
			uni.setClipboardData({
				data: value, //要被复制的内容
				success: function() {
					//重点~做笔记
					//在success中加入uni.hideToast()可以解决
					showToast(text, "success")
					//以下就可自定义操作了~
				},
				fail: function(err) {
					showToast("复制失败！")
				}
			});
		}
	});
}

//登录状态过期
export const statusOverdue = (response) => {
	setTimeout(() => {
		//#ifdef H5
		showToast("登陆状态已过期，请先点击上方的【返回按钮】，然后重新进来操作哦！",false,e=>{
			setTimeout(()=>{
				if (e.confirm) {
					showToast("请点击上方的【返回按钮】哦！",false)
				}
			},1000)
		})
		//#endif
		//#ifndef H5
		uni.showToast({
			title: "正在跳转登录",
			icon: "loading",
			duration: 1000,
			success: () => {
				setTimeout(() => {
					uni.navigateTo({
						url: "/pages/user/login/login",
					});
				}, 1500)
			}
		});
		//#endif
	}, 1000)
}

//查看是否授权了-->微信登录
export const isAuthwx = (_this) => {
	// #ifdef MP-WEIXIN
	uni.getSetting({
		success(res) {
			console.log("授权：", res);
			if (!res.authSetting['scope.userInfo']) {
				_this.wxstatus = false
				//这里调用授权
				console.log("当前未授权");
			} else {
				_this.wxstatus = true
				//用户已经授权过了
				console.log("当前已授权");
			}
		}
	})
	//#endif
}

//扫码方法
export const openScanCode = (_this) => {
	// #ifdef  H5
	_this.$api.msg("该功能暂不支持")
	// #endif
	// #ifdef  APP-PLUS
	uni.scanCode({
		onlyFromCamera: false, //为true只允许相机扫码，不加允许相册扫码
		success: res => {
			_this.$api.msg("扫码成功！", "success")
			// 跳转到内部窗口并且传递链接
			uni.navigateTo({
				url: `/pages/webview/webview?url=${res.result}`
			})
			console.log(res)
		},
		fail: err => {
			console.log('扫码失败', err)
			console.log(err)
		}
	})
	// #endif
	// #ifdef  MP-WEIXIN
	uni.scanCode({
		onlyFromCamera: false, //为true只允许相机扫码，不加允许相册扫码
		success: res => {
			_this.$api.msg("扫码成功！", "success")
			// 跳转到内部窗口并且传递链接
			uni.navigateTo({
				url: `/pages/webview/webview?url=${res.result}`
			})
			console.log(res)
		},
		fail: err => {
			console.log('扫码失败', err)
			console.log(err)
		}
	})
	// #endif
}

//阻止浏览器--> 右键下拉菜单 + ctrl+s + f12 
export const disMalice = (_this, text) => {
	if (typeof window === 'object' && 'document' in window) {
		//禁止右键下拉菜单
		document.oncontextmenu = function() {
			mAlert();
			return false
		}

		//禁止ctrl+s + f12 
		document.onkeydown = document.onkeyup = document.onkeypress = function(event) {
			var e = event || window.event || arguments.callee.caller.arguments[0];
			//禁止ctrl+s
			if (e.ctrlKey == true && e.keyCode == 83) {
				mAlert();
				e.preventDefault();
			}
			//禁止f12
			if (e && e.keyCode == 123) {
				mAlert();
				e.returnValue = false;
				return (false);
			}
		}

		function mAlert() {
			console.log("进来这里了", 123)
			_this.$api.msg(text)
		}
	}
}

//判断是否在微信的内置浏览器
export const isWeiXin = () => {
	//#ifdef H5
	var ua = window.navigator.userAgent.toLowerCase();
	console.log(ua); //mozilla/5.0 (iphone; cpu iphone os 9_1 like mac os x) applewebkit/601.1.46 (khtml, like gecko)version/9.0 mobile/13b143 safari/601.1
	if (ua.match(/MicroMessenger/i) == 'micromessenger') {
		return true; // 微信中打开
	} else {
		return false; // 普通浏览器中打开
	}
	//#endif
}

//对象数组排序
export const objSort = function(data, prop1, prop2, order = true) {
	let datak = data.sort(function(a, b) {
		let value1 = a[prop1];
		let value2 = b[prop1];
		// 按照sort排序
		if (value1 !== value2) {
			return b[prop1] - a[prop1];
			// 如果sort相同，就按照时间排序
		} else if (b[prop2] !== a[prop2]) {
			let date1 = Date.parse(b[prop2]);
			let date2 = Date.parse(a[prop2]);
			return order ? (date1 - date2) : (date2 - date1);
		}
	});
	return datak
};

//获取最新公告
export const newAnnounce = (_this, callBack) => {
	_this.$apis.announce_list().then(res => {
		//先根据排序值，如果排序值一样，再根据最新时间
		if (res.code == 200) {
			if (res.data.rows.length > 0) {
				let {
					rows: datak
				} = res.data;
				let data = objSort(datak, "sort", "updatedAt")
				callBack(data[0]) //返回最新的公告
			} else {
				callBack(null) //返回最新的公告
			}
		}
	})
}

// 屏幕截图
export const screenShot = (isOff = false, obj, callBack) => {
	debounce(() => {
		//#ifdef H5
		let dom = document.querySelector(obj.ele)
		if (dom) {
			html2canvas(dom, {
				width: obj.width,
				height: obj.height,
				scrollX: 0,
				scrollY: 0,
				useCORS: true
			}).then(canvas => {
				console.log(canvas)
				let base64 = canvas.toDataURL("image/png")
				console.log(base64)
				if (base64) {
					callBack && callBack(base64)
				}
			})
		}
		//#endif
		//#ifndef H5
		callBack && callBack()
		//#endif
	}, !isOff ? 3000 : 0)()
}

//--------------------------------------------------------绕过审核--------------------------------------------------------

//获取是否允许开放
export const getWxveri = async () => {
	return new Promise((resolve, reject) => {
		uni.request({
			url: 'https://www.xingyue.xin/xingyue/api/v1/user/getveri',
			success: (res) => {
				console.log('get成功');
				console.log(res.data.message);
				resolve(res.data.message)
			},
			fail: (res) => {
				console.log('get失败');
				console.log(res.data.message);
				reject("666")
			}
		});
	})
}

//设置是否允许开放
export const setVerik = async (_this) => {
	console.log("这里了-------------->", _this)
	let wxVeri = await getWxveri(_this) || ""
	uni.setStorageSync("isveriDate", wxVeri == "666" || wxVeri == "yes")
}

//获取是否已开放
export const bypassAudit = () => {
	return uni.getStorageSync("isveriDate")
}

//--------------------------------------------------------设置观看量、点击量--------------------------------------------------------
//设置观看量
export const setWatCount = () => {
	return new Promise((resolve, reject) => {
		uni.request({
			url: 'https://www.xingyue.xin/xingyue/api/v1/user/setwatchc',
			success: (res) => {
				console.log('设置观看量成功');
			},
			fail: (res) => {
				console.log('设置观看量失败');
			}
		});
	})
}

//设置点击量
export const setCliCount = () => {
	return new Promise((resolve, reject) => {
		uni.request({
			url: 'https://www.xingyue.xin/xingyue/api/v1/user/setclickc',
			success: (res) => {
				console.log('设置点击量成功');
			},
			fail: (res) => {
				console.log('设置点击量失败');
			}
		});
	})
}

//-----------------------------------------------防抖，节流，深拷贝-----------------------------------------------

//防抖
export const debounce = (fn, delay) => {
	let timer = null
	return function() {
		if (timer) {
			clearTimeout(timer)
		}
		timer = setTimeout(fn, delay)
	}
}

//节流
export const throttle = (fn, delay) => {
	let valid = true
	return function() {
		if (!valid) {
			//休息时间 
			return false
		}
		// 工作时间，执行函数且在间隔期内，把状态位设为无效
		valid = false
		setTimeout(() => {
			fn()
			valid = true;
		}, delay)
	}
}

//深拷贝
export const clone = parent => {

	//返回变量的原始类型是否和传过来的一致
	function isType(object, Type) {
		return Object.prototype.toString.call(object).match(/^\[object\s(.*)\]$/)[1] === Type;
	};

	const parents = [];
	const children = [];
	const _clone = parent => {
		if (parent === null) return null;
		if (typeof parent !== 'object') return parent;
		let child, proto;
		if (isType(parent, 'Array')) {
			child = [];
		} else if (isType(parent, 'RegExp')) {
			// 处理正则对象
			child = new RegExp(parent.source, getRegExp(parent));
			if (parent.lastIndex) child.lastIndex = parent.lastIndex;
		} else if (isType(parent, 'Date')) {
			// 处理Date对象
			child = new Date(parent.getTime());
		} else {
			// 处理原型
			proto = Object.getPrototypeOf(parent);
			// 切断原型链
			child = Object.create(proto);
		}
		// 处理循环引用
		const index = parents.indexOf(parent);
		if (index != -1) {
			// 如果父数组存在本对象,说明之前已经被引用过,直接返回此对象
			return children[index];
		}
		parents.push(parent);
		children.push(child);
		for (let i in parent) {
			child[i] = _clone(parent[i]);
		}
		return child;
	};
	return _clone(parent);
};
