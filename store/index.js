import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		hasLogin: false,
		userInfo:'',
		userwxInfo:''
	},
	mutations: {
		login(state, provider) {
			state.hasLogin = true;
			state.userInfo = provider;
			uni.setStorage({//缓存用户登陆状态
			    key: 'userInfo',  
			    data: provider  
			}) 
			console.log(state.userInfo);
		},
		logout(state) {
			state.hasLogin = false;
			state.userInfo = '';
			uni.removeStorage({  
                key: 'userInfo'  
            })
			uni.removeStorage({
			    key: 'userwxInfo'  
			})
		},
		wxlogin(state,provider){
			state.userwxInfo = provider
			uni.setStorage({//缓存用户登陆状态
			    key: 'userwxInfo',  
			    data: provider  
			}) 
			console.log(state.userwxInfo);
		}
	},
	actions: {
	
	}
})

export default store
