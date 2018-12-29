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
import * as filters from '@/utils/filter';

// 注册全局过滤器
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key]);
});

Vue.use(vueQuillEditor);
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
// import '../static/css/theme-green/index.css';       // 浅绿色主题
import '../src/assets/css/commom.css'; // 公用css 样式
import utils from '@/utils/index.js'; // 公共方法
// 图片浏览工具
import Viewer from 'v-viewer';
import 'viewerjs/dist/viewer.css';

Vue.use(Viewer);
Viewer.setDefaults({
    Options: {
        'inline': true,
        'button': true,
        'navbar': true,
        'title': true,
        'toolbar': true,
        'tooltip': true,
        'movable': true,
        'zoomable': true,
        'rotatable': true,
        'scalable': true,
        'transition': true,
        'fullscreen': true,
        'keyboard': true,
        'url': 'data-source'
    }
});
Vue.use(ElementUI, { size: 'small' });
Vue.use(Vue => {
    Vue.prototype.$axios = axios;
});
Vue.prototype.$echarts = echarts;
Vue.prototype.$utils = utils;
Vue.prototype.$oprAuth = function (value) {
    // 获取用户权限
    const getters = this.$store.getters;
    const roles = getters.roles;
    const auth = getters.auth;
    // 假如不是超级管理员则判断用户用户权限
    if (!roles.includes('admin') && !auth.includes(value)) {
        return false;
    }
    return true;
};
/** 权限指令**/
Vue.directive('auth', {
    inserted: function (el) {

    },
    bind: function (el, binding, vnode) {
        // 获取按钮权限
        const value = binding.value;
        // 获取用户权限
        const getters = vnode.context.$store.getters;
        const roles = getters.roles;
        const auth = getters.auth;

        // 假如不是超级管理员则判断用户用户权限
        if (roles.includes('admin')) {
            return;
        }
        // 解决权限模块闪现问题
        try {
            el.style.display = 'none';
        } catch (e) {
            console.log(e);
        }

        if (!auth.includes(value)) {

            setTimeout(function () {
                try {
                    el.parentNode.removeChild(el);
                } catch (e) {
                    console.log(e);
                }
            }, 10);
        } else {
            setTimeout(function () {
                try {
                    el.style.display = 'block';
                } catch (e) {
                    console.log(e);
                }
            }, 10);

        }
    }
});

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
