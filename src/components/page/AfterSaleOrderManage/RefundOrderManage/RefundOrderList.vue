<template>
    <div class="order-list">
        <v-breadcrumb :nav='nav'></v-breadcrumb>
        <el-card class="query-panue" :body-style="{ padding: '20px 20px'}">
            <el-form :model="form" ref="form" inline label-width="120px">
                <el-form-item prop="dateRange" label="创建时间">
                    <el-date-picker
                        v-model="dateRange"
                        type="datetimerange"
                        format="yyyy-MM-dd"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item prop="userPhone" label="用户账号">
                    <el-input v-model="form.userPhone" placeholder="请输入用户账号"></el-input>
                </el-form-item>
                <el-form-item prop="refundNo" label="退款单号">
                    <el-input v-model="form.refundNo" placeholder="请输入退款单号"></el-input>
                </el-form-item>
                <el-form-item prop="serviceNo" label="售后单号">
                    <el-input v-model="form.serviceNo" placeholder="请输入售后单号"></el-input>
                </el-form-item>
                <el-form-item prop="warehouseOrderNo" label="仓库订单号">
                    <el-input v-model="form.warehouseOrderNo" placeholder="请输入仓库订单号"></el-input>
                </el-form-item>
                <el-form-item label=" ">
                    <el-button type="primary" @click="getList(1)">查询</el-button>
                    <el-button @click="resetForm('form')">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card style='margin-top:20px;minHeight:90vh;' :body-style="{ padding: '20px 50px' }">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="全部" name="all">
                    <v-orderlist ref="all"></v-orderlist>
                </el-tab-pane>
                <el-tab-pane label="等待退款" name="1">
                    <v-orderlist ref="1"></v-orderlist>
                </el-tab-pane>
                <el-tab-pane label="退款成功" name="2">
                    <v-orderlist ref="2"></v-orderlist>
                </el-tab-pane>
                <el-tab-pane label="退款关闭" name="5">
                    <v-orderlist ref="5"></v-orderlist>
                </el-tab-pane>
                <el-tab-pane label="退款失败" name="3">
                    <v-orderlist ref="3"></v-orderlist>
                </el-tab-pane>
            </el-tabs>
        </el-card>
    </div>
</template>

<script>
import vBreadcrumb from '@/components/common/Breadcrumb.vue';
import moment from 'moment';
import { myMixinTable } from '@/JS/commom';
import vOrderlist from './_orderList/_orderList';

export default {
    components: {
        vBreadcrumb,
        vOrderlist
    },

    mixins: [myMixinTable],

    data() {
        return {
            nav: ['订单管理', '售后管理', '退款单列表'],
            activeName: 'all',
            dateRange: [],
            form: {
                userPhone: '', // 用户账号
                refundNo: '', // 退款单号
                serviceNo: '', // 售后单号
                warehouseOrderNo: '' // 仓库订单号
            }
        };
    },

    activated() {
        this.handleClick({ name: 'all' });
    },

    methods: {
        // 提交表单
        getList() {
            const data = {};
            Object.assign(data, this.form);
            data.createStartTime = this.dateRange.length != 0 ? moment(this.dateRange[0]).format('YYYY-MM-DD 00:00:00') : '';
            data.createEndTime = this.dateRange.length != 0 ? moment(this.dateRange[1]).format('YYYY-MM-DD 23:59:59') : '';
            data.status = this.activeName === 'all' ? '' : this.activeName;
            this.$refs[this.activeName].page.currentPage = 1;
            this.$refs[this.activeName].data = data;
            this.$refs[this.activeName].getList();
        },
        //  重置表单
        resetForm(formName) {
            this.$refs[formName].resetFields();
            this.dateRange = [];
            this.getList({ name: 'all' });
        },
        //  点击tab选项卡
        handleClick(tab) {
            this.resetForm('form');
            this.activeName = tab.name;
            this.getList();
        }
    }
};
</script>
<style lang='less'>
.order-list {
  .el-tabs__active-bar {
    background-color: #ff1e30;
  }
  .el-tabs__item.is-active,
  .el-tabs__item:hover {
    color: #ff1e30;
  }
  .query-panue {
    .el-input--small .el-input__inner,
    .el-input--small {
      width: 220px;
    }
  }
  .btn-group {
    margin-bottom: 10px;
  }
}
</style>
