import 'babel-polyfill';
import Vue from 'vue';
import App from './App';
import router from './router';
import axios from './api/index.js';
import ElementUI from 'element-ui';
import vueQuillEditor from 'vue-quill-editor'; // 引入富文本工具
import echarts from 'echarts';
import '@/JS/filter.js'; // 全局过滤器
import '@/JS/errorLog.js'; // 错误捕获
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import '@/permission'; // permission control
import store from '@/stores';
Vue.use(vueQuillEditor);
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
// import '../static/css/theme-green/index.css';       // 浅绿色主题
import '../src/assets/css/commom.css'; // 公用css 样式
Vue.use(ElementUI, { size: 'small' });
Vue.use(Vue => {
    Vue.prototype.$axios = axios;
});
Vue.prototype.$echarts = echarts;
// 使用钩子函数对路由进行权限跳转
/*router.beforeEach((to, from, next) => {
    const role = localStorage.getItem('ms_username');
    if (!role && to.path !== '/login') {
        localStorage.clear();
        sessionStorage.clear();
        next('/login');
    } else {
        next();
    }
});*/
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
