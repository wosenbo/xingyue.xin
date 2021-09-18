<template>
	<view class="guide">
		<u-popup v-model="show" mode="center" width="500rpx" height="900rpx">
			<view class="tit-rolling guide-tit-top">
				<u-notice-bar mode="horizontal" :list="titlist" color="grey" bg-color="#f5f5f5"></u-notice-bar>
			</view>
			<!-- 小程序头部兼容 -->
			<!-- #ifdef MP -->
			<u-section title="萌新必看教程" sub-title="查看更多" class="guide-tit-top-wx" :border="true"></u-section>
			<!-- #endif -->
			<template>
				<view class="back-list">
					<u-button v-for="(item,index) in backlist" :key="index" @click="backRouter(item)" width="30%">
						<u-icon :name="item.icon"></u-icon>&nbsp;{{item.name}}
					</u-button>
				</view>
			</template>
			<swiper class="swiper" @change="change">
				<swiper-item>
					<u-grid :col="3" hover-class="hover-class">
						<u-grid-item v-for="(item, index) in courseNames" @click="navToCoursesPage(item.text)" :index="index" :key="index">
							<u-icon :name="item.pic" :size="46"></u-icon>
							<text class="grid-text">{{ item.text }}</text>
						</u-grid-item>
					</u-grid>
				</swiper-item>
			</swiper>
			<!-- <view class="indicator-dots">
				<view class="indicator-dots-item" :class="[current == 0 ? 'indicator-dots-active' : '']">
				</view>
				<view class="indicator-dots-item" :class="[current == 1 ? 'indicator-dots-active' : '']">
				</view>
				<view class="indicator-dots-item" :class="[current == 2 ? 'indicator-dots-active' : '']">
				</view>
			</view> -->
		</u-popup>
	</view>
</template>

<script>
	import {
		showToast
	} from '@/utils/common'
	import {courseNames} from '@/utils/courses.js'
	export default {
		data() {
			return {
				current: 0,
				courseNames: courseNames,
				backlist: [{
						name: '首页',
						icon: 'home',
						url: "/pages/index/index"
					},
					{
						name: '设备',
						icon: 'phone',
						url: "/pages/phone/phone"
					},
					{
						name: '咨询中心',
						icon: 'kefu-ermai',
						url: "/pages/chat/index/index"
					},
				],
				backcurrent: -1,
				titlist: [
					'云教程在这里',
					'不明白怎么操作的话',
					'选择你要查看的教程',
					'去查看详细教程吧!'
				],
				show: false,
			};
		},
		props: {
			isShow: {
				type: Boolean,
				default: false
			}
		},
		watch: {
			isShow(newVal) {
				this.show = newVal
			}
		},
		methods: {
			//返回界面
			backRouter(item) {
				//暂时关闭该功能
				if(item.name=="咨询中心"){
					showToast("暂未开启该服务,请耐心等待...")
					return
				}
				showToast("前往"+item.name,"loading")
				setTimeout(()=>{
					uni[item.url.indexOf("chat")!=-1 ? 'navigateTo' : 'switchTab']({
						url: item.url,
					})
				},1000)
			},
			navToCoursesPage(name) {
				showToast("正在前往教程","loading")
				setTimeout(()=>{
					uni.navigateTo({
						url: '/pages/courses/courses?name=' + name
					})
				},1000)
			},
			change(e) {
				this.current = e.detail.current;
			}
		}
	};
</script>

<style scoped lang="scss">
	/* 下方这些scss变量为uView内置变量，详见开发  组件-指南-内置样式 */

	.guide {
		position: relative;
		z-index: 100;
	}

	.grid-text {
		font-size: 28rpx;
		margin-top: 4rpx;
		color: $u-type-info;
	}

	.swiper {
		height: 100%;
	}

	.indicator-dots {
		margin-top: 40rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.indicator-dots-item {
		background-color: $u-tips-color;
		height: 12rpx;
		width: 12rpx;
		border-radius: 20rpx;
		margin: 0 6rpx;
	}

	.indicator-dots-active {
		background-color: $u-type-primary;
	}

	.guide-tit-top-wx {
		height: 80rpx;
		line-height: 80rpx;
	}
	
	/* #ifdef MP-WEIXIN */
	.guide-tit-top-wx {
		height: 85rpx;
		line-height: 85rpx;
	}
	/* #endif */

	.back-list {
		display: flex;
		align-items: center;
		justify-content: space-around;
		margin: 5px auto;
	}

	// .back-list uni-button,.back-list button {
	// 	width: 30%;
	// 	height: 60rpx;
	// 	margin: 10rpx auto;
	// }
	
</style>
