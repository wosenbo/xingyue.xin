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
		</view>

		<view class="c-list">
			<view class="c-row b-b">
				<text class="tit">您的云币</text>
				<view class="con" style="color:orange;">
					¥ {{my_balance}}
				</view>
			</view>
			<view class="c-row b-b" @click="toggleSpec">
				<!-- #ifdef MP-WEIXIN -->
				<text class="tit">充能时长</text>
				<!-- #endif -->
				<!-- #ifndef MP-WEIXIN -->
				<text class="tit">续费时长</text>
				<!-- #endif -->
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
			<navigator url="/pages/index/index" open-type="switchTab" class="p-b-btn">
				<text class="yticon icon-xiatubiao--copy"></text>
				<text>首页</text>
			</navigator>
			<view class="p-b-btn" @click="toPreview" style="width: 104rpx;">
				<text class="yticon icon-shouhuodizhi"></text>
				<text>预览设备</text>
			</view>
			<view class="p-b-btn" @click="toHelp">
				<text class="yticon icon-bangzhu"></text>
				<text>帮助</text>
			</view>
			<view class="action-btn-group">
				<button type="primary" class=" action-btn no-border buy-now-btn">{{buy_price > 0 ? ("¥ " + buy_price) : "未选择"}}</button>
				<button type="primary" class=" action-btn no-border add-cart-btn" @click="openRecharge">
				   <!-- #ifdef MP-WEIXIN-->
				   立即充能
				   <!-- #endif -->
				   <!-- #ifndef MP-WEIXIN-->
				   立即续费
				   <!-- #endif -->
				</button>
			</view>
		</view>


		<!-- 规格-模态层弹窗 -->
		<view class="popup spec" :class="specClass" @touchmove.stop.prevent="stopPrevent" @click="toggleSpec">
			<!-- 遮罩层 -->
			<view class="mask"></view>
			<view class="layer attr-content" @click.stop="stopPrevent">
				<view class="a-t">
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
						<text v-for="(childItem, childIndex) in specChildList" v-if="childItem.pid === item.id && (item.id == 1 ? (selgameName == childItem.name) : childItem.name!='体验版')"
						 :key="childIndex" class="tit" :class="{selected: childItem.selected}" @click="selectSpec(childIndex, childItem.pid)">
							{{childItem.name}}
						</text>
					</view>
				</view>
				<button class="btn" @click="toggleSpec">完成</button>
			</view>
		</view>

		<!-- 续费的确认弹窗 -->
		<u-modal v-model="rechargeShow" :zoom="false" :show-cancel-button="true" @confirm="rechargePhone" @cancel="cancelRecharge"
		 :title="rechargetit">
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
		formatDateTime,
		binaryToblob,
		randomNum,
		reloadPhone
	} from '@/utils/common'
	import {
		mapState,
		mapMutations
	} from 'vuex';
	
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
				selgameId: "",
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
				// #ifdef MP-WEIXIN
				rechargetit:"充能确认",
				// #endif
				// #ifndef MP-WEIXIN
				rechargetit:"续费确认",
				// #endif
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
				//个人设备数据
				myphones: [],
				isShow: false,
				rechargeShow: false,
				content: "",
				sales: 0,
				stock: 0
			};
		},
		onReady() {
			//#ifndef MP-WEIXIN
			this.$refs.uTips.show({
				title: '小贴士：您正在续费IOS系统云服务,该商品及服务不支持退款哦,请考虑后再做决定！',
				type: 'warning',
				duration: '6000'
			})
			//#endif
		},
		async onLoad(options) {
			
			// 在页面onLoad回调事件中创建插屏广告实例
			if (wx.createInterstitialAd) {
				interstitialAd = wx.createInterstitialAd({
					adUnitId: 'adunit-819c208ff0e92903'
				})
				interstitialAd.onLoad(() => {})
				interstitialAd.onError((err) => {})
				interstitialAd.onClose(() => {})
			}
			
			this.getMyData() //获取个人状态
			this.getMyPhoneList() //获取个人设备数据
			setTimeout(() => {
				this.getPhoneData() //获取游戏数据
			}, 1000)

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
		onShow(){
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
		computed: {
			...mapState(['hasLogin', 'userInfo'])
		},
		methods: {
			//预览设备
			toPreview() {
				uni.navigateTo({
					url: `/pages/courses/courses?name=设备预览`
				})
			},
			//查看帮助
			toHelp() {
				uni.navigateTo({
					url: `/pages/courses/courses?name=设备续费`
				})
			},
			//打开续费窗口
			openRecharge() {
				this.rechargeShow = true
				//提示内容
				let text = ""
				if (parseInt(this.buy_price) < 1) {
					//#ifdef MP-WEIXIN
					this.content = "请选择充能时长!"
					//#endif
					//#ifndef MP-WEIXIN
					this.content = "请选择充能时长!"
					//#endif
				} else {
					this.specSelected.forEach((item, index) => {
						console.log(item)
						text += item.name + (index == this.specSelected.length - 1 ? "" : " ")
					})
					//#ifdef MP-WEIXIN
					this.content = `尊贵的用户${this.userInfo.username},您已选择<span style="color:orange">(${text})</span>,是否确定充能？`
					//#endif
					//#ifndef MP-WEIXIN
					this.content = `尊贵的用户${this.userInfo.username},您已选择<span style="color:orange">(${text})</span>,是否确定续费？`
					//#endif
				}
			},
			//取消购买
			cancelRecharge() {
				this.$api.msg('您已取消购买！');
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
			//获取个人设备数据
			async getMyPhoneList() {

				this.$apis.gamep_userphone().then(res => {
					let list = []
					if (res.data) {
						list = res.data
						if (list.length > 0) {
							res.data.forEach(async (item, index) => {
								//获取到期时间
								this.$apis.user_order_detail(item.id).then(res => {
									if (res.code == 200) {
										list[index].expiration_date = formatDateTime(new Date(res.data[res.data.length - 1].expiration_date))
									}
								})
							})
							setTimeout(() => {
								this.myphones = list[0]
							}, 500)
						} else {
							this.$api.msg('您还未购买设备哦');
						}
					}
				})

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
						this.selgameId = res.data[0].id
						this.selgameName = this.myphones.game.game_name
						res.data.forEach((item, index) => {
							console.log("这里了------------>", item.id, this.myphones.gameId)
							this.specChildList.push({
								id: item.id,
								pid: 1,
								name: item.game_name,
								selected: item.id == this.myphones.gameId
							})
						})

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
				})

				setTimeout(async () => {

					this.$apis.phonep_list().then(res => {
						if (res.code == 200) {
							res.data.forEach((item, index) => {
								this.specChildList.push({
									id: item.id,
									pid: 2,
									name: item.buy_type,
									price: (item.buy_price).toFixed(2),
									selected: index == 0
								})
							})
						}
					})

				}, 1000)
			},
			//设备续费
			async rechargePhone() {
				if (parseInt(this.buy_price) < 1) {
					this.rechargeShow = false
					return
				}
				this.getMyData() //获取个人状态
				setTimeout(async () => {
					setTimeout(async () => {
						//购买之前的检测
						if (parseInt(this.my_balance) < parseInt(this.buy_price)) {
							console.log(parseInt(this.my_balance), parseInt(this.buy_price))
							this.$api.msg('您的云币不够哦!');
							return
						}

						if (this.myphones.length == 0) {
							this.$api.msg('请先购买设备哦!');
							return
						}

						//开始续费
						let params = {
							order_price: this.buy_price,
							gamePhoneId: this.myphones.id,
							buy_duration: this.buy_type
						}

						this.$apis.user_order_create(params).then(res => {
							if (res.code == 200) {
								//#ifdef MP-WEIXIN
								this.$api.msg("充能成功！", "success")
								//#endif
								//#ifndef MP-WEIXIN
								this.$api.msg("续费成功！", "success")
								//#endif
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


					}, 500)
				}, 500)
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
