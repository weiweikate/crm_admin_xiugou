const AUTH = require('./auth.json');
const AUTH_MAP = {}, OriginRoutes = [];

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
    AUTH_MAP[item.name] = item;
    if (item.router || item.name.indexOf('.') === -1) {
        OriginRoutes.push(item.router || item.name);
    }
});

function getAuthRoutes(auth) {
    var result = [];
    for (var i = 0; i < auth.length; i++) {
        var name = auth[i];
        var item = AUTH_MAP[name];
        if (item.router || item.name.indexOf('.') === -1) {
            result.push(item.router || item.name);
        }
    }
    //console.log(99, result);
    return result;
}

function getNoAuthRoutes(authRoutes) {
    var result = [];
    for (var i = 0; i < OriginRoutes.length; i++) {
        var name = OriginRoutes[i];
        if (!authRoutes.includes(name)) {
            result.push(name);
        }
    }
    return result;
}

export {
    AUTH_MAP,
    traverseTree,
    getNoAuthRoutes,
    getAuthRoutes
};
