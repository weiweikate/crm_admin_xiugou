<template>
    <div class="sidebar">
        <div v-if="isShowLogo" class="search-area">
            <img class="logo-img" src="../../assets/images/logo.png" alt=""/>
        </div>
        <el-menu :unique-opened='true' class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse"
                 background-color="#222d32"
                 text-color="#b1b1b1" active-text-color="#fff" router>
            <template v-for="item in permission_routers">
                <template v-if="!item.hidden">
                    <template v-if="item.children && item.children.length>1">
                        <el-submenu :index="item.name" :key="item.name">
                            <template slot="title">
                                <icon :ico="item.meta.icon"></icon>
                                <span style="margin-left:6px" slot="title">{{ item.meta.title }}</span>
                                <!-- <i :class="item.icon"></i><span slot="title">{{ item.title }}</span> -->
                            </template>
                            <el-menu-item v-for="(subItem,i) in item.children" :key="subItem.name" :index="subItem.name" v-if="!subItem.hidden">
                                {{ subItem.meta.title }}
                            </el-menu-item>
                        </el-submenu>
                    </template>
                    <template v-else-if="item.children && item.children.length === 1">
                        <el-menu-item :index="item.name" :key="item.name" v-if="!item.hidden">
                            <icon :ico="item.meta.icon"></icon>
                            <span style="margin-left:6px" slot="title">{{ item.meta.title }}</span>
                        </el-menu-item>
                    </template>
                    <template v-else>
                        <el-menu-item :index="item.name" :key="item.name" v-if="!item.hidden">
                            <icon :ico="item.meta.icon"></icon>
                            <span style="margin-left:6px" slot="title">{{ item.meta.title }}</span>
                        </el-menu-item>
                    </template>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
    import bus from '../common/bus';
    import icon from './ico';
    import { mapGetters } from 'vuex';

    export default {
        components: {
            icon
        },
        data() {
            return {
                collapse: false,
                isShowLogo: true,
                items: [
                ]
            };
        },
        computed: {
            ...mapGetters([
                'permission_routers',
                'sidebar'
            ]),
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
            this.addRoutes();

        },
        methods: {
            // 判断手机号是否有权限获取侧边栏
            addRoutes() {
                //TODO
                const phoneArr = ['18258147420', '15869000373', '13735533492', '17601056863', '18667159736'];
                const phone = localStorage.getItem('ms_userPhone') || '';
                const siderArr = [{
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
                }, {
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
                }];
                if (phoneArr.includes(phone)) {
                    this.items.push(...siderArr);
                }
            }
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
        width: 200px;
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
