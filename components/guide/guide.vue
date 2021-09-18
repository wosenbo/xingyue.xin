<!-- guide.vue -->
<template>
	<view v-if="isShow" class="main">
		<view class="rect-shadow" :style="{'width':width+'px','height':height+'px','left':left+'px',top:top+'px'}"></view>
		<template v-if="noticeArray[currentIndex].type == 'left' ">
			<view class="show-message_left" :style="{'top': top +'px', 'right': winWidth-right+width+20+'px' }">
				<view style="padding: 12rpx 18rpx;">{{showMessage}}</view>
			</view>
		</template>
		<template v-if="noticeArray[currentIndex].type == 'top' ">
			<view :class="left<(winWidth/2)?'show-message_top_left':'show-message_top_right'" :style="{'top': (top-height) +'px', 'left': left<(winWidth/2)?left+'px':'' , 'right': left>(winWidth/2)?(winWidth-right)+'px':''  }">
				<view style="padding: 12rpx 18rpx;">{{showMessage}}</view>
			</view>
		</template>
		<template v-if="noticeArray[currentIndex].type == 'top right' ">
			<view :class="'show-message_top_right'" :style="{'top': (top-height + 20) +'px', 'right': '0px'}">
				<view style="padding: 12rpx 18rpx;">{{showMessage}}</view>
			</view>
		</template>
		<template v-if="noticeArray[currentIndex].type == 'right' ">
			<view class="show-message_right" :style="{'top': top +'px', 'left': (left+width+20) +'px' }">
				<view style="padding: 12rpx 18rpx;">{{showMessage}}</view>
			</view>
		</template>
		<template v-if="noticeArray[currentIndex].type == 'bottom' ">
			<view :class="left<(winWidth/2)?'show-message_bottom_left':'show-message_bottom_right'" :style="{'top': (top+height+20) +'px', 'left': left<(winWidth/2)?left+'px':'' , 'right': left>(winWidth/2)?(winWidth-right) +'px':'' }">
				<view style="padding: 12rpx 18rpx;">{{showMessage}}</view>
			</view>
		</template>
		<view class="cover-wrap">
			<view class="guide-next" @tap="click" :style="{color: currentIndex==noticeArray.length-1? '#EA3E4F':'#000000'}">{{nextText}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "guide",
		props: {
			// 是否展示指引
			show: {
				type: Boolean,
				default: false
			},
			// 位置
			left: {
				type: [Number, String],
				default: ''
			},
			right: {
				type: [Number, String],
				default: ''
			},
			top: {
				type: [Number, String],
				default: ''
			},
			// 宽 高
			width: {
				type: [Number, String],
				default: ''
			},
			height: {
				type: [Number, String],
				default: ''
			},
			// 解释语言
			showMessage: {
				type: String,
				default: ''
			},
			// 当前在第几个
			currentIndex: {
				type: Number,
				default: 0
			},
			// 引导的数量数组
			noticeArray: {
				type: Array,
				default: []
			}
		},
		data() {
			return {
				winWidth: 0, // 获取手机屏幕宽度
				nextText: '下一步' ,// 知道了，关闭说明
				isShow:!uni.getStorageSync('isGuide')
			}
		},
		watch: {
			show(n) {
				
			},
			// 当最后一个时 修改文本
			currentIndex(value) {
				if (value == this.noticeArray.length - 1) {
					this.nextText = '知道了，关闭引导'
				}
			}
		},
		methods: {
			click() {
				if(this.nextText == '知道了，关闭引导'){
					this.isShow = false
					uni.showLoading({
						title: '开始使用吧！',
						mask: true,
						duration:1000,
					});
					setTimeout(()=>{
						uni.hideLoading()
						uni.setStorageSync('isGuide', true);
					},1000)
				}else{
					console.log("点这里了ok")
					this.$emit('click');
				}
			}
		},
		created() {
			setTimeout(() => {
				// 获取手机屏幕宽度
				uni.getSystemInfo({
					success: (res) => {
						this.winWidth = res.windowWidth;
					}
				});
			}, 60)
		}
	}
</script>

<style lang="scss">
	.main {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 999;
	}

	.rect-shadow {
		position: absolute;
		border-radius: 10px;
		box-shadow: 0 0 0 3000px rgba(0, 0, 0, 0.5);
		pointer-events: none;
	}

	.show-message_left,
	.show-message_top_left,
	.show-message_top_right,
	.show-message_right,
	.show-message_bottom_left,
	.show-message_bottom_right {
		position: absolute;
		border-radius: 10rpx;
		background-color: rgba(0, 0, 0, .5);
		text-align: center;
		pointer-events: none;
		color: #fff;
		font-size: 30rpx;
	}

	.show-message_left::after {
		content: '';
		border-left: 12rpx solid rgba(0, 0, 0, .5);
		border-top: 12rpx solid transparent;
		border-right: 12rpx solid transparent;
		border-bottom: 12rpx solid transparent;
		width: 0;
		height: 0;
		position: absolute;
		top: 25%;
		right: -24rpx;
	}

	.show-message_top_left::after,
	.show-message_top_right::after {
		content: '';
		border-left: 12rpx solid transparent;
		border-top: 12rpx solid rgba(0, 0, 0, .5);
		border-right: 12rpx solid transparent;
		border-bottom: 12rpx solid transparent;
		width: 0;
		height: 0;
		position: absolute;
		top: 100%;
	}

	.show-message_top_left::after {
		left: 20%;
	}

	.show-message_top_right::after {
		right: 20%;
	}

	.show-message_right::after {
		content: '';
		border-left: 12rpx solid transparent;
		border-top: 12rpx solid transparent;
		border-right: 12rpx solid rgba(0, 0, 0, .5);
		border-bottom: 12rpx solid transparent;
		width: 0;
		height: 0;
		position: absolute;
		top: 25%;
		left: -24rpx;
	}

	.show-message_bottom_left::after,
	.show-message_bottom_right::after {
		content: '';
		border-left: 12rpx solid transparent;
		border-top: 12rpx solid transparent;
		border-right: 12rpx solid transparent;
		border-bottom: 12rpx solid rgba(0, 0, 0, .5);
		width: 0;
		height: 0;
		position: absolute;
		top: -24rpx;
	}

	.show-message_bottom_left::after {
		left: 20%;
	}

	.show-message_bottom_right::after {
		right: 20%;
	}

	.cover-wrap {
		width: 100vw;
		height: 100vh;
		top: 0;
		left: 0;
		position: absolute;

		.guide-next {
			padding: 0 40rpx;
			height: 72rpx;
			// background-color: #FFFFFF;
			background-color: rgba(200,200,200,0.8);
			line-height: 72rpx;
			text-align: center;
			font-size: 28rpx;
			border-radius: 38rpx;
			position: absolute;
			bottom: 372rpx;
			left: 50%;
			transform: translate(-50%, 0);
		}
	}
</style>
