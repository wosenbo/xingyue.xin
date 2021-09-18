<template>
	<view class="container">
		<view class="left-bottom-sign"></view>
		<view class="back-btn yticon icon-zuojiantou-up" @click="navBack"></view>
		<view class="right-top-sign"></view>
		<!-- 设置白色背景防止软键盘把下部绝对定位元素顶上来盖住输入框等 -->
		<view class="wrapper">
			<!-- <view class="left-top-sign">UPDPASS</view> -->
			<view class="welcome">
				找回密码
			</view>
			<view class="input-content">
				<view class="input-item">
					<text class="tit">账号</text>
					<input type="username" v-model="form.username" placeholder="请输入账号" />
				</view>
				<view class="input-item">
					<text class="tit">手机号</text>
					<input type="number" v-model="form.phone" placeholder="请输入手机号" />
					<button type="default" class="get-verify-code" @click="get_verify_code">{{btntext}}</button>
				</view>
				<view class="input-item">
					<text class="tit">验证码</text>
					<input type="number" v-model="form.verify_code" placeholder="请输入验证码" />
				</view>
				<view class="input-item">
					<text class="tit">新密码</text>
					<input type="password" v-model="form.password_new" placeholder="请输入新密码" @confirm="toRespass" />
				</view>
				<view class="input-item">
					<text class="tit">再次确认</text>
					<input type="password" v-model="form.password_new2" placeholder="再次确认新密码" @confirm="toRespass" />
				</view>
			</view>
			<button class="confirm-btn" @click="toRespass" :disabled="respassing">确定修改</button>
		</view>
		<flotage floticon="question-circle-fill" @parCallback="showOption"></flotage>
		<question :isShow="isShow"></question>
	</view>
</template>

<script>
	import {
		mapMutations,
		mapState
	} from 'vuex';
	import {
		validateData,
		identifying_Code,
		randomNum
	} from '@/utils/common.js';
	export default {
		data() {
			return {
				form:{
					username: '',
					phone: '',
					verify_code: '',
					password_new: '',
					password_new2: '',
				},
				respassing: false,
				integrall: "",
				btntext: "发送验证码",
				isShow:false
			}
		},
		onLoad() {

		},
		computed: {
			...mapState(['hasLogin', 'userInfo'])
		},
		methods: {
			...mapMutations(['login', 'logout']),
			//弹出帮助窗口
			showOption(){
				if(this.isShow){
					this.isShow = false
					setTimeout(()=>{
						this.isShow = true
					},200)
				}else{
					this.isShow = true
				}
			},
			//获取验证码
			async get_verify_code() {
				
				let params = {
					telephone: this.form.phone
				}
				//数据校验
				if (!validateData(this, params)) {
					return false
				}

				this.$apis.user_usersendsms(params).then(res=>{
					if (res.code == 200) {
						this.$api.msg("验证码发送成功！","success");
						identifying_Code(this)
					}
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
			async toRespass() {
				let params1 = {
					'username': this.form.username,
					'telephone': this.form.phone,
					'verify_code': this.form.verify_code
				};
				//数据校验
				if (!validateData(this, params1)) {
					return false
				}
				this.$apis.user_veritelephone(params1).then(res=>{
					if(res.code == 200){
						let {
							token
						} = res.data
						this.$api.msg('手机验证码输入正确...');
						let params2 = {
							'username': this.form.username,
							'password_new': this.form.password_new,
							'password_new2': this.form.password_new2,
						};
						//数据校验
						if (!validateData(this, params2)) {
							return false
						}
						setTimeout(()=>{
							this.$apis.user_resetpass(params2,token).then(res=>{
								if(res.code == 200){
									this.$api.msg("密码重置成功！","success");
									setTimeout(()=>{
										this.$api.msg("正在跳转登录","loading");
										setTimeout(()=>{
											uni.navigateTo({
												url: '/pages/user/login/login'
											})
										},1000)
									},500)
								}
							})
						},1000)
					}
				})
			}
		},

	}
</script>

<style lang='scss'>
	@import "@/static/css/register.less";
</style>