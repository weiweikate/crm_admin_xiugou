import Cookies from 'js-cookie';
import $cookie from '@mr/fe/utils/cookie';

const TokenKey = 'Admin-Token';

export function getToken() {
    return Cookies.get(TokenKey);
}

export function setToken(token) {
    let value = token + '';
    if (value.length > 0) {
        return Cookies.set(TokenKey, value);
    } else {
        return Cookies.set(TokenKey, '');
    }
}

export function removeToken() {
    return Cookies.remove(TokenKey);
}
