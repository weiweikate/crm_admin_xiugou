import Vue from 'vue';
import Vuex from 'vuex';
import app from './modules/app';
import user from './modules/user';
import permission from './modules/permission';
import getters from './getters';

Vue.use(Vuex);

const state = {
    pageInfo: {
        levelMangeToUp: '', // 会员层级晋升设置
        levelMangeToLower: '', // 会员层级降级设置
        levelMangeInfo: '', // 会员层级详情
        joinManageInfo: '', // 发起邀请详情
        joinManageLinkPage: '', // 查看邀请链接
        memberToLowListPage: '', // 会员管理列表查看下级
        memberToInfo: '', // 会员管理列表查看详情
        memberTreeInfo: '', // 会员树状图
        memberInfoAccount: '', // 会员账户
        memberInfoRealName: '', // 会员实名信息
        shopInfo: '', // 店铺信息
        supplierInfo: '', // 供应商详情
        supplierEditInfo: '' // 编辑供应商
    }
};

const mutations = {
    // 修改页面跳转时缓存的参数
    SET_PAGE_PARAM(state, {name, query}) {
        state.pageInfo[name] = query;
        sessionStorage.setItem('pageMsg', JSON.stringify(state.pageInfo));
    }
}
const store = new Vuex.Store({
    state,
    mutations,
    modules: {
        app,
        user,
        permission
    },
    getters
});

export default store;
