<template>
    <div class="product-list">
        <v-breadcrumb :nav='nav'></v-breadcrumb>
        <el-card class="query-panue" :body-style="{ padding: '20px 20px'}">
            <el-form :model="form" ref="form" inline label-width="120px">
                <el-form-item prop="producdCode" label="产品编号">
                    <el-input v-model="form.producdCode" placeholder="请输入产品名称"></el-input>
                </el-form-item>
                <el-form-item prop="username" label="买家姓名">
                    <el-input v-model="form.username" placeholder="请输入收货人姓名"></el-input>
                </el-form-item>
                <el-form-item prop="orderNum" label="订单编号">
                    <el-input v-model="form.orderNum" placeholder="请输入订单编号"></el-input>
                </el-form-item>
                <el-form-item prop="productName" label="产品名称">
                    <el-input v-model="form.productName" placeholder="请输入产品名称"></el-input>
                </el-form-item>
                <el-form-item prop="stars" label="订单标记">
                    <el-select v-model="form.stars" placeholder="请选择订单标记">
                        <el-option v-for="(v,k) in starArr" :key="k" :label="v.label" :value="v.value"></el-option>
                    </el-select>
                </el-form-item>
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
                <el-form-item label=" ">
                    <el-button type="primary" @click="getList(1)">查询</el-button>
                    <el-button @click="resetForm('form')">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card style='margin-top:20px;minHeight:90vh;overflow-x: auto;min-width: 1336px' :body-style="{ padding: '20px 50px' }">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="全部订单" name="all">
                    <v-orderlist ref="all"></v-orderlist>
                </el-tab-pane>
                <el-tab-pane label="待支付" name="1">
                    <v-orderlist ref="1"></v-orderlist>
                </el-tab-pane>
                <el-tab-pane label="待发货" name="2">
                    <v-orderlist ref="2"></v-orderlist>
                </el-tab-pane>
                <el-tab-pane label="待确认" name="3">
                    <v-orderlist ref="3"></v-orderlist>
                </el-tab-pane>
                <el-tab-pane label="已完成" name="5">
                    <v-orderlist ref="5"></v-orderlist>
                </el-tab-pane>
                <el-tab-pane label="已关闭" name="closed">
                    <v-orderlist ref="allOrder"></v-orderlist>
                </el-tab-pane>
            </el-tabs>
        </el-card>
    </div>
</template>

<script>
    import vBreadcrumb from '@/components/common/Breadcrumb.vue';
    import moment from 'moment';
    import { myMixinTable } from '@/JS/commom';
    import vOrderlist from './_giftOrder/orderList';

    export default {
        components: {
            vBreadcrumb,
            vOrderlist
        },

        mixins: [myMixinTable],

        data() {
            return {
                nav: ['订单管理', '礼包订单管理'],
                activeName: 'all',
                dateRange: [],
                starArr: [
                    { label: '红色标记', value: '1' },
                    { label: '蓝色标记', value: '2' },
                    { label: '绿色标记', value: '3' },
                    { label: '黄色标记', value: '4' },
                    { label: '紫色标记', value: '5' }
                ],
                form: {
                    producdCode: '',
                    username: '',
                    orderNum: '',
                    productName: '',
                    stars: ''
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
                this.activeName = tab.name;
                this.getList();
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
