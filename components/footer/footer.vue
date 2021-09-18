<template>
	<view class="footer">
		<view><text @click="getUseragree">用户协议</text>
			|
			<text @click="getPrivacyPoli">隐私政策</text>
		</view>
		<view>© 2021 福州星月网络科技有限公司 版权所有</view>
		<view>福建省福州市马尾区青洲路77号区档案馆大楼1118室</view>
		<view>闽ICP备2021011190号</view>
		<view>应用名：星若云手机</view>
		<view>版本号：4.2.0</view>
		<view>更新时间：2021-9-20</view>
	</view>
</template>

<script>
	export default {
		name: "guide",
		methods:{
			getUseragree(){
				uni.navigateTo({
					url:"/pages/user/agree/agree"
				})
			},
			getPrivacyPoli(){
				uni.navigateTo({
					url:"/pages/user/privacy/privacy"
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.footer {
		margin: 0 auto;
		background: #fff;
		box-shadow: inset 0 1px 0 #ebebeb;
		padding: 40rpx 0;
		line-height: 1.8;
		color: #666;

		view {
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 26rpx;

			text {
				font-size: 26rpx;
				color: #666;
				padding: 0 3.2vw;
				text-decoration: none;
			}
		}

	}
</style>
