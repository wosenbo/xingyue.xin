<template>
	<view class="container">
		<view class="left-bottom-sign"></view>
		<view class="back-btn yticon icon-zuojiantou-up" @click="navBack"></view>
		<view class="right-top-sign"></view>
		<!-- 设置白色背景防止软键盘把下部绝对定位元素顶上来盖住输入框等 -->
		<view class="wrapper">
			<view class="left-top-sign">LOGIN</view>
			<view class="welcome">
				欢迎回来！
				<!-- <u-icon name="weixin-circle-fill" class="weixin-circle-fill"></u-icon>
				<text class="welcome-wxlink" @click="wxLogin">&nbsp;登陆</text> -->
			</view>
			<view class="input-content">
				<view class="input-item">
					<text class="tit">账号</text>
					<input type="text" v-model="form.username" placeholder="请输入账号/手机号" />
				</view>
				<view class="input-item">
					<text class="tit">密码</text>
					<input type="password" placeholder="请输入密码" v-model="form.password" @confirm="toLogin" />
				</view>
			</view>
			<button class="confirm-btn" @click="toLogin" :disabled="logining">登录</button>
			<view class="forget-section" @click="toRetri">
				<text>忘记密码?</text>
			</view>
			<!-- #ifdef MP-WEIXIN -->
			<u-divider class="wx-login-fgx">哈喽，您可以点我进行微信登陆哦&nbsp;↓</u-divider>
			<view class="wx-login-but" @click="wxLogin">
				<u-image width="100%" height="120rpx" src='https://www.xingyue.xin/images/temp/weixin.png'></u-image>
			</view>
			<!-- #endif -->
		</view>
		<view class="register-section">
			还没有账号?
			<text @click="toRegist">马上注册</text>
		</view>
		<flotage floticon="question-circle-fill" @parCallback="showOption"></flotage>
		<question :isShow="isShow"></question>
	</view>
</template>

<script>
	import {
		mapMutations
	} from 'vuex';
	import {
		validateData,
		reloadPhone
	} from '@/utils/common.js';

	export default {
		data() {
			return {
				form: {
					username: '',
					password: '',
				},
				logining: false,
				integrall: "",
				isShow: false
			}
		},
		onLoad() {

		},
		methods: {
			...mapMutations(['login']),
			
			//前往微信登录
			wxLogin(){
				uni.navigateTo({
					url:"/pages/user/wxlogin/wxlogin"
				})
			},
			//弹出帮助窗口
			showOption() {
				if (this.isShow) {
					this.isShow = false
					setTimeout(() => {
						this.isShow = true
					}, 200)
				} else {
					this.isShow = true
				}
			},
			integral() {
				const data = {
					username: this.form.username,
					password: this.form.password
				}
				login(data, res => {
					console.log("这里了", res)
				})
			},
			inputChange(e) {
				const key = e.currentTarget.dataset.key;
				this[key] = e.detail.value;
			},
			navBack() {
				uni.switchTab({
					url: "/pages/user/index/index",
				})
			},
			toRegist() {
				let url
				if (!this.hasLogin) {
					url = '/pages/user/register/register';
				}
				uni.navigateTo({
					url
				})
			},
			toRetri() {
				let url
				if (!this.hasLogin) {
					url = '/pages/user/retrieve/retrieve';
				}
				uni.navigateTo({
					url
				})
			},
			async toLogin() {
				let params = {
					'username': this.form.username,
					'password': this.form.password
				};
				//数据校验
				if (!validateData(this, params)) {
					return false
				}
				this.$apis.user_login(params).then(res => {
					if (res.code == 200) {
						this.login(res.data);
						this.$api.msg('登录成功！', "success");
						setTimeout(() => {
							uni.switchTab({
								url: "/pages/phone/phone",
								success() {
									reloadPhone()
								}
							});
						}, 1000)
					}
				})
			}
		},
	}
</script>

<style lang='scss'>
	@import "@/static/css/login.less";
</style>
