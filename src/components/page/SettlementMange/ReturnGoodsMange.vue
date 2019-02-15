<template>
    <div class="return-goods">
        <v-breadcrumb :nav="['结算管理','退货审核']"></v-breadcrumb>
        <el-card :body-style="{ padding: '30px' }">
            <el-form :model="form" ref="form" inline>
                <el-form-item prop="name" label="买家姓名">
                    <el-input v-model="form.name" placeholder="请输入买家姓名"></el-input>
                </el-form-item>
                <el-form-item prop="dealUser" label="处理人">
                    <el-select v-model="form.dealUser" placeholder="请选择处理人">
                        <el-option v-for="(v,k) in adminList" :key="k" :label="v.name" :value="v.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="supplyName" label="供应商名称">
                    <el-select v-model="form.supplyName" placeholder="请选择供应商名称">
                        <el-option v-for="(v,k) in supplayerList" :key="k" :label="v.name" :value="v.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="time" label="退货时间">
                    <el-date-picker v-model="form.time" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                </el-form-item>
                <el-form-item prop="proType" label="产品情况">
                    <el-select v-model="form.proType" placeholder="请选择产品情况">
                        <el-option label="全部" value></el-option>
                        <el-option label="无报损情况" value="1"></el-option>
                        <el-option label="报损反馈" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label=" ">
                    <el-button type="primary" @click="getList(1)">查询</el-button>
                    <el-button @click="resetForm('form')">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card style="margin-top:20px" :body-style="{ padding: '30px' }">
            <mr-flying parentClass="content-box">
                <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page.currentPage" :page-size="page.pageSize" layout="total, prev, pager, next, jumper" :total="page.totalPage"></el-pagination>
            </mr-flying>
            <el-table :data="table" border v-loading="tableLoading">
                <el-table-column prop="order_num" label="订单编号" align="center"></el-table-column>
                <el-table-column prop="nickname" label="买家" align="center"></el-table-column>
                <el-table-column prop="product_name" label="产品" align="center"></el-table-column>
                <el-table-column prop="refund_time" label="成交时间" align="center"></el-table-column>
                <el-table-column prop="price" label="单价" align="center">
                    <template slot-scope="scope" v-if="scope.row.price">
                        <span style="color:red">{{scope.row.price | handleMoney}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="num" label="数量" align="center"></el-table-column>
                <el-table-column label="商品总价" align="center">
                    <template slot-scope="scope" v-if="scope.row.price">
                        <span style="color:red">{{scope.row.price*scope.row.num+scope.row.freight_price | handleMoney}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="supplierName" label="供应商" align="center"></el-table-column>
                <el-table-column prop="out_refund_no" label="退款编号" align="center"></el-table-column>
                <el-table-column prop="refund_time" label="退款时间" align="center">
                    <template slot-scope="scope" v-if="scope.row.refund_time">{{scope.row.refund_time | formatDate}}</template>
                </el-table-column>
                <el-table-column label="退款金额" align="center">
                    <template slot-scope="scope">
                        <p style="color:red">余额：{{scope.row.actual_balance | handleMoney}}</p>
                        <p style="color:red">代币：{{scope.row.actual_token_coin | handleMoney}}</p>
                        <p style="color:red">积分：{{scope.row.actual_user_score | handleMoney}}</p>
                    </template>
                </el-table-column>
                <el-table-column label="要求" align="center">
                    <template slot-scope="scope">退货退款</template>
                </el-table-column>
                <el-table-column prop="adminUser" label="处理人" align="center"></el-table-column>
                <el-table-column label="处理情况" align="center">
                    <template slot-scope="scope">同意退货</template>
                </el-table-column>
                <el-table-column prop="had_scrap" label="是否报损" align="center">
                    <template slot-scope="scope">
                        <template v-if="scope.row.had_scrap == 1">正常</template>
                        <template v-else>报损</template>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button @click="showDetail(scope.row)" type="primary">详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>
import utils from '@/utils/index.js';
import * as api from '@/api/SettlementMange/index.js';
import vBreadcrumb from '../../common/Breadcrumb.vue';
import * as pApi from '@/privilegeList/SettlementMange/index.js';
import { myMixinTable } from '@/JS/commom';
export default {
    components: { vBreadcrumb },

    mixins: [myMixinTable],

    data() {
        return {
            adminList: [], // 管理员列表
            supplayerList: [], // 供应商列表
            tableLoading: false,
            // 表单
            form: {
                name: '',
                dealUser: '',
                supplyName: '',
                proType: '',
                time: []
            },
            table: [] // 表格信息
        };
    },

    activated() {
        this.getList(1);
        this.getAdminList();
        this.getSupplierList();
    },

    methods: {
        // 查询表单
        getList(val) {
            const data = {};
            data.adminId = this.form.dealUser;
            data.nickname = this.form.name;
            data.supplierId = this.form.supplyName;
            data.startTime = this.form.time.length == 0 ? '' : utils.formatTime(this.form.time[0], 1);
            data.endTime = this.form.time.length == 0 ? '' : utils.formatTime(this.form.time[1], 1);
            data.hadScrap = this.form.proType;
            data.page = val;
            data.url = pApi.queryReturnProductList;
            this.tableLoading = true;
            this.$axios
                .post(api.queryReturnProductList, data)
                .then(res => {
                    this.table = res.data.data.data;
                    this.page.currentPage = val;
                    this.page.totalPage = res.data.data.resultCount;
                    this.tableLoading = false;
                })
                .catch(err => {
                    this.tableLoading = false;
                    console.log(err);
                });
        },
        // 查看详情
        showDetail(row) {
            sessionStorage.setItem('afterSaleOprId', row.orderProductId);
            this.$router.push({ name: 'afterSaleOpr', query: { afterSaleOprId: row.orderProductId }});
        },
        // 重置表单
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        // 获取处理人列表
        getAdminList() {
            this.$axios.post(api.adminList, {}).then(res => {
                this.adminList = res.data.data;
            });
        },
        // 获取供应商列表
        getSupplierList() {
            this.$axios.post(api.querySupplierList, {}).then(res => {
                this.supplayerList = res.data.data;
            });
        }
    }
};
</script>
<style lang='less' scoped>
.return-goods {
    .block {
        margin: 10px 0 20px 0;
    }
}
</style>