<template>
    <div class="repertory-list">
        <v-breadcrumb :nav='nav'></v-breadcrumb>
        <el-card :body-style="{ padding: '20px 40px' }">
            <el-form :model="form" ref="form" inline label-width="100px">
                <el-form-item prop="date" label="报损时间">
                    <el-date-picker type="datetimerange" format="yyyy-MM-dd" v-model="form.date" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
                </el-form-item>
                <el-form-item label="">
                    <el-button type="primary" @click="getList(1)">搜索</el-button>
                    <el-button @click="resetForm('form')">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card :body-style="{ padding: '20px 40px' }" style='margin-top:20px'>
            <el-table :data="tableData" border>
                <el-table-column type="index" label="序号" align="center"></el-table-column>
                <el-table-column prop="serviceNo" label="售后单号" align="center"></el-table-column>
                <el-table-column prop="warehouseOrderNo" label="仓库订单号" align="center"></el-table-column>
                <el-table-column prop="productName" label="产品名称" align="center"></el-table-column>
                <el-table-column prop="skuCode" label="商品SKU编码" align="center"></el-table-column>
                <template v-for='(v,k) in headData'>
                    <el-table-column :show-overflow-tooltip="true" :prop="v.value" :label="v.name" :key="k" align="center">
                    </el-table-column>
                </template>
                <el-table-column label="报损时间" align="center">
                    <template slot-scope="scope">{{scope.row.updateTime|formatDateAll}}</template>
                </el-table-column>
                <el-table-column label="报损数" align="center">
                    <template slot-scope="scope">{{scope.row.defectiveQuantity||0}}件</template>
                </el-table-column>
                <el-table-column prop="remark" label="备注" align="center"></el-table-column>
            </el-table>
            <div class="block">
                <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page.currentPage" :page-size="page.pageSize" layout="total, prev, pager, next, jumper" :total="page.totalPage">
                </el-pagination>
            </div>
        </el-card>
    </div>
</template>

<script>
import vBreadcrumb from '@/components/common/Breadcrumb.vue';
import { myMixinTable } from '@/JS/commom';
import moment from 'moment';
import request from '@/http/http.js';

export default {
    components: { vBreadcrumb },

    mixins: [myMixinTable],

    data() {
        return {
            nav: ['云仓仓库管理', '仓库管理', '仓库报损详情'],
            tableData: [],
            form: {
                date: []
            },
            warehouseCode: '',
            prodCode: '',
            headData: [] // 规格表头
        };
    },
    mounted() {
        this.prodCode = this.$route.query.repertoryInfoId || sessionStorage.getItem('repertoryInfoId');
        this.warehouseCode = this.$route.query.warehouseCode || sessionStorage.getItem('warehouseCode');
        this.getList(this.page.currentPage);
    },
    methods: {
        // 获取数据
        getList(val) {
            const data = {
                prodCode: this.prodCode,
                warehouseCode: this.warehouseCode,
                startTime: this.form.date[0] ? moment(this.form.date[0]).format('YYYY-MM-DD 00:00:00') : '',
                endTime: this.form.date[1] ? moment(this.form.date[0]).format('YYYY-MM-DD 23:59:59') : '',
                page: val,
                pageSize: this.page.pageSize
            };
            this.page.currentPage = val;
            request
                .stockLossDetail(data)
                .then(res => {
                    this.tableData = [];
                    if (!res.data) return;
                    this.tableData = res.data.data;
                    this.page.totalPage = res.data.totalNum;
                    res.data.data.forEach((v, k) => {
                        this.headData = [];
                        if (!v.specTitle || !v.specValue) return;
                        const specs = v.specTitle.split('-');
                        const specValues = v.specValue.split('-');
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
        },
        //   重置表单
        resetForm(formName) {
            this.$refs[formName].resetFields();
            this.form.date = [];
            this.getList(1);
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
