### 秀购后台管理系统说明文档
```$xslt
账号：18458866522
密码：dnl2018
```
#### 线上开发
```
在config目录下，可以修改index.js文件，来改变后端服务地址和端口号。
```
#### 打包上线
```
打包上线分为测试环境和正式环境：
测试环境：npm run build:test 其对应的服务地址在config/test.env.js配置
正式环境：npm run build:prod 其对应的服务地址在config/prod.env.js配置
开发环境：npm run build:dev 其对应的服务地址在config/dev.env.js配置
```

发布到测试环境
```bash
npm run build:test
npm run deploy:test
```

发布到开发环境
```bash
npm run build:dev
npm run deploy:dev
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

## 访问
开发地址： [http://devadmin.sharegoodsmall.com/](http://devadmin.sharegoodsmall.com/)
测试地址： [http://testadmin.sharegoodsmall.com](http://testadmin.sharegoodsmall.com)



## 本地服务
请在config.js配置需要代理的服务器地址
[http://localhost:8989](http://localhost:8989)

```bash
npm run server
```

> 
