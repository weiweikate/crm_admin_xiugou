import 'babel-polyfill';
import Vue from 'vue';
import App from './App';
import router from './router';
import axios from './api/index.js';
import ElementUI from 'element-ui';
import vueQuillEditor from 'vue-quill-editor'; // 引入富文本工具
import echarts from 'echarts';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
Vue.use(vueQuillEditor);
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
// import '../static/css/theme-green/index.css';       // 浅绿色主题
import '../src/assets/css/commom.css'; // 公用css 样式
Vue.use(ElementUI, { size: 'small' });
Vue.use(Vue => {
    Vue.prototype.$axios = axios;
});
Vue.prototype.$echarts = echarts;

// 全局过滤器
import moment from 'moment';
Vue.filter('formatDate', function(value) {
    if (!value) {
        return '';
    }
    return moment(value).format('YYYY-MM-DD');
});
Vue.filter('handleMoney', function(val) {
    return `￥${val}`;
});
Vue.filter('bankCard', function(value) {
    const length = value.length;
    const star = length - 9;
    let starStr = '';
    for (let i = 0; i < star; i++) {
        starStr += '*';
    }
    return value.substring(0, 4) + starStr + value.substring(-1, 5);
});

// 使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
    const role = localStorage.getItem('ms_username');
    const privilege = JSON.parse(localStorage.getItem('privilegeList')) || [];
    if (!role && to.path !== '/login') {
        localStorage.clear();
        sessionStorage.clear();
        next('/login');
    } else if (privilege.indexOf(to.meta.url) == -1 && to.path != '/404' && to.path != '/login') {
        // 权限控制
        // next('/404');
        next();
    } else if (localStorage.getItem('ms_hadFirstLogin') == 1 && to.path !== '/dashboard' && to.path !== '/login' && to.path !== '/404') {
        next('/dashboard');
    } else {
        // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
        if (navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor') {
            Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
                confirmButtonText: '确定'
            });
        } else {
            next();
        }
    }
});
new Vue({
    router,
    render: h => h(App)
}).$mount('#app');
