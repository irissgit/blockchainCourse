
import Vue from 'vue';
import Antd from 'ant-design-vue';
import App from './App';
import router from './router'
import 'ant-design-vue/dist/antd.css';
import moment from 'moment'

Vue.prototype.$moment = moment
Vue.config.productionTip = false;

Vue.use(Antd);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
});
