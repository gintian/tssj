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
  timeout: 8000, // 请求超时时间
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

// axios.interceptors.response.use(undefined, function axiosRetryInterceptor(err) {
//   var config = err.config;
//   // If config does not exist or the retry option is not set, reject
//   if(!config || !config.retry) return Promise.reject(err);
  
//   // Set the variable for keeping track of the retry count
//   config.__retryCount = config.__retryCount || 0;
  
//   // Check if we've maxed out the total number of retries
//   if(config.__retryCount >= config.retry) {
//       // Reject with the error
//       return Promise.reject(err);
//   }
  
//   // Increase the retry count
//   config.__retryCount += 1;
  
//   // Create new promise to handle exponential backoff
//   var backoff = new Promise(function(resolve) {
//       setTimeout(function() {
//           resolve();
//       }, config.retryDelay || 1);
//   });
  
//   // Return the promise in which recalls axios to retry the request
//   return backoff.then(function() {
//       return axios(config);
//   });

service.interceptors.response.use(
  response => {
    const { data, code, result, message } = response
    // console.log('response',response)
    // if(response.headers['jwtToken']){
    //   store.commit('setJToken',response.headers['jwtToken'])
    // }
    
    if(data.error ==-999){
      router.push('/')
      Vue.prototype.$message('请重新登录')   
      }
     else  if (data.error !== 0) {
          console.log('data', data)
          // if(status===500) 处理token过期等
          Vue.prototype.$message({ message: data.msg, type: 'error' });
          Promise.reject(data.msg);
          return data
        }
    else {
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
