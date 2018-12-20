// 错误捕获
import Vue from 'vue';
import { Notification } from 'element-ui';
Vue.config.errorHandler = function(err, vm, info) {
    const {
        message, // 异常信息
        name, // 异常名称
        script, // 异常脚本url
        line, // 异常行号
        column, // 异常列号
        stack // 异常堆栈信息
    } = err;
    console.log(`---------------------------Vue捕获错误信息--------------------------------`);
    console.log(`异常信息：${message}`);
    console.log(`异常名称：${name}`);
    console.log(`异常脚本url：${script}`);
    console.log(`异常行号：${line}`);
    console.log(`异常列号：${column}`);
    console.log(`异常堆栈信息：${stack}`);
    console.log(`-------------------------------------------------------------------------`);
    // Notification.warning('js报错')
};
