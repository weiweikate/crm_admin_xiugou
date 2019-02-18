<template>
    <div class="product-order-list" v-loading="pageLoading">
        <el-table border :data="tableData">
            <el-table-column prop="serviceNo" label="售后单号" align="center"></el-table-column>
            <el-table-column prop="warehouseOrderNo" label="仓库订单号" align="center"></el-table-column>
            <el-table-column prop="productName" label="商品名称" align="center"></el-table-column>
            <el-table-column prop="skuCode" label="SKU编码" align="center"></el-table-column>
            <el-table-column prop="supplierSkuCode" label="供应商SKU编码" align="center">
                <template slot-scope="scope">
                    <template v-if="scope.row.supplierSkuCode">{{scope.row.supplierSkuCode}}</template>
                    <template v-else>/</template>
                </template>
            </el-table-column>
            <el-table-column prop="userPhone" label="用户账号" align="center"></el-table-column>
            <el-table-column prop="supplierName" label="供应商名称" align="center">
                <template slot-scope="scope">
                    <template v-if="scope.row.supplierName">{{scope.row.supplierName}}</template>
                    <template v-else>/</template>
                </template>
            </el-table-column>
            <el-table-column label="售后类型" align="center">
                <template slot-scope="scope">
                    <template v-if="scope.row.type==1">仅退款</template>
                    <template v-if="scope.row.type==2">退货退款</template>
                    <template v-if="scope.row.type==3">换货</template>
                </template>
            </el-table-column>
            <el-table-column label="售后状态" align="center">
                <template slot-scope="scope">
                    <template v-if="scope.row.status==1">待审核</template>
                    <template v-if="scope.row.status==2">待商品寄回</template>
                    <template v-if="scope.row.status==3">待仓库确认</template>
                    <template v-if="scope.row.status==4">待平台处理</template>
                    <template v-if="scope.row.status==5">售后完成</template>
                    <template v-if="scope.row.status==6">售后关闭</template>
                </template>
            </el-table-column>
            <el-table-column prop="reason" label="申请售后原因" align="center"></el-table-column>
            <el-table-column label="售后审核说明" align="center" class="text-title">
                <template slot-scope="scope">
                     <div class="text-title" :title="scope.row.remarks">
                        <template v-if="scope.row.remarks">{{scope.row.remarks}}</template>
                        <template v-else>/</template>
                     </div>
                </template>
            </el-table-column>
            <el-table-column label="回寄物流公司编码" align="center">
                <template slot-scope="scope">
                    <template v-if="scope.row.expressCode">{{scope.row.expressCode}}</template>
                    <template v-else>/</template>
                </template>
            </el-table-column>
            <el-table-column label="回寄物流单号" align="center">
                <template slot-scope="scope">
                    <template v-if="scope.row.expressNo">{{scope.row.expressNo}}</template>
                    <template v-else>/</template>
                </template>
            </el-table-column>
            <el-table-column label="售后处理说明" align="center">
                <template slot-scope="scope">
                    <div class="text-title" :title="scope.row.secRemarks">
                        <template v-if="scope.row.secRemarks">{{scope.row.secRemarks}}</template>
                        <template v-else>/</template>  
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="创建时间" align="center">
                <template slot-scope="scope">{{scope.row.createTime|formatDateAll}}</template>
            </el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <a :href="'#/afterSaleOrderInfo?afterSaleOrderInfoId='+`${scope.row.serviceNo}`" target="_blank" class="el-button el-button--small" :class="scope.row.status==1||scope.row.status==4?'el-button--primary':'el-button--success'">
                        <span v-if="scope.row.status==1||scope.row.status==4">去处理</span> 
                        <span v-else>查看</span> 
                    </a>
                </template>
            </el-table-column>
        </el-table>
        <div class="block">
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-size="page.pageSize" :current-page="page.currentPage" layout="total, prev, pager, next, jumper" :total="page.totalPage">
            </el-pagination>
        </div>
    </div>
</template>

<script>
import request from '@/http/http.js';
import { myMixinTable } from '@/JS/commom';
export default {
    mixins: [myMixinTable],
    data() {
        return {
            tableData: [],
            pageLoading: false,
            data: {}
        };
    },
    methods: {
        // 提交表单
        getList(val) {
            this.data.page = this.page.currentPage;
            this.data.size = this.page.pageSize;
            this.tableData = [];
            this.pageLoading = true;
            this.data = this.$utils.trimForm(this.data);
            request
                .queryAfterSalePage(this.data)
                .then(res => {
                    this.pageLoading = false;
                    this.tableData = res.data ? res.data.data : [];
                    this.page.totalPage = res.data.totalNum;
                })
                .catch(err => {
                    this.pageLoading = false;
                    console.log(err);
                });
        }
    }
};
</script>

<style lang='less' scoped>
.product-order-list {
    .order-list-table {
        font-size: 12px;
        width: 100%;
        color: #606266;
        border: 1px solid #ebeef5;
        border-collapse: collapse;
        margin-bottom: 20px;
        line-height: 23px;
        td {
            border: 1px solid #ebeef5;
            padding: 8px;
            text-align: center;
        }
        .head {
            background: #33b4ff;
            color: #fff;
            text-align: left;
            div {
                display: inline-block;
                width: 20%;
            }
        }
        .marl20 {
            margin-left: 20px;
        }
        .name {
            float: left;
            position: relative;
            height: 100px;
            text-align: left;
            img {
                position: absolute;
                width: 100px;
                height: 100px;
                border-radius: 5px;
                border: 1px solid #eee;
            }
            .pro-name {
                position: absolute;
                top: 5px;
                left: 115px;
                width: 270px;
            }
            .pro-spec {
                position: absolute;
                left: 115px;
                bottom: 5px;
                width: 270px;
            }
        }
        .num {
            margin-left: 20px;
        }
        .order-status {
            margin-bottom: 10px;
        }
        .color-blue {
            color: #33b4ff;
            cursor: pointer;
        }
        .text-left {
            text-align: left;
        }
    }
    .block {
        margin: 20px 0px;
    }
    .text-title {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
}
</style>
