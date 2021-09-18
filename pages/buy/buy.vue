<template>
	<view class="container">
		<view class="carousel">
			<swiper indicator-dots circular=true duration="400" :autoplay="true">
				<swiper-item class="swiper-item" v-for="(item,index) in imgList" :key="index">
					<view class="image-wrapper">
						<image :src="item.src" class="loaded"></image>
					</view>
				</swiper-item>
			</swiper>
		</view>

		<view class="introduce-section">
			<text class="title">星若云手机,你的另一台云手机!赋能ARM云时代,技术铸造云未来!</text>
			<view class="price-box" v-if="isShowMoney">
				<text class="price-tip">¥</text>
				<text class="price">0</text>
				<text class="m-price">云币</text>
				<text class="coupon-tip">起</text>
			</view>
			<!-- <view class="bot-row">
				<text>销量: {{sales}}件</text>
				<text>库存: {{stock}}件</text>
			</view> -->
		</view>

		<view class="c-list">
			<view class="c-row b-b" v-if="isShowMoney">
				<text class="tit">您的云币</text>
				<view class="con" style="color:orange;">
					¥ {{my_balance}}
				</view>
			</view>
			<view class="c-row b-b" @click="toggleSpec">
				<text class="tit">选择云游戏</text>
				<view class="con">
					<text class="selected-text" v-for="(sItem, sIndex) in specSelected" :key="sIndex">
						{{sItem.name}}
					</text>
				</view>
				<text class="yticon icon-you"></text>
			</view>
		</view>

		<!-- 底部操作菜单 -->
		<view class="page-bottom">
			<navigator @click="watchTheads" open-type="switchTab" class="p-b-btn">
				<text class="yticon icon-yiguoqi"></text>
				<text>看广告</text>
			</navigator>
			<view class="p-b-btn" @click="toPreview" style="width: 104rpx;">
				<text class="yticon icon-shouhuodizhi"></text>
				<text>预览设备</text>
			</view>
			<view class="p-b-btn" @click="toHelp">
				<text class="yticon icon-bangzhu"></text>
				<text>帮助</text>
			</view>
			<!--  -->
			<view class="action-btn-group">
				<button type="primary" class=" action-btn no-border buy-now-btn">{{buy_price > 0 ? ("¥ " + buy_price) : (selgameId > 0 ? "体验版" : "未选择")}}</button>
				<button type="primary" class=" action-btn no-border add-cart-btn" @click="openBuy">立即体验</button>
			</view>
		</view>

		<!-- 规格-模态层弹窗 -->
		<view class="popup spec" :class="specClass" @touchmove.stop.prevent="stopPrevent" @click="toggleSpec">
			<!-- 遮罩层 -->
			<view class="mask"></view>
			<view class="layer attr-content" @click.stop="stopPrevent">
				<view class="a-t" v-if="isShowMoney">
					<image src="https://www.xingyue.xin/images/temp/iphone_1.jpg"></image>
					<view class="right">
						<text class="price">¥ {{buy_price}}</text>
						<text class="sales">销量：<text class="underline" v-if="selgameId!=0" style="margin-right: 20rpx;">{{sales}}件</text></text>
						<text class="stock">库存：<text class="underline" v-if="selgameId!=0">{{stock}}件</text></text>
						<view class="selected">
							已选：
							<text class="selected-text underline" v-for="(sItem, sIndex) in specSelected" :key="sIndex">
								{{sItem.name}}
							</text>
						</view>
					</view>
				</view>
				<view v-for="(item,index) in specList" :key="index" class="attr-list">
					<text>{{item.name}}</text>
					<view class="item-list">
						<text v-for="(childItem, childIndex) in specChildList" v-if="childItem.pid === item.id" :key="childIndex" class="tit"
						 :class="{selected: childItem.selected}" @click="selectSpec(childIndex, childItem.pid)">
							{{childItem.name}}
						</text>
					</view>
				</view>
				<button class="btn" @click="toggleSpec">完成</button>
			</view>
		</view>

		<!-- 购买的确认弹窗 -->
		<u-modal v-model="buyShow" :zoom="false" :show-cancel-button="true" @confirm="buyPhone" @cancel="cancelBuy" :title="buytit">
			<view class="slot-content">
				<rich-text :nodes="content"></rich-text>
			</view>
		</u-modal>
		<!-- 分享 -->
		<share ref="share" :contentHeight="580" :shareList="shareList"></share>
		<flotage floticon="question-circle-fill" @parCallback="showOption"></flotage>
		<question :isShow="isShow"></question>
		<!-- 顶部提示 -->
		<u-top-tips ref="uTips"></u-top-tips>

	</view>
</template>

<script>
	import share from '@/components/share';
	import {
		randomNum,
		reloadPhone,
		showToast,
		showModal,
		bypassAudit,
		formatDateTime,
		watchTheadsInter,
		setWatCount,
		setCliCount
	} from '@/utils/common'
	import {
		mapState,
		mapMutations
	} from 'vuex';

	// 判断用户有没有触发查看广告
	let isGetadver = false
	// 在页面中定义插屏广告
	let interstitialAd = null
	export default {
		components: {
			share
		},
		data() {
			return {
				specClass: 'none',
				specSelected: [],
				favorite: true,
				shareList: [],
				buy_type: "体验版",
				buy_price: 0.00,
				my_balance: 0.00,
				is_experience: false,
				buytit: "购买确认",
				isShowMoney: true,
				selgameId: 0,
				selgameName: "",
				myData: "",
				imgList: [{
						src: 'https://www.xingyue.xin/images/temp/iphone_1.jpg'
					},
					{
						src: 'https://www.xingyue.xin/images/temp/iphone_2.jpg'
					},
					{
						src: 'https://www.xingyue.xin/images/temp/iphone_3.jpg'
					}
				],
				desc: `
					<div style="width:100%">
						<img style="width:100%;display:block;" src="https://gd3.alicdn.com/imgextra/i4/479184430/O1CN01nCpuLc1iaz4bcSN17_!!479184430.jpg_400x400.jpg" />
						<img style="width:100%;display:block;" src="https://gd2.alicdn.com/imgextra/i2/479184430/O1CN01gwbN931iaz4TzqzmG_!!479184430.jpg_400x400.jpg" />
						<img style="width:100%;display:block;" src="https://gd3.alicdn.com/imgextra/i3/479184430/O1CN018wVjQh1iaz4aupv1A_!!479184430.jpg_400x400.jpg" />
						<img style="width:100%;display:block;" src="https://gd4.alicdn.com/imgextra/i4/479184430/O1CN01tWg4Us1iaz4auqelt_!!479184430.jpg_400x400.jpg" />
						<img style="width:100%;display:block;" src="https://gd1.alicdn.com/imgextra/i1/479184430/O1CN01Tnm1rU1iaz4aVKcwP_!!479184430.jpg_400x400.jpg" />
					</div>
				`,
				specList: [{
						id: 1,
						name: '云游戏',
					},
					{
						id: 2,
						name: '时长',
					},
				],
				specChildList: [

				],
				isShow: false,
				buyShow: false,
				content: "",
				sales: 0,
				stock: 0
			};
		},
		onReady() {
			//#ifndef MP-WEIXIN
			this.$refs.uTips.show({
				title: '小贴士：您正在购买IOS系统云服务,该商品及服务不支持退款。建议您先购买体验版测试后,再决定是否购买付费版！',
				type: 'warning',
				duration: '8000'
			})
			//#endif
		},
		async onLoad(options) {
			//注册广告组件
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

			//#ifdef MP-WEIXIN
			if (!bypassAudit()) {
				this.isShowMoney = false
				this.buytit = "体验确认"
			} else {
				this.isShowMoney = true
			}
			//#endif
			this.getMyData() //获取个人状态
			this.getPhoneData() //获取游戏数据

			//接收传值,id里面放的是标题，因为测试数据并没写id 
			let id = options.id;
			if (id) {
				this.$api.msg(`点击了${id}`);
			}

			//规格 默认选中第一条
			this.specList.forEach(item => {
				for (let cItem of this.specChildList) {
					if (cItem.pid === item.id) {
						this.$set(cItem, 'selected', true);
						this.specSelected.push(cItem);
						break; //forEach不能使用break
					}
				}
			})
			this.shareList = await this.$api.json('shareList');
		},
		onShow() {
			//加载广告
			setTimeout(() => {
				// 在适合的场景显示插屏广告
				if (interstitialAd) {
					interstitialAd.show().catch((err) => {
						console.error(err)
					})
				}
			}, 5000)
		},
		onHide() {
			isGetadver = true
		},
		computed: {
			...mapState(['hasLogin', 'userInfo'])
		},
		methods: {
			//观看广告
			watchTheads() {
				
				if (!watchTheadsInter()) {
					showModal(`请耐心等待1分钟左右，然后继续观看哦！`)
					return
				}
				
				this.$apis.gamep_userphone().then(res => {
					if (res.data.length > 0) {
						showModal("您已经拥有一台设备了,无法通过看广告重新获得体验资格！")
					} else {
						//观看广告
						this.showRewardedVideoAd()
					}
				})

			},
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
				let date = formatDateTime(new Date()).split(" ")[0]
				this.date = date
				//查询今天是否观看过
				let todayClick = uni.getStorageSync("todayClick" + this.date)
				if (!todayClick) {
					uni.setStorageSync("todayClick" + this.date, isGetadver ? 1 : 0.5)
				} else {
					if (isGetadver) {
						todayClick++
					} else {
						todayClick += 0.5
					}
					uni.setStorageSync("todayClick" + this.date, todayClick)
				}
				if (todayClick >= 4) {
					//重置用户的体验属性
					this.$apis.user_recoverexperience().then(res => {
						if (res.code == 200) {
							setTimeout(() => {
								showModal("恭喜您,您可以再次购买体验版了哦!!")
							}, 1000)
						}
					})
				} else {
					if (!isGetadver && bypassAudit()) {
						showModal('温馨提示：由于您观看视频广告途中，未点击广告下面的链接【如：进入游戏/点击查看/下载等，点一下就行】，我们只记录0.5次哦!!', false, (e) => {
							showModal('不明白原因可以来咨询微信群哦!!', false, (e) => {
								setTimeout(() => {
									showModal(`观看成功，还差${4-(todayClick || (isGetadver ? 1 : 0.5))}次即可再次解锁体验版哦！`, false, (e) => {
										console.log("这里了-------------》")
										setWatCount()
									})
								}, 1000)
							}, 1000)
						})
					} else {
						showModal(`观看成功，还差${4-(todayClick || ((isGetadver || !bypassAudit()) ? 1 : 0.5))}次即可再次解锁体验版哦！`, false, (e) => {
							console.log("这里了-------------》")
							setCliCount()
						})
					}
				}
			},
			//观看失败
			adVideoErr() {
				showModal('呜呜，您不想要用我了嘛！', false, (e) => {
					console.log("这里了-------------》")
				})
			},
			//预览设备
			toPreview() {
				//#ifdef MP-WEIXIN
				if (!bypassAudit()) {
					this.$api.msg('该功能暂未开放!');
					return
				}
				//#endif
				uni.navigateTo({
					url: `/pages/courses/courses?name=设备预览`
				})
			},
			//查看帮助
			toHelp() {
				//#ifdef MP-WEIXIN 
				if (!bypassAudit()) {
					this.$api.msg('该功能暂未开放!');
					return
				}
				//#endif
				uni.navigateTo({
					url: `/pages/courses/courses?name=免费体验`
				})
			},
			//打开购买窗口
			openBuy() {
				this.buyShow = true
				//提示内容
				let text = ""
				if (!this.selgameId || !this.selgameName) {
					if (!bypassAudit()) {
						this.content = "请选择云游戏后,再进行体验!"
					} else {
						this.content = "请选择云游戏后,再进行购买!"
					}
				} else {
					this.specSelected.forEach((item, index) => {
						console.log(item)
						text += item.name + (index == this.specSelected.length - 1 ? "" : " ")
					})
					this.content = `尊贵的用户${this.userInfo.username},您已选择<span style="color:orange">(${text})</span>,是否确定？`
				}
			},
			//取消购买
			cancelBuy() {
				//#ifdef MP-WEIXIN
				if (!bypassAudit()) {
					this.$api.msg('您已取消体验!');
				} else {
					this.$api.msg('您已取消购买!');
				}
				//#endif
				//#ifndef MP-WEIXIN
				this.$api.msg('您已取消购买!');
				//#endif
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
			//获取个人状态
			async getMyData() {
				this.$apis.user_userstatus().then(res => {
					if (res.code == 200) {
						this.my_balance = (res.data.balance).toFixed(2)
						this.is_experience = res.data.is_experience
					}
				})
			},
			//获取设备数据
			async getPhoneData() {
				this.$apis.game_list().then(res => {
					if (res.code == 200) {
						// this.selgameId = res1.data[0].id
						res.data.forEach((item, index) => {
							this.specChildList.push({
								id: item.id,
								pid: 1,
								name: item.game_name,
							})
						})
					}
				})

				setTimeout(async () => {
					this.$apis.phonep_list().then(res => {
						if (res.code == 200) {
							res.data.forEach((item, index) => {
								//#ifdef MP-WEIXIN
								if (!bypassAudit()) {
									if (index == 0) {
										this.pushCont(item, index)
									}
								} else {
									this.pushCont(item, index)
								}
								return
								//#endif
								//#ifndef MP-WEIXIN
								this.pushCont(item, index)
								//#endif
							})
						}
					})
				}, 1000)
			},
			//渲染内容
			pushCont(item, index) {
				this.specChildList.push({
					id: item.id,
					pid: 2,
					name: item.buy_type,
					price: (item.buy_price).toFixed(2),
					selected: index == 0
				})
			},
			//购买设备
			async buyPhone() {
				if (!this.selgameId || !this.selgameName) {
					this.buyShow = false;
					return
				}
				this.getMyData() //获取个人状态
				setTimeout(async () => {
					this.$apis.gamep_userphone().then(res => {
						if (this.stock == 0) {
							this.$api.msg('该云游戏暂无库存了哦!');
							return
						}
						if (res.data.length > 0) {
							this.$api.msg('您已经购买过设备了哦!');
							setTimeout(() => {
								showModal("点下面左边的【看广告】按钮,1天内看满4次即可再次购买体验版哦", false)
							}, 2000)
							return
						}
						setTimeout(async () => {
							//购买之前的检测
							if (parseInt(this.my_balance) < parseInt(this.buy_price)) {
								console.log(parseInt(this.my_balance), parseInt(this.buy_price))
								this.$api.msg('您的云币不够哦!');
								return
							}

							//开始购买
							setTimeout(async () => {
								//获取空闲设备
								this.$apis.game_phonefree(this.selgameId).then(res => {
									if (res.code == 200) {

										//购买设备成功后，如果购买的是体验版，则取消体验资格
										if (parseInt(this.buy_price) < 1) {
											if (!this.is_experience) {
												this.$apis.user_overexperience().then(res => {
													if (res.code == 200) {
														console.log("取消体验资格成功！")
													}
												})
											} else {
												this.$api.msg("您已经购买过体验版了,购买失败！")
												return
											}
										}

										let phone_id = res.data.id
										let phone_name = res.data.phone_name
										let phone_remarks = this.selgameName + "-" + randomNum(4)
										let params1 = {
											order_price: this.buy_price,
											gamePhoneId: phone_id,
											buy_duration: this.buy_type
										}

										let params2 = {
											phone_remarks: phone_remarks
										}

										this.$apis.user_order_create(params1).then(res => {
											if (res.code == 200) {
												this.$apis.gamep_buyphone(phone_id, params2).then(res => {
													if (res.code == 200) {
														this.$api.msg("购买设备成功！", "success")
														setTimeout(() => {
															uni.switchTab({
																url: "/pages/phone/phone",
																success() {
																	reloadPhone()
																}
															});
														}, 500)
													}
												})
											}
										})

									} else {
										this.$api.msg("该类设备已售完")
										return
									}
								})

							}, 500)
						}, 500)
					}, 500)
				})
			},
			//规格弹窗开关
			toggleSpec() {
				if (this.specClass === 'show') {
					this.specClass = 'hide';
					setTimeout(() => {
						this.specClass = 'none';
					}, 250);
				} else if (this.specClass === 'none') {
					this.specClass = 'show';
				}
			},
			//选择规格
			selectSpec(index, pid) {

				let list = this.specChildList;
				list.forEach(item => {
					if (item.pid === pid) {
						this.$set(item, 'selected', false);
					}
				})

				this.$set(list[index], 'selected', true);
				//存储已选择
				/**
				 * 修复选择规格存储错误
				 * 将这几行代码替换即可
				 * 选择的规格存放在specSelected中
				 */
				this.specSelected = [];
				list.forEach(item => {
					if (item.selected === true) {
						this.specSelected.push(item);
						console.log(item)
						//游戏改变
						if (item.pid == 1) {
							this.selgameId = item.id
							this.selgameName = item.name
							console.log("这里了", this.selgameId, this.selgameName)
							//查询销量
							this.$apis.game_phonelist(this.selgameId, {
								filterType: "noemploy"
							}).then(res => {
								this.sales = res.data.length
								//查询库存
								this.$apis.game_phonelist(this.selgameId, {
									filterType: "employ"
								}).then(res => {
									this.stock = res.data.length
									console.log("这里了", res.data)
								})
							})
						}
						//时长改变
						if (item.pid == 2) {
							this.buy_type = item.name
							this.buy_price = item.price
						}
					}
				})

			},
			//分享
			share() {
				this.$refs.share.toggleMask();
			},
			//收藏
			toFavorite() {
				this.favorite = !this.favorite;
			},
			buy() {
				uni.navigateTo({
					url: `/pages/order/createOrder`
				})
			},
			stopPrevent() {}
		},

	}
</script>

<style lang='scss'>
	@import "@/static/css/buy.less";
</style>
