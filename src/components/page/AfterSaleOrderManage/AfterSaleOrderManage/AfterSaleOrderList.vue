<template>
    <div class="product-list">
        <v-breadcrumb :nav='nav'></v-breadcrumb>
        <el-card class="query-panue" :body-style="{ padding: '20px 20px'}">
            <el-form :model="form" ref="form" inline label-width="120px">
                <el-form-item prop="time" label="创建时间">
                    <el-date-picker
                        v-model="form.time"
                        type="datetimerange"
                        format="yyyy-MM-dd"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item prop="user" label="用户账号">
                    <el-input v-model="form.user" placeholder="请输入用户账号"></el-input>
                </el-form-item>
                <el-form-item prop="orderNum" label="售后单号">
                    <el-input v-model="form.orderNum" placeholder="请输入售后单号"></el-input>
                </el-form-item>
                <el-form-item prop="repertoryOrderNum" label="仓库订单号">
                    <el-input v-model="form.orderNum" placeholder="请输入仓库订单号"></el-input>
                </el-form-item>
                <el-form-item prop="afterSaleStatus" label="售后状态">
                    <el-select v-model="form.afterSaleType" placeholder="请选择" @change="changeStatus(1)">
                      <el-option label="暂不选择" value=""></el-option>
                        <el-option v-for="(v,k) in afterSaleStatusArr" :label="v.type" :value="v.id" :key="k">{{v.type}}</el-option>
                    </el-select>
                </el-form-item>
                <!--<el-form-item prop="afterSaleType" label="售后类型">-->
                    <!--<el-select v-model="form.afterSaleType" placeholder="请选择" @change="changeStatus(1)">-->
                      <!--<el-option label="暂不选择" value=""></el-option>-->
                        <!--<el-option v-for="(v,k) in afterSaleTypeArr" :label="v.type" :value="v.id" :key="k">{{v.type}}</el-option>-->
                    <!--</el-select>-->
                <!--</el-form-item>-->
                <el-form-item label="">
                    <el-button type="primary" @click="getList(1)">查询</el-button>
                    <el-button @click="resetForm('form')">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card style='margin-top:20px;minHeight:90vh;overflow-x: auto;min-width: 1336px' :body-style="{ padding: '20px 50px' }">
            <div class="btn-group">
                <el-button type="primary" @click="sendOut" v-auth="'order.orderList.yjts'">导出</el-button>
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
                { label: '待平台处理', value: '3' },
                { label: '售后完成', value: '4' },
                { label: '售后关闭', value: '5' }
            ],
            afterSaleTypeArr: [// 售后类型
                { label: '仅退款', value: '1' },
                { label: '退货退款', value: '2' },
                { label: '换货', value: '3' }
            ],
            form: {
                platOrderNum: '', // 平台级订单号
                repertoryOrderNum: '', // 仓库级订单号
                repertory: '', // 发货仓库
                orderSource: '', // 订单来源
                ticket: '', // 开具发票
                user: '', // 用户账号
                receiver: '', // 收货人姓名
                stars: '', // 用户账号
                sendStatus: '', // 推送状态
                lockStatus: '' // 锁定状态
                // orderStatus: ''// 订单状态
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
            data.startTime = this.dateRange.length != 0 ? moment(this.dateRange[0]).format('YYYY-MM-DD') : '';
            data.endTime = this.dateRange.length != 0 ? moment(this.dateRange[1]).format('YYYY-MM-DD') : '';
            if (this.form.closeReason) {
                this.activeName = '6';
            }
            if (this.form.refundStatus) {
                this.activeName = '9';
            }
            data.status = this.activeName === 'all' ? '' : this.activeName;
            this.$refs[this.activeName].page.currentPage = 1;
            this.$refs[this.activeName].data = data;
            this.$refs[this.activeName].getList();
        },
        // 退款状态。关闭状态切换清值
        // 1 退款状态  2关闭状态
        changeStatus(num) {
            if (num == 1) {
                this.form.closeReason = '';
            } else {
                this.form.refundStatus = '';
            }
        },
        //  重置表单
        resetForm(formName) {
            this.$refs[formName].resetFields();
            this.form.today = '';
            this.form.yesterday = '';
            this.form.threeMonths = '';
            this.dateRange = [];
            this.getList({ name: 'all' });
        },
        //  点击tab选项卡
        handleClick(tab) {
            this.resetForm('form');
            this.activeName = tab.name;
            this.getList();
        },
        toAfterSale(id) {
            sessionStorage.setItem('afterSaleOprId', id);
            this.$router.push({ path: '/afterSaleOpr', query: { afterSaleOprId: id }});
        },
        // 订单按钮
        orderBtn(status) {
            if (status == 'today') {
                this.form.today = 'yes';
                this.form.yesterday = '';
                this.form.threeMonths = '';
            } else if (status == 'yesterday') {
                this.form.today = '';
                this.form.yesterday = 'yes';
                this.form.threeMonths = '';
            } else if (status == 'threeMonths') {
                this.form.today = '';
                this.form.yesterday = '';
                this.form.threeMonths = 'yes';
            }
            this.getList(1);
        },
        sendOut() {
            const ids = this.$refs[this.activeName].ids;
            if (!ids.length) {
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
