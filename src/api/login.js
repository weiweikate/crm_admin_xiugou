import request from '@/http/http.js';
import { authRouterList } from '@/router';

export function login(data) {
    let _url = data._url;
    return request[_url](data);
}

export function getInfo(token) {
    return request['findAdminUserbyId']({ id: token }).then(res => {
        let data = res.data || {}, telephone = data.id === 0 || data.id === 1 ? [data.telephone] : [];
        // todo 前端白名单 超级管理员权限
        const phoneArr = [].concat(telephone);
        if (phoneArr.includes(data.telephone)) {
            res.data.roles = ['admin'];
        } else {
            res.data.roles = ['user'];
        }
        // 兼容新老版本 如果不存在这个字段则赋予所有页面权限
        if (!res.data.privilegeInfo) {
            res.data._auth = [];
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
