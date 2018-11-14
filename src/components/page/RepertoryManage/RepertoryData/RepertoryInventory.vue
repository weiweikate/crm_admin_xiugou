<template>
    <div class="repertory-list">
        <v-breadcrumb :nav='nav'></v-breadcrumb>
        <el-card :body-style="{ padding: '20px 40px' }">
            <el-form :model="form" ref="form" inline label-width="100px">
                <el-form-item prop="productName" label="产品名称">
                    <el-input v-model="form.productName" placeholder="请输入产品名称"></el-input>
                </el-form-item>
                <el-form-item prop="prodCode" label="产品ID">
                    <el-input v-model="form.prodCode" placeholder="请输入产品ID"></el-input>
                </el-form-item>
                <el-form-item prop="supplierName" label="供应商名称">
                    <el-input v-model="form.supplierName" placeholder="请输入供应商名称"></el-input>
                </el-form-item>
                <el-form-item prop="supplierCode" label="供应商ID">
                    <el-input v-model="form.supplierCode" placeholder="请输入供应商ID"></el-input>
                </el-form-item>
                <el-form-item label="">
                    <el-button type="primary" @click="getList(1)">搜索</el-button>
                    <el-button @click="resetForm('form')">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card :body-style="{ padding: '20px 40px' }" style='margin-top:20px'>
            <div style="margin-bottom: 20px;font-size: 14px">仓库编码：{{code}}  <span style="margin-left: 30px">仓库名称：{{name}}</span></div>
            <el-table :data="tableData" border>
                <el-table-column type="index" label="序号" align="center"></el-table-column>
                <el-table-column prop="name" label="产品名称" align="center"></el-table-column>
                <el-table-column prop="prodCode" label="产品ID" align="center"></el-table-column>
                <el-table-column prop="productCategory" label="产品类目" align="center"></el-table-column>
                <el-table-column prop="supplierName" label="供应商名称" align="center"></el-table-column>
                <el-table-column prop="supplierCode" label="供应商ID" align="center"></el-table-column>
                <el-table-column label="仓库总库存数" align="center">
                    <template slot-scope="scope">{{scope.row.totalCount||0}}件</template>
                </el-table-column>
                <el-table-column label="仓库剩余库存" align="center">
                    <template slot-scope="scope">{{scope.row.remainderCount||0}}件</template>
                </el-table-column>
                <el-table-column label="冻结库存" align="center">
                    <template slot-scope="scope">{{scope.row.blockCount||0}}件</template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button @click="showInfo(scope.row)" type="primary">详情</el-button>
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
            nav: ['云仓仓库管理', '仓库管理', '仓库存货数'],
            tableData: [],
            form: {},
            warehouseId: '',
            code: '',
            name: ''
        };
    },
    activated() {
        this.warehouseId = this.$route.query.repertotyId || sessionStorage.getItem('repertotyId');
        this.getDetail();
        this.getList(this.page.currentPage);
    },
    methods: {
        // 获取数据
        getList(val) {
            const data = {
                productName: this.form.productName,
                supplierName: this.form.supplierName,
                prodCode: this.form.prodCode,
                supplierCode: this.form.supplierCode,
                warehouseId: this.warehouseId,
                page: val,
                pageSize: this.page.pageSize
            };
            this.page.currentPage = val;
            request
                .getSPUList(data)
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
        // 查看详情
        showInfo(row) {
            sessionStorage.setItem('repertoryInventoryInfoId', row.id);
            sessionStorage.setItem('warehouseId', this.warehouseId);
            this.$router.push({
                path: 'repertoryInventoryInfo',
                query: { repertoryInventoryInfoId: row.id, warehouseId: this.warehouseId }
            });
        },
        getDetail() {
            const data = {
                id: this.warehouseId
            };
            request.queryRepertoryById(data).then(res => {
                this.name = res.data.name;
                this.code = res.data.code;
            }).catch(err => {
                console.log(err);
            });
        },
        // 重置表单
        resetForm(formName) {
            this.$refs[formName].resetFields();
            this.getList(this.page.currentPage);
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
