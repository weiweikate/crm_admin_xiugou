### 秀购后台管理系统说明文档
#### 线上开发
```
在config目录下，可以修改index.js文件，来改变后端服务地址和端口号。
```
#### 打包上线
```
打包上线分为测试环境和正式环境：
测试环境：npm run build:test 其对应的服务地址在config/test.env.js配置
正式环境：npm run build:prod 其对应的服务地址在config/prod.env.js配置
```
#### 请求方式
```
接口地址：/admin/demo
post请求：
export const demo = ['/admin/demo', { methods: 'post' }];
或者：
export const demo = '/admin/demo'
get请求：
export const demo = ['/admin/demo', { methods: 'get' }];
调用方式：
request.demo(参数).then(res=>{}).catch(err=>{})
```
