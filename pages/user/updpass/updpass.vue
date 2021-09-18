<template>
	<view class="container">
		<view class="left-bottom-sign"></view>
		<view class="back-btn yticon icon-zuojiantou-up" @click="navBack"></view>
		<view class="right-top-sign"></view>
		<!-- 设置白色背景防止软键盘把下部绝对定位元素顶上来盖住输入框等 -->
		<view class="wrapper">
			<!-- <view class="left-top-sign">UPDPASS</view> -->
			<view class="welcome">
				修改密码
			</view>
			<view class="input-content">
				<view class="input-item">
					<text class="tit">账号</text>
					<input type="username" v-model="form.username" placeholder="请输入账号/手机号" />
				</view>
				<view class="input-item">
					<text class="tit">密码</text>
					<input type="password" v-model="form.password_old" placeholder="请输入旧密码" @confirm="toUpdpass" />
				</view>
				<view class="input-item">
					<text class="tit">新密码</text>
					<input type="password" v-model="form.password_new" placeholder="请输入新密码" @confirm="toUpdpass" />
				</view>
			</view>
			<button class="confirm-btn" @click="toUpdpass" :disabled="updpassing">确定修改</button>
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
					password_old: '',
					password_new: '',
				},
				updpassing: false,
				integrall: "",
				isShow:false
			}
		},
		onLoad() {

		},
		methods: {
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
			inputChange(e) {
				const key = e.currentTarget.dataset.key;
				this[key] = e.detail.value;
			},
			navBack() {
				uni.switchTab({
					url: "/pages/user/index/index",
				})
			},
			async toUpdpass() {
				let params = {
					'username': this.form.username,
					'password_old': this.form.password_old,
					'password_new': this.form.password_new,
				};
				//数据校验
				if (!validateData(this, params)) {
					return false
				}
				this.$apis.user_updpass(params).then(res=>{
					if(res.code == 200){
						this.$api.msg("密码修改成功！","success");
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
			}
		},

	}
</script>

<style lang='scss'>
	@import "@/static/css/register.less";
</style>