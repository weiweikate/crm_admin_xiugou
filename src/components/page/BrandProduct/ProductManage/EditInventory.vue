<template>
    <div class="inventory-list">
        <v-breadcrumb :nav='nav'></v-breadcrumb>
        <el-card :body-style="{ padding: '20px 40px' }">
            <el-form :model="form" ref="form" inline label-width="100px">
                <el-form-item prop="warehouseName" label="仓库名称">
                    <el-input v-model="form.warehouseName" placeholder="请输入仓库名称"></el-input>
                </el-form-item>
                <el-form-item prop="warehouseCode" label="仓库编码">
                    <el-input v-model="form.warehouseCode" placeholder="请输入仓库编码"></el-input>
                </el-form-item>
                <el-form-item prop="type" label="仓库类型">
                    <el-select v-model="form.type" placeholder="请选择仓库类型">
                        <el-option value="" label="全部"></el-option>
                        <el-option value="1" label="自建仓"></el-option>
                        <el-option value="2" label="加盟仓"></el-option>
                        <el-option value="3" label="供应商仓"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="">
                    <el-button type="primary" @click="getList(1)">搜索</el-button>
                    <el-button @click="resetForm('form')">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card :body-style="{ padding: '20px 40px' }" style='margin-top:20px'>
            <table class="table-area">
                <tr>
                    <td>fdfdsf</td>
                    <td>4343</td>
                    <td>dfsda</td>
                    <td>dfsda</td>
                </tr>
            </table>
            <el-table :data="tableData" border>
                <el-table-column prop="code" label="仓库编码" align="center"></el-table-column>
                <el-table-column prop="name" label="仓库名称" align="center"></el-table-column>
                <el-table-column prop="type" label="仓库类型" align="center">
                    <template slot-scope="scope">
                        <template v-if="scope.row.type==1">自建仓</template>
                        <template v-if="scope.row.type==2">加盟仓</template>
                        <template v-if="scope.row.type==3">供应商仓</template>
                    </template>
                </el-table-column>
                <el-table-column label="仓库库存" align="center">
                    <template slot-scope="scope">
                        <template v-if="scope.row.type!=3">{{scope.row.addressCityCode}}</template>
                        <template v-else>
                            <el-input-number v-model="scope.row.addressCityCode" :min="0"></el-input-number>
                        </template>
                    </template>
                </el-table-column>
                <el-table-column label="可售库存" align="center">
                    <template slot-scope="scope">
                        <el-input-number v-model="scope.row.productCount" :min="0" :max="scope.row.addressCityCode"></el-input-number>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button @click="openOrClose(scope.row,0)" type="primary" v-if="scope.row.status==1">关闭</el-button>
                        <el-button @click="openOrClose(scope.row,1)" type="primary" v-if="scope.row.status==2">开启</el-button>
                        <el-button @click="openOrClose(scope.row,2)" type="success" v-if="scope.row.status==2">保存</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <el-dialog :title="title[index]" :visible.sync="mask">
            <div style="text-align: center;font-size: 20px">{{info[index]}}</div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="sure('formMask')">确 认</el-button>
                <el-button @click="mask=false">取 消</el-button>
            </div>
        </el-dialog>
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
            nav: ['品牌产品管理', '产品管理', '产品库存管理', '库存编辑'],
            tableData: [],
            form: {
                date: [],
                status: '',
                warehouseName: '',
                warehouseCode: '',
                supplierName: '',
                type: ''
            },
            index: '',
            title: ['关闭', '开启'],
            info: ['确定要关闭可售库存', '确定要开启可售库存'],
            mask: false
        };
    },
    activated() {
        this.getList(this.page.currentPage);
    },
    methods: {
        // 获取数据
        getList(val) {
            const data = {
                warehouseName: this.form.warehouseName,
                warehouseCode: this.form.warehouseCode,
                type: this.form.type,
                page: val,
                pageSize: this.page.pageSize
            };
            this.page.currentPage = val;
            request.queryRepertoryList(data).then(res => {
                this.tableData = [];
                if (!res.data) return;
                this.tableData = res.data.data;
            }).catch(error => {
                console.log(error);
            });
        },
        // 重置表单
        resetForm(formName) {
            this.$refs[formName].resetFields();
            this.form.date = [];
            this.getList(this.page.currentPage);
        },
        // 停用启用
        openOrClose(row, num) {
            this.mask = true;
            this.index = num;
        },
        sure(formName) {
            this.mask = false;
            const data = {};
            this.btnLoading = true;
            request.startOrStopRepertory(data).then(res => {
                this.$message.success(res.msg);
                this.mask = false;
                this.getList(this.page.currentPage);
                this.btnLoading = false;
            });
        }
    }
};
</script>
<style lang='less' scoped>
.inventory-list {
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
