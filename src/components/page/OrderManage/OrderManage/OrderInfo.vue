<template>
    <div class="order-info">
        <v-breadcrumb :nav='nav'></v-breadcrumb>
        <el-card :body-style="{ padding: '28px 50px' }">
            <div class="wrap">
                <div class="item-wrap">
                    <div class="title">订单基础信息</div>
                    <div class="item">
                        <span>平台订单号</span>
                        <span>{{warehouseOrder.platformOrderNo}}</span>
                    </div>
                    <div class="item">
                        <span>仓库订单号</span>
                        <span>{{warehouseOrder.warehouseOrderNo}}</span>
                    </div>
                    <div class="item">
                        <span>支付方式</span>
                        <span>{{payType||`/`}}</span>
                    </div>
                    <!--待付款，交易完成-->
                    <div class="item" v-if="warehouseOrder.status==1||warehouseOrder.status==4">
                        <span>用户留言</span>
                        <span>{{warehouseOrder.message||`/`}}</span>
                    </div>
                    <!--已发货，交易完成-->
                    <div class="item" v-if="warehouseOrder.status==3||warehouseOrder.status==4">
                        <span>平台备注</span>
                        <span>{{warehouseOrder.platformRemarks||`/`}}</span>
                    </div>
                    <div class="item">
                        <span>下单时间</span>
                        <span>{{platformOrder.orderTime|formatDateAll}}</span>
                    </div>
                    <!--已付款，已发货，交易关闭-->
                    <div class="item" v-if="warehouseOrder.status>1&&warehouseOrder.status<5">
                        <span>付款时间</span>
                        <span>{{orderPayInfo.payTime|formatDateAll}}</span>
                    </div>
                    <!--已发货-->
                    <div class="item" v-if="warehouseOrder.status==3">
                        <span>发货时间</span>
                        <span>{{warehouseOrder.deliverTime|formatDateAll}}</span>
                    </div>
                    <!--交易完成-->
                    <div class="item" v-if="warehouseOrder.status==4">
                        <span>成交时间</span>
                        <span>{{warehouseOrder.autoReceiveTime|formatDateAll}}</span>
                    </div>
                    <!--交易关闭-->
                    <div class="item" v-if="warehouseOrder.status==5">
                        <span>关闭时间</span>
                        <span v-if="customerServiceInfos.subStatus==4">{{warehouseOrder.finishTime|formatDateAll}}</span>
                        <span v-else>{{warehouseOrder.cancelTime|formatDateAll}}</span>
                    </div>
                    <div class="item" v-if="warehouseOrder.status==5">
                        <span>关闭原因</span>
                        <span>{{subStatusArr[warehouseOrder.subStatus]||`/`}}</span>
                    </div>
                </div>
                <div class="item-wrap">
                    <div class="title">订单支付信息</div>
                    <div class="item">
                        <span>商品总额</span>
                        <span>{{warehouseOrder.productsAmount | formatMoney}}</span>
                    </div>
                    <div class="item">
                        <span>运费</span>
                        <span>{{warehouseOrder.freightAmount | formatMoney}}</span>
                    </div>
                    <div class="item">
                        <span>应付金额</span>
                        <span>{{warehouseOrder.dueAmount | formatMoney}}</span>
                    </div>
                    <div class="item">
                        <span>促销优惠</span>
                        <span>{{warehouseOrder.promotionAmount | formatMoney}}</span>
                    </div>
                    <div class="item">
                        <span>优惠券</span>
                        <span>{{warehouseOrder.couponAmount | formatMoney}}</span>
                    </div>
                    <div class="item">
                        <span>一元券</span>
                        <span>{{warehouseOrder.tokenCoinAmount | formatMoney}}</span>
                    </div>
                    <!--已付款,已发货，交易完成，交易关闭-->
                    <div class="item" v-if="warehouseOrder.status!=1">
                        <span>余额支付</span>
                        <span>{{warehouseOrder.accountPayAmount | formatMoney}}</span>
                    </div>
                    <div class="item" v-if="warehouseOrder.status!=1">
                        <span>第三方支付</span>
                        <span>{{warehouseOrder.cashPayAmoun | formatMoney}}</span>
                    </div>
                    <div class="item" v-if="warehouseOrder.status!=1">
                        <span>开票余额</span>
                        <span>{{warehouseOrder.invoiceAmount | formatMoney}}</span>
                    </div>
                    <div class="item" v-if="warehouseOrder.status!=1">
                        <span>实付金额</span>
                        <span>{{warehouseOrder.payAmount | formatMoney}}</span>
                    </div>
                </div>
                <div class="item-wrap">
                    <div class="title">订单发票信息</div>
                    <div class="item">
                        <span>开具发票</span>
                        <span>{{orderInvoiceInfo?'是':'否'}}</span>
                    </div>
                    <!--待付款，交易完成-->
                    <div v-if="orderInvoiceInfo">
                        <div class="item" v-if="warehouseOrder.status==1||warehouseOrder.status==4">
                            <span>发票类型</span>
                            <span>{{orderInvoiceInfo.type}}</span>
                        </div>
                        <div class="item" v-if="warehouseOrder.status==1">
                            <span>发票抬头</span>
                            <span>{{orderInvoiceInfo.title}}</span>
                        </div>
                        <div class="item" v-if="warehouseOrder.status==1">
                            <span>发票内容</span>
                            <span>{{orderInvoiceInfo.content}}</span>
                        </div>
                        <div class="item" v-if="warehouseOrder.status==1">
                            <span>发票金额</span>
                            <span>{{orderInvoiceInfo.amount | formatMoney}}</span>
                        </div>
                        <!--交易完成-->
                        <div class="item" v-if="warehouseOrder.status>=4">
                            <span>单位名称</span>
                            <span>{{orderInvoiceInfo.company}}</span>
                        </div>
                        <div class="item" v-if="warehouseOrder.status>=4">
                            <span>纳税人识别号</span>
                            <span>{{orderInvoiceInfo.taxpayerNo}}</span>
                        </div>
                        <div class="item" v-if="warehouseOrder.status>=4">
                            <span>注册电话</span>
                            <span>{{orderInvoiceInfo.regPhone}}</span>
                        </div>
                        <div class="item" v-if="warehouseOrder.status>=4">
                            <span>开户银行</span>
                            <span>{{orderInvoiceInfo.depositBank}}</span>
                        </div>
                        <div class="item" v-if="warehouseOrder.status>=4">
                            <span>银行账户</span>
                            <span>{{orderInvoiceInfo.bankAccount}}</span>
                        </div>
                    </div>

                </div>
                <div class="item-wrap">
                    <div class="title">订单收货信息</div>
                    <div class="item">
                        <span>收货人姓名</span>
                        <span>{{platformOrder.receiver}}</span>
                    </div>
                    <div class="item">
                        <span>收货人联系方式</span>
                        <span>{{platformOrder.receiverPhone}}</span>
                    </div>
                    <div class="item">
                        <span>收货省市区</span>
                        <span>{{platformOrder.province}}{{platformOrder.city}}{{platformOrder.area}}</span>
                    </div>
                    <div class="item">
                        <span>收货详细地址</span>
                        <span>{{platformOrder.address}}</span>
                    </div>
                    <div class="item">
                        <span>配送方式</span>
                        <span>快递</span>
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
                                <!--<span class="pro-name color-blue" @click="toH5(v.prodCode)">{{v.productName}}</span>-->
                                <span class="pro-name">{{v.productName}}</span>
                                <span class="pro-spec">{{v.spec}}</span>
                            </div>
                        </td>
                        <td :rowspan="v.rows" v-if="k1==0">{{v.skuCode}}</td>
                        <td :rowspan="v.rows" v-if="k1==0">{{v.supplierSkuCode||`/`}}</td>
                        <td :rowspan="v.rows" v-if="k1==0">{{v.originalPrice | formatMoney}}</td>
                        <td :rowspan="v.rows" v-if="k1==0">{{v.unitPrice | formatMoney}}</td>
                        <td :rowspan="v.rows" v-if="k1==0">{{v.quantity}}</td>
                        <td :rowspan="v.rows" v-if="k1==0">{{v.payAmount | formatMoney}}</td>
                        <td :rowspan="v.rows" v-if="k1==0">{{v.warehouseName}}</td>
                        <td :rowspan="v.expressInfos.rows" v-if="k1%v.expressInfos.rows==0">
                            <span v-if="v.expressInfos[k1/v.expressInfos.rows]&&v.expressInfos[k1/v.expressInfos.rows].expressName">{{v.expressInfos[k1/v.expressInfos.rows].expressName}}</span>
                            <span v-else>/</span>
                        </td>
                        <td :rowspan="v.expressInfos.rows" v-if="k1%v.expressInfos.rows==0">
                            <span v-if="v.expressInfos[k1/v.expressInfos.rows]&&v.expressInfos[k1/v.expressInfos.rows].expressNo">{{v.expressInfos[k1/v.expressInfos.rows].expressNo}}</span>
                            <span v-else>/</span>
                        </td>
                        <td :rowspan="v.expressInfos.rows" v-if="k1%v.expressInfos.rows==0">
                            <span v-if="v.expressInfos[k1/v.expressInfos.rows]&&v.expressInfos[k1/v.expressInfos.rows].skuNum">{{v.expressInfos[k1/v.expressInfos.rows].skuNum}}</span>
                            <span v-else>/</span>
                        </td>
                        <td :rowspan="v.customerServiceInfos.rows" v-if="k1%v.customerServiceInfos.rows==0">
                            <span v-if="v.customerServiceInfos[k1/v.customerServiceInfos.rows]&&v.customerServiceInfos[k1/v.customerServiceInfos.rows].status">{{status[v.customerServiceInfos[k1/v.customerServiceInfos.rows].status-1]}}</span>
                            <span v-else>无</span>
                        </td>
                        <td :rowspan="v.customerServiceInfos.rows" v-if="k1%v.customerServiceInfos.rows==0">
                            <span v-if="v.customerServiceInfos[k1/v.customerServiceInfos.rows]&&v.customerServiceInfos[k1/v.customerServiceInfos.rows].refundNum">{{v.customerServiceInfos[k1/v.customerServiceInfos.rows].refundNum}}</span>
                            <span v-else>/</span>
                        </td>
                    </tr>
                    </tbody>
                </table>
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
                warehouseOrderNo: '',
                status: ['待审核', '待商品寄回', '待仓库确认', '待平台处理', '售后完成', '售后关闭'], // 状态: 1.待审核 2.待商品寄回 3.待仓库确认 4.待平台处理 5.售后完成 6.售后关闭
                subStatusArr: ['超时取消', '用户手动取消', '平台取消', '全部已售后完成'], // 1.超时取消 2.用户手动取消 3.平台取消 4.全部已售后完成
                tableData: [],
                // 订单信息
                customerServiceInfos: {},
                platformOrder: {},
                orderPayInfo: {},
                expressInfos: {},
                orderInvoiceInfo: {},
                warehouseOrder: {},
                payType: '',
                mask: false,
                src: ''
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
                request.orderDetail({ warehouseOrderNo: this.warehouseOrderNo }).then(res => {
                    this.customerServiceInfos = res.data.customerServiceInfos;
                    this.expressInfos = res.data.expressInfos;
                    this.orderInvoiceInfo = res.data.orderInvoiceInfo;
                    this.warehouseOrder = res.data.warehouseOrder;
                    this.platformOrder = res.data.platformOrder;
                    this.orderPayInfo = res.data.orderPayInfo;
                    this.tableData = [];
                    res.data.productOrders.forEach((v, k) => {
                        const tempTitle = v.specTitle.split('@');
                        const tempValue = v.specValues.substring(1, v.specValues.length - 1).split('@');
                        v.spec = [];
                        tempTitle.forEach((v1, k1) => {
                            const temp = v1 + ':' + tempValue[k1] + '    ';
                            v.spec.push(temp);
                        });
                        v.spec = v.spec.join('  ');
                        v.customerServiceInfos = [];
                        v.expressInfos = [];
                        if (res.data.customerServiceInfos) {
                            res.data.customerServiceInfos.forEach((v1, k1) => {
                                if (v.orderProductNo == v1.orderProductNo) {
                                    v.customerServiceInfos.push(v1);
                                }
                            });
                        }
                        if (res.data.expressInfos) {
                            res.data.expressInfos.forEach((v1, k1) => {
                                if (v.orderProductNo == v1.orderProductNo) {
                                    v.expressInfos.push(v1);
                                }
                            });
                        }
                        v.rows = (v.customerServiceInfos.length || 1) * (v.expressInfos.length || 1) / this.getMaxDivisor(v.customerServiceInfos.length || 1, v.expressInfos.length || 1);
                        v.customerServiceInfos.rows = v.rows / (v.customerServiceInfos.length || 1);
                        v.expressInfos.rows = v.rows / (v.expressInfos.length || 1);
                        v.warehouseName = res.data.warehouseName;
                        this.tableData.push(v);
                    });
                    if (res.data.orderPayInfo && res.data.orderPayInfo.payType) {
                        this.payType = this.getType(res.data.orderPayInfo.payType);
                    }
                }).catch(err => {
                    console.log(err);
                });
            },
            // 获取最大公约数，计算合并行数
            getMaxDivisor(n, m) {
                if (m === 0) return n;
                return this.getMaxDivisor(m, n % m);
            },
            getType(value) {
                let result = '';
                if ((value & 1) != 0) {
                    result += '纯平台+';
                }
                if ((value & 2) != 0) {
                    result += '微信(小程序)+';
                }
                if ((value & 4) != 0) {
                    result += '微信(APP)+';
                }
                if ((value & 8) != 0) {
                    result += '支付宝+';
                }
                if ((value & 16) != 0) {
                    result += '银联+';
                }
                if (result != '') result = result.slice(0, -1);
                return result;
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
            margin-right: 100px;
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
