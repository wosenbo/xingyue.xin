<template>
	<view class="container">
		<view class="user-section">
			<image class="bg" src="https://www.xingyue.xin/images/temp/user-bg.jpg"></image>
			<view class="user-info-box">
				<view class="portrait-box">
					<!-- <image class="portrait" :src="userInfo.userInfo.icon || '/static/missing-face.png'" v-if="userInfo"></image> -->
					<image class="portrait" :src="userInfo.user_profile ? ((userInfo.user_profile.includes('thirdwx.qlogo.cn') ? 
					'' : imgUrl )+userInfo.user_profile) : 'https://www.xingyue.xin/images/temp/user-head.jpg'"
					 v-if="userInfo" @click="updproOpen"></image>
					<image @click="navTo('/pages/user/login/login')" class="portrait" src="https://www.xingyue.xin/images/temp/missing-face.png"
					 v-else></image>
				</view>
				<view class="info-box">
					<text class="username" v-if="userInfo" @click="updnickOpen">{{userInfo.user_nickname ? userInfo.user_nickname : "无"}}</text>
					<view class="username" v-else @click="navTo('/pages/user/login/login')">Hi，您未登录</view>
				</view>
			</view>
			<view class="vip-card-box">
				<!-- <image class="card-bg" src="/static/vip-card-bg.png" mode=""></image> -->
				<view class="b-btn" @click="promoteNum">
					立即提升
				</view>
				<view class="tit">
					<text class="yticon icon-iLinkapp-"></text>
					成长等级
				</view>
				<text class="e-m">星若云手机</text>
				<text class="e-b">星若云是游戏星若品牌旗下苹果云手机，一款云端运行的iOS云手机APP,本机即使关机,在云手机上面照样升级，免越狱手游辅助让您玩的手游副本任务效率事办功倍！</text>
			</view>
		</view>

		<view class="cover-container" :style="[{
				transform: coverTransform,
				transition: coverTransition,
			}]"
		 @touchstart="coverTouchstart" @touchmove="coverTouchmove" @touchend="coverTouchend">
			<image class="arc" src="https://www.xingyue.xin/images/temp/arc.png"></image>

			<view class="tj-sction">
				<view class="tj-item" @longpress="long_press">
					<text class="num">账号</text>
					<text>{{userInfo ? userInfo.username : "游客"}}</text>
				</view>
				<view class="tj-item">
					<text class="num">成长</text>
					<text>{{userInfo.noble_num ? userInfo.noble_num : 0}}</text>
				</view>
				<view class="tj-item">
					<text class="num">云币</text>
					<text>￥{{my_balance}}</text>
				</view>
				<!-- <view class="tj-item">
					<text class="num">设备数</text>
					<text>{{my_phone_count}}</text>
				</view> -->
			</view>

			<!-- 浏览历史 -->
			<view class="history-section icon">
				<!-- <view class="sec-header">
					<text class="yticon icon-lishijilu"></text>
					<text>浏览历史</text>
				</view>
				<scroll-view scroll-x class="h-list">
					<image @click="navTo('/pages/product/product')" src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1553105186633&di=c121a29beece4e14269948d990f9e720&imgtype=0&src=http%3A%2F%2Fimg004.hc360.cn%2Fm8%2FM04%2FDE%2FDE%2FwKhQplZ-QteEBvsbAAAAADUkobU751.jpg" mode="aspectFill"></image>
					<image @click="navTo('/pages/product/product')" src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1553105231218&di=09534b9833b5243296630e6d5b728eff&imgtype=0&src=http%3A%2F%2Fimg002.hc360.cn%2Fm1%2FM05%2FD1%2FAC%2FwKhQcFQ3iN2EQTo8AAAAAHQU6_8355.jpg" mode="aspectFill"></image>
					<image @click="navTo('/pages/product/product')" src="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2319343996,1107396922&fm=26&gp=0.jpg" mode="aspectFill"></image>
					<image @click="navTo('/pages/product/product')" src="https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2668268226,1765897385&fm=26&gp=0.jpg" mode="aspectFill"></image>
				</scroll-view> -->
				<!-- #ifndef MP-WEIXIN -->
				<list-cell icon="icon-share" iconColor="#9789f7" title="分享邀请" @eventClick="shareInvite"></list-cell>
				<!-- #endif -->
				<list-cell icon="icon-weixin" iconColor="#e07472" title="＋公众号" @eventClick="followWxgzh"></list-cell>
				<list-cell v-if="isActivity" icon="icon-fenlei" iconColor="#e07472" title="每日活动" @eventClick="dailyActivities"></list-cell>
				<!-- <list-cell icon="icon-xingxing" iconColor="#e07472" title="安全问题" border=""></list-cell> -->
				<list-cell v-if="userInfo && !userInfo.user_openid" icon="icon-tuandui" iconColor="#e07472" title="修改密码"
				 @eventClick="navTo('/pages/user/updpass/updpass')"></list-cell>
				<!-- MP-WEIXIN -->
				<list-cell v-if="userInfo" icon="icon-shezhi1" iconColor="#e07472" title="账号设置" @eventClick="navTo('/pages/set/set')"></list-cell>
				<list-cell v-else icon="icon-shoucang_xuanzhongzhuangtai" iconColor="#e07472" title="账号注册" @eventClick="navTo('/pages/user/register/register')"></list-cell>
			</view>
		</view>
		<!-- 编辑昵称弹窗 -->
		<u-modal v-model="nickShow" :title-style="{color: 'grey'}" @confirm="updnickName()" :show-cancel-button="true" title="编辑昵称">
			<view class="slot-content">
				<u-input v-model="form.user_nickname" type="text" :border="border" style="margin: 20rpx 0;" />
			</view>
		</u-modal>
		<flotage floticon="question-circle-fill" @parCallback="showOption"></flotage>
		<question :isShow="isShow"></question>
		<!-- 顶部提示 -->
		<!-- <u-top-tips ref="uTips" style="top: 0"></u-top-tips> -->
		<!-- 提示信息 -->
		<u-modal v-model="popShow1" :content="content1" style="line-height: 1.8;" title="[小贴士]"></u-modal>
		<u-modal v-model="popShow2" style="line-height: 1.8;" title="[关注公众号]">
			<view class="slot-content">
				<rich-text :nodes="content2"></rich-text>
			</view>
		</u-modal>
		<u-modal v-model="popShow3" style="line-height: 1.8;" title="[微信搜一搜]">
			<view class="slot-content">
				<rich-text :nodes="content3"></rich-text>
			</view>
		</u-modal>
		<u-modal v-model="popShow4" :content="content4" style="line-height: 1.8;" title="[去搜一搜吧]"></u-modal>
	</view>
</template>
<script>
	import listCell from '@/components/mix-list-cell';
	import {
		mapState,
		mapMutations
	} from 'vuex';
	import {
		copyContent,
		getName,
		copyText,
		appLoginWx,
		isAuthwx,
		bypassAudit
	} from '@/utils/common.js'
	import {
		imgUrl
	} from '@/api/global.js'

	let startY = 0,
		moveY = 0,
		pageAtTop = true;
	export default {
		components: {
			listCell
		},
		data() {
			return {
				coverTransform: 'translateY(0px)',
				coverTransition: '0s',
				moving: false,
				//弹窗属性
				nickShow: false,
				wxauthShow: false,
				isActivity: false,
				form: {
					user_nickname: '',
				},
				border: true,
				isShow: false,
				popShow1: false,
				popShow2: false,
				popShow3: false,
				popShow4: false,
				imgUrl: "",
				my_balance: 0.00,
				my_phone_count: 0,
				content1: "",
				content2: `<img style="width:100%" src="https://www.xingyue.xin/images/wx-saoyisao.jpg" />`,
				content3: `<img style="width:100%" src="https://www.xingyue.xin/images/wx-shouyishou.jpg" />`,
				content4: `您还可以在微信里直接搜索“星月云手机”，来关注本微信公众号哦！`
			}
		},
		onLoad() {
			//#ifdef MP-WEIXIN
			if (!bypassAudit()) {
				this.isActivity = false
			} else {
				this.isActivity = true
			}
			//#endif
			this.imgUrl = imgUrl
			this.form.user_nickname = this.userInfo.user_nickname
		},
		// #ifndef MP
		onNavigationBarButtonTap(e) {
			const index = e.index;
			if (index === 0) {
				this.navTo('/pages/set/set');
			} else if (index === 1) {
				this.$api.msg('管理员暂无发布公告！');
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
		},
		// #endif
		computed: {
			...mapState(['hasLogin', 'userInfo'])
		},
		watch: {
			popShow2(newVal) {
				if (!newVal) {
					setTimeout(() => {
						this.popShow3 = true
						setTimeout(() => {
							this.popShow4 = true
						}, 1000)
					}, 500)
				}
			}
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
		onShow() {
			this.getMyData()
		},
		methods: {
			...mapMutations(['login']),
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
						console.log("这里了------------------>", res.data)
						this.my_balance = (res.data.balance).toFixed(2)
						this.my_phone_count = res.data.phone_count
					}
				})
			},
			//长按复制
			long_press() {
				if (this.userInfo) {
					// #ifdef  H5
					copyContent(this.userInfo.username)
					this.$api.msg("账号复制成功！", "success");
					return
					// #endif
					copyText(this.userInfo.username, "账号复制成功！")
				} else {
					this.$api.msg("请先登录！");
				}
			},
			//提升等级
			promoteNum() {
				this.$api.msg('联系管理员，即可提升成长等级哦！');
			},
			//前往修改头像
			updproOpen() {
				if (this.userInfo.user_openid) {
					this.$api.msg('微信头像无法修改！');
					return
				}
				uni.navigateTo({
					url: "/pages/user/profile/profile"
				})
			},
			//编辑昵称 --打开
			updnickOpen() {
				if (this.userInfo.user_openid) {
					this.$api.msg('微信昵称无法修改！');
					return
				}
				this.nickShow = true;
				this.form.user_nickname = this.userInfo.user_nickname
			},
			//编辑昵称 --执行
			async updnickName() {
				let userInfo = this.userInfo
				let params = {
					"user_nickname": this.form.user_nickname
				}
				this.$apis.user_updnickname(params).then(res => {
					if (res.code == 200) {
						userInfo.user_nickname = this.form.user_nickname
						this.login(userInfo);
						this.$api.msg('编辑昵称成功！', "success");
					}
				})
			},
			//顶部提示信息
			titCont(type, text, duration = 5000) {
				this.$refs.uTips.show({
					title: text,
					type: type,
					duration: duration
				})
			},
			//每日活动
			dailyActivities() {
				this.$api.msg('正在前往活动', "loading");
				setTimeout(() => {
					uni.navigateTo({
						url: "/pages/activity/index/index"
					})
				}, 1000)
			},
			//关注微信公众号
			followWxgzh() {
				this.popShow2 = true;
			},
			//将编码全转为数字
			//分享邀请码
			shareInvite() {
				if (!this.userInfo) {
					this.$api.msg('复制失败,您还未登录哦！');
					return
				}
				//生成分享邀请码
				//let invit_code = encodeURI("星" + this.userInfo.invitation_code + "月" + this.userInfo.username + "云")
				let my_name = this.userInfo.username
				let invit_code = this.userInfo.invitation_code + "-" + my_name;
				// #ifdef  H5
				copyContent(invit_code)
				this.$api.msg("邀请码复制成功", "success");
				// #endif
				// #ifndef  H5
				copyText(invit_code, "邀请码复制成功")
				// #endif
				// #ifdef  H5
				setTimeout(() => {
					this.popShow1 = true;
					this.content1 = "邀请码已复制到剪切板，赶紧转发给你的好友吧！"
				}, 1000)
				// #endif
			},
			/**
			 * 统一跳转接口,拦截未登录路由
			 * navigator标签现在默认没有转场动画，所以用view
			 */
			navTo(url) {
				if (typeof url == "string") {
					if (!this.hasLogin && url.indexOf('register') == -1) {
						url = '/pages/user/login/login';
					}
				}
				uni.navigateTo({
					url
				})
			},

			/**
			 *  会员卡下拉和回弹
			 *  1.关闭bounce避免ios端下拉冲突
			 *  2.由于touchmove事件的缺陷（以前做小程序就遇到，比如20跳到40，h5反而好很多），下拉的时候会有掉帧的感觉
			 *    transition设置0.1秒延迟，让css来过渡这段空窗期
			 *  3.回弹效果可修改曲线值来调整效果，推荐一个好用的bezier生成工具 http://cubic-bezier.com/
			 */
			coverTouchstart(e) {
				if (pageAtTop === false) {
					return;
				}
				this.coverTransition = 'transform .1s linear';
				startY = e.touches[0].clientY;
			},
			coverTouchmove(e) {
				moveY = e.touches[0].clientY;
				let moveDistance = moveY - startY;
				if (moveDistance < 0) {
					this.moving = false;
					return;
				}
				this.moving = true;
				if (moveDistance >= 80 && moveDistance < 100) {
					moveDistance = 80;
				}

				if (moveDistance > 0 && moveDistance <= 80) {
					this.coverTransform = `translateY(${moveDistance * 2}rpx)`;
				}
			},
			coverTouchend() {
				if (this.moving === false) {
					return;
				}
				this.moving = false;
				this.coverTransition = 'transform 0.3s cubic-bezier(.21,1.93,.53,.64)';
				this.coverTransform = 'translateY(0px)';
			}
		}
	}
</script>
<style lang='scss'>
	@import "@/static/css/user_index.scss";
</style>
