<template>
	
	<view style="position: relative; overflow: hidden;" class="lottery-wrap">
		<!-- <image src="https://img1.baidu.com/it/u=902346742,2121734643&fm=11&fmt=auto&gp=0.jpg" mode="widthFix" style="width: 100%;position: absolute;"></image> -->
		<view class="box" :class="isStart? 'start' : '' " :style="'transform: rotate('+deg+'deg)'">
			<view class="box_item" v-for="item in data" :key='item.id'>
				{{item.name}}
			</view>
		</view>
		<view class="active" @click="active">
			开始
		</view>
	</view>
</template>

<script>
	import {getRandomNum_AB,GL} from '@/utils/index.js'
	import {formatDateTime} from '@/utils/common.js'
	
	export default {
		data() {
			return {
				data:[
					{id:1,name:''},
					{id:2,name:''},
					{id:3,name:''},
					{id:4,name:''},
					{id:5,name:''},
					{id:6,name:''},
					{id:7,name:''},
					{id:8,name:''}
				],
				deg:22.5,
				isStart:false,
				flag:0,
				date:null
			};
		},
		onLoad() {
			let arr = ['体验卡(欧皇)','2云币','6云币','谢谢参与','2云币','10云币','16云币','20云币']
			this.data.forEach((item,index)=>{
				item.name=arr[index]
			})
		},
		methods:{
			active(){
				let date = formatDateTime(new Date()).split(" ")[0]
				this.date = date
				//查询今天是否抽过奖
				let isTodaydraw = uni.getStorageSync("isTodaydraw"+this.date)
				if(isTodaydraw == "yes"){
					this.$api.msg("您今日已抽过奖了哦,请明天再来哦！")
					return
				}
				if(this.isStart) return
				this.isStart=true
				// this.flag=getRandomNum_AB(1,8)
				// 随机生成 1 ~ 9 之间的数(不包含9) 
				let gl = new GL({
				    min: 1,
				    max: 9,
				    fenpei: new Map([
				        [1, 0.066], //0.066
						[2, 0.083], 
						[3, 0.15],  
						[4, 0.2],  
						[5, 0.083],  
						[6, 0.15],  
						[7, 0.15],  
						[8, 0.1],  
				    ])
				});
				this.flag=gl.random()
				// 指定奖项
				this.start(this.flag)
			},
			start(n){
				// 获取旋转角度
				let deg = 1080-(45*n)+22.5
				this.deg += deg
				setTimeout(()=>{
					this.isStart=false
					let title = this.data[this.flag-1].name
					let addbalance = 0
					let isOuhuang = false
					if(title=="谢谢参与" || title=="体验卡(欧皇)"){
						addbalance = 0
					}else{
						addbalance = parseInt(title)
					}
					this.$apis.user_updbalance({
						addbalance : addbalance
					}).then(res=>{
						if(title == "体验卡(欧皇)"){
							isOuhuang = true
							title = `哇哇哇,恭喜欧皇,成功抽到体验卡啦!! 您的设备过期后,可以直接再购买一次体验版哦!!`
						}else if(title != "谢谢参与"){
							title = `恭喜您,抽到了${title}!`
						}else{
							title = `谢谢您的参与,再接再厉哦！`
						}
						setTimeout(()=>{
							uni.showModal({
							    title: '抽奖结果',
							    content: title,
							    success:  (res)=> {
									this.deg= 22.5
									uni.setStorageSync("isTodaydraw"+this.date,"yes")
									//如果是欧皇
									if(isOuhuang){
										//重置用户的体验属性
										this.$apis.user_recoverexperience().then(res=>{
											setTimeout(()=>{
												this.$api.msg("欧皇你好,您的设备过期后,可以直接再购买一次体验版哦!!")
											},1000)
										})
									}
							      //   if (res.confirm) {
							      //       console.log('用户点击确定');
									    // this.deg= 21
							      //   } else if (res.cancel) {
							      //       console.log('用户点击取消');
							      //   }
							    }
							});
						},1000)
					})
				},3200)
			}
		}
	}
</script>

<style lang="less" scoped>
	.lottery-wrap{
		height: 100%;
		background: url(https://img1.baidu.com/it/u=902346742,2121734643&fm=11&fmt=auto&gp=0.jpg);
		background-size: 100%;
	}
	.active{
		position: absolute;
		top: 50%;
		left: 50%;
		width: 150rpx;
		height: 150rpx;
		background-color: #DD524D;
		transform: translate(-50%,-50%);
		line-height: 150rpx;
		text-align: center;
		border-radius: 50%;
		color: #fff;
		&::before{
			content: '';
			width: 0;
			height: 0;
			border-left: 30rpx solid transparent;
			border-right: 30rpx solid transparent;
			border-bottom: 60rpx solid #DD524D;	
			position: absolute;
			top: -40rpx;
			left: 50%;
			transform: translateX(-50%);
		}
		
	}
	.start{
		transition: all 3.5s cubic-bezier(0.09, 0.99, 0.72, 1);
	}
	.box{
		position: relative;
		top: calc(50% - 44rpx - 350rpx);
		background-color: #007AFF;
		width: 700rpx;
		height: 700rpx;
		border-radius: 50%;
		margin: 50rpx auto;
		overflow: hidden;
		border: 1px solid #007AFF;
		opacity: 0.6;
		.box_item{
			&::after{
				position: absolute;
				content: '';
				height: 100%;
				width: 2rpx;
				right: 0;
				// transform: translateX(50%);
				background-color: #FFFFFF;
				transform-origin: 50% 50%;
				transform: rotate(22.5deg) translateX(5%);
			}
			position: absolute;
			top: 0;
			left: 275rpx;
			width: 150rpx;
			height: 350rpx;
			font-size: 26rpx;
			// background-color: #4CD964;
			transform-origin: 50% 100%;
			text-align: center;
			line-height: 140rpx;
			color: #fff;
			&:nth-child(1){
				color: yellow;
			}
			&:nth-child(2){
				transform: rotate(45deg);	
			}
			&:nth-child(3){
				// font-size: 34rpx;
				transform: rotate(90deg);
			}
			&:nth-child(4){
				transform: rotate(135deg);
			}
			&:nth-child(5){
				transform: rotate(180deg);
			}
			&:nth-child(6){
				transform: rotate(225deg);
			}
			&:nth-child(7){
				transform: rotate(270deg);
			}
			&:nth-child(8){
				transform: rotate(315deg);
			}
			
		}
	}
	
</style>
