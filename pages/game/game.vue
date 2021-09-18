<template>
	<view class="">
		<u-cell-group style="margin-top: 20rpx;">
<!-- 			<view class="tit-rolling">
				<u-notice-bar mode="horizontal" :list="titlist" color="grey" bg-color="#f5f5f5"></u-notice-bar>
			</view> -->
			<u-cell-item icon="star" title="游戏列表" value="更多游戏" @click="getMore"></u-cell-item>
		</u-cell-group>
		<view>
			<u-swipe-action :show="item.show" :index="index" 
				v-for="(item, index) in list" :key="item.id" 
				@click="navToselGame(item)" @open="open"
				:options="options"
			>
				<view class="item u-border-bottom">
					<image mode="aspectFill" :src="item.images" />
					<!-- 此层wrap在此为必写的，否则可能会出现标题定位错误 -->
					<view class="title-wrap">
						<text class="title u-line-2">{{ item.title }}</text>
					</view>
				</view>
			</u-swipe-action>
		</view>
		<!-- 广告部分 -->
		<view v-if="isViShow">
			<ad unit-id="adunit-83ac71e6e329924c" ad-type="video" ad-theme="white"></ad>
		</view>
		<flotage floticon="question-circle-fill" @parCallback="showOption"></flotage>
		<question :isShow="isShow"></question>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				titlist: [
					'星若云手机',
					'你的另一台云手机',
					'赋能ARM云时代',
					'技术铸造云未来!'
				],
				list: [
				],
				disabled: false,
				btnWidth: 180,
				show: false,
				isViShow: false,
				options: [
					{
						text: '选择',
						style: {
							backgroundColor: '#007aff'
						}
					}
				],
				isShow:false,
				search:""
			};
		},
		onLoad(options){
			if(options){
				this.search = options.game_name
			}
			this.getGameList()
			setTimeout(()=>{
				this.isViShow = true
			},1000)
		},
		methods: {
			//弹出帮助窗口
			showOption(){
				if(this.isShow){
					this.isShow = false
					setTimeout(()=>{
						this.isShow = true
					},200)
				}else{
					this.isShow = true
				}
			},
			click(index, index1) {
				this.list[index].show = false;
				this.$u.toast(`收藏成功`);
			},
			//查看更多游戏
			getMore(){
				this.$api.msg(`暂无更多游戏,敬请期待哦！`);
			},
			//选择游戏
			navToselGame(item){
				uni.setStorageSync('game_id', item.id);
				uni.switchTab({
					url: `/pages/phone/phone`
				})
			},
			//渲染云游戏
			async getGameList() {
				
				this.$apis.game_list({
					keyword:this.search ? this.search : ""
				}).then(res=>{
					if (res.code == 200) {						
						if(res.data.length > 0){
							if(this.search){
								this.$api.msg(`查询游戏成功！`,"success");
							}else{
								this.$api.msg(`正在加载游戏`,"loading");
							}
							setTimeout(()=>{
								res.data.forEach(item => {
									this.list.push({
										id: item.id,
										title: item.game_introduce,
										images: 'http://xyscript.test.upcdn.net/公告图片/' + item.game_logo,
										show: false
									})
								})
							},500)
						}else{
							this.$api.msg(`无此游戏哦！`);
						}
					}
				})
				
			},
			// 如果打开一个的时候，不需要关闭其他，则无需实现本方法
			open(index) {
				// 先将正在被操作的swipeAction标记为打开状态，否则由于props的特性限制，
				// 原本为'false'，再次设置为'false'会无效
				this.list[index].show = true;
				this.list.map((val, idx) => {
					if(index != idx) this.list[idx].show = false;
				})
			}
		}
	};
</script>

<style lang="scss" scoped>
	.item {
		display: flex;
		padding: 20rpx;
	}
	
	image {
		width: 120rpx;
		flex: 0 0 120rpx;
		height: 120rpx;
		margin-right: 20rpx;
		border-radius: 12rpx;
	}
	
	.title {
		text-align: left;
		font-size: 28rpx;
		color: $u-content-color;
		margin-top: 20rpx;
	}
</style>