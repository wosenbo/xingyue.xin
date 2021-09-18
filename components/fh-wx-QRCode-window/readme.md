# 微信授权登录二维码窗口
<fh-wx-QRCode-window\>是一个用于对接微信授权登录展示微信二维码的组件。将微信扫码页面封装到组件里，根据需要调整样式，提供授权二维码扫描。使用前需要申请微信公众号并且开放相关能力,文档可参考[微信公众平台开发](https://developers.weixin.qq.com/doc/offiaccount/Getting_Started/Overview.html)
# 平台差异
当前仅支持APP和H5
# 安装方式
本组件符合[easycom](https://uniapp.dcloud.io/collocation/pages?id=easycom)规范，通过**使用HBuilderX导入插件**或者**下载插件ZIP**，将解压出**fh-wx-QRCode-window**文件夹放到**components**目录下。
# API
## Props
| 属性名 | 类型 | 可选值 | 默认值 | 说明 |
|--------|------|--------|--------|------|
| appId | String | - | '' | 申请的微信公众号appId |
| redirectUrl | String | - | '' | 授权回调域名 |
| options | Object | - | '' | 组件各项配置，options.qrCodeStyle是窗口样式 |
## Event
| 事件名 | 返回参数 | 说明 |
|--------|------|--------|
| getUserInfoByState | {appId,redirectUrl,state} | 轮巡调用，用于可获取二维码状态 |
# 基本用法
~~~
<template>
    <fh-wx-QRCode-window
    	@getUserInfoByState="getUserInfoByState"
    	:redirectUrl="redirectUrl"
    	:appId="appId"
    	:sourceCode="sourceCode"
    	:options="options"
    ></fh-wx-QRCode-window>
</template>
<script>
export default {
    data() {
        return {
			appId: '',
			sourceCode: '',
			redirectUrl: '',
		    options: {
		    	qrCodeStyle:''
		    }
		}
    },
	methods: {
		getUserInfoByState: function({appId,redirectUrl,state}){}
	}
}
</script>
~~~