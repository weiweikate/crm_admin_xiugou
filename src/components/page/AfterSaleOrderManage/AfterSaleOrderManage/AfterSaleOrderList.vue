<template>
    <div class="after-list">
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
                <el-form-item prop="serviceNo" label="售后单号">
                    <el-input v-model="form.serviceNo" placeholder="请输入售后单号"></el-input>
                </el-form-item>
                <el-form-item prop="warehouseOrderNo" label="仓库订单号">
                    <el-input v-model="form.warehouseOrderNo" placeholder="请输入仓库订单号"></el-input>
                </el-form-item>
                <el-form-item prop="status" label="售后状态">
                    <el-select v-model="form.status" placeholder="请选择">
                      <el-option label="暂不选择" value=""></el-option>
                        <el-option v-for="(v,k) in afterSaleStatusArr" :label="v.label" :value="v.value" :key="k"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="">
                    <el-button type="primary" @click="getList(1)">查询</el-button>
                    <el-button @click="resetForm('form')">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card style='margin-top:20px;minHeight:90vh;' :body-style="{ padding: '20px 50px' }">
            <div class="btn-group">
                <!-- <el-button type="primary">导出</el-button> -->
            </div>
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="全部" name="all">
                    <v-orderlist ref="all"></v-orderlist>
                </el-tab-pane>
                <el-tab-pane label="仅退款" name="1">
                    <v-orderlist ref="1"></v-orderlist>
                </el-tab-pane>
                <el-tab-pane label="退货退款" name="2">
                    <v-orderlist ref="2"></v-orderlist>
                </el-tab-pane>
                <el-tab-pane label="换货" name="3">
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
            nav: ['订单管理', '订单管理'],
            activeName: 'all',
            dateRange: [],
            afterSaleStatusArr: [// 售后状态
                { label: '待审核', value: '1' },
                { label: '待商品寄回', value: '2' },
                { label: '待仓库确认', value: '3' },
                { label: '待平台处理', value: '4' },
                { label: '售后完成', value: '5' },
                { label: '售后关闭', value: '6' }
            ],
            afterSaleTypeArr: [// 售后类型
                { label: '仅退款', value: '1' },
                { label: '退货退款', value: '2' },
                { label: '换货', value: '3' }
            ],
            form: {
                serviceNo: '', // 售后单号
                warehouseOrderNo: '', // 仓库级订单号
                userPhone: '', // 用户账号
                status: '' // 推送状态
            },
            formData: {}
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
            data.createStartTime = this.dateRange.length !== 0 ? moment(this.dateRange[0]).format('YYYY-MM-DD 00:00:00') : '';
            data.createEndTime = this.dateRange.length !== 0 ? moment(this.dateRange[1]).format('YYYY-MM-DD 23:59:59') : '';
            data.type = this.activeName === 'all' ? '' : this.activeName;
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
            // this.resetForm('form');
            this.activeName = tab.name;
            this.getList();
        }
    }
};
</script>
<style lang='less'>
.after-list {
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
