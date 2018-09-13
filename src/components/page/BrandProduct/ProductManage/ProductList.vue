<template>
    <div class="product-list">
        <v-breadcrumb :nav='nav'></v-breadcrumb>
        <el-card :body-style="{ padding: '30px 45px',minHeight:'80vh' }">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="全部产品" name="allProduct">
                    <v-tab-content v-if="activeName == 'allProduct'" :name='activeName'></v-tab-content>
                </el-tab-pane>
                <el-tab-pane label="上架产品" name="upProduct">
                    <v-tab-content v-if="activeName == 'upProduct'" :name='activeName'></v-tab-content>
                </el-tab-pane>
                <el-tab-pane label="下架产品" name="downProduct">
                    <v-tab-content v-if="activeName == 'downProduct'" :name='activeName'></v-tab-content>
                </el-tab-pane>
                <el-tab-pane label="审核产品" name="auditProduct">
                    <v-tab-content v-if="activeName == 'auditProduct'" :name='activeName'></v-tab-content>
                </el-tab-pane>
                <!--<el-tab-pane label="推荐产品" name="auditProduct">-->
                    <!--<v-tab-content v-if="activeName == 'auditProduct'" :name='activeName'></v-tab-content>-->
                <!--</el-tab-pane>-->
                <!-- <el-tab-pane label="待修改产品" name="modifyProduct"><v-tab-content v-if="activeName == 'modifyProduct'" :name='activeName'></v-tab-content></el-tab-pane> -->
            </el-tabs>
        </el-card>

    </div>
</template>

<script>
    import vBreadcrumb from '@/components/common/Breadcrumb.vue';
    import vTabContent from './productList/_tabContent';

    export default {
        components: {
            vBreadcrumb,
            vTabContent
        },

        data() {
            return {
                nav: ['品牌产品管理', '产品管理'],
                activeName: 'allProduct'
            };
        },
        activated() {
            this.flag = this.$route.query.flag || sessionStorage.getItem('flag');
            if (this.flag) {
                this.activeName = 'upProduct';
            } else {
                this.activeName = 'allProduct';
            }
        },
        beforeRouteLeave(to, from, next) {
            sessionStorage.removeItem('flag');
            next();
        },
        methods: {
            handleClick(tab) {
                this.tabName = tab.name;
            }
        }
    };
</script>
<style lang='less'>
    .product-list {
        .el-tabs__active-bar {
            background-color: #ff1e30;
        }
        .el-tabs__item.is-active,
        .el-tabs__item:hover {
            color: #ff1e30;
        }
    }
</style>
