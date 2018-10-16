const deploy = require('./deploy');
const path = require('path');
const argv = require('yargs').argv;
const dist = argv.dist; // 本地上传目录
const remoteDir = argv.server || '/ftp/ops/nginx1/dist'; // 服务器目录
const releaseDir = path.join(__dirname, '..', dist || 'dist');

deploy.upload({
    host: '172.16.10.253',
    username: 'root',
    password: 'dDuo$n$',
    path: releaseDir,
    remoteDir: remoteDir
});
