<template>
    <div class="coupon-list">
        <v-breadcrumb :nav='nav'></v-breadcrumb>
        <el-card :body-style="{ padding: '30px 45px',minHeight:'80vh' }">
            <div class="add-coupon" >
                <el-button @click="addCoupon" type="primary">添加优惠券</el-button>
                <el-button @click="couponTemplate" type="success">优惠券模版</el-button>
            </div>
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="全部券" name="allCoupon">
                    <v-tab-content v-if="activeName == 'allCoupon'" :name='activeName'></v-tab-content>
                </el-tab-pane>
                <el-tab-pane label="未开始" name="notStart">
                    <v-tab-content v-if="activeName == 'notStart'" :name='activeName'></v-tab-content>
                </el-tab-pane>
                <el-tab-pane label="进行中" name="start">
                    <v-tab-content v-if="activeName == 'start'" :name='activeName'></v-tab-content>
                </el-tab-pane>
                <el-tab-pane label="已经结束" name="ended">
                    <v-tab-content v-if="activeName == 'ended'" :name='activeName'></v-tab-content>
                </el-tab-pane>
            </el-tabs>
        </el-card>

    </div>
</template>

<script>
    import vBreadcrumb from '@/components/common/Breadcrumb.vue';
    import vTabContent from './couponList/_tabContent';
    import utils from '@/utils/index.js';

    export default {
        components: {
            vBreadcrumb,
            vTabContent
        },

        data() {
            return {
                nav: ['运营管理', '优惠券设置', '优惠券管理'],
                activeName: 'allCoupon'
            };
        },
        activated() {
            this.activeName = 'allCoupon';
        },
        methods: {
            handleClick(tab) {
                this.tabName = tab.name;
            },
            // 添加优惠券
            addCoupon() {
                this.$router.push({ name: 'addCoupon' });
            },
            // 优惠券模版
            couponTemplate() {
                this.$router.push({ name: 'couponTemplate' });
            }
        }
    };
</script>
<style lang='less'>
    .coupon-list {
        .add-coupon {
            margin: 0 0 20px 0;
            position: absolute;
            right: 87px;
            z-index: 99999;
        }
        .el-tabs__active-bar {
            background-color: #ff1e30;
        }
        .el-tabs__item.is-active,
        .el-tabs__item:hover {
            color: #ff1e30;
        }
    }
</style>
