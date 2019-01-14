# crm_admin_xiugou

秀购后台
=======
### mrnpm包安装方式
```
http://registry.npm.mr.com/#/detail/mrnpm
```
### 秀购后台管理系统说明文档
```$xslt
账号：18458866522
密码：dnl2018
首次拉取项目先运行npm run build:dll将一些不经常更新的插件进行打包
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

# 组件

## Clipboard 复制

```bash
import Clipboard from 'clipboard';

<el-button @click="copy" :data-clipboard-text="modalData.secret" id="copy">复制</el-button>

clipboard.on('success', () => {
    this.$message.success('复制成功');
});
```

#路由与权限

需要权限的路由需要在auth.json里配置  如果不需要权限任何人都能访问的话可以在路由配置中加上`default:true`

``` js
{
    path: '/logistics',
    component: Layout,
    name: 'logistics',
    meta: { title: '物流管理', icon: 'icon-shezhi' },
    default: true,
    children: [
        {
            name: 'logisticsCompanyList',
            path: '/logisticsCompanyList',
            component: resolve => require(['../components/page/Logistics/logisticsCompanyList.vue'], resolve),
            meta: { title: '物流公司列表'}
        }
    ]
}
```
