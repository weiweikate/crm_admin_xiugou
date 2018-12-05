<template>
    <div class="after-info">
        <v-breadcrumb :nav='nav'></v-breadcrumb>
        <el-card :body-style="{ padding: '28px 50px' }">
            <div class="wrap">
                <div class="item-wrap">
                    <div class="title">订单基础信息</div>
                    <div class="item">
                        <span>平台订单号</span>
                        <span>{{orderCustomerServiceInfo.platformOrderNo}}</span>
                    </div>
                    <div class="item">
                        <span>仓库订单号</span>
                        <span>{{orderCustomerServiceInfo.warehouseOrderNo}}</span>
                    </div>
                    <div class="item">
                        <span>订单状态</span>
                        <span>{{statusArr[orderCustomerServiceInfo.warehouseOrderNo-1]}}</span>
                    </div>
                    <div class="item">
                        <span>售后单号</span>
                        <span>{{orderCustomerServiceInfo.serviceNo}}</span>
                    </div>
                    <div class="item">
                        <span>供应商名称</span>
                        <span>{{orderCustomerServiceInfo.supplierName}}</span>
                    </div>
                    <div class="item">
                        <span>用户账号</span>
                        <span>{{orderCustomerServiceInfo.userPhone}}</span>
                    </div>
                </div>
                <div class="item-wrap">
                    <div class="title">售后信息</div>
                    <div class="item">
                        <span>售后类型</span>
                        <span>{{typeArr[orderCustomerServiceInfo.type-1]}}</span>
                    </div>
                    <div class="item" v-if="orderCustomerServiceInfo.status==1&&orderCustomerServiceInfo.status==2">
                        <span>用户申请退款金额</span>
                        <span>{{orderCustomerServiceInfo.applyRefundAmount}}</span>
                    </div>
                    <div class="item">
                        <span>售后状态</span>
                        <span>{{orderCustomerServiceInfo.orderNum}}</span>
                    </div>
                    <div class="item">
                        <span>售后单创建时间</span>
                        <span>{{orderCustomerServiceInfo.createTime|formatDateAll}}</span>
                    </div>
                    <div class="item">
                        <span>申请售后原因</span>
                        <span>{{orderCustomerServiceInfo.reason}}</span>
                    </div>
                    <div class="item">
                        <span>问题描述</span>
                        <span>{{orderCustomerServiceInfo.description}}</span>
                    </div>
                    <div class="item">
                        <span>图片信息</span>
                        <span>
                            <viewer :images="orderCustomerServiceInfo.imgList">
                                <img v-for="(item,index) in orderCustomerServiceInfo.imgList" :key="index" :src="item" alt="">
                            </viewer>
                        </span>
                    </div>
                </div>
                <!--<div class="item-wrap">-->
                    <!--<div class="title">协商记录</div>-->
                    <!--&lt;!&ndash;售后关闭&ndash;&gt;-->
                    <!--<div class="item" v-if="exchangeExpress.status==6">-->
                        <!--<span>用户申请退款金额</span>-->
                        <!--<span>{{exchangeExpress.orderNum}}</span>-->
                    <!--</div>-->
                    <!--<div class="item">-->
                        <!--<span>售后审核结果</span>-->
                        <!--<span>{{exchangeExpress.orderNum}}</span>-->
                    <!--</div>-->
                    <!--&lt;!&ndash;待商品寄回，售后完成&ndash;&gt;-->
                    <!--<div class="item" v-if="exchangeExpress.status==2&&exchangeExpress.status==5">-->
                        <!--<span>审核金额调整</span>-->
                        <!--<span>{{exchangeExpress.orderNum}}</span>-->
                    <!--</div>-->
                    <!--<div class="item" v-if="exchangeExpress.status>=2">-->
                        <!--<span>售后审核说明</span>-->
                        <!--<span>{{exchangeExpress.orderNum}}</span>-->
                    <!--</div>-->
                    <!--&lt;!&ndash;待仓库确认，待平台处理&ndash;&gt;-->
                    <!--<div class="item" v-if="exchangeExpress.status==2&&exchangeExpress.status==3&&exchangeExpress.status==4&&exchangeExpress.status==5">-->
                        <!--<span>退货信息</span>-->
                        <!--<span>{{exchangeExpress.orderNum}}</span>-->
                    <!--</div>-->
                    <!--<div class="item" v-if="exchangeExpress.status!=1">-->
                        <!--<span>售后审核者</span>-->
                        <!--<span>{{exchangeExpress.orderNum}}</span>-->
                    <!--</div>-->
                    <!--&lt;!&ndash;待仓库确认&ndash;&gt;-->
                    <!--<div class="item" v-if="exchangeExpress.status==3&&exchangeExpress.status==4&&exchangeExpress.status==5">-->
                        <!--<span>回寄物流公司</span>-->
                        <!--<span>{{exchangeExpress.orderNum}}</span>-->
                    <!--</div>-->
                    <!--<div class="item" v-if="exchangeExpress.status==3&&exchangeExpress.status==4&&exchangeExpress.status==5">-->
                        <!--<span>回寄物流单号</span>-->
                        <!--<span>{{exchangeExpress.orderNum}}</span>-->
                    <!--</div>-->
                    <!--&lt;!&ndash;售后完成&ndash;&gt;-->
                    <!--<div class="item" v-if="exchangeExpress.status==5&&exchangeExpress.status==6">-->
                        <!--<span>售后处理结果</span>-->
                        <!--<span>{{exchangeExpress.orderNum}}</span>-->
                    <!--</div>-->
                    <!--<div class="item" v-if="exchangeExpress.status==5&&exchangeExpress.status==6">-->
                        <!--<span>售后处理说明</span>-->
                        <!--<span>{{exchangeExpress.orderNum}}</span>-->
                    <!--</div>-->
                    <!--<div class="item" v-if="exchangeExpress.status==5&&exchangeExpress.status==6">-->
                        <!--<span>售后处理者</span>-->
                        <!--<span>{{exchangeExpress.orderNum}}</span>-->
                    <!--</div>-->
                <!--</div>-->
            </div>
            <div style="margin-top: 50px" v-if="orderCustomerServiceInfo.status==4&&orderCustomerServiceInfo.status==5">
                <div class="title">仓库反馈</div>
                <div class="item" v-if="orderCustomerServiceInfo.refundWarehouseFeedback">
                    <span>退货仓反馈</span>
                    <span>{{orderCustomerServiceInfo.refundWarehouseFeedback}}</span>
                   <div>
                       <div>
                           物流公司：{{refundExpress.expressName}}
                       </div>
                       <div>
                           物流单号：{{refundExpress.expressNo}}
                       </div>
                   </div>
                </div>

                <div class="item" v-if="orderCustomerServiceInfo.sendWarehouseFeedback">
                    <span>发货仓反馈</span>
                    <span>{{orderCustomerServiceInfo.sendWarehouseFeedback}}</span>
                    <div>
                        <div>
                            物流公司：{{exchangeExpress.expressName}}
                        </div>
                        <div>
                            物流单号：{{exchangeExpress.expressNo}}
                        </div>
                    </div>
                </div>
            </div>
            <div class="goods-info">
                <div class="title">商品信息</div>
                <el-table border :data="tableData">
                    <el-table-column prop="" label="商品订单号"></el-table-column>
                    <el-table-column prop="" label="商品信息">
                        <template slot-scope="scope">
                            <div class="name">
                                <img :src="scope.row.specImg" alt="">
                                <span class="pro-name">{{scope.row.productName}}</span>
                                <span class="pro-spec">{{scope.row.spec}}</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="" label="SKU编码"></el-table-column>
                    <el-table-column prop="" label="供应商SKU编码"></el-table-column>
                    <el-table-column prop="" label="实付单价"></el-table-column>
                    <el-table-column prop="" label="售后数量"></el-table-column>
                    <el-table-column prop="" label="一元券"></el-table-column>
                    <el-table-column prop="" label="实付金额"></el-table-column>
                </el-table>
            </div>
            <!--待审核-->
            <div class="opr-area" v-if="orderCustomerServiceInfo.status==1">
                <div class="title">操作</div>
                <el-form :model="form">
                    <el-form-item label="售后审核结果">
                        <el-radio-group v-model="form.result">
                            <el-radio label="1">审核通过</el-radio>
                            <el-radio label="2">审核驳回</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="审核金额调整">
                        <el-input v-model="form.adjustAmount"></el-input><span class="tip">元，请在¥0.00~¥20.00区间内调整，其中含运费¥6。66</span>
                    </el-form-item>
                    <el-form-item label="退货信息" class="back-address">
                        <div class="address-area">
                            <div class="supplier-address">
                                <el-radio label="1" v-model="form.address">供应商退货地址</el-radio>
                                <div>{{supplierRefundAddress.receiver}} {{supplierRefundAddress.receiverPhone}}</div>
                                <div>{{supplierRefundAddress.province}}{{supplierRefundAddress.city}}{{supplierRefundAddress.area}}{{supplierRefundAddress.address}}</div>
                            </div>
                            <div class="plat-address">
                                <el-radio label="2" v-model="form.address">平台退货地址</el-radio>
                                <div>{{platformRefundAddress.receiver}} {{platformRefundAddress.receiverPhone}}</div>
                                <div>{{platformRefundAddress.province}}{{platformRefundAddress.city}}{{platformRefundAddress.area}}{{platformRefundAddress.address}}</div>
                            </div>
                            <div class="tip">如需修改，请联系相关人员修改退货信息后再审核</div>
                        </div>
                    </el-form-item>
                    <el-form-item label="售后审核说明">
                        <el-input v-model="form.remarks"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" :loading="btnLoading" @click="submit('form')">提交</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <!--待平台处理-->
            <div class="opr-area" v-if="orderCustomerServiceInfo.status==4">
                <div class="title">操作</div>
                <el-form :model="form">
                    <el-form-item label="售后处理结果">
                        <el-radio-group v-model="form.result">
                            <el-radio label="1">审核通过</el-radio>
                            <el-radio label="2">审核驳回</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <!--退款-->
                    <el-form-item label="售后类型">
                        <el-radio-group v-model="form.type">
                            <el-radio label="1">换货</el-radio>
                            <el-radio label="2">退货退款</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="处理金额调整" v-if="orderCustomerServiceInfo.type==1||orderCustomerServiceInfo.type==2">
                        <el-input v-model="form.adjustAmount"></el-input><span class="tip">元，请在¥0.00~¥20.00区间内调整，其中含运费￥6.66</span>
                    </el-form-item>
                    <el-form-item label="售后处理说明">
                        <el-input v-model="form.remarks"></el-input>
                    </el-form-item>
                    <!--换货-->
                    <el-form-item label="换货物流公司" v-if="orderCustomerServiceInfo.type==3">
                        <el-select v-model="form.expressCode">
                            <option v-for="(v,k) in logicList" :key="k" :value="v.code" :label="v.label"></option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="换货物流单号" v-if="orderCustomerServiceInfo.type==3">
                        <el-input v-model="form.expressNo"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" :loading="btnLoading" @click="submit('form')">提交</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
    </div>
</template>

<script>
    import vBreadcrumb from '@/components/common/Breadcrumb.vue';
    import { queryDictonary } from '@/JS/commom';
    import request from '@/http/http.js';

    export default {
        components: { vBreadcrumb },
        mixins: [queryDictonary],
        data() {
            return {
                nav: ['订单管理', '售后单管理', '售后单列表', '售后单详情'],
                serviceNo: '',
                tableData: [],
                // 订单信息
                exchangeExpress: {},
                orderCustomerServiceInfo: {},
                platformRefundAddress: {},
                refundExpress: {},
                supplierRefundAddress: {},
                statusArr: ['待审核', '待商品寄回', '待仓库确认', '待平台处理', '售后完成 ', '售后关闭'], // 状态
                typeArr: ['仅退款', '退货退款 ', '换货'], // 类型
                btnLoading: false,
                logicList: [{ label: '顺丰', code: 1 }]
            };
        },

        created() {
            // 获取订单信息
            this.serviceNo = this.$route.query.afterSaleOrderInfoId;
            this.getInfo();
            // this.getLogic();
        },
        methods: {
            //  获取信息
            getInfo() {
                this.tableData = [];
                request.lookDetail({ serviceNo: this.serviceNo }).then(res => {
                    this.exchangeExpress = res.data;
                    this.table = res.data.warehouseOrderProduct;
                    this.exchangeExpress = res.data.exchangeExpress;
                    this.orderCustomerServiceInfo = res.data.orderCustomerServiceInfo;
                    this.platformRefundAddress = res.data.platformRefundAddress;
                    this.refundExpress = res.data.refundExpress;
                    this.supplierRefundAddress = res.data.supplierRefundAddress;
                    this.orderCustomerServiceInfo.imgList = this.orderCustomerServiceInfo.imgList.split(',');
                }).catch(err => {
                    console.log(err);
                });
            },
            // 物流公司查询
            getLogic() {
                request.sysExpressQuery({ page: 1, pageSize: 10000 }).then(res => {
                    this.logicList = res.data.data;
                });
            },
            // 提交
            submit(formName) {
                let url = '';
                const data = this.form;
                data.serviceNo = this.serviceNo;
                if (this.orderCustomerServiceInfo.status == 1) { // 待审核
                    if (this.form.result == 1) { // 审核通过
                        url = 'agreeApply';
                    } else { // 审核驳回
                        url = 'refuse';
                    }
                    if (this.form.address == 1) {
                        data.warehouseCode = this.orderCustomerServiceInfo.warehouseCode;
                    }
                } else { // 待平台处理
                    if (this.orderCustomerServiceInfo.type == 1 || this.orderCustomerServiceInfo.type == 2) {
                        if (this.form.result == 2) {
                            url = 'refuse';
                        } else {
                            url = 'refundAmounts';
                        }
                    } else {
                        if (this.form.result == 2) {
                            url = 'refuse';
                        } else {
                            if (this.form.type == 1) {
                                url = 'agreeExchange';
                                this.logicList.forEach((v, k) => {
                                    if (this.form.expressNo == v.code) {
                                        data.expressName = v.name;
                                    }
                                });
                            } else {
                                url = 'exchangeChangeRefund';
                            }
                        }
                    }
                }
                this.btnLoading = true;
                request[url](data).then(res => {
                    this.$message.success(res.msg);
                    this.btnLoading = false;
                }).catch(err => {
                    this.btnLoading = false;
                });
            }
        }
    };
</script>
<style lang='less'>
    .after-info {
        .title{
            margin-bottom: 10px;
        }
        .wrap{
            display: flex;
            justify-content: flex-start;
            .item-wrap{
                margin-right: 100px;
                .item{
                    font-size: 14px;
                    color: #666666;
                    line-height: 30px;
                    span:first-child{
                        display: inline-block;
                        width: 115px;
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
        .opr-area{
            margin-top: 20px;
            .tip{
                color: #8c939d;
                margin-left: 10px;
            }
            .el-input,.el-input__inner{
                width: 360px;
            }
            .back-address{
                .address-area{
                    display: flex;
                }
                .supplier-address,.plat-address{
                    div{
                        margin-left: 25px;
                    }
                    margin-right: 50px;
                }
                .tip{
                    margin-top: 30px;
                }
            }
        }
    }
</style>
