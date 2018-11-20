import Cookies from 'js-cookie';

const TokenKey = 'Admin-Token';

export function getToken() {
    return Cookies.get(TokenKey);
}

export function setToken(token) {
    if (token || (token + '').length > 0) {
        return Cookies.set(TokenKey, token);
    } else {
        return Cookies.set(TokenKey, '');
    }
}

export function removeToken() {
    return Cookies.remove(TokenKey);
}
