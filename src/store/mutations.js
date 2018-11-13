export default {
    // 修改页面跳转时缓存的参数
    setPageParam(state, {name, msg}) {
        let data = JSON.stringify(msg)
        state.pageInfo[name] = data;
    }
};
