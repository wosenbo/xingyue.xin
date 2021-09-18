<template>
	<!-- 漂浮按钮 -->
	<view class="content">
		<view :style="{'transform':'translate3d('+xMove * 2+'rpx,'+yMove * 2+'rpx,0)',right:right * 2+'rpx',bottom:bottom * 2 +'rpx'}" class="touch" @touchstart="handleStart"
		 @touchmove="handleMove" @touchend="handleEnd" @click="parCallback">
			<u-icon :name="floticon"></u-icon>
		</view>
	</view>
</template>

<script>
	let winWidth, winHeight
	export default {
		data() {
			return {
				//悬浮按钮属性
				xMove: 0,
				yMove: 0,
				curPoint: {
					x: 0,
					y: 0
				},
				startPoint: {},
				isTouchMove: false
			};
		},
		props: {
			floticon: {
				type: String,
				default: ""
			},
			right: {
				type: String,
				default: "20"
			},
			// #ifdef  MP-WEIXIN
				bottom: {
					type: String,
					default: "20"
				},
			// #endif
			// #ifdef  H5
				bottom: {
					type: String,
					default: "40"
				},
			// #endif
			// #ifdef  APP-PLUS
				bottom: {
					type: String,
					default: "40"
				},
			// #endif
		},
		onLoad() {
			this.getScreenWandH()
		},
		methods: {
			//获取屏幕宽高
			getScreenWandH() {
				// 获取窗口宽度
				uni.getSystemInfo({
					success(res) {
						winWidth = res.windowWidth;
						winHeight = res.windowHeight
					}
				})
			},
			//启用父级的事件
			parCallback() {
				this.$emit("parCallback")
			},
			/* 
				---------------------------------悬浮按钮模块---------------------------------
			*/
			showOption() {
				this.isShow = true
			},
			handleStart(ev) {
				// console.log('start',ev);  
				// 记录一开始手指按下的坐标  
				var touch = ev.changedTouches[0];
				this.startPoint.x = touch.pageX;
				this.startPoint.y = touch.pageY;
			},
			handleMove(ev) {
				this.getScreenWandH()
				// console.log('move',ev);  
				// 防止页面高度很大，出现滚动条，不能移动-默认拖动滚动条事件  
				ev.preventDefault();

				this.isTouchMove = true;

				var touch = ev.changedTouches[0];
				var diffPonit = {}; // 存放差值  
				var movePonit = {
					// 记录移动的距离  
					x: 0,
					y: 0
				};

				diffPonit.x = touch.pageX - this.startPoint.x;
				diffPonit.y = touch.pageY - this.startPoint.y;
				// 移动的距离 = 差值 + 当前坐标点  
				movePonit.x = diffPonit.x + this.curPoint.x;
				movePonit.y = diffPonit.y + this.curPoint.y;
				this.move(movePonit.x, movePonit.y);
			},
			handleEnd(ev) {
				// console.log('end', ev);  
				if (!this.isTouchMove) return;

				//  更新坐标原点  
				var touch = ev.changedTouches[0];

				this.curPoint.x += touch.pageX - this.startPoint.x;
				this.curPoint.y += touch.pageY - this.startPoint.y;

				// 重置  
				this.isTouchMove = false;
			},
			move(x, y) {
				x = x || 0; // 没有传就是0  
				y = y || 0;
				this.xMove = x;
				this.yMove = y;
				// translate3d  (tx,ty,tz)  在X轴偏移tx，在Y轴偏移ty，在Z轴偏移tz，单位px  
			},
		}
	}
</script>

<style scoped>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.touch {
		z-index: 999;
		position: fixed;
		bottom: 10rpx;
		width: 90rpx;
		height: 90rpx;
		line-height: 90rpx;
		text-align: center;
		background-color: rgba(0, 0, 0, 0.6);
		border-radius: 50%;
		color: #fff;
		font-size: 60rpx;
		/* 使用transform: translate3d 处理性能高 GUP */
	}
</style>
