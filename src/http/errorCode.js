export default function errCode(code){
    let result = {};
    switch (code) {
        case 210:
            result.msg = '登陆超时，请重新登陆';
            result.code = -1;
            result.clear = false;
            break;
        case 210:
            result.msg = '登陆超时，请重新登陆';
            result.code = -1;
            result.clear = false;
            break;
        default:
            break;
    }
    return Promise.reject(result);
}