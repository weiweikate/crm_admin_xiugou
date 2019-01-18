export function validateZh(rule, value, callback) {
    const uPattern = /^[A-Za-z0-9\u4e00-\u9fa5]{2,16}$/;
    if (value && !uPattern.test(value)) {
        callback(new Error('请输入2-16位,不含特殊符号'));
    } else {
        callback();
    }
}
export function validatePhone(rule, value, callback) {
    const uPattern = /^1\d{10}$/;
    if (!uPattern.test(value)) {
        callback(new Error('请输入正确的手机号'));
    } else {
        callback();
    }
}
export function validateCouponName(rule, value, callback) {
    const uPattern = /^[A-Za-z0-9\u4e00-\u9fa5]{2,16}$/;
    if (!uPattern.test(value)) {
        callback(new Error('请输入2-16位,不含特殊符号'));
    } else {
        callback();
    }
}