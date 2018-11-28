import request from '@/http/http.js';
import { authRouterList } from '@/router';

export function login(data) {
    let _url = data._url;
    return request[_url](data);
}

export function getInfo(token) {
    return request['findAdminUserbyId']({ id: token }).then(res => {
        let data = res.data || {};
        // todo 前端白名单 超级管理员权限
        const phoneArr = ['18258147420', '15869000373', '13735533492', '17601056863', '18667159736', '15715811438'];
        if (phoneArr.includes(data.telephone)) {
            res.data.roles = ['admin'];
        } else {
            res.data.roles = ['user'];
        }
        // 兼容新老版本 如果不存在这个字段则赋予所有页面权限
        if (!res.data.privilegeInfo) {
            res.data._auth = authRouterList;
        } else {
            if (typeof res.data.privilegeInfo === 'string') {
                res.data._auth = res.data.privilegeInfo.split(',');
            }
        }

        return res;
    });
}

export function logout() {
    return Promise.resolve(true);
}
