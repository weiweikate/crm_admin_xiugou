const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: {
        vendor: ['vue/dist/vue.min.js', 'vue-router', 'babel-polyfill', 'axios', 'echarts', 'element-ui', 'vue-quill-editor', 'v-viewer']
    },
    output: {
        path: path.join(__dirname, '../static'),
        filename: '[name].dll.js',
        library: '[name]_library'
    },
    plugins: [
        new webpack.DllPlugin({
            path: path.join(__dirname, '../dll', '[name]-manifest.json'),
            name: '[name]_library'
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        })
    ]
};
