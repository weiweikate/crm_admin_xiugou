<template>
    <div class="inventory-list">
        <v-breadcrumb :nav='nav'></v-breadcrumb>
        <el-card :body-style="{ padding: '20px 40px' }">
            <el-form :model="form" ref="form" inline label-width="100px">
                <el-form-item prop="name" label="仓库名称">
                    <el-input v-model="form.name" placeholder="请输入仓库名称"></el-input>
                </el-form-item>
                <el-form-item prop="code" label="仓库编码">
                    <el-input v-model="form.code" placeholder="请输入仓库编码"></el-input>
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
                    <td style="width: 40%;text-align: left">
                        <div class="product-img">
                            <img :src="productInfo.imgUrl">
                        </div>
                        <p class="product-name">{{productInfo.name}}</p>
                        <p class="product-id">产品ID：{{productInfo.prodCode}}</p>
                    </td>
                    <td v-for="(v,k) in productInfo.specValues" :key="k">{{v}}</td>
                    <td>{{productInfo.stockUnit}}</td>
                </tr>
            </table>
            <el-table :data="tableData" border v-loading="tableLoading">
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
                        <template v-if="scope.row.type!=3">{{scope.row.warehouseStock}}</template>
                        <template v-else>
                            <el-input-number v-model="scope.row.warehouseStock" :min="0"></el-input-number>
                        </template>
                    </template>
                </el-table-column>
                <el-table-column label="可售库存" align="center">
                    <template slot-scope="scope">
                        <el-input-number v-model="scope.row.stock" :disabled="scope.row.status==0" :min="0" :max="scope.row.warehouseStock"></el-input-number>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button @click="openOrClose(scope.row,0,scope.$index)" type="primary" v-if="scope.row.status==1">关闭</el-button>
                        <el-button @click="openOrClose(scope.row,1,scope.$index)" type="primary" v-if="scope.row.status==0">开启</el-button>
                        <el-button @click="saveMsg(1)" :loading="btnLoading" type="success" v-if="scope.row.status!=0">保存</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div style="margin-top: 20px">
                <el-button @click="$router.push({path:'/productInventory'})" type="primary">取消</el-button>
                <el-button type="success" @click="saveMsg(1)">保存</el-button>
            </div>
        </el-card>
        <el-dialog :title="title[index]" :visible.sync="mask">
            <div style="text-align: center;font-size: 20px">{{info[index]}}</div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" :loading="btnLoading" @click="saveMsg(2)">确 认</el-button>
                <el-button @click="mask=false">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import vBreadcrumb from '@/components/common/Breadcrumb.vue';
import moment from 'moment';
import request from '@/http/http.js';

export default {
    components: { vBreadcrumb },

    data() {
        return {
            nav: ['品牌产品管理', '产品管理', '产品库存管理', '库存编辑'],
            productInfo: {
                specValues: []
            },
            tableData: [],
            form: {
                date: [],
                status: '',
                name: '',
                code: '',
                supplierName: '',
                type: ''
            },
            index: '',
            title: ['关闭', '开启'],
            info: ['确定要关闭可售库存', '确定要开启可售库存'],
            mask: false,
            id: '',
            row: {},
            btnLoading: false,
            tableLoading: false
        };
    },
    activated() {
        this.id = this.$route.query.editInventoryId || sessionStorage.getItem('editInventoryId');
        this.getList();
    },
    methods: {
        // 获取数据
        getList() {
            const data = {
                priceId: this.id,
                name: this.form.name,
                code: this.form.code,
                type: this.form.type
            };
            request.queryProductSpecStockDetailsList(data).then(res => {
                this.tableData = [];
                this.productInfo = {
                    specValues: []
                };
                if (!res.data) return;
                this.productInfo = res.data.productExt;
                this.productInfo.specValues = res.data.productExt.spec.split('-');
                this.tableData = res.data.list;
            }).catch(error => {
                console.log(error);
            });
        },
        // 重置表单
        resetForm(formName) {
            this.$refs[formName].resetFields();
            this.form.date = [];
            this.getList();
        },
        // 停用启用
        openOrClose(row, num) {
            this.mask = true;
            this.index = num;
            this.row = row;
        },
        // 保存表单信息
        saveMsg(num) {
            const data = {};
            data.productSpecStockVOList = [];
            this.tableData.forEach((v, k) => {
                const temp = {
                    id: v.id,
                    type: v.type,
                    status: num == 2 ? 1 - v.status : v.status,
                    stock: v.stock,
                    warehouseStock: v.warehouseStock
                };
                data.productSpecStockVOList.push(temp);
            });
            this.tableLoading = num == 1;
            this.btnLoading = num == 2;
            request.updateProductSpecStock(data).then(res => {
                this.$message.success(res.msg);
                this.mask = false;
                this.row.status = 1 - this.row.status;
                this.getList();
                this.tableLoading = false;
                this.btnLoading = false;
            }).catch(err => {
                this.tableLoading = false;
                this.btnLoading = false;
                this.mask = false;
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
        .product-img {
            display: inline-block;
            float: left;
            width: 80px;
            height: 80px;
            border: 1px solid #ddd;
            overflow: hidden;
            img {
                width: 60px;
                height: 60px;
                margin: 10px;
            }
        }
        .product-name {
            float: left;
            width: 65%;
            height: auto;
            margin: 5px 0 0 20px;
        }
        .product-id {
            float: left;
            width: 65%;
            height: auto;
            margin: 20px 0 0 20px;
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
