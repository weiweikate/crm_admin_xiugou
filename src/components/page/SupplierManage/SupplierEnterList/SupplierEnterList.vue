<template>
    <div class="coupon-list">
        <v-breadcrumb :nav='nav'></v-breadcrumb>
        <el-card class="query-panue" :body-style="{ padding: '20px 20px'}">
            <el-form :model="form" ref="form" inline label-width="120px">
                <el-form-item prop="dateRange" label="创建时间">
                    <el-date-picker v-model="dateRange" type="datetimerange" format="yyyy-MM-dd" handled-placeholder="开始日期" end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item prop="merchantName" label="商家名称">
                    <el-input v-model="form.merchantName" placeholder="请输入商家名称"></el-input>
                </el-form-item>
                <el-form-item prop="brandName" label="品牌名称">
                    <el-input v-model="form.brandName" placeholder="请输入品牌名称"></el-input>
                </el-form-item>
                <el-form-item label=" ">
                    <el-button type="primary" @click="getList(1)">查询</el-button>
                    <el-button @click="resetForm('form')">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card :body-style="{ padding: '30px 45px',minHeight:'80vh' }">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="全部" name="all">
                    <v-tab-content v-if="activeName == 'all'" :name='activeName'></v-tab-content>
                </el-tab-pane>
                <el-tab-pane :label="`待处理(${unProcessed})`" name="toHandle">
                    <v-tab-content v-if="activeName == 'toHandle'" :name='activeName'></v-tab-content>
                </el-tab-pane>
                <el-tab-pane label="已处理" name="handled">
                    <v-tab-content v-if="activeName == 'handled'" :name='activeName'></v-tab-content>
                </el-tab-pane>
            </el-tabs>
        </el-card>

    </div>
</template>

<script>
import vBreadcrumb from '@/components/common/Breadcrumb.vue';
import vTabContent from './SupplierEnterList/_tabContent';
import moment from 'moment';
import request from '@/http/http';
import { myMixinTable } from '@/JS/commom';

export default {
    components: {
        vBreadcrumb,
        vTabContent
    },
    mixins: [myMixinTable],

    data() {
        return {
            nav: ['供应商管理', '供应商申请入驻列表'],
            activeName: 'all',
            form: {
                merchantName: '',
                brandName: ''
            },
            dateRange: [],
            unProcessed: '' // 待处理数目
        };
    },
    activated() {
        this.activeName = 'all';
    },
    methods: {
        handleClick(tab) {
            this.tabName = tab.name;
        },
        // 提交表单
        getList() {
            const data = {};
            Object.assign(data, this.form);
            data.start = this.dateRange.length !== 0 ? moment(this.dateRange[0]).format('YYYY-MM-DD') : '';
            data.end = this.dateRange.length !== 0 ? moment(this.dateRange[1]).format('YYYY-MM-DD') : '';
            this.$refs[this.activeName].page.currentPage = 1;
            this.$refs[this.activeName].data = data;
            request.merchantCount().then(res => {
                if (!res.data) return;
                this.unProcessed = res.data.unProcessed;
            }).catch(error => {
                console.log(error);
            });
            this.$refs[this.activeName].getList(this.page.currentPage);
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
