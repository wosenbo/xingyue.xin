<template>
    <view>
        <web-view :src="url"></web-view>
    </view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex';
    export default {
        data() {
            return {
                url: ''
            }
        },
		onShow(e) {
		
		},
		computed: {
			...mapState(['hasLogin', 'userInfo'])
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
        onLoad(e) {
			// this.$api.msg("这里了----------->"+e.url);
             // 获取传递过来的链接
            this.url = e.url && decodeURIComponent(e.url)
			console.log("这里链接----------->",this.url)
        }
    }
</script>