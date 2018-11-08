<template>
    <div class="inventoryInfo-list">
        <v-breadcrumb :nav='nav'></v-breadcrumb>
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
            <el-table :data="tableData" border>
                <el-table-column prop="code" label="仓库编码" align="center"></el-table-column>
                <el-table-column prop="name" label="仓库名称" align="center"></el-table-column>
                <el-table-column prop="id" label="仓库ID" align="center"></el-table-column>
                <el-table-column prop="type" label="仓库类型" align="center">
                    <template slot-scope="scope">
                        <template v-if="scope.row.type==1">自建仓</template>
                        <template v-if="scope.row.type==2">加盟仓</template>
                        <template v-if="scope.row.type==3">供应商仓</template>
                    </template>
                </el-table-column>
                <el-table-column prop="warehouseStock" label="仓库库存" align="center"></el-table-column>
                <el-table-column prop="stock" label="可售库存" align="center"></el-table-column>
            </el-table>
            <div style="margin-top: 20px">
                <el-button @click="$router.push({path:'/productInventory'})" type="primary">返回</el-button>
            </div>
        </el-card>

    </div>
</template>

<script>
    import vBreadcrumb from '@/components/common/Breadcrumb.vue';
    import request from '@/http/http.js';

    export default {
        components: { vBreadcrumb },

        data() {
            return {
                nav: ['品牌产品管理', '产品管理', '产品库存管理', '库存查看'],
                tableData: [],
                productInfo: {
                    specValues: []
                },
                id: ''
            };
        },
        activated() {
            this.id = this.$route.query.inventoryInfoId || sessionStorage.getItem('inventoryInfoId');
            this.getList();
        },
        methods: {
            // 获取数据
            getList() {
                const data = {
                    priceId: this.id
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
            }
        }
    };
</script>
<style lang='less' scoped>
    .inventoryInfo-list {
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
