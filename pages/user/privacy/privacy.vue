<template>
	<view style="height: 100%;overflow: scroll;">
		<scroll-view scroll-y="true" >
			<u-read-more ref="uReadMore" show-height="1000" :show-height="1000">
				<rich-text :nodes="content"></rich-text>
			</u-read-more>
		</scroll-view>
	</view>
</template>

<script>
	import {
		agreement,privacypoli
	} from '@/utils/agreement.js'
	export default {
		data() {
			return {
				content: '',
				shadowStyle: {
					backgroundImage: "none",
					paddingTop: "0",
					marginTop: "20rpx"
				}
			}
		},
		onLoad() {
			// 模拟后端请求
			setTimeout(() => {
				this.content = 	privacypoli
				// 请注意上方已在组件中添加ref-uReadMore
				this.$nextTick(() => {
					this.$refs.uReadMore.init();
				})
			}, 500);
		}
	}
</script>
