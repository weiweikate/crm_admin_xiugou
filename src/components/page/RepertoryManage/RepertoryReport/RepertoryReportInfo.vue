<template>
    <div class="report-info">
        <v-breadcrumb :nav='nav'></v-breadcrumb>
        <el-card :body-style="{ padding: '20px 40px' }" style='margin-top:20px'>
            <table class="table-area">
                <tr>
                    <td>采购单</td>
                    <td colspan="8">93489349348</td>
                </tr>
                <tr>
                    <td>入库类型</td>
                    <td>111</td>
                    <td>入库单日期</td>
                    <td>222</td>
                    <td>状态</td>
                    <td colspan="2">4334</td>
                    <td>出库方</td>
                    <td>43434</td>
                </tr>
                <tr>
                    <td>出库方仓库编码</td>
                    <td>111</td>
                    <td>入库方</td>
                    <td>222</td>
                    <td>入库方仓库编码</td>
                    <td>4334</td>
                    <td>入库方地址</td>
                    <td colspan="2">43434</td>
                </tr>
                <tr>
                    <td>入库单创建人</td>
                    <td>111</td>
                    <td>联系方式</td>
                    <td>222</td>
                    <td>送货人姓名</td>
                    <td colspan="2">4334</td>
                    <td>送货人联系方式</td>
                    <td colspan="2">43434</td>
                </tr>
                <tr>
                    <td>备注</td>
                    <td colspan="8">93489349348</td>
                </tr>
            </table>
            <el-table :data="tableData" border>
                <el-table-column type="index" label="序号" align="center"></el-table-column>
                <el-table-column prop="name" label="产品名称" align="center"></el-table-column>
                <el-table-column prop="name" label="产品ID" align="center"></el-table-column>
                <el-table-column prop="id" label="商品编码" align="center"></el-table-column>
                <el-table-column prop="id" label="产品类目" align="center"></el-table-column>
                <el-table-column prop="code" label="颜色" align="center"></el-table-column>
                <el-table-column prop="type" label="版本" align="center"></el-table-column>
                <el-table-column prop="supplierId" label="规格" align="center"></el-table-column>
                <el-table-column prop="supplierId" label="类型" align="center"></el-table-column>
                <el-table-column prop="supplierId" label="预计入库数量" align="center"></el-table-column>
                <el-table-column label="实际入库数量" align="center">
                    <template slot-scope="scope">{{scope.row.time||'/'}}</template>
                </el-table-column>
            </el-table>
            <div class="block">合计 <span style="margin: 0 20px">采购数量：10000</span> 实际入库数量：100000</div>
            <div style="margin-top: 40px">
                <el-button type="primary" @click="back">返回列表</el-button>
            </div>
        </el-card>
    </div>
</template>

<script>
import vBreadcrumb from '@/components/common/Breadcrumb.vue';
import moment from 'moment';
import { myMixinTable } from '@/JS/commom';
import request from '@/http/http.js';

export default {
    components: { vBreadcrumb },

    mixins: [myMixinTable],

    data() {
        return {
            nav: ['云仓仓库管理', '仓库单', '入库单'],
            tableData: [],
            form: {},
            formMask: {},
            title: '启用仓库',
            mask: false,
            tips: ['确认推送入库单？', '确认取消图库单？'],
            index: ''
        };
    },
    activated() {
        this.getList(this.page.currentPage);
    },
    methods: {
        // 获取数据
        getList(val) {
            const data = {
                productId: this.form.status,
                warehouseId: this.form.type,
                page: val,
                pageSize: this.page.pageSize
            };
            this.page.currentPage = val;
            request
                .aaa(data)
                .then(res => {
                    this.tableData = [];
                    if (!res.data) return;
                    this.tableData = res.data.data;
                    this.page.totalPage = res.data.totalNum;
                })
                .catch(error => {
                    console.log(error);
                });
        },
        // 返回
        back() {
            this.$router.push('/repertoryReportList');
        }
    }
};
</script>
<style lang='less' scoped>
.report-info {
    .block {
        margin: 10px 0;
    }
    .color-blue {
        color: #33b4ff;
        cursor: pointer;
    }
    .table-area{
        font-size:12px;
        width: 100%;
        color:#606266;
        border: 1px solid #ebeef5;
        border-collapse: collapse;
        margin-bottom: 20px;
        line-height: 23px;
        td {
            border: 1px solid #ebeef5;
            padding: 8px;
            text-align: center;
        }
    }

}
</style>
