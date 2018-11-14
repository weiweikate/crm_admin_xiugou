import request from '@/http/http.js';

export function login(data) {
    let _url = data._url;
    return request[_url](data);
}

export function getInfo(token) {
    return request['findAdminUserbyId']({ id: token }).then(res => {
        let data = res.data || {};
        console.log('findAdminUserbyId',data)
        // todo 默认超级管理员权限
        res.data.roles = ['admin'];
        return res;
    });
}

export function logout() {
    return Promise.resolve(true);
}
