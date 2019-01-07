<template>
    <div class="order-info">
        <v-breadcrumb :nav='nav'></v-breadcrumb>
        <el-card :body-style="{ padding: '28px 50px' }">
            <div class="wrap">
                <div class="item-wrap">
                    <div class="title">订单基础信息</div>
                    <div class="item">
                        <span>平台订单号</span>
                        <span>{{orderInfo.platformOrderNo}}</span>
                    </div>
                    <div class="item">
                        <span>仓库订单号</span>
                        <span>{{orderInfo.warehouseOrderNo}}</span>
                    </div>
                    <div class="item">
                        <span>发货单号</span>
                        <span>{{orderInfo.dispatchNo}}</span>
                    </div>
                    <div class="item">
                        <span>物流费用</span>
                        <span>{{orderInfo.freightAmount | formatMoney}}</span>
                    </div>
                    <div class="item">
                        <span>发货单创建时间</span>
                        <span>{{orderInfo.createTime|formatDateAll}}</span>
                    </div>
                </div>

                <div class="item-wrap">
                    <div class="title">订单收货信息</div>
                    <div class="item">
                        <span>收货人姓名</span>
                        <span>{{orderInfo.receiver}}</span>
                    </div>
                    <div class="item">
                        <span>收货人联系方式</span>
                        <span>{{orderInfo.receiverPhone}}</span>
                    </div>
                    <div class="item">
                        <span>收货省市区</span>
                        <span>{{orderInfo.province}}{{orderInfo.city}}{{orderInfo.area}}</span>
                    </div>
                    <div class="item">
                        <span>收货详细地址</span>
                        <span>{{orderInfo.address}}</span>
                    </div>
                    <div class="item">
                        <span>配送方式</span>
                        <span>快递</span>
                    </div>
                </div>
            </div>
            <div class="goods-info">
                <div class="title">商品信息</div>
                <el-table :data="tableData" border :span-method="objectSpanMethod">
                    <el-table-column prop="expressName" label="物流公司" align="center"></el-table-column>
                    <el-table-column prop="expressNo" label="物流单号" align="center"></el-table-column>
                    <el-table-column label="发货时间" align="center">
                        <template slot-scope="scope">
                            {{scope.row.createTime|formatDateAll}}
                        </template>
                    </el-table-column>
                    <el-table-column label="商品信息" align="center" width="400">
                        <template slot-scope="scope">
                            <div class="name">
                                <img :src="scope.row.specImg" alt="">
                                <!--<span class="pro-name color-blue" @click="toH5(scope.row.prodCode)">{{scope.row.productName}}</span>-->
                                <span class="pro-name">{{scope.row.productName}}</span>
                                <span class="pro-spec">{{scope.row.spec}}</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="skuCode" label="SKU编码" align="center"></el-table-column>
                    <el-table-column prop="supplierSkuCode" label="供应商SKU编码" align="center"></el-table-column>
                    <el-table-column prop="skuNum" label="发货数量" align="center">
                    </el-table-column>
                </el-table>
            </div>
        </el-card>
        <product-dialog v-show="mask" :src="src" :mask="mask" @msg="closeMask"></product-dialog>
    </div>
</template>

<script>
    import vBreadcrumb from '@/components/common/Breadcrumb.vue';
    import productDialog from '@/components/common/ProductDialog';
    import { queryDictonary, myProductDialog } from '@/JS/commom';
    import request from '@/http/http.js';

    export default {
        components: { vBreadcrumb, productDialog },
        mixins: [queryDictonary, myProductDialog],
        data() {
            return {
                nav: ['订单管理', '发货单列表', '发货单详情'],
                deliveryNo: '',
                tableData: [],
                // 订单信息
                orderInfo: {},
                spanArr: [],
                position: 0
            };
        },

        activated() {
            // 获取订单信息
            this.deliveryNo = this.$route.query.sendedOrderInfoId;
            this.getInfo();
        },
        methods: {
            //  获取信息
            getInfo() {
                request
                    .deliveryNo({ dispatchNo: this.deliveryNo })
                    .then(res => {
                        this.tableData = [];
                        this.orderInfo = res.data;
                        res.data.sendOrderProducts.forEach((v, k) => {
                            const tempTitle = v.specTitle.split('@');
                            const tempValue = v.specValues.substring(1, v.specValues.length - 1).split('@');
                            v.spec = [];
                            tempTitle.forEach((v1, k1) => {
                                const temp = v1 + ':' + tempValue[k1] + '    ';
                                v.spec.push(temp);
                            });
                            v.spec = v.spec.join('  ');
                            this.tableData.push(v);
                        });
                        this.rowspan();
                    })
                    .catch(err => {
                        console.log(err);
                    });
            },
            rowspan() {
                this.tableData.forEach((item, index) => {
                    if (index === 0) {
                        this.spanArr.push(1);
                        this.position = 0;
                    } else {
                        if (this.tableData[index].expressNo === this.tableData[index - 1].expressNo) {
                            this.spanArr[this.position] += 1;
                            this.spanArr.push(0);
                        } else {
                            this.spanArr.push(1);
                            this.position = index;
                        }
                    }
                });
            },
            objectSpanMethod({ row, column, rowIndex, columnIndex }) {
                // 表格合并行
                if (columnIndex < 3) {
                    const _row = this.spanArr[rowIndex];
                    const _col = _row > 0 ? 1 : 0;
                    return {
                        rowspan: _row,
                        colspan: _col
                    };
                }
            }
        }
    };
</script>
<style lang='less'>
    .order-info {
        .title {
            margin-bottom: 10px;
        }
        .wrap {
            display: flex;
            justify-content: flex-start;
            .item-wrap {
                .item {
                    font-size: 14px;
                    color: #666666;
                    line-height: 30px;
                    margin-right: 100px;
                    span:first-child {
                        display: inline-block;
                        width: 100px;
                    }
                    span:nth-child(2) {
                        display: inline-block;
                    }
                }
            }
        }
        .goods-info {
            margin-top: 50px;
            .table-area {
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
            }
            .name {
                float: left;
                position: relative;
                display: inline-block;
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
        }
        .color-blue {
            color: #33b4ff;
            cursor: pointer;
        }
    }
</style>
