<template>
    <div class="repertory-list">
        <v-breadcrumb :nav='nav'></v-breadcrumb>
        <el-card :body-style="{ padding: '20px 40px' }" style='margin-top:20px'>
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
            <el-table :data="tableData" border>
                <el-table-column type="index" label="序号" align="center"></el-table-column>
                <el-table-column prop="name" label="产品名称" align="center"></el-table-column>
                <el-table-column prop="skuCode" label="商品SKU编码" align="center"></el-table-column>
                <template v-for='(v,k) in headData'>
                    <el-table-column :show-overflow-tooltip="true" :prop="v.value" :label="v.name" :key="k" align="center">
                    </el-table-column>
                </template>
                <el-table-column label="仓库总库存数" align="center">
                    <template slot-scope="scope">{{scope.row.totalCount}}件</template>
                </el-table-column>
                <el-table-column label="仓库剩余库存" align="center">
                    <template slot-scope="scope">{{scope.row.remainderCount}}件</template>
                </el-table-column>
                <el-table-column label="冻结库存" align="center">
                    <template slot-scope="scope">{{scope.row.blockCount}}件</template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>
import vBreadcrumb from '@/components/common/Breadcrumb.vue';
import { myMixinTable } from '@/JS/commom';
import request from '@/http/http.js';

export default {
    components: { vBreadcrumb },

    mixins: [myMixinTable],

    data() {
        return {
            nav: ['云仓仓库管理', '仓库管理', '仓库存货数'],
            tableData: [],
            productId: '',
            warehouseId: '',
            headData: [] // 规格表头
        };
    },
    mounted() {
        this.productId = this.$route.query.repertoryInventoryInfoId;
        this.warehouseId = this.$route.query.warehouseId;
        this.getList(this.page.currentPage);
    },
    methods: {
        // 获取数据
        getList(val) {
            const data = {
                prodCode: this.productId,
                warehouseCode: this.warehouseId,
                page: val,
                pageSize: this.page.pageSize
            };
            this.page.currentPage = val;
            request
                .SKUListByProductId(data)
                .then(res => {
                    this.tableData = [];
                    if (!res.data) return;
                    this.tableData = res.data.data;
                    this.page.totalPage = res.data.totalNum;
                    res.data.data.forEach((v, k) => {
                        this.headData = [];
                        if (!v.specifies || !v.specifyValues) return;
                        const specs = v.specifies.split('-');
                        const specValues = v.specifyValues.split('-');
                        specs.forEach((v1, k1) => {
                            const temp = {
                                value: v1,
                                name: v1
                            };
                            this.headData.push(temp);
                            this.tableData[k][v1] = specValues[k1];
                        });
                    });
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }
};
</script>
<style lang='less' scoped>
.repertory-list {
    .block {
        margin: 10px 0;
    }
    .color-blue {
        color: #33b4ff;
        cursor: pointer;
    }
    /*弹窗样式*/
    /deep/.el-dialog {
        width: 530px;
        border-radius: 10px;
        .el-dialog__header {
            border-bottom: 1px solid #eee;
            padding: 20px 20px 10px;
        }
        .el-dialog__title {
            color: #ff6868;
        }
        .el-input {
            display: inline;
        }
        .el-input__inner {
            width: 360px;
        }
        .el-dialog__footer {
            margin-right: 30px;
        }
    }
}
</style>
