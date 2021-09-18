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
	export default {
		data() {
			return {
				roomList: [{
						roomId: "001",
						name: "系统操作",
						content: "如果看了教程还不知道怎么操作的话，可以在这里进行交流哦！",
						linktit: "点我进入",
						imgUrl: "https://img0.baidu.com/it/u=3077137035,1637566390&fm=224&fmt=auto&gp=0.jpg"
					},
					{
						roomId: "002",
						name: "充值续费",
						content: "因为系统暂不支持在线支付，您可以在这里联系客服充值哦！",
						linktit: "点我进入",
						imgUrl: "https://www.xingyue.xin:444/images/invest.png"
					},
					{
						roomId: "003",
						name: "辅助使用",
						content: "对辅助使用还有什么问题的，可以在这里寻求详细使用方法！",
						linktit: "点我进入",
						imgUrl: "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fm.haote.com%2Fupload%2Fnews%2Fimage%2F20160823%2F20160823013257_22091.png&refer=http%3A%2F%2Fm.haote.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1628741100&t=11a77bc4249d6780437f4e82882974d4"
					},
					{
						roomId: "004",
						name: "反馈建议",
						content: "如果觉得系统有什么不满意，或者有缺陷的地方，欢迎在此进行评价哦！",
						linktit: "点我进入",
						imgUrl: "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fhbimg.b0.upaiyun.com%2Fcb277f8bfc0ac47345b6ce2cfe2ffd806c56f8e9a6fc7-muWeya_fw658&refer=http%3A%2F%2Fhbimg.b0.upaiyun.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1628740922&t=b2bbce4e5f3e0150b574f7e5dd0f1379"
					}
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
				title: '不懂可以在这里交流哦！',
				subTitle: '[来自云咨询]',
				thumb: 'https://www.xingyue.xin:444/images/consult.png',
				isShow: false
			}
		},
		computed: {
			...mapState(['userInfo'])
		},
		onShow() {
			Object.assign(this.$data, this.$options.data());
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
				// if (this.selectedAvatar.imgUrl == "") {
				// 	uni.showToast({
				// 		title: "请选择头像",
				// 		duration: 2000,
				// 		icon: "none"
				// 	});
				// 	return
				// }
				this.roomToken = {
					roomId: room.roomId,
					roomName: room.name,
					userId: (Math.random() * 1000).toString(),
					nickname: this.userInfo.user_nickname,
					avatar: this.userInfo.user_profile ? ((this.userInfo.user_profile.indexOf('thirdwx.qlogo.cn') != -1 ?
						'' : imgUrl) + this.userInfo.user_profile) : 'https://www.xingyue.xin:444/images/temp/user-head.jpg'
				};
				let roomTokenAsJsonString = JSON.stringify(this.roomToken)
				uni.navigateTo({
					url: "/pages/chat/chatroom/chatroom?roomToken=" + roomTokenAsJsonString
				})
			}
		}
	}
</script>

<style>
	@import "@/static/css/chat_index.css";
</style>
