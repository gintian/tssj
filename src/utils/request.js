import Vue from 'vue'
import axios from 'axios'
import store from '../store'
import router from '../router'
// 创建axios实例

const service = axios.create({
   // api 的 base_url
  // baseURL:process.env.VUE_APP_BASE_API ,
  baseURL: 'http://192.168.1.36:8093/',
  // baseURL: 'http://127.0.0.1:8093/',
  timeout: 5000, // 请求超时时间
  // withCredentials:true
})
// request拦截器
service.interceptors.request.use(
  config => {

    // console.log('config')
    // console.log('getJSESSIONID',store.getters.getJSESSIONID)
    // if (store.getters.getJToken) {
    //   config.headers['jwtToken'] = store.getters.getJToken
    //   config.headers['refreshToken'] = store.getters.getRefreshToken
    // }
    if (store.getters.getJSESSIONID) {
      config.headers['my-session'] = store.getters.getJSESSIONID
    }
    // console.log(config)
    if (config.method === 'post') {
      // config.data={param:config.data}
      // config.data.param= config.params.data
      // config.params = ''
      
    }
    
    // console.log(config)
    return config
  },
  error => {
    // Do something with request error
    // console.log("错误的传参") // for debug
    Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  response => {
    const { data, code, result, message } = response
    // console.log(response)
    // if(response.headers['jwtToken']){
    //   store.commit('setJToken',response.headers['jwtToken'])
    // }
    if (data.error !== 0) {
      console.log('data',data)
      // if(status===500) 处理token过期等

      Vue.prototype.$message({ message: data.msg, type: 'error' });
      Promise.reject(data.msg);
      return data

    } else {
      // console.log(response)
      return data
    }
  },
  error => {
    console.log('err' + error) // for debug
    return Promise.reject(error)
  }
)
// axios.interceptors.response.use((res) =>{
//   //对响应数据做些事
//   if(!res.data.success){
//       return Promise.resolve(res);
//   }
//   return res;
// }, (error) => {
//   console.log('网络异常')
//   return Promise.reject(error);
// });

export default service
