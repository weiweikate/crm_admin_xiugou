<template>
    <div class="promotionManage-list">
        <v-breadcrumb :nav='nav'></v-breadcrumb>
        <el-card class="query-panue" :body-style="{ padding: '20px 20px'}">
            <el-form :model="form" ref="form" inline label-width="120px">
                <el-form-item prop="nickname" label="推广人">
                    <el-input v-model="form.nickname" placeholder="请输入推广人"></el-input>
                </el-form-item>
                <el-form-item prop="dateRange" label="推广时间">
                    <el-date-picker
                        v-model="dateRange"
                        type="datetimerange"
                        format="yyyy-MM-dd"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item prop="packageName" label="套餐名称">
                    <el-input v-model="form.packageName" placeholder="请输入套餐"></el-input>
                </el-form-item>

                <el-form-item label=" ">
                    <el-button type="primary" @click="getList">查询</el-button>
                    <el-button @click="resetForm('form')">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card :body-style="{ padding: '20px 50px'}" style="margin-top: 20px">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="全部" name="all">
                    <v-tab-content ref="all"></v-tab-content>
                </el-tab-pane>
                <el-tab-pane label="正常" name="1">
                    <v-tab-content ref="1"></v-tab-content>
                </el-tab-pane>
                <el-tab-pane label="取消" name="3">
                    <v-tab-content ref="3"></v-tab-content>
                </el-tab-pane>
                <el-tab-pane label="结束" name="2">
                    <v-tab-content ref="2"></v-tab-content>
                </el-tab-pane>
            </el-tabs>
        </el-card>

    </div>
</template>

<script>
    import vBreadcrumb from '@/components/common/Breadcrumb.vue';
    import vTabContent from './PromotionOrderList/_tabContent';
    import moment from 'moment';
    import { myMixinTable } from '@/JS/commom';

    export default {
        components: {
            vBreadcrumb,
            vTabContent
        },
        mixins: [myMixinTable],

        data() {
            return {
                nav: ['运营管理', '推广订单管理', '推广订单查看'],
                activeName: 'all',
                form: {
                    nickname: '',
                    packageName: ''
                },
                dateRange: [],
                promotionOrderId: ''
            };
        },
        activated() {
            this.promotionOrderId = this.$route.query.promotionOrderId || sessionStorage.getItem('promotionOrderId');
            this.handleClick({ name: 'all' });
        },
        methods: {
            // 提交表单
            getList() {
                const data = {};
                Object.assign(data, this.form);
                data.startTime = this.dateRange.length != 0 ? moment(this.dateRange[0]).format('YYYY-MM-DD 00:00:00') : '';
                data.endTime = this.dateRange.length != 0 ? moment(this.dateRange[1]).format('YYYY-MM-DD 23:59:59') : '';
                data.status = this.activeName === 'all' ? '' : this.activeName;
                data.packageId = this.promotionOrderId;
                this.$refs[this.activeName].data = data;
                this.$refs[this.activeName].getList();
            },
            handleClick(tab) {
                this.activeName = tab.name;
                this.getList();
            },
            //  重置表单
            resetForm(formName) {
                this.$refs[formName].resetFields();
                this.dateRange = [];
                this.getList({ name: 'all' });
            }
        }
    };
</script>
<style lang='less'>
    .promotionManage-list {
        .el-tabs__active-bar {
            background-color: #ff1e30;
        }
        .el-tabs__item.is-active,
        .el-tabs__item:hover {
            color: #ff1e30;
        }
    }
</style>
