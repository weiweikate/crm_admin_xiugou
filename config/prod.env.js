'use strict';
const ut = require('../src/utils/index.js');
const v = ut.formatTime(new Date());
module.exports = {
    NODE_ENV: '"production"',
    EVN_CONFIG: '"prod"',
    API_ROOT: '""',
    version: JSON.stringify(v)
};
