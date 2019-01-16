<template>
    <div class="coupon-replacement-info" v-loading="loading">
        <v-breadcrumb :nav='nav'></v-breadcrumb>
        <el-card class="mt10">
            <div slot="header">
                <span>发放记录</span>
            </div>
            <p class="record">
                <span>操作人：王佳丽</span>
                <span>操作时间：2018-12-23 12:23:00</span>
                <span>审核状态：<el-tag type="danger">已审核</el-tag></span>
                <span>发放方式：条件发放</span>
                <span>发放人数：50人</span>
                <span>发放秀豆：500枚</span>
            </p>
            <p class="record">
                备注：/
            </p>
            <p class="record">
                <span>审核人：李佳丽</span>
                <span>审核时间：2018-12-23 12:23:00</span>
                <span>审核说明：/</span>
            </p>
        </el-card>
        <el-card class="mt10">
            <div slot="header">
                <span>发放条件</span>
            </div>
            <p class="record">
                <span>发放层级：V0,V1</span>
            </p>
            <p class="record">
                <span>注册时间：2018-09-10 12:00:00 到 2018-09-10 12:00:00</span>
            </p>
        </el-card>
        <el-card class="mt10">
            <div slot="header">
                <span>发放人数统计</span>
            </div>
            <p class="record">
                <span class="tip">发放失败人数：<el-tag type="danger">23人</el-tag></span>
            </p>
            <p class="record">
                <span class="tip">发放成功人数：<el-tag type="danger">23人</el-tag></span>
            </p>
            <el-button class="mt10" type="primary" @click="$router.push('beanReplacement')">返回列表</el-button>
        </el-card>
    </div>
</template>

<script>
    import vBreadcrumb from '@/components/common/Breadcrumb.vue';
    import request from '@/http/http.js';
    export default {
        components: { vBreadcrumb },
        data() {
            return {
                nav: ['运营管理', '营销工具管理', '秀豆发放列表', '详情'],
                loading: false,
                id: ''
            };
        },
        mounted() {
            this.id = this.$route.query.replacementCouponId;
            console.log(this.id);
        }
    };
</script>

<style lang="less" scoped>
.coupon-replacement-info{
    .record {
        font-size: 14px;
        &:not(:first-child){
            margin-top: 20px;
        }
        span{
            margin-right: 30px;
        }
        .tip {
            font-weight: 900;
        }
    }
}
</style>
