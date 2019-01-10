const getters = {
    // 获取页面跳转参数
    getPageParam(state) {
        // 拉取本地缓存的页面信息
        state.pageInfo = JSON.parse(sessionStorage.getItem('pageMsg'));
        return function (paramName) {
            return state.pageInfo[paramName];
        };
    },
    sidebar: state => state.app.sidebar,
    device: state => state.app.device,
    token: state => state.user.token,
    user: state => state.user.user,
    avatar: state => state.user.avatar,
    name: state => state.user.name,
    roles: state => state.user.roles,
    auth: state => state.user.auth,
    permission_routers: state => state.permission.routers,
    addRouters: state => state.permission.addRouters,
    noAuthRoutes: state => state.permission.noAuthRoutes
};
export default getters;
