<template>
	<view>
		<template>
			<u-card :title="title" :sub-title="subTitle" :thumb="thumb">
				<view class="" slot="body">
					<view class="consult u-body-item u-flex u-border-bottom u-col-between u-p-t-0" v-for="(room, key) in roomList"
					 :key="room.roomId" @click="onSelectRoom(room)">
						<view class="u-body-item-title u-line-3"><text class="consult-tittop">[{{room.name}}]</text>{{room.content}}
							<text class="consult-label animat">☛{{room.linktit}}</text>
						</view>
						<image :src="room.imgUrl" mode="aspectFill"></image>
					</view>
				</view>
			</u-card>
			<flotage floticon="question-circle-fill" @parCallback="showOption"></flotage>
			<question :isShow="isShow"></question>
			<!-- 广告部分 -->
			<view class="">
				<ad unit-id="adunit-83ac71e6e329924c" ad-type="video" ad-theme="white"></ad>
			</view>
		</template>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex';
	import {
		formatDateTime
	} from '@/utils/common.js'
	import {
		imgUrl
	} from '@/api/global.js'
	
	// 在页面中定义插屏广告
	let interstitialAd = null
	export default {
		data() {
			return {
				roomList: [{
						roomId: "001",
						name: "天天幸运大轮盘",
						content: "每天参与幸运大轮盘,即可获得大量奖励哦,去试下你的欧皇之气吧！",
						linktit: "点我进入",
						imgUrl: "https://img2.baidu.com/it/u=1696309255,3937490885&fm=26&fmt=auto&gp=0.jpg"
					},
					// {
					// 	roomId: "002",
					// 	name: "充值续费",
					// 	content: "因为系统暂不支持在线支付，您可以在这里联系客服充值哦！",
					// 	linktit: "点我进入",
					// 	imgUrl: "https://www.xingyue.xin:444/images/invest.png"
					// },
					// {
					// 	roomId: "003",
					// 	name: "辅助使用",
					// 	content: "对辅助使用还有什么问题的，可以在这里寻求详细使用方法！",
					// 	linktit: "点我进入",
					// 	imgUrl: "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fm.haote.com%2Fupload%2Fnews%2Fimage%2F20160823%2F20160823013257_22091.png&refer=http%3A%2F%2Fm.haote.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1628741100&t=11a77bc4249d6780437f4e82882974d4"
					// },
					// {
					// 	roomId: "004",
					// 	name: "反馈建议",
					// 	content: "如果觉得系统有什么不满意，或者有缺陷的地方，欢迎在此进行评价哦！",
					// 	linktit: "点我进入",
					// 	imgUrl: "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fhbimg.b0.upaiyun.com%2Fcb277f8bfc0ac47345b6ce2cfe2ffd806c56f8e9a6fc7-muWeya_fw658&refer=http%3A%2F%2Fhbimg.b0.upaiyun.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1628740922&t=b2bbce4e5f3e0150b574f7e5dd0f1379"
					// }
				],
				nickname: '',
				selectedAvatar: {
					imgUrl: '',
					id: ''
				},
				selectedRoom: {
					roomId: null,
					roomName: '',
				},
				//内容属性
				title: '参与活动,可领取大量奖励哦！',
				subTitle: '[来自星若云]',
				thumb: 'https://www.xingyue.xin/images/activity.png',
				isShow: false
			}
		},
		computed: {
			...mapState(['userInfo'])
		},
		onLoad(){
			// 在页面onLoad回调事件中创建插屏广告实例
			if (wx.createInterstitialAd) {
				interstitialAd = wx.createInterstitialAd({
					adUnitId: 'adunit-819c208ff0e92903'
				})
				interstitialAd.onLoad(() => {})
				interstitialAd.onError((err) => {})
				interstitialAd.onClose(() => {})
			}
		},
		onShow() {
			Object.assign(this.$data, this.$options.data());
			setTimeout(() => {
				console.log("这里了哦",interstitialAd)
				// 在适合的场景显示插屏广告
				interstitialAd.show().catch((err) => {
					console.error(err)
				})
			}, 5000)
		},
		methods: {
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
			onInputUserName(event) { // 输入用户名
				this.nickname = event.target.value;
			},
			onSelectAvatar(avtar) { //选择头像
				this.selectedAvatar = avtar;
			},
			onSelectRoom(room) { 
				uni.navigateTo({
					url: "/pages/activity/lottery/lottery"
				})
			}
		}
	}
</script>

<style>
	@import "@/static/css/chat_index.css";
</style>
