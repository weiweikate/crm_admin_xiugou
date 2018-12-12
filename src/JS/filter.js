// 全局过滤器
import moment from 'moment';
import Vue from 'vue';
Vue.filter('formatDate', function(value) {
    if (!value) {
        return '';
    }
    return moment(value).format('YYYY-MM-DD');
});
Vue.filter('formatDateAll', function(value) {
    if (!value) {
        return '';
    }
    return moment(value).format('YYYY-MM-DD HH:mm:ss');
});
Vue.filter('formatDateToMinute', function(value) {
    if (!value) {
        return '';
    }
    return moment(value).format('YYYY-MM-DD HH:mm');
});
Vue.filter('handleMoney', function(val) {
    if (!val) return '-';
    return `￥${val}`;
});
Vue.filter('bankCard', function(value) {
    const length = value.length;
    const star = length - 9;
    let starStr = '';
    for (let i = 0; i < star; i++) {
        starStr += '*';
    }
    return value.substring(0, 4) + starStr + value.substring(-1, 5);
});
