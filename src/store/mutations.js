export default {
    // 修改页面跳转时缓存的参数
    SET_PAGE_PARAM(state, {name, query}) {
        state.pageInfo[name] = query;
        sessionStorage.setItem('pageMsg', JSON.stringify(state.pageInfo));
    },
    // 拉取本地缓存的页面信息
    GET_LOCAL_PAGE_INFO(state) {
        state.pageInfo = JSON.parse(sessionStorage.getItem('pageMsg'));
    }
};
