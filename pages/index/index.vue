<template>
	<!-- 网页端暂时停掉 -->
	<!-- #ifdef H5 -->
	<u-modal v-model="popShowh5" :content="contenth5" style="line-height: 1.8;" title="[去使用小程序吧]" :show-confirm-button="show_confirm"></u-modal>
	<!-- #endif -->
	<!-- #ifndef H5 -->
	<view class="container">
		<!-- 小程序头部兼容 -->
		<!-- #ifdef MP -->
		<view class="mp-search-box">
			<input class="ser-input" type="text" :placeholder="'输入'+placehtxt+'名查找'" @click="searchOpen" disabled />
		</view>
		<!-- #endif -->
		<!-- 头部轮播 -->
		<view class="carousel-section">
			<!-- 标题栏和状态栏占位符 -->
			<view class="titleNview-placing"></view>
			<!-- 背景色区域 -->
			<view class="titleNview-background" :style="{backgroundColor:titleNViewBackground}"></view>
			<swiper class="carousel" circular :autoplay="true" @change="swiperChange">
				<swiper-item v-for="(item, index) in carouselList" :key="index" class="carousel-item">
					<image :src="item.src" />
				</swiper-item>
			</swiper>
			<!-- 自定义swiper指示器 -->
			<view class="swiper-dots">
				<text class="num">{{swiperCurrent+1}}</text>
				<text class="sign">/</text>
				<text class="num">{{swiperLength}}</text>
			</view>
		</view>

		<!-- 分类 -->
		<view class="cate-section" v-if="isNavShow">
			<view class="cate-item" @click="showOption" id="domid1">
				<image src="https://www.xingyue.xin/images/temp/wentis.jpeg"></image>
				<text>萌新必看</text>
			</view>
			<view class="cate-item" @click="navToBuyPage" id="domid2">
				<!-- #ifdef MP-WEIXIN -->
				<image src="https://www.xingyue.xin/images/temp/experience.png"></image>
				<!-- #endif -->
				<!-- #ifndef MP-WEIXIN -->
				<image src="https://www.xingyue.xin/images/temp/buy.png"></image>
				<!-- #endif -->
				<text>体验设备</text>
			</view>
			<!-- #ifdef MP-WEIXIN -->
			<view class="cate-item" @click="navToRechargePage" id="domid3">
				<image src="https://www.xingyue.xin/images/temp/chongneng.png"></image>
				<text>设备充能</text>
			</view>
			<!-- #endif -->
			<!-- #ifndef MP-WEIXIN -->
			<view class="cate-item" @click="navToRechargePage" id="domid3">
				<image src="https://www.xingyue.xin/images/temp/chongzhis.jpeg"></image>
				<text>设备续费</text>
			</view>
			<!-- #endif -->
			<view class="cate-item" @click="navtoGamemanage()">
				<!-- #ifdef MP-WEIXIN -->
				<image v-if="isShowGame" src="https://www.xingyue.xin/images/temp/games.jpeg"></image>
				<image v-else="isShowGame" src="https://www.xingyue.xin/images/temp/classify.png"></image>
				<!-- #endif -->
				<!-- #ifndef MP-WEIXIN -->
				<image src="https://www.xingyue.xin/images/temp/games-h5.jpeg"></image>
				<!-- #endif -->
				<text>选择{{placehtxt}}</text>
			</view>
			<view class="cate-item" @click="navToGroupmanage">
				<!-- #ifdef MP-WEIXIN -->
				<image src="https://www.xingyue.xin/images/temp/fenleis.jpeg"></image>
				<!-- #endif -->
				<!-- #ifndef MP-WEIXIN -->
				<image src="https://www.xingyue.xin/images/temp/fenleis-h5.jpeg"></image>
				<!-- #endif -->
				<text>分组管理</text>
			</view>
		</view>
		<u-cell-group style="margin-top: 20rpx;" v-if="isShowGame">
			<view class="tit-rolling">
				<u-notice-bar mode="horizontal" :list="titlist" color="grey" bg-color="#f5f5f5"></u-notice-bar>
			</view>
			<u-cell-item icon="zhuanfa" title="推荐游戏" value="更多游戏" @click="getMore"></u-cell-item>
		</u-cell-group>
		<template v-if="isShowGame && isGames">
			<view class="bottom-list" id="domid4">
				<u-swipe-action :show="item.show" :index="index" v-for="(item, index) in list" :key="item.id" @click="navToselGame(item)"
				 @open="open" :options="options">
					<view class="item u-border-bottom">
						<image mode="aspectFill" :src="item.images" />
						<!-- 此层wrap在此为必写的，否则可能会出现标题定位错误 -->
						<view class="title-wrap">
							<text class="title u-line-2">{{ item.title }}</text>
						</view>
					</view>
				</u-swipe-action>
			</view>
		</template>
		<flotage floticon="question-circle-fill" @parCallback="showOption"></flotage>
		<question :isShow="isShow" id="domid5"></question>
		<!-- 新手引导 -->
		<!-- <guide class="guide" :width="cWidth" :height="cHeight" :left="cLeft" :top="cTop" :showMessage='cShowMsg'
		 :currentIndex="currentIndex" :noticeArray="noticeArray" @click="clicktoNext"></guide> -->
		<!-- 搜索游戏 -->
		<u-modal v-model="selshow" :title-style="{color: 'grey'}" @confirm="searchData()" :show-cancel-button="true" :title="'搜索'+placehtxt">
			<view class="slot-content">
				<u-input v-model="search" type="text" :placeholder="'输入'+placehtxt+'名搜索'" :border="true" style="margin: 20rpx 0;" />
			</view>
		</u-modal>
		<!-- 提示信息 -->
		<view>
			<!-- 系统提示 -->
			<u-modal v-model="popShow1" :content="content1" style="line-height: 1.8;" title="[温馨提示]"></u-modal>
			<u-modal v-model="popShow2" class="good-chat" style="line-height: 1.8;" title="[好消息]" confirm-text="点我了解"></u-modal>
			<u-modal v-model="popShow3" :content="content3" :show-cancel-button="true" :confirm-text="invitaTxt" cancel-text="取消邀请"
			 style="line-height: 1.8;" title="[邀请就送]" @confirm="confirmInvite" @cancel="cancelInvite"></u-modal>
			<u-modal v-model="popShow4" :content="content4" style="line-height: 1.8;" title="[小贴士]"></u-modal>
			<u-modal v-model="popShow5" :content="content5" style="line-height: 1.8;" title="[关注微信公众号]"></u-modal>
			<!-- 最新公告 -->
			<u-modal v-model="announShow" class="announ-pop-wrap" title="[最新公告]">
				<rich-text :nodes="annContent" class="announ-pop" ></rich-text>
			</u-modal>
		</view>
		<ufooter v-if="isGames"></ufooter>
	</view>
	<!-- #endif -->
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex';
	import {
		openScanCode,
		isWeiXin,
		copyContent,
		newAnnounce,
		bypassAudit,
		setVerik
	} from '@/utils/common.js'
	// 在页面中定义插屏广告
	let interstitialAd = null
	export default {
		data() {
			return {
				titlist: [
					'星若云手机',
					'你的另一台云手机',
					'赋能ARM云时代',
					'技术铸造云未来!'
				],
				titleNViewBackground: '',
				swiperCurrent: 0,
				swiperLength: 0,
				carouselList: [],
				goodsList: [],

				//底部列表属性
				list: [],
				disabled: false,
				btnWidth: 180,
				show: false,
				popShow1: false,
				popShow2: false,
				popShow3: false,
				popShow4: false,
				popShow5: false,
				popShowh5: true,
				announShow: false,
				isGames: false,
				isNavShow:false,
				show_confirm:false,
				
				//#ifdef MP-WEIXIN
				isShowGame: false,
				//#endif
				//#ifndef MP-WEIXIN
				isShowGame: true,
				//#endif

				options: [{
					text: '选择',
					style: {
						backgroundColor: '#007aff'
					}
				}, ],
				isShow: false,
				//#ifdef MP-WEIXIN
				placehtxt: "分类",
				//#endif
				//#ifndef MP-WEIXIN
				placehtxt: "游戏",
				//#endif
				//新手引导
				showGuide: false, //引导是否显示 
				cShowMsg: '', // 展示的解释语
				cWidth: '',
				cHeight: '',
				cLeft: '',
				// cRight:'',
				cTop: '',
				currentIndex: 0,
				//配置需要显示引导的view以及引导显示的msg
				noticeArray: [{
						"showID": "domid1", // 对应的id
						"showMessage": "1、点这里可以查看使用教程", // 对应的解释文本
						"type": "bottom" // 解释框的气泡类型
					},
					{
						"showID": "domid2", // 对应的id
						"showMessage": "2、点这里可以购买设备,必须先登录哦", // 对应的解释文本
						"type": "bottom" // 解释框的气泡类型
					},
					{
						"showID": "domid3", // 对应的id
						"showMessage": "3、点这里可以给设备进行续费哦", // 对应的解释文本
						"type": "bottom" // 解释框的气泡类型
					},
					// {
					// 	"showID": "domid4", // 对应的id
					// 	"showMessage": "4、游戏这里往左滑可以选择游戏哦", // 对应的解释文本
					// 	"type": "bottom" // 解释框的气泡类型
					// },
					// {
					// 	"showID": "domid5",
					// 	"showMessage": "5、点问号这里可查看教程,问号可以随意拖动哦！",
					// 	"type": "top right"
					// }
				],
				search: "",
				selshow: false,
				content1: "为了更好的浏览体验,请点击右上角的【···】标志,然后选择在浏览器中打开哦，祝您使用愉快！",
				content2: ``,
				content3: `邀请好友后，您与好友都可获得100云币哦！`,
				content4: ``,
				content5: `欢迎您使用星若云手机! 如需了解更多服务,您可以：点下面导航-->我的-->关注微信公众号哦！`,
				annContent: ``,
				contenth5: ``,
				invitaTxt: ""
			};
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
		onLoad() {
			// 如果是H5端直接前往小程序
			//#ifdef H5
			if(isWeiXin()){
				this.contenth5 = `正在自动前往星若小程序哦...`
				setTimeout(()=>{
					location.href="weixin://dl/business/?t=i0DhOx6yd2r"
				},2000)
			}else{
				if(location.href)
				this.contenth5 = `该网站已停用，请联系客服，去使用【星若云手机】小程序吧！`
			}
			//#endif
			
			//#ifdef MP-WEIXIN
			this.invitaTxt = "邀请朋友"
			//#endif
			//#ifndef MP-WEIXIN
			this.invitaTxt = "复制邀请码"
			//#endif
			this.setVerik();
			this.loadData();
			this.getGameList();
			//新手引导
			// this.guideInit();
			//最新公告
			this.newAnnounce();
			
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
		onReady(){
			//推荐游戏是否显示
			//#ifdef MP-WEIXIN
			if (!bypassAudit()) {
				this.isShowGame = false
				this.placehtxt = "分类"
			} else {
				this.isShowGame = true
				this.placehtxt = "游戏"
			}
			//#endif
				
			setTimeout(()=>{
				this.isNavShow = true
			},200)
			setTimeout(()=>{
				this.isGames = true
			},1500)
		},
		onShow() {
			if (isWeiXin()) {
				this.popShow1 = true
			}
			if (!this.popShow1) {
				const isCloseAdver = uni.getStorageSync("isCloseAdver")
				//登录之后的弹窗
				if (this.userInfo) {
					if (!isCloseAdver) {
						this.popShow2 = true
					}
				}
			}
			
			setTimeout(() => {
				console.log("这里了哦",interstitialAd)
				if (this.userInfo) {
					// 在适合的场景显示插屏广告
					interstitialAd.show().catch((err) => {
						console.error(err)
					})
				}
			}, 5000)
		},
		watch: {
			popShow1(newval) {
				setTimeout(() => {
					if (!newval) {
						const isCloseAdver = uni.getStorageSync("isCloseAdver")
						//登录之后的弹窗
						if (this.userInfo) {
							if (!isCloseAdver) {
								this.popShow2 = true
							}
						}
					}
				}, 1000)
			},
			popShow2(newval) {
				setTimeout(() => {
					if (!newval) {
						this.popShow3 = true
						uni.setStorageSync("isCloseAdver", true)
					}
				}, 500)
			},
			popShow4(newval) {
				setTimeout(() => {
					if (!newval) {
						this.popShow5 = true
					}
				}, 500)
			}
		},
		computed: {
			...mapState(['hasLogin', 'userInfo'])
		},
		methods: {
			//设置是否到了审核开放时间
			async setVerik() {
				await setVerik()
			},
			//最新公告
			newAnnounce() {
				//如果审核过了
				if (bypassAudit()) {
					setTimeout(() => {
						newAnnounce(this, res => {
							if (res) {
								this.announShow = true
								//#ifdef H5
								this.annContent =
									`<img style="display:${res.banner ? 'block' : 'none'};" src="http://xyscript.test.upcdn.net/公告图片/${res.banner}"/><pre>${res.content}</pre>`
								//#endif
					
								//#ifndef H5
								this.annContent =
									`<img class="announ-wx-img" style="display:${res.banner ? 'block' : 'none'};" src="http://xyscript.test.upcdn.net/公告图片/${res.banner}"/><p class="announ-wx-p">${res.content}</p>`
								//#endif
							}
						});
					}, 4000)
				}
			},
			//引导初始化
			guideInit() {
				let _this = this;
				this.$nextTick(function() {
					_this.cShowMsg = _this.noticeArray[_this.currentIndex].showMessage;
					var idS = '#' + _this.noticeArray[_this.currentIndex].showID;
					//根据布局信息显示引导框位置
					const query = uni.createSelectorQuery().in(_this);
					query.select(idS).boundingClientRect(data => {
						_this.cWidth = data.width;
						_this.cHeight = data.height;
						_this.cLeft = data.left;
						_this.cTop = data.top;
					}).exec();
				});
			},
			//搜索游戏 --打开
			searchOpen() {
				this.selshow = true
			},
			//搜索游戏 --执行
			searchData() {
				this.$api.msg("获取相似游戏中", "loading")
				setTimeout(() => {
					uni.navigateTo({
						url: "/pages/game/game?game_name=" + this.search
					})
				}, 1000)
			},
			//顶部提示信息
			titCont(type, text, duration = 5000) {
				this.$refs.uTips.show({
					title: text,
					type: type,
					duration: duration
				})
			},
			//邀请好友 -->确认邀请
			confirmInvite() {
				if (!this.userInfo) {
					this.$api.msg('复制失败,您还未登录哦！');
					return
				}
				//生成分享邀请码
				// let invit_code = encodeURI("星" + this.userInfo.invitation_code + "月" + this.userInfo.username + "云")
				let my_name = this.userInfo.username
				let invit_code = this.userInfo.invitation_code + "-" + my_name;
				// #ifdef  H5
				copyContent(invit_code)
				this.$api.msg("邀请码复制成功", "success");
				setTimeout(() => {
					this.popShow4 = true
					this.content4 = "邀请码已复制到剪切板，赶紧转发给你的好友吧！"
				}, 1000)
				// #endif
				// #ifdef MP-WEIXIN
				this.$api.msg("点击右上角“...”-->发送给朋友");
				setTimeout(() => {
					this.popShow5 = true
				}, 500)
				// #endif
			},
			//邀请好友 -->取消邀请
			cancelInvite() {
				//#ifdef MP-WEIXIN
				setTimeout(() => {
					this.popShow5 = true
				}, 500)
				//#endif
				//#ifndef MP-WEIXIN
				setTimeout(() => {
					this.popShow4 = true
					this.content4 = "错过这次机会没关系，您还可以：点下面导航-->我的-->分享邀请码哦！"
				}, 500)
				//#endif
			},
			//引导方法
			clicktoNext() {
				try {
					if (this.currentIndex >= this.noticeArray.length) {
						this.showGuide = false;
						return;
					}
					this.noticeArray[this.currentIndex].zindex = 0;
					this.cShowMsg = '';
					this.currentIndex++;
					if (this.currentIndex >= this.noticeArray.length) {
						this.showGuide = false;
						return;
					}
					this.cShowMsg = this.noticeArray[this.currentIndex].showMessage;
					var idS = '#' + this.noticeArray[this.currentIndex].showID;
					const query = uni.createSelectorQuery().in(this);
					query.select(idS).boundingClientRect(data => {
						this.cWidth = data.width;
						this.cHeight = data.height;
						this.cLeft = data.left;
						this.cTop = data.top;
					}).exec();
				} catch (e) {
					console.log(e)
				}
			},
			//弹出帮助窗口
			showOption() {
				//#ifdef MP-WEIXIN
				if (!bypassAudit()) {
					this.$api.msg(`该功能暂未开放哦！`);
					return
				}
				//#endif
				if (this.isShow) {
					this.isShow = false
					setTimeout(() => {
						this.isShow = true
					}, 200)
				} else {
					this.isShow = true
				}
			},
			//查看更多游戏
			getMore() {
				this.$api.msg(`暂无更多游戏,敬请期待哦！`);
			},
			//底部列表事件
			click(index, index1) {
				if (index1 == 1) {
					this.list.splice(index, 1);
					this.$u.toast(`删除了第${index}个cell`);
				} else {
					this.list[index].show = false;
					this.$u.toast(`收藏成功`);
				}
			},
			// 如果打开一个的时候，不需要关闭其他，则无需实现本方法
			open(index) {
				// 先将正在被操作的swipeAction标记为打开状态，否则由于props的特性限制，
				// 原本为'false'，再次设置为'false'会无效
				this.list[index].show = true;
				this.list.map((val, idx) => {
					if (index != idx) this.list[idx].show = false;
				})
			},

			//渲染云游戏
			async getGameList() {

				this.list = []
				this.$apis.game_list().then(res => {
					if (res.code == 200) {
						res.data.forEach((item, index) => {
							if (index <= 1) {
								this.list.push({
									id: item.id,
									title: item.game_introduce,
									images: 'http://xyscript.test.upcdn.net/公告图片/' + item.game_logo,
									show: false
								})
							}
						})
					}
				})

			},
			/**
			 * 请求静态数据只是为了代码不那么乱
			 * 分次请求未作整合
			 */
			async loadData() {
				let carouselList = await this.$api.json('carouselList');
				this.titleNViewBackground = carouselList[0].background;
				this.swiperLength = carouselList.length;
				this.carouselList = carouselList;

				let goodsList = await this.$api.json('goodsList');
				this.goodsList = goodsList || [];
			},
			//轮播图切换修改背景色
			swiperChange(e) {
				const index = e.detail.current;
				this.swiperCurrent = index;
				this.titleNViewBackground = this.carouselList[index].background;
			},
			//详情页
			navToDetailPage(item) {
				//测试数据没有写id，用title代替
				let id = item.title;
				uni.navigateTo({
					url: `/pages/product/product?id=${id}`
				})
			},
			//选择游戏
			navToselGame(item) {
				uni.setStorageSync('game_id', item.id);
				uni.switchTab({
					url: `/pages/phone/phone`
				})
			},
			navtoGamemanage() {
				// #ifdef MP-WEIXIN
				if (!bypassAudit()) {
					this.$api.msg(`该功能暂未开放！`);
					return
				}
				// #endif
				uni.navigateTo({
					url: `/pages/game/game`
				})
			},
			//购买设备页
			navToBuyPage() {
				if (!this.userInfo) {
					this.$api.msg(`请先登录才能操作哦！`);
					return
				}
				//测试数据没有写id，用title代替
				uni.navigateTo({
					url: `/pages/buy/buy`
				})
			},
			//设备续费
			navToRechargePage() {
				// #ifdef MP-WEIXIN
				if (!bypassAudit()) {
					this.$api.msg(`该功能暂未开放！`);
					return
				}
				// #endif
				if (!this.userInfo) {
					this.$api.msg(`请先登录才能操作哦！`);
					return
				}
				//测试数据没有写id，用title代替
				uni.navigateTo({
					url: `/pages/recharge/recharge`
				})
			},
			//前往分组
			navToGroupmanage() {
				this.$api.msg(`该功能暂未发布,敬请期待！`);
			}
		},
		// #ifndef MP
		// 标题栏input搜索框点击
		onNavigationBarSearchInputClicked: async function(e) {
			this.searchOpen()
		},
		//点击导航栏 buttons 时触发
		onNavigationBarButtonTap(e) {
			const index = e.index;
			if (index === 0) {
				openScanCode(this)
			} else if (index === 1) {
				this.announShow = true
				return
				// #ifdef APP-PLUS
				const pages = getCurrentPages();
				const page = pages[pages.length - 1];
				const currentWebview = page.$getAppWebview();
				currentWebview.hideTitleNViewButtonRedDot({
					index
				});
				// #endif
				uni.navigateTo({
					url: '/pages/notice/notice'
				})
			}
		}
		// #endif
	}
</script>

<style lang="scss">
	@import "@/static/css/index.less";
</style>
