/*
* 参数说明：
* number：要格式化的数字
* places：保留几位小数
* symbol：前缀
* thousand：千分位符号
* decimal：小数点
* */
function formatMoney(number, places, symbol, thousand, decimal) {
    if (number === null || number === undefined) return '-';
    number = number || 0;
    places = !isNaN(places = Math.abs(places)) ? places : 2;
    symbol = symbol !== undefined ? symbol : '￥';
    thousand = thousand || ',';
    decimal = decimal || '.';
    var negative = number < 0 ? '-' : '';

    var i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + '';

    var j = (j = i.length) > 3 ? j % 3 : 0;
    return symbol + negative + (j ? i.substr(0, j) + thousand : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousand) + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : '');
}

export { formatMoney };
