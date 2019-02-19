<template>
    <div class="invoice-info">
        <v-breadcrumb :nav="['结算管理','云仓结算管理','发货单']"></v-breadcrumb>
        <el-card :body-style="{ padding: '30px' }">
            <el-form :model="form" ref="form" inline>
                <el-form-item prop="time" label="发货时间">
                    <el-date-picker v-model="form.time" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                </el-form-item>
                <el-form-item label=" ">
                    <el-button type="primary" @click="queryForm(1)">查询</el-button>
                    <el-button @click="resetForm('form')">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card style="margin-top:20px" :body-style="{ padding: '30px' }">
            <mr-flying parentClass="content-box">
                <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page.currentPage" :page-size="page.pageSize" layout="total, prev, pager, next, jumper" :total="page.totalPage"></el-pagination>
            </mr-flying>
            <el-table :data="table" border>
                <el-table-column prop="no" label="编号" align="center"></el-table-column>
                <el-table-column prop="no" label="订单号" align="center"></el-table-column>
                <el-table-column prop="no" label="发货时间" align="center">
                    <template slot-scope="scope">
                        <span style="color:red">{{scope.row.no | handleMoney}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="no" label="发货数量" align="center"></el-table-column>
                <el-table-column prop="no" label="货品/重量/体积/数量" align="center">
                    <template slot-scope="scope">
                        <span style="color:red">{{scope.row.no | handleMoney}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="no" label="发货人" align="center"></el-table-column>
                <el-table-column prop="no" label="使用快递" align="center"></el-table-column>
                <el-table-column prop="no" label="物流费用" align="center">
                    <template slot-scope="scope">{{scope.row.no | handleMoney}}</template>
                </el-table-column>
                <el-table-column prop="no" label="状态" align="center"></el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button @click="showInfo(scope.row)" type="primary">订单详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>
import vBreadcrumb from '../../common/Breadcrumb.vue';
export default {
    components: { vBreadcrumb },

    data() {
        return {
            // 表单
            form: {
                time: []
            },
            table: [{ no: 123456789, id: 1 }, { no: 123456789, id: 1 }], // 表格信息
            page: {
                currentPage: 1,
                totalPage: 0
            }
        };
    },

    methods: {
        // 查询表单
        queryForm(val) {},
        // 查看详情
        showInfo(row) {
            this.isShowdia = true;
        },
        // 分页
        handleSizeChange(val) {},
        handleCurrentChange(val) {
            this.page.currentPage = val;
            this.queryForm(val);
        }
    }
};
</script>
<style lang='less' scoped>
.invoice-info {
    .block {
        margin: 10px 0 20px 0;
    }
    /deep/.el-dialog {
        border-radius: 10px;
        .el-dialog__header {
            border-bottom: 1px solid #ccc;
            .el-dialog__title {
                color: #ff6868;
            }
        }
    }
    .deposit-payment {
        text-align: center;
        font-size: 16px;
        line-height: 35px;
    }
}
</style>