export default {
    // 获取页面跳转参数
    getageParam(state) {
        return function(pageInfo) {
            if (!pageInfo || !state.pageInfo[pageInfo]) return '';
            return JSON.parse(state.pageInfo[pageInfo]);
        };
    }
};
