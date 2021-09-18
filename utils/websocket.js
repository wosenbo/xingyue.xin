import {socketUrl} from '@/api/global.js'
var socketOpen = false;
//发消息方法
function doSend(msg) {
	if (socketOpen) {
		uni.sendSocketMessage({
			data: msg
		});
	} 
}

function websocketInit() {
	//建立连接
	uni.connectSocket({
		url: socketUrl
	});
	//连接错误
	uni.onSocketError(function(res) {
		console.log('WebSocket连接打开失败，请检查！');
	});
	//打开了连接
	uni.onSocketOpen(function() {
		// alert("WebSocket连接已打开！")
		console.log('WebSocket连接已打开！');
		// uni.closeSocket();
		socketOpen = true;
		//发送消息
		// for (var i = 0; i < socketMsgQueue.length; i++) {
		// 	doSend(socketMsgQueue[i]);
		// }
		// socketMsgQueue = [];
	});
	//关闭连接
	uni.onSocketClose(function(res) {
		console.log('WebSocket 已关闭！');
		websocketInit() //重新连接
	});
	//接受消息
	uni.onSocketMessage(function(res) {
		console.log('收到服务器内容：' + res.data);
	});
}

module.exports = {
	doSend,
	websocketInit
}
