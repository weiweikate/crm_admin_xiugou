import axios from 'axios';
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
import { Message,MessageBox } from 'element-ui';
import store from '../stores'

const api = {};
Object.assign(api, api_1, api_2, api_3, api_4, api_5, api_6, api_7, api_8, api_9,api_10);

const request = {};
try {
    Object.keys(api).forEach((v, k) => {
        const value = api[v];
        let url = '';
        let methods = 'post';
        if (typeof value === 'string') {
            url = value;
            methods = 'post';
        } else if (value.length) {
            url = value[0];
            methods = value[1]['methods'];
        }
        url = url && url.indexOf('/admin/') > -1 ? url.replace('/admin/','/') : url;
        // 接口方法
        request[v] = function(data = {}) {
            if (methods === 'get') {
                data = {
                    params: data
                };
            }
            return axios[methods](`/admin${url}`, data)
                .then(res => {
                    // 错误信息拦截
                    if (res.code === 10009 || res.code === 70009) {
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
                                location.reload() // 为了重新实例化vue-router对象 避免bug
                            });
                        });
                        return Promise.reject(res.msg);
                    }
                    if (res.code !== 10000) {
                        Message.error({
                            duration: 1000,
                            message: res.msg
                        });
                        setTimeout(() => {
                            Message.closeAll();
                        }, 1000);
                        return Promise.reject(res.msg);
                    }
                    if (res.data === undefined) return Promise.reject('返回值错误');
                    return Promise.resolve(res);
                })
                .catch(err => {
                    return Promise.reject(err);
                });
        };
    });
} catch (error) {
    console.log(error);
}
export default request;
