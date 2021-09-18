<template>
	<view class="wrap">
		<view class="u-avatar-wrap">
			<image class="u-avatar-demo" :src="avatar" mode="aspectFill"></image>
		</view>
		<u-button @click="chooseAvatar">选择头像上传</u-button>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex';
	import {
		urlTobase64
	} from '@/utils/common.js'
	import {
		pathToBase64,
		base64ToPath
	} from '@/utils/pathto.js'
	import {imgUrl} from '@/api/global.js'
	export default {
		data() {
			return {
				avatar: '',
			}
		},
		computed: {
			...mapState(['hasLogin', 'userInfo'])
		},
		created() {
			let _this = this
			this.avatar = this.userInfo.user_profile ? ((this.userInfo.user_profile.indexOf('thirdwx.qlogo.cn')!=-1 ?
			'' : imgUrl )+this.userInfo.user_profile) : 'https://www.xingyue.xin/images/temp/user-head.jpg'
			// 监听从裁剪页发布的事件，获得裁剪结果
			uni.$on('uAvatarCropper', path => {
				this.avatar = path;
				setTimeout(()=>{
					// 上传服务端
					// #ifdef  H5
					this.uploadProfile({
						imgData: path,
						filePath: "profile"
					})
					// #endif
					// #ifndef H5
					pathToBase64(path).then(res=>{
						console.log("这里了哦--------------->",res)
						this.uploadProfile({
							imgData: res,
							filePath: "profile"
						})
					})
					// #endif
				},1000)
			})
		},
		methods: {
			...mapMutations(['login']),
			//上传头像
			async uploadProfile(params) {
				this.$apis.user_uploadimg(params).then(res => {
					if (res.code == 200) {
						if (res.data) {
							let userInfo = this.userInfo
							userInfo.user_profile = res.data.imgPath
							this.login(userInfo);
							setTimeout(() => {
								this.$api.msg('上传头像成功！', "success");
							}, 1000)
						}
					} else {
						this.$api.msg('图片过大,上传失败！');
					}
				})
			},
			chooseAvatar() {
				// 此为uView的跳转方法，详见"文档-JS"部分，也可以用uni的uni.navigateTo
				this.$u.route({
					// 关于此路径，请见下方"注意事项"
					url: '/uview-ui/components/u-avatar-cropper/u-avatar-cropper',
					// 内部已设置以下默认参数值，可不传这些参数
					params: {
						// 输出图片宽度，高等于宽，单位px
						destWidth: 150,
						// 裁剪框宽度，高等于宽，单位px
						rectWidth: 150,
						// 输出的图片类型，如果'png'类型发现裁剪的图片太大，改成"jpg"即可
						fileType: 'jpg',
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.wrap {
		padding: 40rpx;
	}

	.u-avatar-wrap {
		margin-top: 80rpx;
		overflow: hidden;
		margin-bottom: 80rpx;
		text-align: center;
	}

	.u-avatar-demo {
		width: 300rpx;
		height: 300rpx;
		border-radius: 50%;
	}
</style>
