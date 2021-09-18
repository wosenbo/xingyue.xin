let url = "https://www.xingyue.xin"
let courseNames = [{
		pic: "question-circle",
		text: "登录注册"
	}, {
		pic: "question-circle",
		text: "修改密码"
	}, {
		pic: "question-circle",
		text: "找回密码"
	}, {
		pic: "question-circle",
		text: "免费体验"
	},
	{
		pic: "question-circle",
		text: "设备续费"
	},
	{
		pic: "question-circle",
		text: "设备预览"
	}, {
		pic: "question-circle",
		text: "基础操作"
	}, {
		pic: "question-circle",
		text: "操作问题1"
	}, {
		pic: "question-circle",
		text: "操作问题2"
	}, {
		pic: "question-circle",
		text: "操作问题3"
	}, {
		pic: "question-circle",
		text: "辅助使用1"
	}, {
		pic: "question-circle",
		text: "辅助使用2"
	}, {
		pic: "question-circle",
		text: "辅助扫码"
	}, {
		pic: "question-circle",
		text: "微信浏览缓存"
	}
]
let courseConts = {
	"登录注册": {
		steps: [{
			name: '使用前注意',
			title: '0、在微信里面打开网页的时候,是可以缩小浮窗的哦！',
			url: url + "/images/a0.jpg"
		}, {
			name: '前往我的',
			title: '1、开始使用的时候,先前往我的这里',
			url: url + "/images/a1.jpg"
		}, {
			name: '点注册',
			title: '2、然后点击账号注册这里',
			url: url + "/images/a2.jpg"
		}, {
			name: '填写信息',
			title: '3、填写注册的具体信息,要注意验证码哦,最后点击提交',
			url: url + "/images/a3.jpg"
		}, {
			name: '去登录吧',
			title: '4、我们成功注册账号后,会跳转到登录,然后输入账号信息进行登录',
			url: url + "/images/a4.jpg"
		}, ]
	},
	"修改密码": {
		steps: [{
			name: '前往我的',
			title: '1、如果您需要修改自己的密码,先前往我的这里',
			url: url + "/images/b1.jpg"
		}, {
			name: '点修改密码',
			title: '2、然后点击修改密码这里',
			url: url + "/images/b2.jpg"
		}, {
			name: '填写信息',
			title: '3、填写要你的具体信息,最后点击确认修改',
			url: url + "/images/b3.jpg"
		}, {
			name: '重新登录',
			title: '4、最后输入刚才修改后的账号密码，来进行登录吧',
			url: url + "/images/b4.jpg"
		}, ]
	},
	"找回密码": {
		steps: [{
			name: '点忘记密码',
			title: '1、如果我们忘记了登录密码,点击忘记密码这里',
			url: url + "/images/c1.jpg"
		}, {
			name: '填写信息',
			title: '2、输入指定的信息进行找回密码',
			url: url + "/images/c2.jpg"
		}, {
			name: '重新登录',
			title: '3、最后输入刚才重置后的账号密码，来进行登录吧',
			url: url + "/images/c3.jpg"
		}, ]
	},
	"免费体验": {
		steps: [{
			name: '点首页',
			title: '1、我们在登录账号后,可以去首页免费体验设备哦',
			url: url + "/images/d1.jpg"
		}, {
			name: '点体验',
			title: '2、点中间这里的体验按钮进入',
			url: url + "/images/d2.jpg"
		}, {
			name: '选游戏',
			title: '3、到了这个界面后,点这里打开选择云游戏窗口',
			url: url + "/images/d3.jpg"
		}, {
			name: '选择',
			title: '4、选择你想要的云游戏',
			url: url + "/images/d4.jpg"
		}, {
			name: '选体验',
			title: '5、下面这里选择体验版,然后点击确定',
			url: url + "/images/d5.jpg"
		}, {
			name: '点体验',
			title: '6、然后点击这里的体验',
			url: url + "/images/d6.jpg"
		}, {
			name: '确定',
			title: '7、会弹出一个窗口,点击确定',
			url: url + "/images/d7.jpg"
		}]
	},
	"设备续费": {
		steps: [{
			name: '点首页',
			title: '1、如果我们想一直使用,去点击首页这里',
			url: url + "/images/e1.jpg"
		}, {
			name: '点充能',
			title: '2、然后去点击中间这个充能按钮,去充能一波',
			url: url + "/images/e2.jpg"
		}, {
			name: '选时长',
			title: '3、到了这个界面后,点这里打开选充能时长窗口',
			url: url + "/images/e3.jpg"
		}, {
			name: '选择',
			title: '4、这里选择充能时长,前提是你得有足够的云币哦,不够的话联系管理员进行充值',
			url: url + "/images/e4.jpg"
		}, {
			name: '立即充能',
			title: '5、最后立即充能就行了哦',
			url: url + "/images/e5.jpg"
		}, {
			name: '确定',
			title: '6、会弹出一个窗口,点击确定',
			url: url + "/images/e6.jpg"
		}, {
			name: '完成',
			title: '7、然后你就发现你的到期时间往后推迟了1个月',
			url: url + "/images/e7.jpg"
		}]
	},
	"设备预览": {
		steps: [{
			name: '点设备',
			title: '1、我们在使用之前如果想预览设备,点设备这里',
			url: url + "/images/f1.jpg"
		}, {
			name: '刷新屏幕',
			title: '2、点击这里的刷新屏幕,就可以获取到最新的屏幕状态了！',
			url: url + "/images/f2.jpg"
		}, {
			name: '点图预览',
			title: '3、然后我们点击图片这里,去进行预览',
			url: url + "/images/f3.jpg"
		}, {
			name: '预览查看',
			title: '4、然后屏幕预览图就显示出来了！',
			url: url + "/images/f4.jpg"
		}, {
			name: '关闭预览',
			title: '5、最后点这里进行关闭预览',
			url: url + "/images/f5.jpg"
		}, ]
	},
	"基础操作": {
		steps: [{
			name: '点进入',
			title: '1、之前的那些操作学会后,点这里正式操作',
			url: url + "/images/g1.jpg"
		}, {
			name: '点隐藏',
			title: '2、到达了这个界面后,下面的功能栏是默认开启的,点这里隐藏',
			url: url + "/images/g2.jpg"
		}, {
			name: '选显示',
			title: '3、我们希望下面的功能栏再次出现的话,再点这里进行开启',
			url: url + "/images/g3.jpg"
		}, {
			name: '点主页',
			title: '4、当我们到了一个应用里的界面,想要返回屏幕主页的时候,点home键这里',
			url: url + "/images/g4.jpg"
		}, {
			name: '切进程',
			title: '5、然后回到主页后,如果我们想要切换进程,点击这里',
			url: url + "/images/g5.jpg"
		}, {
			name: '滑动',
			title: '6、然后我们可以进行滑动,最后选择进程',
			url: url + "/images/g6.jpg"
		}, {
			name: '返回',
			title: '7、如果你想要返回最开始的界面时,可以点这里进行返回哦',
			url: url + "/images/g7.jpg"
		}]
	},
	"操作问题1": {
		steps: [{
			name: '无反应',
			title: '1、如果我们点击了应用后,发现无反应',
			url: url + "/images/h1.jpg"
		}, {
			name: '点刷新',
			title: '2、试下点这里的刷新吧！',
			url: url + "/images/h2.jpg"
		}, {
			name: '再次尝试',
			title: '3、然后你再次点击看下',
			url: url + "/images/h3.jpg"
		}, {
			name: '恢复正常',
			title: '4、这个时候，你会发现可以正常使用了！',
			url: url + "/images/h4.jpg"
		}]
	},
	"操作问题2": {
		steps: [{
			name: '正常情况',
			title: '1、当我们移上账号框的时候，是可以看到下面的软键盘的',
			url: url + "/images/i1.jpg"
		}, {
			name: '看不到键盘',
			title: '2、但是我们移到密码框上的时候，却看不到键盘',
			url: url + "/images/i2.jpg"
		}, {
			name: '打开虚拟键盘',
			title: '3、我们可以点击这里，打开虚拟键盘，再次点击隐藏',
			url: url + "/images/i3.jpg"
		}, {
			name: '正常输入',
			title: '4、然后就可以正常的输入密码了哦',
			url: url + "/images/i4.jpg"
		}, {
			name: '关闭键盘',
			title: '5、因为是虚拟键盘,所以最后输入完成后请手动关闭哦！',
			url: url + "/images/i5.jpg"
		}]
	},
	"操作问题3": {
		steps: [{
			name: '弹出框输入',
			title: '1、如果嫌用键盘麻烦，我们也可以点击这里进行输入',
			url: url + "/images/i6.jpg"
		}, {
			name: '弹出窗输入',
			title: '2、我们在弹出的窗口内输入内容,然后点击确定',
			url: url + "/images/i7.jpg"
		}, {
			name: '输入成功',
			title: '3、这样我们的内容就输入成功了哦',
			url: url + "/images/i8.jpg"
		}]
	},
	"辅助使用1": {
		steps: [{
			name: '操作图标',
			title: '1、进来这个界面的时候，这里会默认有操作图标在这里',
			url: url + "/images/j1.jpg"
		}, {
			name: '若无图标',
			title: '2、如果没有看到这个图标的话，我们先点这里的按键精灵',
			url: url + "/images/j2.jpg"
		}, {
			name: '依次点击',
			title: '3、进入后，先点下面的工具箱，然后再选择天龙八部辅助[云手机天龙]这里',
			url: url + "/images/j3.jpg"
		}, {
			name: '点启动',
			title: '4、然后我们点击下面的启动按钮',
			url: url + "/images/j4.jpg"
		}, {
			name: '点加载',
			title: '5、再点击这里的加载按钮',
			url: url + "/images/j5.jpg"
		}, {
			name: '看到图标',
			title: '6、然后我们就看到这个操作图标了',
			url: url + "/images/j6.jpg"
		}]
	},
	"辅助使用2": {
		steps: [{
			name: '点击游戏',
			title: '1、我们正式使用的时候，先点击天龙八部游戏',
			url: url + "/images/k1.jpg"
		}, {
			name: '登录选择',
			title: '2、选择登录方式，比如使用微信登录',
			url: url + "/images/k2.jpg"
		}, {
			name: '扫码界面',
			title: '3、当到了扫码界面时,拿手机进行扫码登录',
			url: url + "/images/k3.jpg"
		}, {
			name: '登录成功后',
			title: '4、微信登录成功后，可以先选择区服，最后点这里的踏入江湖正式进入游戏',
			url: url + "/images/k4.jpg"
		}, {
			name: '点击启动',
			title: '5、当我们正式进入游戏后，再点击这里的启动就可以做日常活动了！',
			url: url + "/images/k5.jpg"
		}]
	},
	"辅助扫码": {
		steps: [{
			name: '扫码问题',
			title: '1、如果不知道登录游戏时如何进行扫码,接下来教你具体的步骤',
			url: url + "/images/l1.jpg"
		}, {
			name: '图示操作',
			title: '2、按照如图所示步骤进行操作就行了哦！',
			url: url + "/images/l2.jpg"
		}]
	},
	"微信浏览缓存": {
		steps: [{
			name: '缓存问题',
			title: '1、如果你的网站是在微信内打开的,网站更新后你那里没变化,点下一步教你解决！',
			url: url + "/images/m1.jpg"
		}, {
			name: '点我的',
			title: '2、进到我的界面这里,然后点击系统设置',
			url: url + "/images/m2.jpg"
		}, {
			name: '点清除缓存',
			title: '3、在微信内打开时,这里会有“清除内置缓存”这个按钮,我们点击进去。',
			url: url + "/images/m3.jpg"
		}, {
			name: '阅读教程',
			title: '4、到了这个界面后,根据你手机的类型选择相应的步骤吧！',
			url: url + "/images/m4.jpg"
		}]
	}
}

module.exports = {
	courseNames,
	courseConts
}
