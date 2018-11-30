export default [{
    title: '系统首页',
    name: 'dashboard',
    children: [
        {
            title: '数据类模块',
            name: 'dashboard.data1',
            children: []
        },
        {
            title: '快捷操作模块',
            name: 'dashboard.data',
            children: [
                {
                    title: '发布产品',
                    name: 'dashboard.shortcut.fbcp'
                },
                {
                    title: '发布礼包',
                    name: 'dashboard.shortcut.fblb'
                },
                {
                    title: '会员邀请',
                    name: 'dashboard.shortcut.hyyq'
                },
                {
                    title: '实名认证查看',
                    name: 'dashboard.shortcut.smrzck'
                },
                {
                    title: '防伪码查询',
                    name: 'dashboard.shortcut.fwmcx'
                },
                {
                    title: '推荐位管理',
                    name: 'dashboard.shortcut.tjwgl'
                },
                {
                    title: '创建管理员账号',
                    name: 'dashboard.shortcut.cjglyzh'
                },
                {
                    title: '会员搜索',
                    name: 'dashboard.shortcut.hyss'
                },
                {
                    title: '添加供应商',
                    name: 'dashboard.shortcut.tjgys'
                },
                {
                    title: '广告位管理',
                    name: 'dashboard.shortcut.ggwgl'
                },
                {
                    title: '敏感词库管理',
                    name: 'dashboard.shortcut.mgckgl'
                },
                {
                    title: '账户充值',
                    name: 'dashboard.shortcut.zhcz'
                }
            ]
        }
    ]
},
{
    title: '会员管理',
    name: 'vip',
    children: [{
        title: '会员层级管理',
        name: 'vip.levelManage',
        children: [
            {
                title: '晋升设置',
                name: 'vip.levelManage.jssz'
            },
            {
                title: '降级设置',
                name: 'vip.levelManage.jjsz'
            },
            {
                title: '编辑',
                name: 'vip.levelManage.bj'
            },
            {
                title: '层级信息',
                name: 'vip.levelManage.cjxx'
            }]
    }]
}];
