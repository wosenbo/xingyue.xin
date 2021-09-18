<template>
	<view v-if="show">
		<view>
			<view class="warper">
				<view class='header'>
					<image src='https://www.xingyue.xin/images/temp/weixin.png'></image>
					
				</view>
				<view class='content'>
					<template v-if="!isCanUse">
						<view>申请获取以下权限↓</view>
						<text>获取您的公开信息(昵称，头像、地区等)</text>
						<view class="u-checkbox-group" style="margin-top: 30rpx;">
							<u-checkbox-group @change="checkboxGroupChange">
								<u-checkbox @change="checkboxChange" v-model="item.checked" v-for="(item, index) in list" :key="index" :name="item.name">
									{{item.name}}
								</u-checkbox>
								<text class="user-agree" style="margin-top: 0;" @click="getUseragree">星若云手机用户协议</text>
							</u-checkbox-group>
						</view>
					</template>
					<template v-else>
						<view>申请获取以下信息↓</view>
						<text>获取您微信绑定的手机号码</text>
					</template>
				</view>
				<u-button class='wxlogin' v-if="!isCanUse" type='success' @click="wxGetUserInfo">同意授权</u-button>
				<u-button class='wxlogin' v-if="!isCanUse" type='warning' @click="removeCache">登录无反应？点我清除缓存</u-button>
				<u-button class='wxlogin' v-else type='success' open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">手机一键登录</u-button>
				<flotage floticon="question-circle-fill" @parCallback="showOption"></flotage>
				<question :isShow="isShow"></question>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapMutations
	} from 'vuex'
	import {
		validateData,
		reloadPhone,
		randomNum,
		getSubstr
	} from '@/utils/common.js';
	export default {
		data() {
			return {
				show: true,
				isShow: false,
				code: "",
				SessionKey: '',
				encryptedData: "",
				iv: "",
				//用户微信信息
				nickName: null,
				avatarUrl: null,
				openId: '',
				SessionKey: '',
				isCanUse: false, //默认为false  记录当前用户是否是第一次授权使用的
				//服务条款模块
				isCheck: false,
				list: [{
					name: '我已同意',
					checked: false,
					disabled: false
				}, ],
				//微信邀请码
				invitation_code: "",
				invite_user: ""
			}
		},

		onLoad(option) {
			if (option) {
				let invit_code = option.invit_code
				console.log("进来微信登陆界面了，邀请码为:" + invit_code)
				if (invit_code) {
					this.invitation_code = invit_code.split("-")[0]
					this.invite_user = invit_code.split("-")[1]
				}
			}
		},
		methods: {
			...mapMutations(["logout","login", "wxlogin"]),
			//复选框勾选事件
			// 选中某个复选框时，由checkbox时触发
			checkboxChange(e) {
				this.isCheck = e.value
				console.log(e, this.isCheck)
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
			getUseragree() {
				uni.navigateTo({
					url: "/pages/user/agree/agree"
				})
			},
			//清除应用缓存
			removeCache(){
				let _this = this
				uni.showModal({
					content: '确定要清除应用缓存吗？',
					success: (e) => {
						if (e.confirm) {
							//先清除你设置的缓存
							this.logout()
							let storArr = ["game_id","isGuide","isCanUse","userwxInfo"]
							storArr.forEach(item=>{
								uni.removeStorage({
									key: item
								})
							})
							_this.$api.msg("缓存清理成功", "success")
							setTimeout(()=>{
								_this.$api.msg("重新登录吧！", "success")
							},1000)
						}
					},
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
			wxGetUserInfo() { //第一授权获取用户信息===》按钮触发
				if (!this.isCheck) {
					this.$api.msg("请先勾选【星若云手机】用户许可协议！");
					return
				}
				let _this = this;
				// 获取用户信息
				uni.getUserProfile({
					desc: 'weixin',
					success: function(infoRes) {
						_this.encryptedData = infoRes.encryptedData
						_this.iv = infoRes.iv
						_this.nickName = infoRes.userInfo.nickName; //昵称
						_this.avatarUrl = infoRes.userInfo.avatarUrl; //头像
						_this.wxAuthorize()
					},
					fail: function(fail) {
						console.log("fail:", fail)
					}
				});
			},
			//微信授权
			wxAuthorize() {
				let _this = this;
				uni.showLoading({
					title: '授权中...'
				});

				// 1.wx获取登录用户code
				uni.login({
					desc: 'weixin',
					success: function(loginRes) {
						_this.code = loginRes.code;
						_this.updateUserInfo(); //调用更新信息方法
						// 将用户登录code传递到后台置换用户SessionKey、OpenId等信息
						setTimeout(() => {
							_this.show = false
							_this.isCanUse = true
							_this.$api.msg("授权成功...", "success")
							setTimeout(() => {
								_this.$api.msg("正在跳转...", "loading")
								setTimeout(() => {
									_this.show = true
								}, 1000)
							}, 500)
						}, 500)
					},
				})
			},
			//向后台更新信息
			updateUserInfo() {
				let params = {
					nickName: this.nickName,
					avatarUrl: this.avatarUrl
				}
				let _this = this;
				var obj = {
					js_code: this.code
				}
				// 请求微信端地址获取用户唯一标识的
				this.$apis.user_wechatcode(obj).then(res => {
					let {
						session_key,
						openid
					} = res.data
					this.sessionKey = session_key
					this.openId = openid
				}, err => {
					console.log("err:", err)
				})
			},
			//微信登录
			user_wxLogin(params) {
				this.$apis.user_wxlogin(params).then(res => {
					let data = res.data
					data.user_profile = this.avatarUrl
					this.login(data);
					this.$api.msg('微信登录成功！', "success");
					setTimeout(() => {
						uni.switchTab({
							url: "/pages/phone/phone",
							success() {
								reloadPhone()
								uni.setStorageSync('isCanUse', true); //记录是否第一次授权 true:表示不是第一次授权
							}
						});
					}, 1000)
				})
			},
			//手机一键登录
			getPhoneNumber(PhoneNumber) {
				let userwxInfo = uni.getStorageSync('userwxInfo')
				let {
					openId,
					sessionKey,
					nickName,
					avatarUrl
				} = userwxInfo ? userwxInfo : this
				if (userwxInfo) {
					this.avatarUrl = userwxInfo.avatarUrl
				}
				let params = {
					sessionKey: sessionKey,
					encryptedData: PhoneNumber.detail.encryptedData,
					iv: PhoneNumber.detail.iv
				}
				this.$apis.user_wechatdecrypt(params).then(res => {
					if (res.code == 200) {
						let telephone = res.data.phoneNumber
						let userwxData = {
							nickName: nickName,
							avatarUrl: avatarUrl,
							telephone: telephone,
							openId: openId,
							sessionKey: sessionKey
						}
						//这里调用微信登录
						setTimeout(() => {
							this.$apis.user_wxisregister({
								user_openid: openId
							}).then(res => {
								if (res.code == 200) {
									if (res.status == 1) {
										let params = {
											user_openid: openId,
											telephone: telephone
										}
										//已注册过,直接调用登录
										this.user_wxLogin(params)
									} else {
										//先注册，在登录
										let params = {
											'username': randomNum(10),
											'user_nickname': nickName,
											'telephone': telephone,
											'user_openid': openId
										};

										params.invitation_code = this.invitation_code || "199927"
										params.invite_user = this.invite_user || ""

										console.log("这里了1------------->", params.invitation_code)
										console.log("这里了2------------->", params.invite_user)
										//数据校验
										if (!validateData(this, params)) {
											return false
										}
										setTimeout(() => {
											this.$apis.user_wxregister(params).then(res => {
												if (res.code == 200) {
													//调用登录
													let params = {
														user_openid: openId,
														telephone: telephone
													}
													setTimeout(() => {
														console.log("---------------------------这里了---------------------------")
														this.user_wxLogin(params)
														this.wxlogin(userwxData)
													}, 500)
												}
											})
										}, 500)
									}
								}
							})
						}, 500)
					}
				})
			}
		}
	}
</script>

<style scoped>
	.warper {
		width: 90%;
		margin: 0 auto;
	}

	.header {
		margin: 90rpx 0 90rpx 0;
		border-bottom: 2rpx solid #ccc;
		text-align: center;
		width: 650rpx;
		height: 300rpx;
		line-height: 450rpx;
	}

	.header image {
		width: 200rpx;
		height: 200rpx;
	}

	.content {
		margin-left: 50rpx;
		margin-bottom: 90rpx;
	}

	.content text {
		display: block;
		color: #9d9d9d;
		margin-top: 40rpx;
	}

	.wxlogin {
		border-radius: 80rpx;
		margin: 70rpx 50rpx;
		font-size: 35rpx;
	}
</style>
