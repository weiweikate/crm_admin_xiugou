<template>
    <div class="order-info">
        <v-breadcrumb :nav='nav'></v-breadcrumb>
        <el-card :body-style="{ padding: '28px 50px' }">
            <div class="wrap">
                <div class="item-wrap">
                    <div class="title">订单基础信息</div>
                    <div class="item">
                        <span>平台订单号</span>
                        <span>{{customerServiceInfos.platformOrderNo}}</span>
                    </div>
                    <div class="item">
                        <div>仓库订单号</div>
                        <div>{{customerServiceInfos.warehouseOrderNo}}</div>
                    <div class="item">
                        <span>支付方式</span>
                        <span>{{customerServiceInfos.orderNum}}</span>
                    </div>
                    <!--待付款，交易完成-->
                    <div class="item" v-if="customerServiceInfos.status==1&&customerServiceInfos.status==4">
                        <span>用户留言</span>
                        <span>{{warehouseOrder.message}}</span>
                    </div>
                    <!--已发货，交易完成-->
                    <div class="item" v-if="customerServiceInfos.status==3&&customerServiceInfos.status==4">
                        <span>平台备注</span>
                        <span>{{warehouseOrder.platformRemarks}}</span>
                    </div>
                    <div class="item">
                        <span>下单时间</span>
                        <span>{{customerServiceInfos.orderTime|formatDateAll}}</span>
                    </div>
                    <!--已付款，已发货，交易关闭-->
                    <div class="item" v-if="customerServiceInfos.status>1&&customerServiceInfos.status<5">
                        <span>付款时间</span>
                        <span>{{customerServiceInfos.payTime|formatDateAll}}</span>
                    </div>
                    <!--已发货-->
                    <div class="item" v-if="customerServiceInfos.status==3">
                        <span>发货时间</span>
                        <span>{{warehouseOrder.deliverTime|formatDateAll}}</span>
                    </div>
                    <!--交易完成-->
                    <div class="item" v-if="customerServiceInfos.status==4">
                        <span>成交时间</span>
                        <span>{{customerServiceInfos.orderNum}}</span>
                    </div>
                    <!--交易关闭-->
                    <div class="item" v-if="customerServiceInfos.status==5">
                        <span>关闭原因</span>
                        <span>{{customerServiceInfos.orderNum}}</span>
                    </div>
                </div>
                <div class="item-wrap">
                    <div class="title">订单支付信息</div>
                    <div class="item">
                        <span>商品总额</span>
                        <span>¥{{customerServiceInfos.totalAmount||0}}</span>
                    </div>
                    <div class="item">
                        <span>运费</span>
                        <span>¥{{customerServiceInfos.freightAmount||0}}</span>
                    </div>
                    <div class="item">
                        <span>应付金额</span>
                        <span>¥{{customerServiceInfos.totalAmount||0+customerServiceInfos.freightAmount||0}}</span>
                    </div>
                    <div class="item">
                        <span>促销优惠</span>
                        <span>¥{{customerServiceInfos.promotionAmount||0}}</span>
                    </div>
                    <div class="item">
                        <span>优惠券</span>
                        <span>¥{{customerServiceInfos.couponAmount||0}}</span>
                    </div>
                    <div class="item">
                        <span>一元券</span>
                        <span>¥{{customerServiceInfos.tokenCoinAmount||0}}</span>
                    </div>
                    <!--已付款,已发货，交易完成，交易关闭-->
                    <div class="item" v-if="customerServiceInfos.status!=1">
                        <span>余额支付</span>
                        <span>¥{{customerServiceInfos.accountPayAmount||0}}</span>
                    </div>
                    <div class="item" v-if="customerServiceInfos.status!=1">
                        <span>第三方支付</span>
                        <span>¥{{customerServiceInfos.cashPayAmount||0}}</span>
                    </div>
                    <div class="item" v-if="customerServiceInfos.status!=1">
                        <span>开票余额</span>
                        <span>¥{{customerServiceInfos.invoiceAmount||0}}</span>
                    </div>
                    <div class="item" v-if="customerServiceInfos.status!=1">
                        <span>实付金额</span>
                        <span>¥{{customerServiceInfos.payAmount||0}}</span>
                    </div>
                </div>
                <div class="item-wrap">
                    <div class="title">订单发票信息</div>
                    <div class="item">
                        <span>开具发票</span>
                        <span>{{orderInvoiceInfo.orderNum}}</span>
                    </div>
                    <!--待付款，交易完成-->
                    <div class="item" v-if="customerServiceInfos.status==1&&customerServiceInfos.status==4">
                        <span>发票类型</span>
                        <span>{{orderInvoiceInfo.type}}</span>
                    </div>
                    <div class="item" v-if="customerServiceInfos.status==1">
                        <span>发票抬头</span>
                        <span>{{orderInvoiceInfo.title}}</span>
                    </div>
                    <div class="item" v-if="customerServiceInfos.status==1">
                        <span>发票内容</span>
                        <span>{{orderInvoiceInfo.content}}</span>
                    </div>
                    <div class="item" v-if="customerServiceInfos.status==1">
                        <span>发票金额</span>
                        <span>{{orderInvoiceInfo.amount}}</span>
                    </div>
                    <!--交易完成-->
                    <div class="item" v-if="customerServiceInfos.status>=4">
                        <span>单位名称</span>
                        <span>{{orderInvoiceInfo.company}}</span>
                    </div>
                    <div class="item" v-if="customerServiceInfos.status>=4">
                        <span>纳税人识别号</span>
                        <span>{{orderInvoiceInfo.taxpayerNo}}</span>
                    </div>
                    <div class="item" v-if="customerServiceInfos.status>=4">
                        <span>注册电话</span>
                        <span>{{orderInvoiceInfo.regPhone}}</span>
                    </div>
                    <div class="item" v-if="customerServiceInfos.status>=4">
                        <span>开户银行</span>
                        <span>{{orderInvoiceInfo.depositBank}}</span>
                    </div>
                    <div class="item" v-if="customerServiceInfos.status>=4">
                        <span>银行账户</span>
                        <span>{{orderInvoiceInfo.bankAccount}}</span>
                    </div>
                </div>
                <div class="item-wrap">
                    <div class="title">订单收货信息</div>
                    <div class="item">
                        <span>收货人姓名</span>
                        <span>{{customerServiceInfos.receiver}}</span>
                    </div>
                    <div class="item">
                        <span>收货人联系方式</span>
                        <span>{{customerServiceInfos.receiverPhone}}</span>
                    </div>
                    <div class="item">
                        <span>收货省市区</span>
                        <span>{{customerServiceInfos.province}}{{customerServiceInfos.city}}{{customerServiceInfos.area}}</span>
                    </div>
                    <div class="item">
                        <span>收货详细地址</span>
                        <span>{{customerServiceInfos.address}}</span>
                    </div>
                    <div class="item">
                        <span>配送方式</span>
                        <span>{{customerServiceInfos.orderNum}}</span>
                    </div>
                </div>
            </div>
                <div class="goods-info">
                <div class="title">商品信息</div>
                <table border :data="tableData" class="table-area">
                    <thead>
                        <tr>
                            <td rowspan="2">商品信息</td>
                            <td rowspan="2">SKU编码</td>
                            <td rowspan="2">供应商SKU编码</td>
                            <td rowspan="2">应付单价</td>
                            <td rowspan="2">实付单价</td>
                            <td rowspan="2">数量</td>
                            <td rowspan="2">实付金额</td>
                            <td rowspan="2">发货仓库</td>
                            <td colspan="3">物流信息</td>
                            <td colspan="2">售后信息</td>
                        </tr>
                        <tr>
                            <td>物流公司</td>
                            <td>物流单号</td>
                            <td>商品数量</td>
                            <td>售后状态</td>
                            <td>售后数量</td>
                        </tr>
                    </thead>
                    <tbody v-for="(v,k) in tableData" :key="k">
                        <tr v-for="(v1,k1) in v.rows" :key="k1">
                            <td :rowspan="v.rows" v-if="k1==0" style="width: 400px">
                               <div class="name">
                                    <img :src="v.specImg" alt="">
                                    <span class="pro-name color-blue" @click="$router.push({path:'/productInfo',query:{productInfoId:v.productId}})">{{v.productName}}</span>
                                    <span class="pro-spec">{{v.spec}}</span>
                                </div>
                            </td>
                            <td :rowspan="v.rows" v-if="k1==0">{{v.skuCode}}</td>
                            <td :rowspan="v.rows" v-if="k1==0">{{v.supplierSkuCode}}</td>
                            <td :rowspan="v.rows" v-if="k1==0">{{v.unitPrice}}</td>
                            <td :rowspan="v.rows" v-if="k1==0">{{v.unitPrice}}</td>
                            <td :rowspan="v.rows" v-if="k1==0">{{v.unitPrice}}</td>
                            <td :rowspan="v.rows" v-if="k1==0">{{v.payAmount}}</td>
                            <td :rowspan="v.rows" v-if="k1==0">{{v.price}}</td>
                            <td>{{v.express_name}}</td>
                            <td>{{v.express_no}}</td>
                            <td :rowspan="v.rows" v-if="k1==0">{{v.price}}</td>
                            <td>{{v.price}}</td>
                            <td>{{v.price}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            </div>
        </el-card>
    </div>
</template>

<script>
    import vBreadcrumb from '@/components/common/Breadcrumb.vue';
    import utils from '@/utils/index.js';
    import { queryDictonary } from '@/JS/commom';
    import request from '@/http/http.js';

    export default {
        components: { vBreadcrumb },
        mixins: [queryDictonary],
        data() {
            return {
                nav: ['订单管理', '订单详情'],
                detailUrl: '',
                warehouseOrderNo: '',
                isShowPop: false, // 订单标记颜色是否显示
                orderStatus: '', // 总订单状态: 1:待支付 2:待发货 3:待收货 4:确认收货 5:已完成 6:退货关闭 7:用户关闭 8:超时关闭
                markArr: [
                    { label: 'red', value: '1' },
                    { label: 'skyblue', value: '2' },
                    { label: 'lightgreen', value: '3' },
                    { label: 'orange', value: '4' },
                    { label: 'purple', value: '5' }
                ],
                tableData: [],
                // 订单信息
                customerServiceInfos: {},
                expressInfos: {},
                orderInvoiceInfo: {},
                warehouseOrder: {}
            };
        },

        created() {
            // 获取订单信息
            this.warehouseOrderNo = this.$route.query.orderInfoId;
            this.getInfo();
        },
        methods: {
            //  获取信息
            getInfo() {
                request.orderDetail({ id: this.warehouseOrderNo }).then(res => {
                    this.customerServiceInfos = res.data.customerServiceInfos;
                    this.expressInfos = res.data.expressInfos;
                    this.orderInvoiceInfo = res.data.orderInvoiceInfo;
                    this.warehouseOrder = res.data.warehouseOrder;
                    this.tableData = [];
                    res.data.productOrders.forEach((v, k) => {
                        // if (k == 0) {
                        //     v.returnProductList = [{ id: 1, salesStatus: '11' }, { id: 1, salesStatus: '22' }];
                        //     v.logicList = [{ id: 1, logicStatus: '11' }];
                        // } else {
                        //     v.returnProductList = [{ id: 2, salesStatus: '11' }];
                        //     v.logicList = [{ id: 2, logicStatus: '11' }, { id: 2, logicStatus: '22' }];
                        // }
                        // const length = v.returnProductList.length > v.logicList.length ? v.returnProductList.length : v.logicList.length;
                        // v.rows = length;
                        this.tableData.push(v);
                        console.log(this.tableData);
                    });
                }).catch(err => {
                    console.log(err);
                });
            }
        }
    };
</script>
<style lang='less'>
    .order-info {
        .title{
            margin-bottom: 10px;
        }
        .wrap{
            display: flex;
            justify-content: space-between;
            .item-wrap{
                .item{
                    font-size: 14px;
                    color: #666666;
                    line-height: 30px;
                    span:first-child{
                        display: inline-block;
                        width: 100px;
                    }
                    span:nth-child(2){
                        display: inline-block;
                    }
                }
            }
        }
        .goods-info{
            margin-top: 50px;
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
                    bottom:5px;
                    width: 270px;
                }
            }
        }
        .color-blue{
            color: #33b4ff;
            cursor: pointer;
        }
    }
</style>
