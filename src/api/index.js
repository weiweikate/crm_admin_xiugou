import axios from 'axios';
import { Loading } from 'element-ui';
import { Message } from 'element-ui';
import utils from '../utils/index.js';
import qs from 'qs';

axios.defaults.baseURL = process.env.API_ROOT;

axios.defaults.timeout = 200000;

axios.defaults.retry = 3; // 重试次数

axios.defaults.retryDelay = 2000;// 重试延时

axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';

var loading;
axios.interceptors.request.use(config => {
    // let receiveData = config.data;
    // 免session
    // let nocheckout = ['/admin/adminLogin/pswLogin'];
    // let url = '/'+config.url.split(axios.defaults.baseURL)[1];
    // if(nocheckout.indexOf(url) == -1){
    //   let sessionId = sessionStorage.getItem('sessionId') || 'adsadsasasasd';
    //   let sessionPwd = sessionStorage.getItem('sessionPwd') || 'qewqeqeqeqwqe';
    //   receiveData.sessionId = sessionId;
    //   receiveData.sessionPwd = sessionPwd;
    // }
    // if (config.url != '/admin/ossClient/aliyunOSSUploadImage') {
    //     if (receiveData.url == undefined) {
    //         receiveData.url = '/dashboard';
    //     }
    // }
    // if (config.method == 'post') {
    //     // var sentData = qs.stringify(receiveData);
    // } else {
    //     var sentData = receiveData;
    // }
    // config.data = sentData;
    return config;
});

axios.interceptors.response.use(
    res => {
        const code = [10006];
        console.log(res);
        if (code.includes(res.data.code)) {
            const config = res.config;
            if (!config || !config.retry) return res.data || {};
            // 设置重置次数，默认为0
            config.__retryCount = config.__retryCount || 0;
            // 判断是否超过了重试次数
            if (config.__retryCount >= config.retry) {
                return res.data || {};
            }
            // 重试次数自增
            config.__retryCount += 1;
            // 延时处理
            const backoff = new Promise(function(resolve) {
                setTimeout(function() {
                    resolve();
                }, config.retryDelay || 1);
            });

            // 重新发起axios请求
            return backoff.then(function() {
                return axios(config);
            });
        } else {
            return res.data || {};
        }
    },
    err => {
        Message.error({ duration: 1000, message: '网络异常' });
        return Promise.reject(err);
    }
);

export default axios;
