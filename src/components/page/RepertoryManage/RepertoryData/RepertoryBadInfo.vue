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
                <el-table-column prop="name" label="产品名称" align="center"></el-table-column>
                <el-table-column prop="id" label="商品编码" align="center"></el-table-column>
                <el-table-column prop="code" label="颜色" align="center"></el-table-column>
                <el-table-column prop="type" label="版本" align="center"></el-table-column>
                <el-table-column prop="supplierId" label="规格" align="center"></el-table-column>
                <el-table-column prop="supplierId" label="类型" align="center"></el-table-column>
                <el-table-column prop="supplierId" label="订单号" align="center"></el-table-column>
                <el-table-column label="报损时间" align="center">
                    <template slot-scope="scope">{{scope.row.time|formatDateAll}}</template>
                </el-table-column>
                <el-table-column label="报损数" align="center">
                    <template slot-scope="scope">{{scope.row.num}}件</template>
                </el-table-column>
                <el-table-column prop="remark" label="备注" align="center"></el-table-column>
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
import utils from '@/utils/index.js';

export default {
    components: { vBreadcrumb },

    mixins: [myMixinTable],

    data() {
        return {
            nav: ['云仓仓库管理', '仓库管理', '仓库报损详情'],
            tableData: [],
            form: {
                date: []
            }
        };
    },
    activated() {
        this.getList(this.page.currentPage);
    },
    methods: {
        // 获取数据
        getList(val) {
            const data = {
                startTime: this.form.date ? utils.formatTime(this.form.createTime[0], 1) : '',
                endTime: this.form.date ? utils.formatTime(this.form.createTime[1], 1) : '',
                page: val,
                pageSize: this.page.pageSize
            };
            this.page.currentPage = val;
            request
                .getStoreList(data)
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
        //   重置表单
        resetForm(formName) {
            this.$refs[formName].resetFields();
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
