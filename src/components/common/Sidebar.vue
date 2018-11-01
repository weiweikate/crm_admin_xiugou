<template>
    <div class="sidebar">
        <div v-if="isShowLogo" class="search-area">
            <img class="logo-img" src="../../assets/images/logo.png" alt=""/>
        </div>
        <el-menu :unique-opened='true' class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse"
                 background-color="#222d32"
                 text-color="#b1b1b1" active-text-color="#fff" router>
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <icon :ico="item.icon"></icon>
                            <span style="margin-left:6px" slot="title">{{ item.title }}</span>
                            <!-- <i :class="item.icon"></i><span slot="title">{{ item.title }}</span> -->
                        </template>
                        <el-menu-item v-for="(subItem,i) in item.subs" :key="i" :index="subItem.index">
                            {{ subItem.title }}
                        </el-menu-item>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <icon :ico="item.icon"></icon>
                        <span style="margin-left:6px" slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
    import bus from '../common/bus';
    import icon from './ico';

    export default {
        components: {
            icon
        },
        data() {
            return {
                collapse: false,
                isShowLogo: true,
                items: [
                    {
                        icon: 'icon-shouye',
                        index: 'dashboard',
                        title: '系统首页'
                    },
                    // {
                    //     icon: 'icon-shouquanfuwu',
                    //     index: '1',
                    //     title: '授权管理',
                    //     subs: [
                    //         // {
                    //         //     index: "channelItemManage",
                    //         //     title: "渠道类目管理"
                    //         // }
                    //         // {
                    //         //   index: "certificateUse",
                    //         //   title: "授权证书模板"
                    //         // },
                    //         // {
                    //         //   index: "contractReview",
                    //         //   title: "续约审核"
                    //         // }
                    //     ]
                    // },
                    {
                        icon: 'icon-huiyuanzhanghaoguanli',
                        index: '7',
                        title: '会员管理',
                        subs: [
                            {
                                index: 'levelManage',
                                title: '会员层级管理'
                            },
                            {
                                index: 'joinManage',
                                title: '会员邀请管理'
                            },
                            {
                                index: 'memberManage',
                                title: '会员管理'
                            },
                            // {
                            //     index: "accountRecharge",
                            //     title: "账户充值"
                            // },
                            {
                                index: 'realNameAuthentication',
                                title: '实名认证记录'
                            },
                            {
                                index: 'supplierManage',
                                title: '供应商管理'
                            }
                            // {
                            //     index: "activityParams",
                            //     title: "活跃度参数设置"
                            // }
                        ]
                    },
                    {
                        icon: 'icon-fenlei',
                        index: '5',
                        title: '品牌产品管理',
                        subs: [
                            {
                                index: 'brandProductClassify',
                                title: '产品品类分类管理'
                            },
                            {
                                index: 'brandManage',
                                title: '品牌管理'
                            },
                            {
                                index: 'productList',
                                title: '产品管理'
                            },
                            {
                                index: 'shippingTemplate',
                                title: '运费模板'
                            },
                            {
                                index: 'giftManage',
                                title: '产品礼包管理'
                            }
                        ]
                    },
                    {
                        icon: 'icon-dianpu',
                        index: '6',
                        title: '拼店管理',
                        subs: [
                            {
                                index: 'shopLevelSet',
                                title: '店铺等级设置'
                            },
                            {
                                index: 'shopList',
                                title: '店铺管理'
                            },
                            {
                                index: 'recruitShopManage',
                                title: '招募店铺管理'
                            },
                            {
                                index: 'reportSpellShop',
                                title: '拼店店铺举报'
                            }
                        ]
                    },
                    {
                        icon: 'icon-dingdan',
                        index: '3',
                        title: '订单管理',
                        subs: [
                            {
                                index: 'orderList',
                                title: '订单管理'
                            },
                            {
                                index: 'giftOrderList',
                                title: '礼包订单'
                            }
                        ]
                    },
                    // {
                    //     icon: 'icon-suyuan',
                    //     index: '4',
                    //     title: '溯源管理',
                    //     subs: [
                    //         // {
                    //         //     index: "rootsCodeMange",
                    //         //     title: "溯源防伪码管理"
                    //         // },
                    //         // {
                    //         //     index: "rootsCodeParams",
                    //         //     title: "防伪码参数设置"
                    //         // },
                    //         // {
                    //         //     index: "rootsCodeQuery",
                    //         //     title: "防伪码查询"
                    //         // },
                    //         // {
                    //         //     index: "rootsCodeTpl",
                    //         //     title: "防伪码模板"
                    //         // }
                    //     ]
                    // },
                    {
                        icon: 'icon-huiyuanzhanghaoguanli',
                        index: '8',
                        title: '服务管理',
                        subs: [
                            {
                                index: 'feedBack',
                                title: '问题反馈'
                            }
                        ]
                    },
                    {
                        icon: 'icon-yunying',
                        index: '9',
                        title: '运营管理',
                        subs: [
                            {
                                index: 'showHome',
                                title: '发现管理'
                            },
                            {
                                index: 'discountCoupon',
                                title: '优惠券设置'
                            },
                            {
                                index: 'noticeInformManage',
                                title: '公告/通知管理'
                            },
                            {
                                index: 'topicManage',
                                title: '专题管理'
                            },
                            {
                                index: 'sensitiveLibrary',
                                title: '敏感词库'
                            },
                            {
                                index: 'advertisingManage',
                                title: '广告位管理'
                            },
                            {
                                index: 'keyWords',
                                title: '热门搜索关键词'
                            },
                            {
                                index: 'allKeyWords',
                                title: '搜索关键词看板'
                            },
                            {
                                index: 'helpCenter',
                                title: '帮助中心管理'
                            },
                            {
                                index: 'labelManage',
                                title: '标签管理'
                            },
                            {
                                index: 'signInManage',
                                title: '签到管理'
                            },
                            {
                                index: 'promotionOrderManage',
                                title: '推广订单管理'
                            },
                            // {
                            //     index: "baseParamsSet",
                            //     title: "交易基础参数设置"
                            // },
                            // {
                            //     index: "featured",
                            //     title: "推荐位管理"
                            // },
                            // {
                            //     index: "deliveryAddress",
                            //     title: "提货地址设置"
                            // },
                            {
                                index: 'marketToolsManage',
                                title: '营销工具管理'
                            }
                        ]
                    },
                    {
                        icon: 'icon-shezhi',
                        index: '2',
                        title: '结算管理',
                        subs: [
                            {
                                index: 'withdrawalAudit',
                                title: '提现申请审核'
                            },
                            {
                                index: 'refundMange',
                                title: '退款记录'
                            },
                            {
                                index: 'returnGoodsMange',
                                title: '退货记录'
                            },
                            {
                                index: 'exchangeMange',
                                title: '换货记录'
                            },
                            {
                                index: 'supplierSettMange',
                                title: '供应商结算管理'
                            },
                            {
                                index: 'depositPayment',
                                title: '保证金缴纳记录'
                            },
                            {
                                index: 'cloudWarHouseMange',
                                title: '云仓结算管理'
                            },
                            {
                                index: 'flatAccountInfo',
                                title: '平台账户收入明细'
                            },
                            {
                                index: 'soFar',
                                title: '收益金比例设置'
                            },
                            {
                                index: 'profitDistrMange',
                                title: '利润分配设置'
                            }
                        ]
                    },
                    {
                        icon: 'icon-huiyuanzhanghaoguanli',
                        index: '11',
                        title: '基础参数设置',
                        subs: [
                            {
                                index: 'baseParamsSet',
                                title: '交易基础参数设置'
                            },
                            {
                                index: 'groupBaseParamsSet',
                                title: '拼店基础参数设置'
                            },
                            {
                                index: 'backAddress',
                                title: '寄回地址管理'
                            },
                            {
                                index: 'currencyRatio',
                                title: '货币比例设置'
                            },
                            {
                                index: 'stockMsg',
                                title: '库存消息提醒设置'
                            },
                            {
                                index: 'withdrawalCharge',
                                title: '提现设置'
                            },
                            {
                                index: 'userAssociatedParam',
                                title: '用户关联参数设置'
                            }
                        ]
                    },
                    {
                        icon: 'icon-suyuan',
                        index: '12',
                        title: '秀值模块',
                        subs: [
                            {
                                index: 'taskHome',
                                title: '现金分享任务管理'
                            },
                            {
                                index: 'showValueList',
                                title: '秀值分配设置'
                            },
                            {
                                index: 'showValueParamSet',
                                title: '秀值参数设置'
                            },
                            {
                                index: 'showValReCharge',
                                title: '秀值账户充值'
                            }
                        ]
                    },
                    {
                        icon: 'icon-shezhi',
                        index: '10',
                        title: '权限管理',
                        subs: [
                            // {
                            //     index: "organizeMange",
                            //     title: "组织结构管理"
                            // },
                            {
                                index: 'manageList',
                                title: '管理员账号管理'
                            },
                            // {
                            //     index: "setPermission",
                            //     title: "权限设置"
                            // },
                            {
                                index: 'versionIteration',
                                title: '版本迭代管理'
                            }
                            // {
                            //     index: "dataDictionary",
                            //     title: "数据字典"
                            // }
                        ]
                    },
                    {
                        icon: 'icon-shezhi',
                        index: '21',
                        title: '云仓仓库管理',
                        subs: [
                            {
                                index: 'repertoryList',
                                title: '仓库管理'
                            },
                            {
                                index: 'repertoryData',
                                title: '仓库数据同步'
                            },
                            {
                                index: 'repertoryReport',
                                title: '仓库单'
                            }
                        ]
                    }
                ]
            };
        },
        computed: {
            onRoutes() {
                return this.$route.path.replace('/', '');
            }
        },
        created() {
            // 通过 Event Bus 进行组件间通信，来折叠侧边栏
            bus.$on('collapse', msg => {
                this.collapse = msg;
                this.isShowLogo = !msg;
            });
        }
    };
</script>

<style lang='less'>
.sidebar {
    display: block;
    position: absolute;
    width: 220px;
    left: 0;
    top: 70px;
    bottom: 0;
    background-color: #222d32;
    overflow-y: scroll;
    .el-submenu__title {
        font-size: 16px;
    }
    .el-menu-item {
        font-size: 16px;
    }
    .el-menu-item .is-active,
    .el-submenu .is-active {
        border-left: 5px solid #ff1e30;
        background-color: rgba(255, 255, 255, 0.2) !important;
    }
    .el-menu-item:hover {
        color: white !important;
        background-color: rgba(255, 255, 255, 0.2) !important;
    }
    .search-area {
        height: 150px;
        text-align: center;
        .logo-img {
            width: 128px;
            height: 128px;
            margin-top: 15px;
            border-radius: 64px;
            background-color: white;
        }
    }
}

.sidebar-el-menu:not(.el-menu--collapse) {
    width: 200px;
}

.sidebar > ul {
    height: 100%;
}
</style>
