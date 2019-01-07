import { asyncRouterMap, constantRouterMap } from '@/router';
import { getAuthRoutes, getNoAuthRoutes, getAdminRoutes } from '@/auth-util';

/**
 * @param noAuthRoutes
 * @param route
 */
function hasPermission(noAuthRoutes, route) {
    if (noAuthRoutes.includes(route.name)) {
        return false;
    } else {
        return true;
    }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param routes asyncRouterMap
 * @param auth
 */
function filterAsyncRouter(routes, noAuthRoutes) {
    const res = [];
    const len = routes.length;
    for (let i = 0; i < len; i++) {
        const tmp = { ...routes[i] };
        if (hasPermission(noAuthRoutes, tmp)) {
            if (tmp.children) {
                tmp.children = filterAsyncRouter(tmp.children, noAuthRoutes);
            }
            res.push(tmp);
        }
    }

    return res;
}

const permission = {
    state: {
        routers: constantRouterMap,
        addRouters: []
    },
    mutations: {
        SET_ROUTERS: (state, routers) => {
            state.addRouters = routers;
            state.routers = constantRouterMap.concat(routers);
        }
    },
    actions: {
        GenerateRoutes({ commit }, data) {
            return new Promise(resolve => {
                const roles = data.roles;
                const auth = data._auth;
                const adminRoutes = getAdminRoutes(asyncRouterMap);
                const noAuthRoutes = getNoAuthRoutes(auth);
                const dashboard = noAuthRoutes.indexOf('dashboard');
                let accessedRouters;
                if (dashboard > -1) {
                    noAuthRoutes.splice(dashboard, 1);
                }
                // 超级管理员则赋予所有权限
                if (roles.includes('admin')) {
                    accessedRouters = asyncRouterMap;
                } else {
                    let tmp = noAuthRoutes.concat(adminRoutes);
                    console.log('没权限的路由：', tmp);
                    accessedRouters = filterAsyncRouter(asyncRouterMap, noAuthRoutes);
                }
                console.log('用户权限', accessedRouters);
                commit('SET_ROUTERS', accessedRouters.concat([{ path: '*', redirect: '/404', hidden: true }]));
                resolve();
            });
        }
    }
};

export default permission;
