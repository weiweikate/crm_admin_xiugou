<template>
    <div class="withdraw-account">
        <breadcrumb :nav='["经销商会员管理","会员管理","会员详情","TA的账户","待提现账户明细"]'></breadcrumb>
        <el-card :body-style="{ padding: '30px' }">
            <el-form :model="form" ref='form' inline>
                <!--<el-form-item prop="orderNo" label="编号">-->
                    <!--<el-input v-model="form.orderNo" placeholder="请输入编号"></el-input>-->
                <!--</el-form-item>-->
                <el-form-item prop="orderNo" label="订单号">
                    <el-input v-model="form.orderNo" placeholder="请输入订单号"></el-input>
                </el-form-item>
                <el-form-item prop="finishTime" label="完成时间">
                    <el-date-picker v-model="form.finishTime" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                </el-form-item>
                <!--<el-form-item v-if='status == 1' prop="status" label="金额状态">-->
                    <!--<el-select v-model="form.status" placeholder="请选择金额状态">-->
                        <!--<el-option label="全部" value=""></el-option>-->
                        <!--<el-option label="可提现" value="1"></el-option>-->
                        <!--<el-option label="冻结中" value="2"></el-option>-->
                    <!--</el-select>-->
                <!--</el-form-item>-->
                <el-form-item prop="no" label=" ">
                    <el-button @click="getList(1)" type="primary">提交</el-button>
                    <el-button @click="resetForm('form')">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card :body-style="{ padding: '30px' }" style='margin-top:10px'>
            <p style="font-size:14px;color:#ff6868">{{name}}的待提现账户</p>
            <el-button @click="toggleStatus(1)" style="margin:10px 0" :type="biType==1?'primary':''">收入</el-button>
            <el-button @click="toggleStatus(2)" style="margin:10px 0" :type="biType==2?'primary':''">支出</el-button>
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
            <el-table :data="tableData" border v-loading="tableLoading">
                <el-table-column type="index" label="编号" align="center"></el-table-column>
                <el-table-column v-if="biType == 1" prop="orderNo" label="订单编号" align="center"></el-table-column>
                <el-table-column v-if="biType == 1" prop="balance" label="收入金额" align="center">
                    <template slot-scope="scope" v-if='scope.row.balance || scope.row.balance ==0'>
                        {{`+￥${scope.row.balance}`}}
                    </template>
                </el-table-column>
                <el-table-column v-if="biType == 2" prop="balance" label="支出金额" align="center">
                    <template slot-scope="scope" v-if='scope.row.balance || scope.row.balance ==0'>
                        {{`-￥${scope.row.balance}`}}
                    </template>
                </el-table-column>
                <el-table-column prop="useType" label="交易方式" align="center">
                    <template slot-scope="scope">
                        <!--只写一个？-->
                        <template v-if='scope.row.useType == 6'>品牌推广奖励金</template>
                        <template v-else>-</template>
                    </template>
                </el-table-column>
                <el-table-column label="完成时间" align="center">
                    <template slot-scope="scope" v-id='scope.row.createTime'>
                        {{scope.row.createTime | formatDateAll}}
                    </template>
                </el-table-column>
                <!--name 买家层级？-->
                <el-table-column v-if="biType == 1" prop="name" label="买家层级" align="center"></el-table-column>
                <el-table-column v-if="biType == 1" prop="status" label="金额状态" align="center">
                    <template slot-scope="scope">
                        <span>可提现</span>
                    </template>
                </el-table-column>
                <el-table-column label="备注" align="center">
                    <template slot-scope="scope">

                    </template>
                </el-table-column>
            </el-table>
        </el-card>

    </div>
</template>

<script>
import breadcrumb from '@/components/common/Breadcrumb';
import { myMixinTable } from '@/JS/commom.js';
import utils from '@/utils/index.js';
import request from '@/http/http';
export default {
    components: { breadcrumb },

    mixins: [myMixinTable],

    data() {
        return {
            // 人员code
            memberCode: '',
            // form表单
            form: {
                orderNo: '',
                orderNum: '',
                finishTime: []
            },
            // 表格信息
            tableData: [],
            name: '', // 姓名
            biType: '1', // 1：收入 2：支出
            tableLoading: false
        };
    },

    activated() {
        this.memberCode = this.$route.query.memberAccMsg.memberCode;
        this.name = this.$route.query.memberAccMsg.nickname;
        this.getList(this.page.currentPage);
    },

    methods: {
        // 提交表单
        getList(val) {
            const data = {
                userCode: this.memberCode,
                orderNo: this.form.orderNo,
                startTime: this.form.finishTime.length == 0 ? '' : utils.formatTime(this.form.finishTime[0], 1),
                endTime: this.form.finishTime.length == 0 ? '' : utils.formatTime(this.form.finishTime[1], 1),
                biType: this.biType,
                page: val,
                pageSize: this.page.pageSize
            };
            this.tableLoading = true;
            this.tableData = [];
            request.queryWithdrawalList(data).then(res => {
                this.tableLoading = false;
                this.tableData = res.data.data;
                this.page.totalPage = res.data.totalNum;
            }).catch(err => {
                this.tableLoading = false;
                console.log(err);
            });
        },
        //   重置表单
        resetForm(formName) {
            this.$refs[formName].resetFields();
            this.getList(1);
        },
        // 切换支出收入
        toggleStatus(val) {
            this.biType = val;
            this.page.currentPage = 1;
            this.getList(1);
        }
    }
};
</script>
<style lang='less' scoped>
.withdraw-account{
    .block{
        margin: 10px 0;
    }
}
</style>
