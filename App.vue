<style lang="scss">
	/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
	@import "uview-ui/index.scss";
</style>
<script>
	/**
	 * vuex管理登陆状态，具体可以参考官方登陆模板示例
	 */
	import {
		mapMutations
	} from 'vuex';
	import {
		setVerik
	} from '@/utils/common.js'
	// import GoEasy from "https://www.xingyue.xin/js/goeasy-2.0.12.min.js";
	import {
		disMalice
	} from '@/utils/common.js'
	export default {
		globalData: {
			// goEasy: GoEasy.getInstance({
			// 	host:"hangzhou.goeasy.io",//应用所在的区域地址: 【hangzhou.goeasy.io |singapore.goeasy.io】
			//        appkey:"BC-d47ec855476c45ab937ecc5bb1ce845b",// common key,
			//        modules: ['pubsub']
			// })
		},
		onLaunch: function() {
			// #ifdef MP-WEIXIN
			this.mpUpdate()
			// #endif
			let userInfo = uni.getStorageSync('userInfo') || '';
			if (userInfo.token) {
				//更新登陆状态
				uni.getStorage({
					key: 'userInfo',
					success: (res) => {
						this.login(res.data);
					}
				});
			}	
		},
		onLoad() {
			setVerik();
		},
		methods: {
			...mapMutations(['login']),
			mpUpdate() {
				const updateManager = uni.getUpdateManager() // 小程序版本更新管理器
				
				updateManager.onCheckForUpdate(res => { // 检测新版本后的回调
					if (res.hasUpdate) { // 如果有新版本提醒并进行强制升级
						uni.showModal({
							content: '发现新版本',
							showCancel: false,
							confirmText: '升级',
							success: res => {
								if (res.confirm) {
									updateManager.onUpdateReady(res => { // 新版本下载完成的回调
										updateManager.applyUpdate() // 强制当前小程序应用上新版本并重启
									})

									updateManager.onUpdateFailed(res => { // 新版本下载失败的回调
										// 新版本下载失败，提示用户删除后通过冷启动重新打开
										uni.showModal({
											content: '下载失败，请删除当前小程序后重新打开',
											showCancel: false,
											confirmText: '知道了'
										})
									})
								}
							}
						})
					}
				})
			}
		},
		onShow: function() {
			//获取缓存
			const isMessPoint = uni.getStorageSync('isMessPoint')
			if (!isMessPoint) {
				uni.setStorageSync('isMessPoint', true)
			}
			console.log('App Show')
			//获取屏幕宽高
			// 获取窗口宽度
			//#ifdef H5
			uni.getSystemInfo({
				success: (res) => {
					if (location.host.indexOf("xingyue.xin") != -1) {
						disMalice(this, res.windowWidth <= 750 ? "" : "感谢您使用星若云手机平台，禁止一切想操作控制台的行为！！！")
					}
				}
			})
			//#endif
		},
		onHide: function() {
			console.log('App Hide')
		},
	}
</script>

<style lang='scss'>
	@import "@/static/css/style.less";
</style>
