import { login, logout, getInfo } from '@/api/login';
import { getToken, setToken, removeToken } from '@/utils/auth';

const TokenKey = 'id'; // todo 使用id作为token

const user = {
    state: {
        token: getToken(),
        name: '',
        avatar: '',
        user: null,
        roles: [],
        auth: []
    },

    mutations: {
        SET_TOKEN: (state, token) => {
            state.token = token;
        },
        SET_NAME: (state, name) => {
            state.name = name;
        },
        SET_AVATAR: (state, avatar) => {
            state.avatar = avatar;
        },
        SET_ROLES: (state, roles) => {
            state.roles = roles;
        },
        SET_AUTH: (state, data) => {
            state.auth = data;
        },
        SET_USER: (state, user) => {
            console.log('SET_USER', user);
            state.user = user;
        }
    },

    actions: {
        // 登录
        Login({ commit }, userInfo) {
            return new Promise((resolve, reject) => {
                login(userInfo).then(response => {
                    const data = response.data || {};
                    setToken(data[TokenKey]);
                    commit('SET_TOKEN', data[TokenKey]);
                    resolve();
                }).catch(error => {
                    reject(error);
                });
            });
        },

        // 获取用户信息
        GetInfo({ commit, state }) {
            return new Promise((resolve, reject) => {
                getInfo(state.token).then(response => {
                    const data = response.data;
                    const roles = data.roles || [];
                    if (roles.length > 0) { // 验证返回的roles是否是一个非空数组
                        commit('SET_ROLES', roles);
                    } else {
                        reject('getInfo: roles must be a non-null array !');
                    }
                    commit('SET_AUTH', data._auth);
                    commit('SET_USER', data);
                    resolve(response);
                }).catch(error => {
                    reject(error);
                });
            });
        },

        // 登出
        LogOut({ commit, state }) {
            return new Promise((resolve, reject) => {
                logout(state.token).then(() => {
                    commit('SET_TOKEN', '');
                    commit('SET_ROLES', []);
                    removeToken();
                    resolve();
                }).catch(error => {
                    reject(error);
                });
            });
        },

        // 前端 登出
        FedLogOut({ commit }) {
            return new Promise(resolve => {
                commit('SET_TOKEN', '');
                commit('SET_ROLES', []);
                removeToken();
                resolve();
            });
        }
    }
};

export default user;
