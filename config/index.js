'use strict';

const path = require('path');
// const baseURL = 'http://172.16.10.42';
// const baseURL = 'http://172.16.10.88';
// const baseURL = 'http://172.16.10.100';
// const baseURL = 'http://172.16.10.41';
// const baseURL = 'http://172.16.10.111';
const baseURL = 'http://172.16.10.12';
// const baseURL = 'http://172.16.10.19';
// const baseURL = 'http://172.16.10.29';
// const baseURL = 'http://testadmin.sharegoodsmall.com';
// const baseURL = 'http://devadmin.sharegoodsmall.com';

// 测试地址不需要端口号
const url_1 = baseURL + ':8190';
// const url_1 = baseURL;

module.exports = {
    dev: {
        // Paths
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        proxyTable: {
            '/admin': {
                target: url_1,
                changeOrigin: true,
                pathRewrite: {
                    '^/admin': url_1 + '/admin'
                }
            }
        },
        // Various Dev Server settings

        host: '0.0.0.0', // can be overwritten by process.env.HOST

        port: 8090, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
        autoOpenBrowser: false,
        errorOverlay: true,
        notifyOnErrors: true,
        poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

        /**
         * Source Maps
         */

        // https://webpack.js.org/configuration/devtool/#development
        devtool: 'eval-source-map',

        // If you have problems debugging vue-files in devtools,
        // set this to false - it *may* help
        // https://vue-loader.vuejs.org/en/options.html#cachebusting
        cacheBusting: true,

        // CSS Sourcemaps off by default because relative paths are "buggy"
        // with this option, according to the CSS-Loader README
        // (https://github.com/webpack/css-loader#sourcemaps)
        // In our experience, they generally work as expected,
        // just be aware of this issue when enabling this option.
        cssSourceMap: false
    },

    build: {
        prodEnv: require('./prod.env'),
        testEnv: require('./test.env'),
        devEnv: require('./development.env'),
        // Template for index.html
        index: path.resolve(__dirname, '../dist/index.html'),

        // Paths
        assetsRoot: path.resolve(__dirname, '../dist'),
        assetsSubDirectory: 'static',
        assetsPublicPath: './',

        /**
         * Source Maps
         */

        productionSourceMap: false,
        // https://webpack.js.org/configuration/devtool/#production
        devtool: '#source-map',

        // Gzip off by default as many popular static hosts such as
        // Surge or Netlify already gzip all static assets for you.
        // Before setting to `true`, make sure to:
        // npm install --save-dev compression-webpack-plugin
        productionGzip: false,
        productionGzipExtensions: ['js', 'css'],

        // Run the build command with an extra argument to
        // View the bundle analyzer report after build finishes:
        // `npm run build --report`
        // Set to `true` or `false` to always turn it on or off
        bundleAnalyzerReport: process.env.npm_config_report
    }
};
