import AUTH from './auth.json';

const AUTH_MAP = {}, OriginRoutes = [], MAP = {};

function traverseTree(list, callback) {
    if (!list || list.length === 0) return list;
    for (var i = 0; i < list.length; i++) {
        var item = list[i];
        callback && callback(item);
        if (item.children) {
            traverseTree(item.children, callback);
        }
    }
}

traverseTree(AUTH, function (item) {
    let router = item.name.indexOf('.') === -1 ? item.name : item.router || '';
    MAP[item.name] = router;
    AUTH_MAP[item.name] = item;
    if (item.router || item.name.indexOf('.') === -1) {
        OriginRoutes.push(item.router || item.name);
    }
});

function getAdminRoutes(list) {
    let result = [];

    traverseTree(list, function (item) {
        if (item.meta && item.meta.roles && item.meta.roles.indexOf('admin') > -1) {
            result.push(item.name);
        }
    });
    return result;
}

function getNoAuthRoutes(auth) {
    var result = [];
    for (var i = 0; i < auth.length; i++) {
        var name = auth[i];
        if (MAP[name]) {
            delete MAP[name];
        }
    }
    for (var key in MAP) {
        MAP[key] && (result.push(MAP[key]));
    }
    console.log('getNoAuthRoutes', result);
    return result;
}

export {
    AUTH_MAP,
    traverseTree,
    getNoAuthRoutes,
    getAdminRoutes
};
