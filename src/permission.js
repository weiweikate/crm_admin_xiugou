import router from './router';
import store from './stores';
import { Message } from 'element-ui';
import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css';// progress bar style
import { getToken } from '@/utils/auth'; // getToken from cookie

NProgress.configure({ showSpinner: false });// NProgress Configuration

const whiteList = ['/login', '/404', '/403', '/500'];// no redirect whitelist

router.beforeEach((to, from, next) => {
    console.log('beforeEach', to);
    NProgress.start(); // start progress bar
    if (getToken()) { // determine if there has token
        console.log('token', store.getters.token);
        /* has token*/
        if (to.path === '/login') {
            next({ path: '/' });
            NProgress.done(); // if current page is dashboard will not trigger	afterEach hook, so manually handle it
        } else {
            console.log('判断用户权限', store.getters.roles);
            if (store.getters.roles.length === 0) { // 判断当前用户是否已拉取完user_info信息
                console.log('重新拉取用户信息');
                store.dispatch('GetInfo').then(res => { // 拉取user_info
                    console.log('GetInfo roles', res.data.roles);
                    const roles = res.data.roles; // note: roles must be a array! such as: ['editor','develop']
                    const _auth = res.data._auth;
                    store.dispatch('GenerateRoutes', { roles, _auth }).then(() => { // 根据roles权限生成可访问的路由表
                        console.log('store.getters.addRouters', store.getters.addRouters,store.getters.auth);
                        router.addRoutes(store.getters.addRouters); // 动态添加可访问路由表
                        next({ ...to, replace: true }); // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
                    });
                }).catch((err) => {
                    console.log('GetInfo err', err);
                    store.dispatch('FedLogOut').then(() => {
                        Message.error(err || 'Verification failed, please login again');
                        next({ path: '/' });
                    });
                });
            } else {
                next();
            }
        }
    } else {
        console.log('token不存在');
        /* has no token*/
        if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
            next();
        } else {
            next(`/login?redirect=${to.path}`); // 否则全部重定向到登录页
            NProgress.done();
        }
    }
});

router.afterEach(() => {
    NProgress.done(); // finish progress bar
});
