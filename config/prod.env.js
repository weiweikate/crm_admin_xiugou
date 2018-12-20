'use strict';
const utils = require('../build/utils');
const v = utils.formatTime(new Date());
module.exports = {
    NODE_ENV: '"production"',
    EVN_CONFIG: '"prod"',
    API_ROOT: '""',
    version: JSON.stringify(v)
};
