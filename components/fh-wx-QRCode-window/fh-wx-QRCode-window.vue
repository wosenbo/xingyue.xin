<template>
	<view>
		<!-- #ifdef APP-PLUS || H5 -->
		<view id="oauth" :prop="config" v-show="false"></view>
		<view class="oauth" id="login_container"></view>
		<!-- #endif -->
		<!-- #ifndef APP-PLUS || H5 -->
		<view>非 APP、H5 环境不支持</view>
		<!-- #endif -->
	</view>
</template>

<script>
/**
 * FhWxQRCodeWindow 微信授权登录二维码窗口
 * @description APP端对接微信展示授权登录二维码
 * @property {string} appId 申请的微信公众号appId
 * @property {string} redirectUrl 授权回调域名
 * @property {object} options 组件配置options.qrCodeStyle是窗口样式
 */
export default {
	name: 'FhWxQRCodeWindow',
	props: {
		appId: {
			type: String,
			required: true
		},
		redirectUrl: {
			type: String,
			required: true
		},
		options: {
			type: Object,
			default: () => ({})
		}
	},
	watch: {
		options: {
			deep: true,
			handler: function(newVal, oldVal) {
				this.config = { ...this.config, ...this.options }
			},
			immediate: true
		},
		appId: {
			immediate: true,
			handler: function(newVal, oldVal) {
				this.config.appId = newVal
			}
		},
		redirectUrl: {
			immediate: true,
			handler: function(newVal, oldVal) {
				this.config.redirectUrl = newVal
			}
		}
	},
	data() {
		return {
			timer: null,
			config: {
				qrCodeStyle:
					'.impowerBox .qrcode {width: ' +
					uni.upx2px(145.02) +
					'px; margin-top: 0;}.impowerBox .title {display: none;}.impowerBox .info {display: none;}',
				timeout: 2000
			}
		}
	},
	mounted() {},
	methods: {
		async getUserInfoByState(data) {
			let redirectUrl = this.redirectUrl
			this.timer = setInterval(() => {
				this.$emit('getUserInfoByState', {
					appId: this.appId,
					redirectUrl: this.redirectUrl,
					state: data.state
				})
			}, this.config.timeout)
		},
		clearTimer() {
			clearInterval(this.timer)
		},
		updateConfig() {
			this.config = {}
		}
	},
	beforeDestroy() {
		this.clearTimer()
	}
}
</script>

<script module="oauth" lang="renderjs">
import createUUID from './utils.js'
let wxJsLogin;
export default {
		mounted() {
			let that = this
			// 动态引入较大类库避免影响页面展示
			const script = document.createElement('script')
			// view 层的页面运行在 www 根目录，其相对路径相对于 www 计算
			// script.src = 'static/js/wx-sdk/wxLogin.js'
			script.src = 'https://res.wx.qq.com/connect/zh_CN/htmledition/js/wxLogin.js'
			script.onload = this.initQRcode.bind(this)
			document.head.appendChild(script)
			console.log("这里了--->",script)
		},
		methods:{
			initQRcode(){
			    let {redirectUrl,appId,qrCodeStyle} = this.config
				let uuid = createUUID(32,16)
				// 设置二维码样式
				const blob = new Blob([qrCodeStyle],{type: "text/css;charset=utf-8"})
				const reader = new FileReader();
				reader.readAsDataURL(blob)
				const that = this
				reader.onload = function(e){
					wxJsLogin =	new WxLogin({
						self_redirect:true,
						id:"login_container",
						appid: appId,
						scope: "snsapi_login",
						redirect_uri: encodeURIComponent(redirectUrl),
						state: uuid,
						style: "black",
						href:reader.result
					});
					that.$ownerInstance.callMethod('getUserInfoByState',{
						'state':uuid
					});
				}
			}
		}
}
</script>

<style scoped lang="scss">
body {
	margin: unset !important;
}
</style>
