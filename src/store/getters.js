export default {
    // 获取页面跳转参数
    getPageParam(state) {
        // 拉取本地缓存的页面信息
        state.pageInfo = JSON.parse(sessionStorage.getItem('pageMsg'));
        return function(paramName) {
            return state.pageInfo[paramName];
        };
    }
};
