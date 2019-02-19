<template>
    <div class="pay-order">
        <v-breadcrumb :nav="['订单管理','支付单列表']"></v-breadcrumb>
        <el-card style="margin:10px 0 20px">
            <el-form ref="form" :inline="true" :model="form" label-width="120px" @submit.native.prevent>
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
                <el-form-item prop="userPhone" label="用户账号">
                    <el-input style="width:200px" placeholder="请输入用户账号" v-model="form.userPhone"></el-input>
                </el-form-item>
                <el-form-item prop="paymentNo" label="支付单号">
                    <el-input style="width:200px" placeholder="请输入支付单号" v-model="form.paymentNo"></el-input>
                </el-form-item>
                <el-form-item prop="platformNo" label="平台级订单号">
                    <el-input v-model="form.platformNo" placeholder="请输入平台级订单号"></el-input>
                </el-form-item>
                <el-form-item prop="status" label="支付单状态">
                    <el-select v-model="form.status" placeholder="全部">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="等待支付" value="1"></el-option>
                        <el-option label="支付成功" value="3"></el-option>
                        <el-option label="支付作废" value="5"></el-option>
                        <el-option label="支付过期" value="4"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button @click="getList(1)" native-type="submit" type="primary">查询</el-button>
                    <el-button @click="resetForm('form')">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <div class="table-block">
            <mr-flying parentClass="content-box">
                <el-pagination
                    background
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="page.currentPage"
                    :page-size="page.pageSize"
                    layout="total, prev, pager, next, jumper"
                    :total="page.totalPage">
                </el-pagination>
            </mr-flying>
            <el-table v-loading="tableLoading" :data="tableData" border style="width: 100%">
               <el-table-column prop="tradeNo" label="支付单号" align="center"></el-table-column>
               <el-table-column prop="platformOrderNo" label="平台订单号" align="center"></el-table-column>
               <el-table-column prop="userPhone" label="用户账号" align="center"></el-table-column>
               <el-table-column prop="title" label="账单标题" align="center">
                   <template slot-scope="scope">{{scope.row.title||`/`}}</template>
               </el-table-column>
               <el-table-column prop="area" label="账单类型" align="center">
                   <template slot-scope="scope">
                       <template v-if="scope.row.type==1">普通账单</template>
                       <template v-else-if="scope.row.type==2">充值账单</template>
                       <template v-else>/</template>
                   </template>
               </el-table-column>
               <el-table-column label="支付单状态" align="center">
                   <template slot-scope="scope">
                       <template v-if="scope.row.status == 1">等待支付</template>
                       <template v-if="scope.row.status == 3">支付成功</template>
                       <template v-if="scope.row.status == 2">支付失败</template>
                       <template v-if="scope.row.status == 5">支付作废</template>
                       <template v-if="scope.row.status == 4">支付过期</template>
                   </template>
               </el-table-column>
               <el-table-column label="创建时间" align="center">
                   <template slot-scope="scope">{{scope.row.createTime|formatDateAll}}</template>
               </el-table-column>
               <el-table-column label="支付时间" align="center">
                   <template slot-scope="scope">
                        <template v-if="scope.row.payTime">{{scope.row.payTime|formatDateAll}}</template>
                        <template v-else>/</template>
                   </template>
               </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    import vBreadcrumb from '@/components/common/Breadcrumb.vue';
    import { myMixinTable } from '@/JS/commom';
    import moment from 'moment';
    import request from '@/http/http.js';

    export default {
        components: {
            vBreadcrumb
        },
        mixins: [myMixinTable],
        data() {
            return {

                tableData: [],
                tableLoading: false,
                height: '',
                form: {
                    time: '',
                    userPhone: '',
                    paymentNo: '',
                    status: '',
                    platformNo: ''
                }
            };
        },
        created() {
        },
        activated() {
            this.getList(this.page.currentPage);
        },
        methods: {
            // 获取列表
            getList(val) {
                const data = {
                    page: val,
                    pageSize: this.page.pageSize,
                    status: this.form.status,
                    userPhone: this.form.userPhone,
                    paymentNo: this.form.paymentNo,
                    platformNo: this.form.platformNo,
                    from: this.form.time[0] ? moment(this.form.time[0]).format('YYYY-MM-DD 00:00:00') : '',
                    to: this.form.time[1] ? moment(this.form.time[1]).format('YYYY-MM-DD 23:59:59') : ''
                };
                this.page.currentPage = val;
                this.tableLoading = true;
                request.queryPayments(this.$utils.trimForm(data)).then(res => {
                    this.tableLoading = false;
                    if (!res.data.data) return;
                    this.tableData = res.data.data;
                    this.page.totalPage = res.data.totalNum;
                }).catch(error => {
                    console.log(error);
                    this.tableLoading = false;
                });
            },
            //   重置表单
            resetForm(formName) {
                this.$refs[formName].resetFields();
                this.getList(this.page.currentPage);
            }
        }
    };
</script>

<style lang="less">
    .pay-order {
        .table-block {
            padding: 20px 20px 60px;
            background: #fff
        }
        .block {
            float: right;
            margin-top: 10px
        }
    }
</style>
