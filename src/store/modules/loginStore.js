import request from '../../utils/request'
// import request from '../../utils/request'
export default {
  state: {
    user:{},
    menu:[],
    jToken:'',
    refreshToken:'',
    JSESSIONID:'',
  },
  getters: {
    user: state => {
      return state.user
    },
    getMenu:state=>{
      return state.menu
    },
    getJToken:state=>{
      return state.jToken
    },
    getRefreshToken:state=>{
      return state.refreshToken
    },
    getJSESSIONID:state=>{
      return state.JSESSIONID
    }
  },
  mutations: {
    setUserData(state,data){
      state.user = data;
    },

    setMenuData(state,data){
      state.menu = data;
    },
    setJToken(state,data){
      state.jToken = data;
    },
    setRefreshToken(state,data){
      state.refreshToken = data;
    },
    setJSESSIONID(state,data){
      state.JSESSIONID = data;
    }
  },
  actions: {
    getToken({ commit,state}) {
      return new Promise((resolve, reject) => {
        request({
          url: '',
          method: 'get',
          params: { refreshToken:state.refreshToken }
        }).then(response => {
          const { data } = response
          console.log(data)
          commit('setJToken', '12313131')
          resolve()
        }).catch(error => {
          reject(error)
        })
        
      })
    },
    setUserData({commit},data){
      commit('setUserData',data);
    },
    resetToken({ commit }) {
      return new Promise(resolve => {
        commit('setJToken', '')
        commit('setRefreshToken', '')
        resolve()
      })
    },
  },
}
