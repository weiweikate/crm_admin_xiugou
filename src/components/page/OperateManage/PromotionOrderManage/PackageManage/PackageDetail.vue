<template>
    <div class="promotion-info">
        <v-breadcrumb :nav='nav'></v-breadcrumb>
        <el-card :body-style="{ padding: '20px 45px',color:'#666' }">
            <el-form label-width="110px">
                <el-form-item label="套餐名称">
                    <span>{{detail.name}}</span>
                </el-form-item>
                <el-form-item label="套餐单红包金额">
                    <span>¥{{detail.price}}</span>
                </el-form-item>
                <el-form-item label="红包数">
                    <span>{{detail.count}}份</span>
                </el-form-item>
                <el-form-item label="套餐金额">
                    <span>¥{{detail.total}}</span>
                </el-form-item>
                <el-form-item label="推广周期">
                    <span>{{detail.cycle}}天</span>
                </el-form-item>
                <el-form-item label="可购买数">
                    <span>{{detail.remain}}份</span>
                </el-form-item>
                <el-button @click="backToList" type="primary">返回</el-button>
            </el-form>
        </el-card>
    </div>
</template>

<script>
    import vBreadcrumb from '@/components/common/Breadcrumb.vue';
    import icon from '@/components/common/ico';
    import request from '@/http/http.js';
    import { myMixinTable } from '@/JS/commom';

    export default {
        components: {
            vBreadcrumb,
            icon
        },
        mixins: [myMixinTable],
        data() {
            return {
                nav: ['运营管理', '推广订单管理', '套餐管理', '套餐详情'],
                detail: {}
            };
        },

        activated() {
            this.id = this.$route.query.packageDetailId || sessionStorage.getItem('packageDetailId');
            this.getDetail();
        },

        methods: {
            // 返回列表
            backToList() {
                this.$router.push('/packageManage');
            },
            // 详情
            getDetail() {
                const data = {
                    id: this.id
                };
                request.findPromotionPackageDetailsById(data).then(res => {
                    this.detail = res.data;
                }).catch(err => {
                    this.btnLoading = false;
                });
            }
        }
    };
</script>
<style lang='less'>

</style>
