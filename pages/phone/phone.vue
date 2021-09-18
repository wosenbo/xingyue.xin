<template>
	<!-- 网页端暂时停掉 -->
	<!-- #ifdef H5 -->
	<u-modal v-model="popShowh5" :content="contenth5" style="line-height: 1.8;" title="[去使用小程序吧]" :show-confirm-button="show_confirm"></u-modal>
	<!-- #endif -->
	<!-- #ifndef H5 -->
	<view class="container">
		<!-- 空白页 -->
		<view v-if="!hasLogin || empty===true" class="empty">
			<image src="https://www.xingyue.xin/images/temp/emptyCart.jpg" mode="aspectFit"></image>
			<view v-if="hasLogin" class="empty-tips">
				空空如也
				<navigator class="navigator" v-if="hasLogin" url="../buy/buy">立即去体验设备吧-->></navigator>
			</view>
			<view v-else class="empty-tips">
				空空如也
				<view class="navigator" @click="navToLogin">去登陆></view>
			</view>
		</view>
		<view v-else>
			<!-- 列表 -->
			<view class="phone-list">
				<block v-for="(item, index) in myphones" :key="item.id">
					<view class="phone-item" :class="{'b-b': index!==myphones.length-1}">
						<view class="image-wrapper">
							<image mode="aspectFill" :src="phoneSreen(item)" v-if="item.show" @click="imgPreview(item)"></image>
						</view>
						<view class="item-right">
							<text class="id">云游戏ID：{{item.id}}</text>
							<text class="game-name">游戏名称：{{item.game.game_name}}</text>
							<text class="phone-remarks">设备备注：{{item.phone_remarks}}</text>
							<text class="expiration-date">到期时间：<text>{{item.expiration_date}}</text></text>
							<u-button class="add-timer" type="warning" plain size="mini" @click="addTimer(item)">
								<u-icon class="phone-add-icon" name="red-packet-fill"></u-icon>
								<text :style="{position:'relative',top:isWeixin ? '2rpx' : '1rpx'}">看广告,增加时长</text>
							</u-button>
							<!-- <u-button class="phone-reload" type="warning" plain size="mini" @click="imgReload(item)">
								<u-icon class="phone-reload-icon" name="reload"></u-icon><text :style="{position:'relative',top:isWeixin ? '2rpx' : '1rpx'}">刷新</text>
							</u-button> -->
							<view class="item-right-edit">
								<u-button v-if="userInfo.user_num!='0'" type="primary" plain style="width: 48%;" size="medium" @click="updremarksOpen(item)">
									<u-icon name="edit-pen"></u-icon><text :style="{position:'relative',top:isWeixin ? '4rpx' : '0'}">编辑备注</text>
								</u-button>
								<u-button v-else type="primary" plain style="width: 48%;" size="medium" @click="openDebug(item)">
									<u-icon name="edit-pen"></u-icon><text :style="{position:'relative',top:isWeixin ? '4rpx' : '0'}">调试模式</text>
								</u-button>
								<u-button type="success" plain style="width: 48%;" size="medium" @click="getIntoOperate(item)">
									<u-icon name="home-fill"></u-icon><text :style="{position:'relative',top:isWeixin ? '4rpx' : '0'}">进入操作</text>
								</u-button>
							</view>
						</view>
					</view>
				</block>
			</view>
			<!-- 编辑备注弹窗 -->
			<u-modal v-model="show" :title-style="{color: 'grey'}" @confirm="updremarksName()" :show-cancel-button="true" title="编辑备注">
				<view class="slot-content">
					<u-input v-model="form.phone_remarks" type="text" :border="border" style="margin: 20rpx 0;" />
				</view>
			</u-modal>
			<!-- 调试弹窗 -->
			<u-modal v-model="debugshow" :title-style="{color: 'grey'}" @confirm="debugPhone()" :show-cancel-button="true" title="调试模式">
				<view class="slot-content">
					<u-input v-model="form.debug_phoneip" type="text" :border="border" style="margin: 20rpx 0;" />
				</view>
			</u-modal>
			<!-- 图片预览弹窗 -->
			<u-modal v-model="imgShow" title="云手机预览" confirm-text="关闭预览">
				<view class="slot-content">
					<u-image width="90%" height="900rpx" :src="imgSrc" :fade="true" duration="450" style="padding: 20rpx 0;margin: 0 auto;"></u-image>
				</view>
			</u-modal>
		</view>
		<flotage floticon="question-circle-fill" @parCallback="showOption"></flotage>
		<question :isShow="isShow"></question>

		<!-- 广告部分 -->
		<view v-if="hasLogin && isViShow">
			<ad unit-id="adunit-83ac71e6e329924c" ad-type="video" ad-theme="white"></ad>
		</view>
	</view>
	<!-- #endif -->
</template>

<script>
	let expir_time
	import {
		mapState
	} from 'vuex';
	import {
		formatDateTime,
		binaryToblob,
		veriExpirtimes,
		isWeiXin,
		veriExpirClick,
		randomNumRan,
		showModal,
		watchTheadsInter,
		setWatCount,
		setCliCount,
		bypassAudit
	} from '@/utils/common.js'
	import {
		screenUrl
	} from '@/api/global.js'

	// 在页面中定义插屏广告
	let interstitialAd = null
	// 判断用户有没有触发查看广告
	let isGetadver = false
	export default {
		data() {
			return {
				allChecked: false, //全选状态  true|false
				empty: false, //空白页现实  true|false
				isVeri: false,
				myphones: [],
				id: 0,
				order_id: 0,
				form: {
					phone_remarks: "",
					debug_phoneip: ""
				},
				border: true,
				show: false,
				debugshow: false,
				game_id: 0,
				isShow: false,
				isWeixin: false,
				isViShow: false,
				item_k: null,
				//图像属性
				imgShow: false,
				imgSrc: "",

				//h5暂时停掉
				show_confirm: false,
				popShowh5: true,
				contenth5: "",

			};
		},
		onLoad() {
			let adUnitId = "adunit-35a6dd834ef4c243"
			this.$utils.videoAdInit(adUnitId);

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
		onReady() {

		},
		//微信分享
		onShareAppMessage(res) {
			let my_name = this.userInfo.username
			let invit_code = this.userInfo.invitation_code + "-" + my_name;
			if (res.from === 'button') { // 来自页面内分享按钮
				console.log(res.target)
			}
			return {
				title: '星若云手机',
				path: `/pages/user/wxlogin/wxlogin?invit_code=${invit_code}`
			}
		},
		onHide() {
			this.isViShow = false
			isGetadver = true
		},
		onShow() {
			//加载广告
			if (this.hasLogin) {
				setTimeout(() => {
					this.isViShow = true

					setTimeout(() => {
						// 在适合的场景显示插屏广告
						if (interstitialAd) {
							interstitialAd.show().catch((err) => {
								console.error(err)
							})
						}
					}, 5000)

				}, 3000)
			}
			this.empty = false
			this.myphones = []
			this.getMyPhoneList();
			if (isWeiXin()) {
				this.isWeixin = true
			}
			try {
				const value = uni.getStorageSync('game_id');
				if (value) {
					this.game_id = value
					try {
						uni.removeStorageSync('game_id');
					} catch (e) {
						// error
					}
				}
			} catch (e) {
				// error
			}

			// 如果是H5端直接前往小程序
			//#ifdef H5
			if (isWeiXin()) {
				this.contenth5 = `正在自动前往星若小程序哦...`
				setTimeout(() => {
					location.href = "weixin://dl/business/?t=i0DhOx6yd2r"
				}, 2000)
			} else {
				this.contenth5 = `该网站已停用，请联系客服，去使用【星若云手机】小程序吧！`
			}
			//#endif

		},
		watch: {
			//显示空白页
			// myphones(e) {
			// 	let empty = e.length === 0 ? true: false;
			// 	console.log("这里了哦",empty)
			// 	if(this.empty !== empty){
			// 		this.empty = empty;
			// 	}
			// 	this.empty = false;
			// }
		},
		computed: {
			...mapState(['userInfo', 'hasLogin'])
		},
		methods: {
			//广告部分
			showRewardedVideoAd(hours = 5) {
				isGetadver = false
				this.$utils.videoAdShow()
					.then((res) => {
						if (res) {
							// 成功
							this.issueAward(hours);
						} else {
							this.adVideoErr();
						}
					})
					.catch((err) => {
						console.log("这里的", err)
						this.$api.msg("视频加载失败了,稍后在试");
					});

			},
			//下发奖励
			issueAward(hours) {
				//如果没有点查看广告
				if (!isGetadver) {
					hours = 2
				}
				let afterTime = formatDateTime(new Date(expir_time + hours * 60000 * 60))
				console.log("这里了------------->", this.order_id, expir_time, afterTime)
				//奖励部分
				this.$apis.user_order_update(this.order_id, {
					expiration_date: afterTime
				}).then(res => {
					console.log("这里了", res.data)
					if (hours == 2 && bypassAudit()) {
						showModal("温馨提示：由于您观看视频广告途中，未点击广告下面的链接【如：进入游戏/点击查看/下载等，点一下就行】，奖励会相对较少哦!!", false, (e) => {
							showModal('不明白原因可以来咨询微信群哦!!', false, (e) => {
								setTimeout(() => {
									showModal(`恭喜您，使用时间延长${hours}小时哦！`, false, (e) => {
										this.clickAdver() // 点击广告配置
										setWatCount() // 设置观看次数
										this.getMyPhoneList();
									})
								}, 1000)
							}, 1000)
						})
					} else {
						if(!bypassAudit()){
							hours = 5
						}
						showModal(`恭喜您，使用时间延长${hours}小时哦！`, false, (e) => {
							this.clickAdver() // 点击广告配置
							setCliCount() // 设置点击次数
							this.getMyPhoneList();
						})
					}
				})
			},
			//点击广告配置
			clickAdver() {
				//看这个小时里面用户是否点击了
				let date = formatDateTime(new Date(), 0, false)
				let clickCount = parseInt(uni.getStorageSync("clickTime" + date))
				if (clickCount > 0) {
					uni.setStorageSync("clickTime" + date, ++clickCount)
				} else {
					uni.setStorageSync("clickTime" + date, 1)
				}
				let clickAllCount = uni.getStorageSync("clickAllCount")
				if (!clickAllCount) {
					uni.setStorageSync("clickAllCount", 1)
				} else {
					uni.setStorageSync("clickAllCount", ++clickAllCount)
				}
			},
			//观看失败
			adVideoErr() {
				showModal('呜呜，您不想要用我了嘛！', false, (e) => {
					console.log("这里了-------------》")
					this.getMyPhoneList();
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
			//打开调试模式
			openDebug(item) {
				this.item_k = item
				this.debugshow = true
			},
			//图片渲染
			phoneSreen(item) {
				return `${screenUrl}${item.phone_ip}&urll=snapshot1&t=${new Date().getTime()}`
			},
			//屏幕重新获取
			imgReload(item) {
				this.$api.msg("正在刷新屏幕", "loading");
				setTimeout(() => {
					item.show = false
					setTimeout(() => {
						item.show = true
					}, 200)
				}, 1000)
			},
			//预览屏幕
			imgPreview(item) {
				this.$api.msg("正在预览屏幕", "loading");
				setTimeout(() => {
					this.imgShow = true
					this.imgSrc = `${screenUrl}${item.phone_ip}&urll=snapshot1&t=${new Date().getTime()}`
				}, 1000)
			},
			//获取个人设备数据
			async getMyPhoneList() {

				try {
					this.$apis.gamep_userphone().then(res => {
						let list = []
						if (res.data) {
							list = res.data
							if (list.length > 0) {
								res.data.forEach(async (item, index) => {

									//获取到期时间
									this.$apis.user_order_detail(item.id).then(res => {
										if (res.data) {
											this.order_id = res.data[res.data.length - 1].id
											let expiration_date = res.data[res.data.length - 1].expiration_date
											list[index].expiration_date = formatDateTime(new Date(expiration_date))
											list[index].show = true
											expir_time = new Date(expiration_date).getTime()
										}
									})

								})
								setTimeout(() => {
									this.myphones = list
									//可用时长检测
									if (!this.isVeri) {
										this.isVeri = true
										veriExpirtimes(this, this.myphones[0].id, expir_time)
									}
									//如果是从选择游戏界面进来的，就过滤当前游戏
									if (this.game_id > 0) {
										this.myphones = this.myphones.filter(item => item.gameId == this.game_id)
										if (this.myphones.length == 0) {
											this.empty = true;
											this.$api.msg('您还未购买该游戏设备哦！');
										}
									}
								}, 1000)
							} else {
								this.empty = true;
								this.$api.msg('您还未购买云设备哦！');
							}
						}
					})
				} catch (e) {
					console.log(e)
				}

			},
			navToLogin() {
				uni.navigateTo({
					url: '/pages/user/login/login'
				})
			},
			//修改设备备注 --打开
			updremarksOpen(item) {
				this.show = true
				this.id = item.id
				this.form.phone_remarks = item.phone_remarks
			},
			//编辑设备备注 --编辑
			async updremarksName() {
				let params = {
					"phone_remarks": this.form.phone_remarks
				}

				this.$apis.gamep_update(this.id, params).then(res => {
					if (res.code == 200) {
						this.getMyPhoneList()
						this.$api.msg("编辑备注成功！", "success")
					}
				})

			},
			//调试模式
			debugPhone(item) {
				console.log("进入调试模式")
				this.$api.msg("前往操作界面", "loading")
				setTimeout(() => {
					uni.navigateTo({
						url: `/pages/operate/operate?phone=${JSON.stringify(this.item_k)}&expir_time=${expir_time}&debug_ip=${this.form.debug_phoneip}`
					});
				}, 1000)
			},
			//增加时长
			addTimer() {
				
				if (!watchTheadsInter()) {
					showModal(`请耐心等待1分钟左右，然后继续观看哦！`)
					return
				}
				let clickCount = 0,
					date

				function getDate(hour) {
					date = formatDateTime(new Date(), hour, false)
					return parseInt(uni.getStorageSync("clickTime" + date))
				}

				for (let i = 2; i >= 0; i--) {
					if (getDate(i)) {
						clickCount += getDate(i)
					}
				}

				console.log("这里了--------》", clickCount)

				if (clickCount >= 3) {
					this.$api.msg("观看过于频繁，4小时后才可继续观看哦！")
				} else {
					let addHours, text, clickAllCount = uni.getStorageSync("clickAllCount")
					if (clickAllCount >= 300) {
						text = "恭喜您！您已累计观看超过300次啦，现在看广告可以随机增加8~10小时使用时间哦"
					} else if (clickAllCount >= 100) {
						text = "您已累计观看超过100次啦，现在看广告可以随机增加6~8小时使用时间哦"
					} else {
						text = "观看广告可以随机增加4~6小时使用时间哦,观看次数越多,后面奖励越多哦！！"
					}
					showModal(text, true, (e) => {
						if (e.confirm) {
							console.log("观看广告")
							if (clickAllCount >= 300) {
								addHours = randomNumRan(8, 10)
							} else if (clickAllCount >= 100) {
								addHours = randomNumRan(6, 8)
							} else {
								addHours = randomNumRan(4, 6)
							}
							this.showRewardedVideoAd(addHours);
						}
					})
				}
			},
			//前往操作界面
			getIntoOperate(item) {
				//如果用户的使用时间已到期，让用户去看广告
				if (!veriExpirClick(this, this.myphones[0].id, expir_time)) {
					return false
				}

				this.$api.msg("前往操作界面", "loading")
				setTimeout(() => {
					// uni.navigateTo({
					// 	url: `/pages/operate/operate?phone=${JSON.stringify(item)}&expir_time=${expir_time}`
					// });
					//#ifdef H5
					uni.navigateTo({
						url: `/pages/operate/operate?phone=${JSON.stringify(item)}&expir_time=${expir_time}`
					});
					//#endif
					//#ifndef H5
					// 跳转到内部窗口并且传递链接
					let isMessPoint = uni.getStorageSync('isMessPoint')
					if (isMessPoint != "no") {
						isMessPoint = "yes"
					}
					let link =
						`https://www.xingyue.xin/yun_phone/index.html#/pages/operate/operate?phone=${JSON.stringify(item)}&expir_time=${expir_time}&isWxpro=yes&user=${JSON.stringify(this.userInfo)}&isMessPoint=${isMessPoint}&t=${new Date().getTime()}`
					// let link = `http://localhost:8080/#/pages/operate/operate?phone=`
					uni.navigateTo({
						url: `/pages/webview/webview?url=${encodeURIComponent(link)}`,
					})
					//#endif
				}, 1000)
			}
		}
	}
</script>

<style lang='scss'>
	@import "@/static/css/phone.scss";
</style>
