import HttpUtils from '@mr/fe/http';
import * as api_1 from '@/api/api.js';
import * as api_2 from '@/api/BrandProduct/index.js';
import * as api_3 from '@/api/MemberManage/index.js';
import * as api_4 from '@/api/OperateManage/index.js';
import * as api_5 from '@/api/OrderManage/index.js';
import * as api_6 from '@/api/SettlementMange/index.js';
import * as api_7 from '@/api/SpellShopManage/index.js';
import * as api_8 from '@/api/BasePramConfig/index.js';
import * as api_9 from '@/api/ShowValue/index.js';
import * as api_10 from '@/api/RepertoryManage/index.js';
import * as api_11 from '@/api/SupplierManage/index.js';
import { Message, MessageBox } from 'element-ui';
import store from '../stores';
import { getToken } from '@/utils/auth';

const api = judgeApiRepeat(api_1, api_2, api_3, api_4, api_5, api_6, api_7, api_8, api_9, api_10, api_11);
const list = [];
const request = {};
const http = new HttpUtils({
    // 定义请求文件类型
    headers: {
        'Content-Type': 'application/json'
    },
    // 超时时间
    timeout: 60000,
    _transformRequest: function(config) {
        config.headers['token'] = getToken();
        return config;
    }
});
// 解析api文件
Object.keys(api).forEach(function(name) {
    const value = api[name];
    if (typeof value === 'string') {
        list.push({
            name,
            uri: `/admin/${value}`,
            action: '未知'
        });
    } else if (value.length) {
        if (value[1].requestRoot) {
            list.push({
                name,
                uri: `${value[1].requestRoot}${value[0]}`,
                ...value[1]
            });
        } else {
            list.push({
                name,
                uri: `/admin/${value[0]}`,
                ...value[1]
            });
        }
    }
});
// 生成API接口
let flag = 0;
list.forEach(function(item) {
    const name = item.name; const url = item.uri.replace(/\/\//g, '/'); const method = item.methods || 'post'; const action = item.action || '';
    request[name] = function(params, config = {}) {
        return new Promise((resolve, reject) => {
            console.log(`[开始请求:${action}] : ${url}`);
            item.transformRequest && item.transformRequest.call(http, config);
            http[method](url, params, config).then(res => {
                // 错误信息拦截
                if (res.code === 10009 || res.code === 70009) {
                    flag++;
                    if (flag <= 1) {
                        MessageBox.confirm(
                            '你已被登出，可以取消继续留在该页面，或者重新登录',
                            '确定登出',
                            {
                                confirmButtonText: '重新登录',
                                cancelButtonText: '取消',
                                type: 'warning'
                            }
                        ).then(() => {
                            store.dispatch('FedLogOut').then(() => {
                                location.reload(); // 为了重新实例化vue-router对象 避免bug
                            });
                        });
                    }
                    return reject(res.msg);
                }
                if (res.code !== 10000) {
                    Message.error({
                        duration: 1000,
                        message: res.msg
                    });
                    setTimeout(() => {
                        Message.closeAll();
                    }, 1000);
                    return reject(res.msg);
                }
                if (res.data === undefined) return reject('返回值错误');
                // 业务处理成功
                item.transformResponse && item.transformResponse.call(http, res);
                return resolve(res);
            }).catch(err => {
                // 显示错误信息
                console.log(`[网络请求失败:${action}] : ${url}`, err);
                reject(err);
            });
        });
    };
});
function judgeApiRepeat() {
    const api = {};
    try {
        if (arguments.length !== 0) {
            for (let v = 0; v < arguments.length; v++) {
                const childKeys = Object.keys(arguments[v]);
                const apiKeys = Object.keys(api);
                for (let i = 0; i < apiKeys.length; i++) {
                    let num = 0;
                    for (let j = 0; j < childKeys.length; j++) {
                        if (apiKeys[i] === childKeys[j]) num++;
                    }
                    if (num > 0) throw new Error(`api接口文件${apiKeys[i]}名字重复`);
                }
                Object.assign(api, arguments[v]);
            }
        }
    } catch (e) {
        console.log(e);
    }
    return api;
}
export default request;

// try {
//     Object.keys(api).forEach((v, k) => {
//         const value = api[v];
//         let url = '';
//         let methods = 'post';
//         if (typeof value === 'string') {
//             url = value;
//             methods = 'post';
//         } else if (value.length) {
//             url = value[0];
//             methods = value[1]['methods'];
//         }
//         url = url && url.indexOf('/admin/') > -1 ? url.replace('/admin/', '/') : url;
//         // 接口方法
//         request[v] = function(data = {}) {
//             if (methods === 'get') {
//                 data = {
//                     params: data
//                 };
//             }
//             return axios[methods](`/admin${url}`, data)
//                 .then(res => {
//                     // 错误信息拦截
//                     if (res.code === 10009 || res.code === 70009) {
//                         MessageBox.confirm(
//                             '你已被登出，可以取消继续留在该页面，或者重新登录',
//                             '确定登出',
//                             {
//                                 confirmButtonText: '重新登录',
//                                 cancelButtonText: '取消',
//                                 type: 'warning'
//                             }
//                         ).then(() => {
//                             store.dispatch('FedLogOut').then(() => {
//                                 location.reload(); // 为了重新实例化vue-router对象 避免bug
//                             });
//                         });
//                         return Promise.reject(res.msg);
//                     }
//                     if (res.code !== 10000) {
//                         Message.error({
//                             duration: 1000,
//                             message: res.msg
//                         });
//                         setTimeout(() => {
//                             Message.closeAll();
//                         }, 1000);
//                         return Promise.reject(res.msg);
//                     }
//                     if (res.data === undefined) return Promise.reject('返回值错误');
//                     return Promise.resolve(res);
//                 })
//                 .catch(err => {
//                     return Promise.reject(err);
//                 });
//         };
//     });
// } catch (error) {
//     console.log(error);
// }
// export default request;
