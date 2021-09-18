<template>
	<view class="screenPage" style="overflow: hidden;">

		<view class="content">
			<!-- 正文内容 -->
		</view>
		<!--  -->
		<view class="screen-wrap" @touchstart="screen_start" @touchmove="screen_move" @touchend="screen_end">
			<!-- 设置空容器用来过渡 -->
			<!-- #ifdef H5 -->
			<image style="display: none;" class="img1" @load="imgLoad" :src="src1" :style="{width:imgWidth + 'px',height:imgHeight + 'px',opacity: '1!important'}"></image>
			<image class="img2 test" :src="src2" id="poster" :style="{width:imgWidth + 'px',height:imgHeight + 'px',position:'fixed',left:phase_x_val + 'px',top:phase_y_val + 'px', opacity: '1!important'}"></image>
			<!-- #endif -->
			<!-- #ifndef H5 -->
			<image style="display: none;" class="img1" @load="imgLoad1" :src="src1" :style="{width:imgWidth + 'px',height:imgHeight + 'px',opacity: '1!important'}"></image>
			<image style="display: none;" class="img2" @load="imgLoad2" :src="src2" :style="{width:imgWidth + 'px',height:imgHeight + 'px',opacity: '1!important'}"></image>
			<image class="img3 test" :src="src3" id="poster" :style="{width:imgWidth + 'px',height:imgHeight + 'px',position:'fixed',left:phase_x_val + 'px',top:phase_y_val + 'px',opacity: '1!important'}"></image>
			<!-- #endif -->
			<!-- 虚拟键盘 -->
			<template v-if="isKeyboard">
				<!-- 横屏键盘 -->
				<template v-if="keyboardDir == 'landscape'">
					<image class="invented1 xiaoxie" v-if="iskeyShow == 'xiaoxie' " :style="{width:(keyboardW_l + 2) + 'px',height:keyboardH_l + 'px',left: phase_x_val + 'px' , top:(phase_y_val - 2)+'px'}"
					 src="https://www.xingyue.xin/images/xiaoxie1.jpg" mode="" @touchstart="xiaoxieStart"></image>
					<image class="invented1 daxie" v-else-if="iskeyShow == 'daxie' " :style="{width:(keyboardW_l + 2) + 'px',height:keyboardH_l + 'px',left: phase_x_val + 'px' ,top:(phase_y_val - 2)+'px'}"
					 src="https://www.xingyue.xin/images/daxie1.jpg" mode="" @touchstart="daxieStart"></image>
					<image class="invented1 shuzhi" v-else-if="iskeyShow == 'shuzhi' " :style="{width:(keyboardW_l + 2) + 'px',height:keyboardH_l + 'px',left: phase_x_val + 'px' ,top:(phase_y_val - 2)+'px'}"
					 src="https://www.xingyue.xin/images/shuzhi1.jpg" mode="" @touchstart="shuzhiStart"></image>
				</template>
				<!-- 竖屏键盘 -->
				<template v-else-if="keyboardDir == 'portrait'">
					<image class="invented2 xiaoxie" v-if="iskeyShow == 'xiaoxie' " :style="{width:keyboardW_p  + 'px',height:keyboardH_p + 'px',left: phase_x_val + 'px' , bottom:phase_y_val+'px'}"
					 src="https://www.xingyue.xin/images/xiaoxie2.jpg" mode="" @touchstart="xiaoxieStart"></image>
					<image class="invented2 daxie" v-else-if="iskeyShow == 'daxie' " :style="{width:keyboardW_p + 'px',height:keyboardH_p + 'px',left: phase_x_val + 'px' ,bottom:phase_y_val+'px'}"
					 src="https://www.xingyue.xin/images/d-axie2.jpg" mode="" @touchstart="daxieStart"></image>
					<image class="invented2 shuzhi" v-else-if="iskeyShow == 'shuzhi' " :style="{width:keyboardW_p + 'px',height:keyboardH_p + 'px',left: phase_x_val + 'px' ,bottom:phase_y_val+'px'}"
					 src="https://www.xingyue.xin/images/shuzhi2.jpg" mode="" @touchstart="shuzhiStart"></image>
				</template>
			</template>
		</view>
		<!-- 底部菜单 -->
		<view v-if="isShow">
			<view class="u-page">
				<!-- 所有内容的容器 -->
			</view>
			<!-- 与包裹页面所有内容的元素u-page同级，且在它的下方 -->
			<u-tabbar v-model="current" :list="list" :mid-button="true" @change="tabbarChange"></u-tabbar>
		</view>
		<flotage v-else floticon="eye" @parCallback="showOption" right="0" bottom="10"></flotage>
		<!-- 输入文字 -->
		<u-modal v-model="inpshow" :title-style="{color: 'grey'}" @confirm="inputSubmit()" :show-cancel-button="true" title="输入文字[保证设备是可输入状态]">
			<view class="slot-content">
				<u-input v-model="inputVal" type="text" placeholder="输入你的内容" :border="true" style="margin: 20rpx 0;" />
			</view>
		</u-modal>
		<!-- 顶部提示 -->
		<u-top-tips ref="uTips" style="top: 0"></u-top-tips>
		<!-- 弹窗提示 -->
		<u-modal v-model="popShow1" style="line-height: 1.8;" title="[苹果appid]" :title-style="{color:'orangered'}"
		 :show-cancel-button="true" confirm-text="我知道了" :cancel-text="appidtext" cancel-color="blue" @confirm="confirmPop"
		 @cancel="copyEvent">
			<view class="slot-content">
				<rich-text :nodes="content1" class="operate-tit"></rich-text>
			</view>
		</u-modal>
		<u-modal v-model="popShow2" style="line-height: 1.8;" :title="appidtitle" confirm-text="点我关闭">
			<view class="slot-content">
				<rich-text :nodes="content2" class="operate-tit"></rich-text>
			</view>
		</u-modal>
		<u-modal v-model="popShow3" style="line-height: 1.8;" title="[看不到键盘怎么办]" confirm-text="我知道了">
			<view class="slot-content">
				<rich-text :nodes="content3" class="operate-tit"></rich-text>
			</view>
		</u-modal>
		<u-modal v-model="popShow4" :show-cancel-button="true" style="line-height: 1.8;" title="[开启微信浮窗]" confirm-text="我知道了"
		 cancel-text="不再提示" @cancel="noPopmess">
			<view class="slot-content">
				<rich-text :nodes="content4" class="operate-tit" style="padding: 0;"></rich-text>
			</view>
		</u-modal>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex';
	import {
		doSend,
		websocketInit
	} from '@/utils/websocket.js'
	import {
		veriExpirtimes,
		openScanCode,
		debounce,
		throttle,
		copyContent,
		binaryToblob,
		userLog_Insert,
		screenShot
	} from '@/utils/common.js'
	import {
		pathToBase64,
		base64ToPath
	} from '@/utils/pathto.js'
	import {
		screenUrl
	} from '@/api/global.js'

	let winWidth, winHeight, timer1 = null,
		timer2 = null,
		timeStart = null,
		timeEnd = null,
		timeOutEvent = null
	//操作屏幕的变量
	var startX;
	var startY;
	var endX;
	var endY;
	var scaleX;
	var scaleY;
	var phase_x_val;
	var phase_y_val;
	export default {
		data() {
			return {
				params: {},
				phone_id: "",
				phone_ip: "",
				src1: "",
				src2: "",
				src3: "",
				isShow: true,
				inpshow: false,
				isWxpro: "",
				isMessPoint: "",
				touchStartTime: 0, // 触摸开始时间   用来判断是否是双击	

				//底部菜单属性
				list: [{
						iconPath: "rewind-left",
						selectedIconPath: "rewind-left-fill",
						text: '返回',
						customIcon: false,
					},
					{
						iconPath: "home",
						selectedIconPath: "home-fill",
						text: 'home',
						// count: 2,
						// isDot: true,
						customIcon: false,
					},
					{
						iconPath: "grid",
						selectedIconPath: "grid-fill",
						text: '进程',
						customIcon: false,
					},
					{
						iconPath: "edit-pen",
						selectedIconPath: "edit-pen-fill",
						text: '输入',
						customIcon: false,
					},
					{
						// "https://cdn.uviewui.com/uview/common/min_button.png"
						// "https://cdn.uviewui.com/uview/common/min_button_select.png"
						iconPath: "eye-off",
						selectedIconPath: "eye-off",
						text: '隐藏',
						midButton: true,
						customIcon: false,
					},
					{
						iconPath: "level",
						selectedIconPath: "level",
						text: '键盘',
						// count: 23,
						// isDot: false,
						customIcon: false,
					},
					{
						iconPath: "reload",
						selectedIconPath: "reload",
						text: '刷新',
						// count: 23,
						// isDot: false,
						customIcon: false,
					},
					{
						iconPath: "scan",
						selectedIconPath: "scan",
						text: '扫码',
						// count: 23,
						// isDot: false,
						customIcon: false,
					},
					{
						iconPath: "apple-fill", //arrow-right",
						selectedIconPath: "apple-fill", //"arrow-right",
						text: 'appid',
						// count: 23,
						// isDot: false,
						customIcon: false,
					}
				],
				current: -1,
				//图片属性
				imgWidth: 375,
				imgHeight: 667,
				phase_x_val: 0,
				phase_y_val: 0,
				txtPrefix: "",
				//虚拟键盘
				//横屏宽高
				keyboardW_l: "",
				keyboardW_l: "",
				//竖屏宽高
				keyboardW_p: "",
				keyboardW_p: "",
				isKeyboard: false,
				iskeyShow: "xiaoxie",
				// landscape || portrait
				keyboardDir: 'landscape',
				//输入文字
				inputVal: "",
				//公告部分
				popShow1: false,
				popShow2: false,
				popShow3: false,
				popShow4: false,
				content1: `星若云手机--开放苹果appid<br/>可前往appStore下载各种游戏<br/><span style="color:orange">账号：sydz1001@126.com</span><br/><span style="color:orange">密码：Sy1234567</span><br/>为了方便使用请截图保存！！<br/>也可点击【屏幕下方导航栏--><br/>最右边的appid,来查看appid】`,
				content2: `<span style="color:orange">账号：sydz1001@126.com</span><span class="copy-but copy-but1">点我复制</span><br/><span style="color:orange">密码：Sy1234567</span><span class="copy-but copy-but2">点我复制</span>`,
				content3: `<img style="width:100%" src="https://www.xingyue.xin/images/pass-input.png"/>`,
				content4: `<img style="width:100%" src="https://www.xingyue.xin/images/fuchuang-pop.png"/>`,

				//显示内容调整
				appidtitle: `[复制appid]`,
				appidtext: `点我复制appid`
			}
		},
		onReady() {
			//#ifdef MP-WEIXIN
			this.appidtitle = `[查看appid]`
			this.appidtext = `[点我查看appid]`
			this.content2 =
				`<span style="color:orange">账号：sydz1001@126.com</span><br/><span style="color:orange">密码：Sy1234567</span>`
			//#endif
			//#ifdef H5
			const isMessPoint = this.isMessPoint ? this.isMessPoint : uni.getStorageSync('isMessPoint')
			console.log("这里了----------->", isMessPoint)
			if (isMessPoint != "no") {
				this.$refs.uTips.show({
					title: '小贴士1：由于网络安全起见,输入密码的时候-->是看不到输入框的密码和键盘的,您可以点击屏幕最下面左侧的【输入】按钮哦！！！',
					type: 'error',
					duration: '8000'
				})
				setTimeout(() => {
					this.$refs.uTips.show({
						title: '小贴士2：请不要将云设备的【苹果appid】退出,需要下载其他游戏的时候-->用我们给的appid下载或联系微信群哦！！！',
						type: 'error',
						duration: '7000'
					})
					setTimeout(() => {
						this.$refs.uTips.show({
							title: '小贴士3：如果不想要每次进来都弹出【提示信息】，可以点击我的-->账号设置-->消息推送-->取消即可哦！！！',
							type: 'error',
							duration: '6000'
						})
						setTimeout(() => {
							this.popShow1 = true
						}, 7000)
					}, 7000)
				}, 9000)
			}
			//#endif
			//#ifndef H5
			this.popShow1 = true
			//#endif
		},
		//微信分享
		onShareAppMessage(res) {
			let my_name = this.userInfo.username
			let invit_code = this.userInfo.invitation_code + "-" + my_name;
			if (res.from === 'button') { // 来自页面内分享按钮
				console.log(res.target)
			}
			return {
				title: '星若云手机',
				path: `/pages/user/wxlogin/wxlogin?invit_code=${invit_code}`
			}
		},
		onLoad(option) {
			try {
				if (option) {
					//获取设备数据
					let phone = JSON.parse(option.phone)
					let phone_id = phone.id
					let phone_ip = option.debug_ip ? option.debug_ip : phone.phone_ip
					let game_name = phone.game.game_name
					this.keyboardDir = game_name == "江湖贵族版" ? 'portrait' : 'landscape'
					let {
						expir_time,
						isWxpro,
						user,
						isMessPoint
					} = option

					if (user) {
						user = JSON.parse(user)
						console.log("这里了哦", user)
						this.login(user);
					}
					this.phone_id = phone_id
					this.phone_ip = phone_ip
					this.isWxpro = isWxpro
					this.isMessPoint = isMessPoint
					if (this.isWxpro) {
						this.list[0] = {
							iconPath: "share",
							selectedIconPath: "share-fill",
							text: '分享',
							customIcon: false,
						}
					}
					//可用时长检测
					veriExpirtimes(this, phone_id, expir_time)
					if (this.userInfo) {
						this.txtPrefix = "尾号为:" + this.userInfo.telephone.substring(this.userInfo.telephone.length - 4) + "的用户"
					}
				}
			} catch (e) {
				console.log(e)
			}

		},
		onShow() {
			//初始化
			this.init()
			//每过10分钟刷新一次
			timer1 = setInterval(item => {
				this.init()
			}, 60000 * 10)
			// 生成日志记录
			// 进入操作开始
			setTimeout(() => {
				timeStart = new Date().getTime()
				this.logrecordCreate(`开始操作`, `${this.txtPrefix}开始进入界面操作`)
			}, 3000)
			// 每过5分钟上传一次状态
			timer2 = setInterval(item => {
				this.logrecordCreate(`设备状态`, `${this.txtPrefix}当前的设备状态`)
			}, 60000 * 5)
		},
		onUnload() {
			clearInterval(timer1)
			clearInterval(timer2)
		},
		computed: {
			...mapState(['userInfo'])
		},
		watch: {
			popShow2(newVal) {
				if (newVal) {
					let _this = this
					setTimeout(() => {
						//#ifdef H5
						const but1 = document.getElementsByClassName("copy-but1")[0]
						const but2 = document.getElementsByClassName("copy-but2")[0]
						but1.onclick = function() {
							_this.copyText("sydz1001@126.com", "appid的账号复制成功！")
						}
						but2.onclick = function() {
							_this.copyText("Sy1234567", "appid的密码复制成功！")
						}
						//#endif
					}, 1000)
				}
			},
			popShow3(newVal) {
				if (!newVal) {
					setTimeout(() => {
						this.popShow4 = true
					}, 1000)
				}
			}
		},
		methods: {
			...mapMutations(['login']),
			//上传图片
			async uploadImg(params, callBack) {
				this.$apis.user_uploadimg(params).then(res => {
					if (res.code == 200) {
						if (res.data) {
							callBack && callBack(res.data.imgPath)
						}
					} else {
						this.$api.msg('图片过大,上传失败！');
					}
				})
			},
			//生成日志记录
			async logrecordCreate(name, content, isOff) {
				if (!userLog_Insert(this, isOff)) {
					return false
				}
				//调用截图
				screenShot(isOff, {
					ele: "#poster",
					width: this.imgWidth,
					height: this.imgHeight,
				}, base64 => {
					//#ifdef H5
					this.uploadImg({
						imgData: base64
					}, imgurl => {
						this.$apis.userlog_create({
							gamePhoneId: this.phone_id,
							name: name,
							content: content,
							imgurl: imgurl
						})
					})
					//#endif
					//#ifndef H5
					this.$apis.userlog_create({
						gamePhoneId: this.phone_id,
						name: name,
						content: content,
						imgurl: "无图片"
					})
					//#endif
				})
			},
			//最新公告
			newAnnounce() {
				setTimeout(() => {
					newAnnounce(this, res => {
						console.log("这里的公告==>", res)
						if (res) {
							this.announShow = true
							//#ifdef H5
							this.annContent =
								`<img style="display:${res.banner ? 'block' : 'none'}" src="http://xyscript.test.upcdn.net/公告图片/${res.banner}"/><pre>${res.content}</pre>`
							//#endif
						}
					});
				}, 3000)
			},
			//初始化
			init(text) {
				if (!text) {
					websocketInit()
					this.getScreenWandH()
					this.setKeyboard()
				}
				this.$api.msg(text || "正在获取屏幕", "loading")
				throttle(() => {
					this.$api.msg("请稍后...", "loading")
				}, 1000)()
				throttle(() => {
					this.screenAuto()
				}, 2000)()
			},
			//打开漂浮按钮
			showOption() {
				this.isShow = true
			},
			//复制appid
			copyEvent() {
				setTimeout(() => {
					this.popShow1 = true
				}, 1000)
				this.popShow2 = true
			},
			//复制文字
			copyText(text, tit) {
				copyContent(text)
				this.$api.msg(tit)
			},
			//点我知道了
			confirmPop() {
				setTimeout(() => {
					this.popShow3 = true
				}, 1000)
			},
			//不再提示
			noPopmess() {
				uni.setStorageSync('isMessPoint', "no")
			},
			/*
			  ---------------------------------界面操作模块---------------------------------
			*/
			//图片加载完成 --解决微信小程序里面-->> 图片不断加载闪屏的bug
			//功能 --通过一个或多个临时容器去临时存储图片，然后用一个容器去显示它
			//网页端 --> 一个壳子 + 一个显示容器
			//非网页端 --> 二个壳子 + 一个显示容器
			// #ifdef H5
			imgLoad() {
				setTimeout(() => {
					this.src2 = this.src1
				}, 5)
				this.get_phone_screen()
			},
			// #endif
			// #ifndef H5
			imgLoad1() {
				setTimeout(() => {
					this.src2 = this.src1
				}, 3)
			},
			imgLoad2() {
				setTimeout(() => {
					this.src3 = this.src2
				}, 3)
				this.get_phone_screen()
			},
			// #endif
			//界面渲染方法入口
			screenAuto() {
				this.get_phone_screen()
			},
			//设置虚拟键盘的宽高
			setKeyboard() {
				this.keyboardW_l = 161 / 375 * this.imgWidth
				this.keyboardH_l = this.imgHeight
				this.keyboardW_p = this.imgWidth
				this.keyboardH_p = 217 / 667 * this.imgHeight
			},
			//输入文字--提交
			inputSubmit() {
				this.Mouse_Option(11, 0, 0, this.inputVal);
			},
			//获取屏幕宽高
			getScreenWandH() {
				// 获取窗口宽度
				uni.getSystemInfo({
					success: (res) => {
						winWidth = res.windowWidth;
						winHeight = res.windowHeight;
						//设置图片显示宽高
						// #ifdef H5
						if (winWidth <= 375) {
							if (this.isWxpro == "yes") {
								this.imgWidth = winWidth * 0.92
								this.imgHeight = winWidth * (667 / 375) * 0.92
							} else {
								this.imgWidth = winWidth * 0.85
								this.imgHeight = winWidth * (667 / 375) * 0.85
							}
						} else {
							if (this.isWxpro == "yes") {
								//如果是苹果迷你5
								if (winWidth >= 750) {
									this.content4 = `<img style="width:70%" src="https://www.xingyue.xin/images/fuchuang-pop.png"/>`
									console.log("------------------进来这里了哦------------------")
									this.imgWidth = winWidth * 0.67
									this.imgHeight = winWidth * (667 / 375) * 0.67
								} else if (winWidth >= 500) {
									this.imgWidth = winWidth * 0.87
									this.imgHeight = winWidth * (667 / 375) * 0.87
								} else {
									this.imgWidth = winWidth * 0.92
									this.imgHeight = winWidth * (667 / 375) * 0.92
								}
							} else {
								//如果是苹果迷你5
								if (winWidth >= 750) {
									this.content4 = `<img style="width:70%" src="https://www.xingyue.xin/images/fuchuang-pop.png"/>`
									console.log("------------------进来这里了哦------------------")
									this.imgWidth = winWidth * 0.6
									this.imgHeight = winWidth * (667 / 375) * 0.6
								} else if (winWidth >= 500) {
									this.imgWidth = winWidth * 0.8
									this.imgHeight = winWidth * (667 / 375) * 0.8
								} else {
									this.imgWidth = winWidth * 0.9
									this.imgHeight = winWidth * (667 / 375) * 0.9
								}
							}
						}
						// #endif
						// #ifndef H5
						this.imgWidth = winWidth * 0.95
						this.imgHeight = winWidth * (667 / 375) * 0.95
						// #endif
						phase_x_val = (winWidth - this.imgWidth) / 2
						phase_y_val = (winHeight - this.imgHeight) / 2
						this.phase_x_val = phase_x_val
						this.phase_y_val = phase_y_val
						scaleX = this.imgWidth / 365
						scaleY = this.imgHeight / 667
					}
				})
			},
			//图片渲染方法
			imgApply(type = "", move_type, text) {
				const url = `${screenUrl}${this.phone_ip}&urll=`
				const url1 =
					`${url}snapshot1&t=${new Date().getTime()}`
				const url2 =
					`${url}event&type=${move_type}&state=0&text=` + text
				// const url1 =
				// 	`http://${this.phone_ip}:50005/snapshot1?ext=jpg&orient=0&compress=0.00001&scale=1&t-${new Date().getTime()}`
				// const url2 =
				// 	`http://${this.phone_ip}:50005/event?type=${move_type}&state=0&text=${text}`
				if (type != "action") {
					this.src1 = url1
				} else {
					this.src1 = url2
					this.init((move_type == 20 || move_type == 21) ? (move_type == 20 ? "正在前往home" : "正在切换进程") : "正在输入文字")
				}
			},
			//获取屏幕状态
			async get_phone_screen() {
				this.imgApply("", null, null)
			},
			//切换键盘类型
			setKeyType(name) {
				throttle(() => {
					this.iskeyShow = name
				}, 300)()
			},
			//虚拟键盘事件
			//小写键盘-->切换大写|数字
			xiaoxieStart(e) {
				const startX = e.changedTouches[0].clientX;
				const startY = e.changedTouches[0].clientY - phase_y_val;

				//如果是横屏状态
				if (this.keyboardDir == 'landscape') {
					if (startX > 45 * scaleX && startX <= (45 + 45) * scaleX && startY > 73 * scaleY && startY <= (73 + 65) * scaleY) {
						this.setKeyType("daxie")
					} else if (startX > 0 && startX <= 40 * scaleX && startY > 140 * scaleY && startY <= (140 + 65) * scaleY) {
						this.setKeyType("shuzhi")
					}
					//如果是竖屏状态
				} else {
					if (startX > 0 && startX <= 50 * scaleX && startY > 560 * scaleY && startY <= (563 + 55) * scaleY) {
						this.setKeyType("daxie")
					} else if (startX > 0 && startX <= 50 * scaleX && startY > 620 * scaleY && startY <= (620 + 55) * scaleY) {
						this.setKeyType("shuzhi")
					}
				}

			},
			//大写键盘-->切换小写|数字
			daxieStart(e) {
				const startX = e.changedTouches[0].clientX;
				const startY = e.changedTouches[0].clientY - phase_y_val;

				//如果是横屏状态
				if (this.keyboardDir == 'landscape') {
					if (startX > 0 && startX <= 40 * scaleX && startY > 140 * scaleY && startY <= (140 + 65) * scaleY) {
						this.setKeyType("shuzhi")
					} else {
						this.setKeyType("xiaoxie")
					}
				}
				//如果是竖屏状态
				else {
					if (startX > 0 && startX <= 50 * scaleX && startY > 620 * scaleY && startY <= (620 + 55) * scaleY) {
						this.setKeyType("shuzhi")
					} else {
						this.setKeyType("xiaoxie")
					}
				}

			},
			//数字键盘-->切换小写
			shuzhiStart(e) {
				const startX = e.changedTouches[0].clientX;
				const startY = e.changedTouches[0].clientY - phase_y_val;

				//如果是横屏状态
				if (this.keyboardDir == 'landscape') {
					//判定是否切换了小写
					if (startX > 0 && startX <= 40 * scaleX && startY > 70 * scaleY && startY <= (70 + 135) * scaleY) {
						this.setKeyType("xiaoxie")
					}
				}
				//如果是竖屏状态
				else {
					//判定是否切换了小写
					if (startX > 0 && startX <= 50 * scaleX && startY > 620 * scaleY && startY <= (620 + 55) * scaleY) {
						this.setKeyType("xiaoxie")
					}
				}

			},
			tabbarChange(index) {
				//底部事件
				//返回首页
				const navigateToIndex = () => {
					if (this.isWxpro == "yes") {
						//生成分享邀请码
						this.$api.msg("点击右上角“...”-->发送给朋友");
						setTimeout(() => {
							this.$api.msg("邀请注册成功可以领取100云币哦！");
						}, 2000)
					} else {
						//发送日志 --退出操作
						timeEnd = new Date().getTime()
						let timeDiff = timeEnd - timeStart
						let minutes = (parseInt(timeDiff) / 60000).toFixed(2)
						this.logrecordCreate(`退出操作`, `${this.txtPrefix}退出界面操作,共操作了${minutes}分钟！`, true)
						//退出界面
						this.$api.msg("正在返回设备页", "loading")
						setTimeout(() => {
							uni.switchTab({
								url: "/pages/phone/phone",
							});
						}, 500)
					}
				}
				//屏幕home键
				const toscreenIndex = () => {
					this.Mouse_Option(20, 0, 0, 0);
				}
				//切换进程
				const switchProcess = () => {
					this.Mouse_Option(21, 0, 0, 0);
				}
				//输入文字
				const inputText = () => {
					this.inpshow = true
				}
				//隐藏选项
				const hideOption = () => {
					this.isShow = false
				}
				//显示|隐藏键盘
				const toggleKeyboard = () => {
					this.isKeyboard = !this.isKeyboard
					if (this.isKeyboard) {
						this.iskeyShow = "xiaoxie"
					}
				}
				//重连设备
				const reconnect = () => {
					this.$api.msg("正在重连设备", "loading")
					doSend(JSON.stringify("rebinding:" + this.phone_ip))
				}
				//刷新界面
				const pageLoad = () => {
					this.$api.msg("重新加载中...", "loading")
					this.init()
				}
				//打开手机摄像头扫码
				const scanCode = () => {
					openScanCode(this)
				}
				//查看更多
				// viewMore
				//查看appid
				const getAppid = () => {
					this.popShow2 = true
					// this.$api.msg("暂无更多哦...")
				}

				switch (index) {
					case 0:
						{
							navigateToIndex()
						}
						break;
					case 1:
						{
							toscreenIndex()
						}
						break;
					case 2:
						{
							switchProcess()
						}
						break;
					case 3:
						{
							inputText()
						}
						break;
					case 4:
						{
							hideOption()
						}
						break;
					case 5:
						{
							toggleKeyboard()
						}
						break;
					case 6:
						{
							reconnect()
							pageLoad()
						}
						break;
					case 7:
						{
							scanCode()
						}
						break;
					case 8:
						{
							// viewMore()
							getAppid()
						}
						break;
				}
			},
			//公用屏幕操作方法
			Mouse_Option(type,
				x,
				y, text) {
				var params = this.params;
				var move_type = 1;
				switch (type) {
					case "down": //鼠标按下
						params.Mouse_Down = true;
						move_type = 1;
						break;
					case "move": //鼠标在屏幕移动
						if (!params.Mouse_Down) {
							move_type = 0;
						} else move_type = 2;
						break;
					case "up":
						move_type = 3;
						params.Mouse_Down = false;
						break;
					default:
						move_type = type;
						break;
				}
				if (move_type > 0) {
					//通过获取到的原始屏幕大小计算出当前鼠标所在屏幕位置
					var w_b = x / this.imgWidth;
					var h_b = y / this.imgHeight;
					var nowX = this.imgWidth * w_b * (375 / this.imgWidth);
					var nowY = this.imgHeight * h_b * (667 / this.imgHeight);
					if (typeof type == "number") {
						this.imgApply("action", move_type, text)
					} else {
						let sendObj = {
							input: {
								type: move_type,
								x: nowX * 2,
								y: nowY * 2,
								state: 0,
								text: text || "",
							},
						}
						//往设备发送拖动屏幕请求
						doSend(JSON.stringify(sendObj));
					}
				}
			},
			screen_start(e) {
				//如果不是管理员的，禁止掉卸载应用
				if (this.userInfo.username != "test") {
					// 长按事件触发
					timeOutEvent = setTimeout(() => {
						timeOutEvent = 0;
						this.Mouse_Option("up", startX, startY, this.phone_ip);
						this.logrecordCreate(`违规操作`, `${this.txtPrefix}可能想删除应用`)
						return
					}, 300);
				}

				//点击点赋值
				startX = e.changedTouches[0].clientX - phase_x_val;
				startY = e.changedTouches[0].clientY - phase_y_val;
				this.Mouse_Option("down", startX, startY, this.phone_ip);
				timeEnd = new Date().getTime()
				let timeDiff = timeEnd - timeStart
				if (timeDiff > 60000 * 30) {
					let minutes = (parseInt(timeDiff) / 60000).toFixed(2)
					this.logrecordCreate(`连续操作超过30分钟`, `${this.txtPrefix}操作时间已操作${minutes}分钟！`)
				} else {
					this.logrecordCreate(`点击屏幕`, `${this.txtPrefix}正在点击屏幕`)
				}
			},
			screen_move(e) {
				//长按状态清除
				clearTimeout(timeOutEvent);
				timeOutEvent = 0;
				e.preventDefault();
				//滑动点赋值
				startX = e.changedTouches[0].clientX - phase_x_val;
				startY = e.changedTouches[0].clientY - phase_y_val;
				this.Mouse_Option("move", startX, startY, this.phone_ip);
				this.logrecordCreate(`滑动屏幕`, `${this.txtPrefix}正在滑动屏幕`)
			},
			screen_end(e) {
				//长按状态清除
				clearTimeout(timeOutEvent);
				//弹起点赋值
				endX = e.changedTouches[0].clientX - phase_x_val;
				endY = e.changedTouches[0].clientY - phase_y_val;
				this.Mouse_Option("up", startX, startY, this.phone_ip);
				this.logrecordCreate(`屏幕弹起`, `${this.txtPrefix}屏幕已弹起`)
			},
		}
	}
</script>

<style lang="scss" scoped>
	.menu {
		position: absolute;
		right: 40rpx;

		.u-icon {
			font-size: 50rpx;
		}
	}

	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.invented1 {
		position: fixed;
		top: 0;
	}

	.invented2 {
		position: fixed;
		bottom: 0;
	}
</style>
