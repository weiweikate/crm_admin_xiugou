import { asyncRouterMap, constantRouterMap } from '@/router';
import { getAuthRoutes, getNoAuthRoutes } from '@/auth-util';
/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param auth
 * @param roles
 * @param route
 */
function hasPermission(noAuthRoutes, roles, route) {
    if (noAuthRoutes.includes(route.name)) {
        return false;
    } else if (route.meta && route.meta.roles) {
        return roles.some(role => route.meta.roles.includes(role));
    } else {
        return true;
    }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param routes asyncRouterMap
 * @param auth
 */
function filterAsyncRouter(routes, noAuthRoutes, roles) {
    const res = [];
    const len = routes.length;
    for (let i = 0; i < len; i++) {
        const tmp = { ...routes[i] };
        if (tmp.default) {
            res.push(tmp);
            continue;
        }
        if (hasPermission(noAuthRoutes, roles, tmp)) {
            if (tmp.children) {
                tmp.children = filterAsyncRouter(tmp.children, noAuthRoutes, roles);
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
                const authRoutes = getAuthRoutes(auth);
                const noAuthRoutes = getNoAuthRoutes(authRoutes);
                let accessedRouters;
                // 超级管理员则赋予所有权限
                if (roles.includes('admin')) {
                    accessedRouters = asyncRouterMap;
                } else {
                    accessedRouters = filterAsyncRouter(asyncRouterMap, noAuthRoutes, roles);
                }
                console.log('用户权限', accessedRouters);
                commit('SET_ROUTERS', accessedRouters.concat([{ path: '*', redirect: '/404', hidden: true }]));
                resolve();
            });
        }
    }
};

export default permission;
