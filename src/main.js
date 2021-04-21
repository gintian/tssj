import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'

Vue.config.productionTip = false
Vue.use(ElementUI)

import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import  'proj4'
import './utils/leaflet.canvas-markers'
import './utils/MovingMarker'
import './utils/proj4leaflet'
import './utils/Leaflet.LinearMeasurement/Leaflet.LinearMeasurement.css'
import './utils/Leaflet.LinearMeasurement/Leaflet.LinearMeasurement' //测距
import './utils/leaflet.polylineDecorator'
import 'leaflet.tilelayer.colorfilter' //图层颜色
import 'leaflet.chinatmsproviders'

import  'leaflet.markercluster'//聚合
import  'leaflet.markercluster/dist/MarkerCluster.Default.css'//聚合样式

import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';

import service from './utils/request'
import Axios from 'axios'
Vue.prototype.$axios=Axios
Vue.prototype.service=service

// Axios.defaults.retry = 4;
// Axios.defaults.retryDelay = 1000;


import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/style.css'
import element from './element/index'
Vue.use(element);


import BaiduMap from 'vue-baidu-map'
Vue.use(BaiduMap, {
  // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key */
  ak: 'RAarHyPGrEuL3lgEx13vNmGvIIPBCXeD'
})


import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon, FontAwesomeLayers, FontAwesomeLayersText } from '@fortawesome/vue-fontawesome'
library.add(fas, far, fab)

Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.component('font-awesome-layers', FontAwesomeLayers)
Vue.component('font-awesome-layers-text', FontAwesomeLayersText)


Vue.filter('formatDateTime', function (value) {
  if (!value) return ''
  let date = new Date(value);
  let y = date.getFullYear() + '/';
  let mon = (date.getMonth() + 1) + '/';
  let d = date.getDate();
  return y + mon + d;
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
