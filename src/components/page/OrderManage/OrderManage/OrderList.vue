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
                <el-form-item prop="platOrderNum" label="平台级订单号">
                    <el-input v-model="form.orderNum" placeholder="请输入平台级订单号"></el-input>
                </el-form-item>
                <el-form-item prop="repertoryOrderNum" label="仓库级订单号">
                    <el-input v-model="form.orderNum" placeholder="请输入仓库级订单号"></el-input>
                </el-form-item>
                <el-form-item prop="repertory" label="发货仓库">
                    <el-select v-model="form.repertory" placeholder="请选择">
                        <el-option v-for="(v,k) in repertoryArr" :key="k" :label="v.label" :value="v.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="orderSource" label="订单来源">
                    <el-select v-model="form.orderSource" placeholder="请选择">
                        <el-option v-for="(v,k) in orderSourceArr" :key="k" :label="v.label" :value="v.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="ticket" label="开具发票">
                    <el-select v-model="form.ticket" placeholder="请选择">
                      <el-option label="是" value="0"></el-option>
                      <el-option label="否" value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="user" label="用户账号">
                    <el-input v-model="form.user" placeholder="请输入用户账号"></el-input>
                </el-form-item>
                <el-form-item prop="receiver" label="收货人姓名">
                    <el-input v-model="form.receiver" placeholder="请输入收货人姓名"></el-input>
                </el-form-item>
                <el-form-item prop="stars" label="订单标记">
                    <el-select v-model="form.stars" placeholder="请选择">
                        <el-option v-for="(v,k) in starArr" :key="k" :label="v.label" :value="v.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="sendStatus" label="推送状态">
                    <el-select v-model="form.sendStatus" placeholder="请选择" @change="changeStatus(1)">
                      <el-option label="暂不选择" value=""></el-option>
                        <el-option v-for="(v,k) in sendStatusArr" :label="v.type" :value="v.id" :key="k">{{v.type}}</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="lockStatus" label="锁定状态">
                    <el-select v-model="form.lockStatus" placeholder="请选择" @change="changeStatus(1)">
                      <el-option label="暂不选择" value=""></el-option>
                        <el-option v-for="(v,k) in lockStatusArr" :label="v.type" :value="v.id" :key="k">{{v.type}}</el-option>
                    </el-select>
                </el-form-item>
                <!--<el-form-item prop="orderStatus" label="订单状态">-->
                    <!--<el-select v-model="form.orderStatus" placeholder="请选择" @change="changeStatus(2)">-->
                        <!--<el-option label="暂不选择" value=""></el-option>-->
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
                <el-button type="primary" @click="sendOut" v-auth="'order.orderList.yjts'">导出</el-button>
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
                <el-tab-pane label="部分发货" name="3">
                    <v-orderlist ref="3"></v-orderlist>
                </el-tab-pane>
                <el-tab-pane label="已发货" name="9">
                    <v-orderlist ref="9"></v-orderlist>
                </el-tab-pane>
                <el-tab-pane label="交易完成" name="5">
                    <v-orderlist ref="5"></v-orderlist>
                </el-tab-pane>
                <el-tab-pane label="交易关闭" name="6">
                    <v-orderlist ref="6"></v-orderlist>
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
            repertoryArr: [// 发货仓库
                { label: '自建仓', value: '1' },
                { label: '加盟仓', value: '2' },
                { label: '供应商仓', value: '3' },
                { label: '虚拟仓', value: '4' }
            ],
            orderSource: [// 订单来源
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
            sendStatus: [// 推送状态
                { label: '无需推送', value: '1' },
                { label: '等待推送', value: '2' },
                { label: '推送成功', value: '3' },
                { label: '推送失败', value: '4' }
            ],
            lockStatus: [// 锁定状态
                { label: '无需锁定', value: '1' },
                { label: '未锁定', value: '2' },
                { label: '已锁定', value: '3' }
            ],
            orderStatus: [// 订单状态
                { label: '待付款', value: '1' },
                { label: '已付款', value: '2' },
                { label: '已付款', value: '3' },
                { label: '部分发货', value: '4' },
                { label: '已发货', value: '5' },
                { label: '交易完成', value: '6' },
                { label: '交易关闭', value: '7' }
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
            formData: {},
            // 售后状态数组
            afterSaleStatusArr: [{
                type: '售后中+售后完毕',
                id: 1
            }, {
                type: '售后中',
                id: 2
            }, {
                type: '售后完毕',
                id: 3
            }],
            // 退款状态数组
            refundStatusArr: [{
                type: '退款中',
                id: 1
            }, {
                type: '退款成功',
                id: 2
            }, {
                type: '换货中',
                id: 3
            }, {
                type: '换货成功',
                id: 4
            }, {
                type: '退货中',
                id: 5
            }, {
                type: '退货成功',
                id: 6
            }],
            // 关闭状态
            closeReasonArr: [{
                type: '取消关闭',
                id: 7
            }, {
                type: '退款完成',
                id: 6
            }, {
                type: '超时关闭',
                id: 8
            }]
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
