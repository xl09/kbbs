import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import axios from 'axios'
import 'element-ui/lib/theme-chalk/index.css'
// import './plugins/element.js'
import './assets/css/public.css'
import './assets/fonts/iconfont.css'
import ZkTable from 'vue-table-with-tree-grid'
import VueQuillEditor from 'vue-quill-editor'
// 导入vue‐quill‐editor的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import * as echarts from 'echarts'

import './assets/css/common.less'
import './assets/font/iconfont.css'

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

Vue.prototype.$echarts = echarts

axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

Vue.filter('dateFormat', function (originVal) {
  const neworiginVal = originVal * 1000
  const dt = new Date(neworiginVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')
  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  return `${y}‐${m}‐${d} ${hh}:${mm}:${ss}`
})

Vue.prototype.$http = axios

Vue.config.productionTip = false

Vue.use(ElementUI)

Vue.component('tree-table', ZkTable)

Vue.use(VueQuillEditor)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
