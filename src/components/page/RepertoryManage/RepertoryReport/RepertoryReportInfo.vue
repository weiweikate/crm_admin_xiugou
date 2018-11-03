<template>
    <div class="report-info">
        <v-breadcrumb :nav='nav'></v-breadcrumb>
        <el-card :body-style="{ padding: '20px 40px' }" style='margin-top:20px'>
            <table class="table-area">
                <tr>
                    <td>采购单</td>
                    <td colspan="8">{{detail.id}}</td>
                </tr>
                <tr>
                    <td>入库类型</td>
                    <td>
                        <template v-if="detail.type==1">采购入库</template>
                        <template v-if="detail.type==2">盘盈入库</template>
                        <template v-if="detail.type==3">调拨入库</template>
                    </td>
                    <td>入库单日期</td>
                    <td>{{detail.createTime|formatDateAll}}</td>
                    <td>状态</td>
                    <td colspan="2">
                        <template v-if="detail.type==1">采购入库</template>
                        <template v-if="detail.type==2">盘盈入库</template>
                        <template v-if="detail.type==3">调拨入库</template>
                    </td>
                    <td>出库方</td>
                    <td>{{detail.deliverWarehouseName}}</td>
                </tr>
                <tr>
                    <td>出库方仓库编码</td>
                    <td>{{detail.deliverWarehouseCode}}</td>
                    <td>入库方</td>
                    <td>{{detail.receiveWarehouseName}}</td>
                    <td>入库方仓库编码</td>
                    <td>{{detail.receiveWarehouseCode}}</td>
                    <td>入库方地址</td>
                    <td colspan="2">{{detail.receiveWarehouseAddress}}</td>
                </tr>
                <tr>
                    <td>入库单创建人</td>
                    <td>{{detail.contactUserName}}</td>
                    <td>联系方式</td>
                    <td>{{detail.contactPhone}}</td>
                    <td>送货人姓名</td>
                    <td colspan="2">{{detail.goodsSenderName}}</td>
                    <td>送货人联系方式</td>
                    <td colspan="2">{{detail.goodsSenderPhone}}</td>
                </tr>
                <tr>
                    <td>备注</td>
                    <td colspan="8">{{detail.remark}}</td>
                </tr>
            </table>
            <el-table :data="tableData" border>
                <el-table-column type="index" label="序号" align="center"></el-table-column>
                <el-table-column prop="name" label="产品名称" align="center"></el-table-column>
                <el-table-column prop="prodCode" label="产品ID" align="center"></el-table-column>
                <el-table-column prop="skuCode" label="商品编码" align="center"></el-table-column>
                <el-table-column prop="productCategory" label="产品类目" align="center"></el-table-column>
                <el-table-column prop="specifyValues" label="规格" align="center"></el-table-column>
                <el-table-column prop="estimateCount" label="预计入库数量" align="center"></el-table-column>
                <el-table-column label="实际入库数量" align="center">
                    <template slot-scope="scope">{{scope.row.estimateCount||'/'}}</template>
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
            nav: ['云仓仓库管理', '仓库单', '入库单详情'],
            tableData: [],
            detail: {},
            id: ''
        };
    },
    activated() {
        this.id = this.$route.query.reportInfoId || sessionStorage.getItem('reportInfoId');
        this.getDetail();
    },
    methods: {
        // 获取数据
        getDetail() {
            const data = {
                id: this.id
            };
            request.getNoteById(data).then(res => {
                if (!res.data) return;
                this.detail = res.data;
                this.tableData = [];
                res.data.spuList.forEach((v, k) => {
                    v.skuList.forEach((v1, k1) => {
                        this.tableData.push(v1);
                    });
                });
            }).catch(error => {
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
