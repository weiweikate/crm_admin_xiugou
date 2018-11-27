<template>
    <div class="pay-order">
        <v-breadcrumb :nav="['订单管理','支付单列表']"></v-breadcrumb>
        <el-card style="margin:10px 0 20px">
            <el-form ref="form" :inline="true" :model="form" label-width="120px">
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
                    <el-input style="width:200px" placeholder="请输入用户账号" v-model="form.user"></el-input>
                </el-form-item>
                <el-form-item prop="payNum" label="支付单号">
                    <el-input style="width:200px" placeholder="请输入支付单号" v-model="form.payNum"></el-input>
                </el-form-item>
                <el-form-item prop="status" label="支付单状态">
                    <el-select v-model="form.status" placeholder="全部">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="等待支付" value="1"></el-option>
                        <el-option label="支付成功" value="2"></el-option>
                        <el-option label="支付作废" value="3"></el-option>
                        <el-option label="支付过期" value="4"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button @click="getList(1)" type="primary">查询</el-button>
                    <el-button @click="resetForm('form')">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <div class="table-block">
            <el-table v-loading="tableLoading" :data="tableData" border style="width: 100%">
               <el-table-column prop="payNum" label="支付单号" align="center"></el-table-column>
               <el-table-column prop="area" label="平台订单号" align="center"></el-table-column>
               <el-table-column prop="payNum" label="用户账号" align="center"></el-table-column>
               <el-table-column prop="area" label="账单标题" align="center"></el-table-column>
               <el-table-column prop="area" label="账单类型" align="center"></el-table-column>
               <el-table-column label="支付单状态" align="center">
                   <template slot-scope="scope">
                       <template v-if="scope.row.status == 1">等待支付</template>
                       <template v-if="scope.row.status == 2">支付成功</template>
                       <template v-if="scope.row.status == 3">支付作废</template>
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
            <div class="block">
                <el-pagination
                        background
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="page.currentPage"
                        :page-size="page.pageSize"
                        layout="total, prev, pager, next, jumper"
                        :total="page.totalPage">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import vBreadcrumb from '@/components/common/Breadcrumb.vue';
    import { myMixinTable } from '@/JS/commom';
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
                    user: '',
                    payNum: '',
                    status: ''
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
                const that = this;
                const data = {
                    page: val,
                    pageSize: this.page.pageSize,
                    status: that.form.status,
                    name: that.form.name
                };
                this.page.currentPage = val;
                that.tableLoading = true;
                request.getProductBrandList(data).then(res => {
                    that.tableLoading = false;
                    if (!res.data) return;
                    that.tableData = res.data.data;
                    that.page.totalPage = res.data.totalNum;
                }).catch(error => {
                    console.log(error);
                    that.tableLoading = false;
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
