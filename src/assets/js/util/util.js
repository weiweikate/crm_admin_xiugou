/**
 * 检测是否未空
 * @export
 * @param {any} query
 * @returns
 */
export function isNull(query, errInfo = '暂无数据') {
    if (query || parseInt(query) === 0) {
        return query;
    }
    return errInfo;
}
/**
 * 判断参数是否是其中之一
 * @param {*} value
 * @param {*} validList
 */
export function oneOf(value, validList) {
    for (let i = 0; i < validList.length; i++) {
        if (value === validList[i]) {
            return true;
        }
    }
    return false;
}
/**
 * 深度克隆
 * @param {*} obj
 */
export function deepClone(obj) {
    var result;

    var oClass = isClass(obj);
    // 确定result的类型
    if (oClass === 'Object') {
        result = {};
    } else if (oClass === 'Array') {
        result = [];
    } else {
        return obj;
    }
    for (const key in obj) {
        var copy = obj[key];
        if (isClass(copy) == 'Object') {
            result[key] = deepClone(copy); // 递归调用
        } else if (isClass(copy) == 'Array') {
            result[key] = deepClone(copy);
        } else {
            result[key] = obj[key];
        }
    }
    return result;
}
/**
 * 返回传递给他的任意对象的类
 * @param {*} o
 */
export function isClass(o) {
    if (o === null) return 'Null';
    if (o === undefined) return 'Undefined';
    return Object.prototype.toString.call(o).slice(8, -1);
}
