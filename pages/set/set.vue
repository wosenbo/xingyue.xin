<template>
	<view class="container">
		<view class="list-cell m-t b-b">
			<text class="cell-tit">系统版本</text>
			<text class="cell-tip">当前版本 4.2.0</text>
		</view>
		<view class="list-cell m-t b-b" @click="clearCache" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">清除用户数据</text>
			<text class="cell-more yticon icon-you"></text>
		</view>
		<view v-if="isWeixin" class="list-cell m-t b-b" @click="clearbuiltCache" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">清除内置缓存</text>
			<text class="cell-more yticon icon-you"></text>
		</view>
		<view class="list-cell m-t">
			<text class="cell-tit">消息推送</text>
			<switch :checked="isMessPoint" color="#fa436a" @change="switchChange" />
		</view>
		<view class="list-cell m-t b-b" @click="showToast" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">关于云手机</text>
			<text class="cell-more yticon icon-you"></text>
		</view>
		<view class="list-cell log-out-btn" @click="toLogout">
			<text class="cell-tit">退出登录</text>
		</view>
		<flotage floticon="question-circle-fill" @parCallback="showOption"></flotage>
		<question :isShow="isShow"></question>
		<!-- 关于云手机 -->
		<view>
			<u-modal v-model="show" :content="content" style="line-height: 1.8;" title="关于云手机"></u-modal>
		</view>
	</view>
</template>

<script>
	import {
		mapMutations
	} from 'vuex';
	import {
		isWeiXin,
		showModal
	} from '@/utils/common.js'
	export default {
		data() {
			return {
				isShow: false,
				isWeixin: false,
				urllist: {
					"个人资料": "/pages/user/personal/personal"
				},
				fileSizeString: "", // 缓存总数
				show: false,
				isMessPoint: true,
				content: '星若云是游戏星若品牌旗下苹果云手机，一款云端运行的iOS云手机APP,运行的是iOS的游戏,支线手游7*24小时离线托管,手机分身工具,云手机挂机运行iOS游戏,苹果正版无需越狱,免越狱手游辅助软件,iOS手游脚本助手,' +
					'苹果模拟器，手游挂机多开免费辅助软件工具，本机即使关机,在云手机上面照样升级，免越狱手游辅助让您玩的手游副本任务效率事办功倍！'
			};
		},
		onLoad() {
			if (isWeiXin()) {
				this.isWeixin = true
			}
			//获取缓存
			const isMessPoint = uni.getStorageSync('isMessPoint')
			this.isMessPoint = isMessPoint != "no"
		},
		methods: {
			...mapMutations(['logout']),
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
			navTo(url) {
				// if(url == "个人资料"){
				// 	this.$api.msg(`正在前往${url}...`);
				// 	setTimeout(()=>{
				// 		uni.navigateTo({
				// 			url:this.urllist[url]
				// 		})
				// 	},1000)
				// }else{

				// }
				this.$api.msg(`${url}功能暂未开放`);
			},
			//打开消息提示
			showToast() {
				this.show = true
			},
			//退出登录
			toLogout() {
				showModal('确定要退出登录么', true, (e) => {
					if (e.confirm) {
						//退出登录
						this.$apis.user_logoff().then(res => {
							this.logout();
							setTimeout(() => {
								uni.navigateBack();
							}, 200)
						})
					}
				})
			},
			//switch
			switchChange(e) {
				let statusTip = e.detail.value ? '打开' : '关闭';
				uni.setStorageSync('isMessPoint', e.detail.value ? "yes" : "no")
				this.$api.msg(`${statusTip}消息推送`, "success");
			},
			// 计算缓存
			formatSize() {
				//#ifdef APP-PLUS
				let that = this;
				plus.cache.calculate(function(size) {
					let sizeCache = parseInt(size);
					if (sizeCache == 0) {
						that.fileSizeString = "0B";
					} else if (sizeCache < 1024) {
						that.fileSizeString = sizeCache + "B";
					} else if (sizeCache < 1048576) {
						that.fileSizeString = (sizeCache / 1024).toFixed(2) + "KB";
					} else if (sizeCache < 1073741824) {
						that.fileSizeString = (sizeCache / 1048576).toFixed(2) + "MB";
					} else {
						that.fileSizeString = (sizeCache / 1073741824).toFixed(2) + "GB";
					}
				});
				//#endif
			},
			// 清理缓存
			clearCache() {
				showModal('确定要清除应用缓存吗？', true, (e) => {
					if (e.confirm) {
						//先清除你设置的缓存
						this.logout()
						let storArr = ["game_id", "isGuide", "isCanUse", "userwxInfo"]
						storArr.forEach(item => {
							uni.removeStorage({
								key: item
							})
						})
						// 清除应用缓存仅在APP范畴内
						//#ifdef APP-PLUS
						let that = this;
						let os = plus.os.name;
						if (os == 'Android') {
							let main = plus.android.runtimeMainActivity();
							let sdRoot = main.getCacheDir();
							let files = plus.android.invoke(sdRoot, "listFiles");
							let len = files.length;
							for (let i = 0; i < len; i++) {
								let filePath = '' + files[i]; // 没有找到合适的方法获取路径，这样写可以转成文件路径 
								plus.io.resolveLocalFileSystemURL(filePath, function(entry) {
									if (entry.isDirectory) {
										entry.removeRecursively(function(entry) { //递归删除其下的所有文件及子目录 
											that.$api.msg("缓存清理完成", "success")
											that.formatSize(); // 重新计算缓存 
										}, function(e) {
											console.log(e.message)
										});
									} else {
										entry.remove();
									}
								}, function(e) {
									console.log('文件路径读取失败')
								});
							}
						} else { // ios 
							plus.cache.clear(function() {
								that.$api.msg("缓存清理完成", "success")
								that.formatSize();
							});
						}
						//#endif
						// 如果不在APP范畴内
						//#ifndef APP-PLUS
						this.$api.msg("缓存清理完成", "success")
						//#endif
					}
				})
			},
			//清除微信内置浏览器缓存
			clearbuiltCache() {
				this.$api.msg("正在前往查看", "loading")
				setTimeout(() => {
					window.location.href = "https://blog.csdn.net/qq285679784/article/details/78258487?locationNum=4&fps=1"
				}, 1000)
			}
		}
	}
</script>

<style lang='scss' scoped>
	page {
		background: $page-color-base;
	}

	.list-cell {
		display: flex;
		align-items: baseline;
		padding: 20upx $page-row-spacing;
		line-height: 60upx;
		position: relative;
		background: #fff;
		justify-content: center;

		&.log-out-btn {
			margin-top: 40upx;

			.cell-tit {
				color: $uni-color-primary;
				text-align: center;
				margin-right: 0;
			}
		}

		&.cell-hover {
			background: #fafafa;
		}

		&.b-b:after {
			left: 30upx;
		}

		&.m-t {
			margin-top: 16upx;
		}

		.cell-more {
			align-self: baseline;
			font-size: $font-lg;
			color: $font-color-light;
			margin-left: 10upx;
		}

		.cell-tit {
			flex: 1;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			margin-right: 10upx;
		}

		.cell-tip {
			font-size: $font-base;
			color: $font-color-light;
		}

		switch {
			transform: translateX(16upx) scale(.84);
		}
	}
</style>
