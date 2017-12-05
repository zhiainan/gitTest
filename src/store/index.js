import Vue from 'vue'
import Vuex from 'vuex'
import {getAdminInfo,myTest} from '@/api/getData'

Vue.use(Vuex)

const state = {
	adminInfo: {
		avatar: 'default.jpg'
	},
}

const mutations = {
	saveAdminInfo(state, adminInfo){
        console.log(adminInfo);
        state.adminInfo = adminInfo;
	}
}

const actions = {
	async getAdminData({commit}){
		try{
			const res = await getAdminInfo();
            console.log(res);
            if (res.status == 1) {
                commit('saveAdminInfo', res.data);
            }else{
                throw new Error(res)
            }
		}catch(err){
			console.log('您尚未登陆或者session失效')
		}
	},
    async getMyInfo({commit}) {
        try{
            const res = await myTest();
            console.log(res);
        }catch(err){
            console.log('怎么会出错')
        }
    }

}

export default new Vuex.Store({
	state,
	actions,
	mutations,
})
