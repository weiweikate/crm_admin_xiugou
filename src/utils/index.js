import moment from 'moment'
const encryptData = function(data) {
    var tmpData = {};
    for (var k in tmpData) {
        delete tmpData[k];
    }
    const key = '&key=juReWeb@key';
    var itemArr = [];
    for (const item in data) {
        if (data[item] != '' && data[item] != undefined) {
            itemArr.push(item + '=' + data[item]);
            tmpData[item] = data[item];
        }
    }
    var tmpArr = itemArr.sort().join('&');
    var res = tmpArr + key;
    var sign = md5(res);
    var timestamp = new Date().getTime();
    tmpData.sign = sign.toUpperCase();
    tmpData.timestamp = timestamp;
    return tmpData;
};

// 清除数据
const cleanFormData = function(form) {
    for (const key in form) {
        if (form[key] instanceof Array) {
            form[key] = [];
        } else if (form[key] instanceof Object) {
            form[key] = {};
        } else {
            form[key] = '';
        }
    }
};
//  三级联动
const handleCity = function(regionoption, v1, v2, v3) {
    var cityArr = [];
    for (var i in regionoption) {
        if (regionoption[i].value == v1) {
            cityArr.push(regionoption[i].label);
        }
    }
    for (var i in regionoption) {
        for (var z in regionoption[i].children) {
            if (
                regionoption[i].children[z].value == v2 &&
                v2 != undefined
            ) {
                cityArr.push(regionoption[i].children[z].label);
            }
        }
    }
    for (var y in regionoption) {
        for (var z in regionoption[y].children) {
            for (var i in regionoption[y].children[z].children) {
                if (
                    regionoption[y].children[z].children[i].value == v3 &&
                    v3 != undefined
                ) {
                    cityArr.push(regionoption[y].children[z].children[i].label);
                }
            }
        }
    }
    return cityArr;
};
const handleCityIndex = function(regionoption, v1, v2, v3) {
    var cityIndArr = [];
    for (var i in regionoption) {
        if (v1.indexOf(regionoption[i].label) != -1) {
            cityIndArr.push(regionoption[i].value);
        }
    }
    for (var i in regionoption) {
        for (var z in regionoption[i].children) {
            if (
                regionoption[i].children[z].label == v2 &&
                v2 != undefined
            ) {
                cityIndArr.push(regionoption[i].children[z].value);
            }
        }
    }
    for (var y in regionoption) {
        for (var z in regionoption[y].children) {
            for (var i in regionoption[y].children[z].children) {
                if (
                    regionoption[y].children[z].children[i].label == v3 &&
                    v3 != undefined
                ) {
                    cityIndArr.push(regionoption[y].children[z].children[i].value);
                }
            }
        }
    }
    return cityIndArr;
};
// 格式化时间
const formatTime = function(value, status) {
    if (value == undefined || value == null) {
        return '';
    }
    if (status == 1) {
        return value == '' ? '' : moment(value).format('YYYY-MM-DD');
    } else if (status == 2) {
        return value == '' ? '' : moment(value).format('YYYY-MM');
    }
    return value == '' ? '' : moment(value).format('YYYY-MM-DD HH:mm:ss');
};
/**
 * 页面跳转缓存参数
 * @param path 页面跳转路径
 * @param paramName 参数名称
 * @param param 参数
 */
const setParam = function(path = '/404', paramName = 'pageDefParam', param = '-1') {
    this.$store.commit('SET_PAGE_PARAM', { name: paramName, query: param });
    const obj = {};
    obj[paramName] = param;
    this.$router.push({ path: path, query: obj });
};
/**
 * 页面跳转获取缓存参数
 * @param paramName 参数名称
 * @returns {string | *} 参数值
 */
const getParam = function(paramName = 'pageDefParam') {
    return this.$route.query[paramName] || this.$store.getters.getPageParam(paramName);
};
/**
 * 跳转h5页面路径
 * @param code 产品code
 * @returns {string | *} 参数值
 */
const getSrc = (code) => {
    const href = location.href;
    let first = '';
    if (href.indexOf('sharegoodsmall.com') === -1) { // 本地环境
        first = 'http://devh5.sharegoodsmall.com/';
    } else {
        first = first.replace('admin.sharegoodsmall', 'h5.sharegoodsmall');
        const index = first.indexOf('#');
        first = first.substring(0, index);
    }
    const second = 'product/99/' + code;
    return first + second;
};
/**
 * 导出请求参数
 * @param params 参数
 * @returns {string | *} 参数值
 */
const setRequestParams = (params) => {
    return Object.keys(params).map((key) => {
        return key+'='+params[key]
    }).join('&')
    // var arr=[];
    // for(var i in params){
    //   arr.push(i+'='+params[i]);
    // }
    // return arr.join('&');
};

export default {
    encryptData,
    cleanFormData,
    handleCity,
    handleCityIndex,
    formatTime,
    setParam,
    getParam,
    getSrc,
    setRequestParams
};
