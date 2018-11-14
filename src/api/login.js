import request from '@/http/http.js';

export function login(data) {
    let _url = data._url;
    return request[_url](data);
}

export function getInfo(token) {
    return request['findAdminUserbyId']({ id: token }).then(res => {
        let data = res.data || {};
        // todo 前端白名单 超级管理员权限
        const phoneArr = ['18258147420', '15869000373', '13735533492', '17601056863', '18667159736', '15715811438'];
        console.log('findAdminUserbyId', data);
        if (phoneArr.includes(data.telephone)) {
            res.data.roles = ['admin'];
        } else {
            res.data.roles = ['user'];
        }

        return res;
    });
}

export function logout() {
    return Promise.resolve(true);
}
