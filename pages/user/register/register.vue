<template>
	<view class="container">
		<view class="left-bottom-sign"></view>
		<view class="back-btn yticon icon-zuojiantou-up" @click="navBack"></view>
		<view class="right-top-sign"></view>
		<!-- 设置白色背景防止软键盘把下部绝对定位元素顶上来盖住输入框等 -->
		<view class="wrapper">
			<!-- <view class="left-top-sign">REGISTER</view> -->
			<view class="welcome">
				注册用户
			</view>
			<view class="input-content">
				<view class="input-item">
					<text class="tit">手机号码</text>
					<input type="number" v-model="form.phone" placeholder="请输入手机号码" />
					<button type="default" class="get-verify-code" @click="get_verify_code">{{btntext}}</button>
				</view>
				<view class="input-item">
					<text class="tit">验证码</text>
					<input type="number" v-model="form.verify_code" placeholder="请输入验证码" />
				</view>
				<view class="input-item">
					<text class="tit">密码</text>
					<input type="password" v-model="form.password" placeholder="请输入密码" />
				</view>
				<view class="input-item">
					<text class="tit">邀请码(必填)</text>
					<input type="invita_text" v-model="form.invita_text" placeholder="请输入邀请码" />
				</view>
				<u-checkbox-group @change="checkboxGroupChange">
					<u-checkbox @change="checkboxChange" v-model="item.checked" v-for="(item, index) in list" :key="index" :name="item.name">
					{{item.name}}
					</u-checkbox>
					<text class="user-agree" @click="getUseragree">星若云用户许可协议</text>
				</u-checkbox-group>
				
			</view>

			<button class="confirm-btn" @click="toRegister" :disabled="registering">注册</button>
		</view>
		<view class="register-section">
			已有账号?
			<text @click="toLogin">前往登录</text>
		</view>
		<flotage floticon="question-circle-fill" @parCallback="showOption"></flotage>
		<question :isShow="isShow"></question>
		<!-- 提示信息 -->
		<u-modal v-model="titshow" :content="content" style="line-height: 1.8;" title="[小贴士]"></u-modal>
	</view>
</template>

<script>
	import {
		mapMutations
	} from 'vuex';
	import {
		validateData,
		identifying_Code,
		randomNum,
		getName,
		getSubstr,
		showToast
	} from '@/utils/common.js';
	export default {
		data() {
			return {
				form: {
					phone: '',
					verify_code: '',
					password: '',
					invita_text: ''
				},
				registering: false,
				integrall: "",
				btntext: "发送验证码",
				isShow: false,
				titshow: true,
				content: '小贴士：如果您输入有效邀请码的话，注册后可以免费获得20云币哦！',
				//服务条款模块
				isCheck:false,
				list: [{
						name: '我已同意',
						checked: false,
						disabled: false
					},
				]
			}
		},
		onLoad() {

		},
		methods: {
			...mapMutations(['login']),
			//复选框勾选事件
			// 选中某个复选框时，由checkbox时触发
			checkboxChange(e) {
				this.isCheck = e.value
				console.log(e,this.isCheck)
			},
			// 选中任一checkbox时，由checkbox-group触发
			checkboxGroupChange(e) {
				// console.log(e);
			},
			// 全选
			checkedAll() {
				this.list.map(val => {
					val.checked = true;
				})
			},
			getUseragree(){
				uni.navigateTo({
					url:"/pages/user/agree/agree"
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
			//获取验证码
			async get_verify_code() {
				let params = {
					telephone: this.form.phone
				}
				//数据校验
				if (!validateData(this, params)) {
					return false
				}
				if (!identifying_Code(this)) {
					return false
				}
				this.$apis.user_usersendsms(params).then(res => {
					if (res.code == 200) {
						showToast("验证码发送成功")
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
			toLogin() {
				let url
				if (!this.hasLogin) {
					url = '/pages/user/login/login';
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
			async toRegister() {
				if(!this.isCheck){
					this.$api.msg("请先勾选【星若云手机】用户许可协议！");
					return
				}
				//获取随机昵称
				this.$apis.user_getnumnickname().then(res => {
					let user_nickname = res.data.name
					let params = {
						'username': randomNum(10),
						'user_nickname': user_nickname,
						'password': this.form.password,
						'telephone': this.form.phone,
						'verify_code': this.form.verify_code,
					};
					// 注释部分暂时不用
					let invita_text = this.form.invita_text
					if(!invita_text) {this.$api.msg("必须填写邀请码！");return}
					let invitation_code = this.form.invita_text.split("-")[0]
					let invite_user = this.form.invita_text.split("-")[1]
					params.invitation_code = invitation_code || "199927"
					params.invite_user = invite_user || ""

					//数据校验
					if (!validateData(this, params)) {
						return false
					}
					this.$apis.user_register(params).then(res => {
						if (res.code == 200) {
							this.$api.msg("注册成功！", "success");
							setTimeout(() => {
								this.$api.msg("正在跳转登录", "loading");
								setTimeout(() => {
									uni.navigateTo({
										url: '/pages/user/login/login'
									})
								}, 1000)
							}, 500)
						}
					})
				})
			}
		},
	}
</script>

<style lang='scss'>
	@import "@/static/css/register.less";
</style>
