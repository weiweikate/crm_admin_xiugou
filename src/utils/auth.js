import $cookie from '@mr/fe/utils/cookie';

const TokenKey = 'Admin-Token';

export function getToken() {
    return $cookie.get(TokenKey);
}

export function setToken(token) {
    let value = token + '';
    if (value.length > 0) {
        return $cookie.set(TokenKey, value);
    } else {
        return $cookie.set(TokenKey, '');
    }
}

export function removeToken() {
    return $cookie.remove(TokenKey);
}
