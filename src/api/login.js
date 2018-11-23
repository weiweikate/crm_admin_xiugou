import request from '@/http/http.js';
import { authRouterList } from '@/router';

export function login(data) {
    const _url = data._url;
    return request[_url](data);
}

export function getInfo(token) {
    return request['findAdminUserbyId']({ id: token }).then(res => {
        const data = res.data || {};
        // todo 前端白名单 超级管理员权限
        const phoneArr = ['18258147420', '15869000373', '13735533492', '18667159736', '17601056863', '15715811438'];
        if (phoneArr.includes(data.telephone)) {
            res.data.roles = ['admin'];
        } else {
            res.data.roles = ['user'];
        }
        authRouterList.push('dashboard.data', 'dashboard.shortcut', 'dashboard.shortcut.zhcz', 'vip.memberManage.xjck');
        // 兼容新老版本 如果不存在这个字段则赋予所有页面权限
        if (!res.data.privateInfo) {
            res.data._auth = authRouterList;
        } else {
            if (typeof res.data.privateInfo === 'string') {
                res.data._auth = res.data.privateInfo.split(',');
            }
        }

        return res;
    });
}

export function logout() {
    return Promise.resolve(true);
}
