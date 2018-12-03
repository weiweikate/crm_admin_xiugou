<template>
    <div class="product-list">
        <v-breadcrumb :nav='nav'></v-breadcrumb>
        <el-card class="query-panue" :body-style="{ padding: '20px 20px'}">
            <el-form :model="form" ref="form" inline label-width="120px">
                <el-form-item prop="dateRange" label="下单时间">
                    <el-date-picker
                        v-model="dateRange"
                        type="datetimerange"
                        format="yyyy-MM-dd"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item prop="platformNo" label="平台级订单号">
                    <el-input v-model="form.platformNo" placeholder="请输入平台级订单号"></el-input>
                </el-form-item>
                <el-form-item prop="warehouseOrderNo" label="仓库级订单号">
                    <el-input v-model="form.warehouseOrderNo" placeholder="请输入仓库级订单号"></el-input>
                </el-form-item>
                <el-form-item prop="warehouseType" label="发货仓库">
                    <el-select v-model="form.warehouseType" placeholder="请选择">
                        <el-option label="全部" value=""></el-option>
                        <el-option v-for="(v,k) in repertoryArr" :key="k" :label="v.label" :value="v.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="source" label="订单来源">
                    <el-select v-model="form.source" placeholder="请选择">
                        <el-option label="全部" value=""></el-option>
                        <el-option v-for="(v,k) in orderSourceArr" :key="k" :label="v.label" :value="v.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="invoiceRequired" label="开具发票">
                    <el-select v-model="form.invoiceRequired" placeholder="请选择">
                        <el-option label="全部" value=""></el-option>
                      <el-option label="是" value="true"></el-option>
                      <el-option label="否" value="false"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="userPhone" label="用户账号">
                    <el-input v-model="form.userPhone" placeholder="请输入用户账号"></el-input>
                </el-form-item>
                <el-form-item prop="userPhoneName" label="收货人姓名">
                    <el-input v-model="form.userPhoneName" placeholder="请输入收货人姓名"></el-input>
                </el-form-item>
                <el-form-item prop="marker" label="订单标记">
                    <el-select v-model="form.marker" placeholder="请选择">
                        <el-option label="全部" value=""></el-option>
                        <el-option v-for="(v,k) in starArr" :key="k" :label="v.label" :value="v.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="pushStatus" label="推送状态">
                    <el-select v-model="form.pushStatus" placeholder="请选择">
                      <el-option label="全部" value=""></el-option>
                        <el-option v-for="(v,k) in sendStatusArr" :label="v.label" :value="v.value" :key="k"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="lockStatus" label="锁定状态">
                    <el-select v-model="form.lockStatus" placeholder="请选择">
                      <el-option label="全部" value=""></el-option>
                        <el-option v-for="(v,k) in lockStatusArr" :label="v.label" :value="v.value" :key="k"></el-option>
                    </el-select>
                </el-form-item>
                <!--<el-form-item prop="orderStatus" label="订单状态">-->
                    <!--<el-select v-model="form.orderStatus" placeholder="请选择" @change="changeStatus(2)">-->
                        <!--<el-option label="全部" value=""></el-option>-->
                        <!--<el-option v-for="(v,k) in orderStatusArr" :label="v.type" :value="v.id" :key="k">{{v.type}}</el-option>-->
                    <!--</el-select>-->
                <!--</el-form-item>-->
                <el-form-item label=" ">
                    <el-button type="primary" @click="getList(1)">查询</el-button>
                    <el-button @click="resetForm('form')">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card style='margin-top:20px;minHeight:90vh;overflow-x: auto;min-width: 1336px' :body-style="{ padding: '20px 50px' }">
            <div class="btn-group">
                <el-button type="danger" @click="sendOut" v-auth="'order.orderList.yjts'">推送云仓</el-button>
                <a ref="exportData" @click="downloadOrderData">
                    <el-button type="primary">导出</el-button>
                </a>
            </div>
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="全部" name="all">
                    <v-orderlist ref="all"></v-orderlist>
                </el-tab-pane>
                <el-tab-pane label="待付款" name="1">
                    <v-orderlist ref="1"></v-orderlist>
                </el-tab-pane>
                <el-tab-pane label="已付款" name="2">
                    <v-orderlist ref="2"></v-orderlist>
                </el-tab-pane>
                <!--<el-tab-pane label="部分发货" name="6">-->
                    <!--<v-orderlist ref="6"></v-orderlist>-->
                <!--</el-tab-pane>-->
                <el-tab-pane label="已发货" name="3">
                    <v-orderlist ref="3"></v-orderlist>
                </el-tab-pane>
                <el-tab-pane label="交易完成" name="4">
                    <v-orderlist ref="4"></v-orderlist>
                </el-tab-pane>
                <el-tab-pane label="交易关闭" name="5">
                    <v-orderlist ref="5"></v-orderlist>
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
import * as api from '@/api/api.js';

export default {
    components: {
        vBreadcrumb,
        vOrderlist
    },

    mixins: [myMixinTable],

    data() {
        return {
            nav: ['订单管理', '订单管理'],
            activeName: 'all',
            dateRange: [],
            repertoryArr: [// 发货仓库
                { label: '自建仓', value: '1' },
                { label: '加盟仓', value: '2' },
                { label: '供应商仓', value: '3' }
                // { label: '虚拟仓', value: '4' }
            ],
            orderSourceArr: [// 订单来源
                { label: '小程序', value: '1' },
                { label: 'APP', value: '2' },
                { label: '微商城', value: '3' }
            ],
            starArr: [// 订单标记
                { label: '红色标记', value: '1' },
                { label: '蓝色标记', value: '2' },
                { label: '绿色标记', value: '3' },
                { label: '黄色标记', value: '4' },
                { label: '紫色标记', value: '5' }
            ],
            sendStatusArr: [// 推送状态
                { label: '无需推送', value: '1' },
                { label: '等待推送', value: '2' },
                { label: '推送成功', value: '3' },
                { label: '推送失败', value: '4' }
            ],
            lockStatusArr: [// 锁定状态
                { label: '无需锁定', value: '2' },
                { label: '未锁定', value: '0' },
                { label: '已锁定', value: '1' }
            ],
            orderStatusArr: [// 订单状态
                { label: '待付款', value: '1' },
                { label: '已付款', value: '2' },
                { label: '已付款', value: '3' },
                { label: '部分发货', value: '4' },
                { label: '已发货', value: '5' },
                { label: '交易完成', value: '6' },
                { label: '交易关闭', value: '7' }
            ],
            form: {
                platformNo: '', // 平台级订单号
                warehouseOrderNo: '', // 仓库级订单号
                warehouseType: '', // 发货仓库
                source: '', // 订单来源
                invoiceRequired: '', // 开具发票
                userPhone: '', // 用户账号
                userPhoneName: '', // 收货人姓名
                marker: '', // 标记
                pushStatus: '', // 推送状态
                lockStatus: '', // 锁定状态
                orderStatus: ''// 订单状态
            },
            formData: {}
        };
    },

    activated() {
        this.handleClick({ name: 'all' });
    },

    methods: {
        downloadOrderData() {
            const platformNo = this.form.platformNo;
            const warehouseOrderNo = this.form.warehouseOrderNo;
            const warehouseType = this.form.warehouseType;
            const source = this.form.source;
            const invoiceRequired = this.form.invoiceRequired;
            const userPhone = this.form.userPhone;
            const userPhoneName = this.form.userPhoneName;
            const marker = this.form.marker;
            const pushStatus = this.form.pushStatus;
            const lockStatus = this.form.lockStatus;
            const orderStatus = this.form.orderStatus;
            const form = this.dateRange.length != 0 ? moment(this.dateRange[0]).format('YYYY-MM-DD 00:00:00') : '';
            const to = this.dateRange.length != 0 ? moment(this.dateRange[1]).format('YYYY-MM-DD 23:59:59') : '';
            this.downloadOrderList = api.downloadOrderList + '?platformNo=' + platformNo + '&warehouseOrderNo=' + warehouseOrderNo + '&warehouseType=' + warehouseType + '&source=' + source + '&invoiceRequired=' + invoiceRequired + '&userPhone=' + userPhone + '&userPhoneName=' + userPhoneName + '&marker=' + marker + '&pushStatus=' + pushStatus + '&lockStatus=' + lockStatus + '&orderStatus=' + orderStatus + '&form=' + form + '&to=' + to;
            this.$refs.exportData.href = this.downloadOrderList;
        },
        // 提交表单
        getList() {
            const data = {};
            Object.assign(data, this.form);
            data.from = this.dateRange.length != 0 ? moment(this.dateRange[0]).format('YYYY-MM-DD 00:00:00') : '';
            data.to = this.dateRange.length != 0 ? moment(this.dateRange[1]).format('YYYY-MM-DD 23:59:59') : '';
            data.orderStatus = this.activeName === 'all' ? '' : this.activeName;
            this.$refs[this.activeName].page.currentPage = 1;
            this.$refs[this.activeName].data = data;
            this.$refs[this.activeName].getList(this.page.currentPage);
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
        },
        // 推送
        sendOut() {
            const warehouseOrderNos = this.$refs[this.activeName].warehouseOrderNos;
            if (!warehouseOrderNos.length) {
                return this.$message.warning('请选择订单');
            } else {
                this.$refs[this.activeName].pushCloud();
            }
        }
    }
};
</script>
<style lang='less'>
.product-list {
    .el-card__body{
        overflow-x: auto;
        min-width: 1336px;
    }
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
