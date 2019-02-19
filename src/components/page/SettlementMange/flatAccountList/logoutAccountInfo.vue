<template>
    <div class="flat-act-01">
        <v-breadcrumb :nav="nav"></v-breadcrumb>
        <el-card :body-style="{ padding: '30px' }">
            <el-form :model="form" ref='form' @submit.native.prevent inline>
                <el-form-item prop="phone" label="手机号">
                    <el-input v-model="form.phone" placeholder="请输入手机号"></el-input>
                </el-form-item>
                <el-form-item prop="time" label="注销时间">
                    <el-date-picker v-model="form.time" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" type="datetimerange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                </el-form-item>
                <el-form-item label=" ">
                    <el-button native-type="submit" type="primary" @click="getList(1)">查询</el-button>
                    <el-button @click="resetForm('form')">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card style='margin-top:20px' :body-style="{ padding: '30px' }">
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
            <el-table v-loading="loading" :data="tableData" border stripe>
                <el-table-column type="index" :index='handleIndex' label="编号" align="center"></el-table-column>
                <el-table-column prop='accountBalance' label="金额（¥）" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.accountBalance">{{scope.row.accountBalance.toFixed(2)}}</span>
                        <span v-else-if="scope.row.accountBalance == 0">0</span>
                        <span v-else>-</span>
                    </template>
                </el-table-column>
                <el-table-column prop='createTime' label="注销时间" align="center">
                    <template slot-scope="scope" v-if='scope.row.createTime'>
                        {{scope.row.createTime | formatDateAll}}
                    </template>
                </el-table-column>
                <el-table-column prop='phone' label="手机号" align="center"></el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>
    import utils from '@/utils/index.js';
    import vBreadcrumb from '@/components/common/Breadcrumb.vue';
    import { myMixinTable } from '@/JS/commom';
    import request from '@/http/http';
    export default {
        components: { vBreadcrumb },

        mixins: [myMixinTable],

        data() {
            return {
                nav: ['结算管理', '注销账户收入明细'],
                // 表单
                form: {
                    phone: '',
                    time: []
                },
                id: '',
                loading: false,
                tableData: [] // 表格信息
            };
        },

        mounted() {
            this.getList(this.page.currentPage);
        },

        methods: {
            // 查询表单
            getList(val) {
                this.form.time = this.form.time ? this.form.time : [];
                const data = {
                    ...this.form,
                    createBeginTime: this.form.time.length === 0 ? '' : this.form.time[0],
                    createEndTime: this.form.time.length === 0 ? '' : this.form.time[1],
                    page: val,
                    pageSize: this.page.pageSize
                };
                this.loading = true;
                request.queryConfineBalancePageList(data).then(res => {
                    const resData = res.data || {};
                    this.loading = false;
                    this.tableData = resData.data || [];
                    this.page.totalPage = resData.totalNum || 0;
                    this.page.currentPage = resData.currentPage || 0;
                }).catch(err => {
                    this.loading = false;
                    console.log(err);
                });
            },
            // 编号
            handleIndex(index) {
                return index + 1;
            },
            // 重置表单
            resetForm(formName) {
                this.$refs[formName].resetFields();
                this.getList(1);
            }
        }
    };

</script>
<style lang='less' scoped>
    .flat-act-01{
        .block{margin: 10px 0 20px 0}
        .deposit-payment{
            text-align: center;
            font-size: 16px;
            line-height: 35px;
        }
    }
</style>
