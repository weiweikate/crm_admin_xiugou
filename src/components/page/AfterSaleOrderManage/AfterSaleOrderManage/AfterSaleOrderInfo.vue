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
                        <span>{{statusArr[orderInfo.status-1]}}</span>
                    </div>
                    <div class="item">
                        <span>售后单号</span>
                        <span>{{orderCustomerServiceInfo.serviceNo}}</span>
                    </div>
                    <div class="item">
                        <span>供应商名称</span>
                        <span>{{orderCustomerServiceInfo.supplierName||`/`}}</span>
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
                    <div class="item" v-if="orderCustomerServiceInfo.status==1||orderCustomerServiceInfo.status==2">
                        <span>用户申请退款金额</span>
                        <span>{{orderCustomerServiceInfo.applyRefundAmount|formatMoney}}</span>
                    </div>
                    <div class="item">
                        <span>售后状态</span>
                        <span>{{refundStatusArr[orderCustomerServiceInfo.status-1]}}</span>
                    </div>
                    <div class="item">
                        <span>售后单创建时间</span>
                        <span>{{orderCustomerServiceInfo.createTime|formatDateAll}}</span>
                    </div>
                    <div class="item">
                        <span>申请售后原因</span>
                        <span>{{orderCustomerServiceInfo.reason||`/`}}</span>
                    </div>
                    <div class="item">
                        <span>问题描述</span>
                        <span>{{orderCustomerServiceInfo.description||`/`}}</span>
                    </div>
                    <div class="item">
                        <span>图片信息</span>
                        <span v-if="orderCustomerServiceInfo.imgList&&orderCustomerServiceInfo.imgList.length">
                            <viewer :images="orderCustomerServiceInfo.imgList">
                                <img v-for="(item,index) in orderCustomerServiceInfo.imgList" :key="index" :src="item" alt="">
                            </viewer>
                        </span>
                        <span v-else>/</span>
                    </div>
                </div>
               <!-- <div class="item-wrap">
                    <div class="title">协商记录</div>
                    &lt;!&ndash;售后关闭&ndash;&gt;
                    <div class="item" v-if="exchangeExpress.status==6">
                        <span>用户申请退款金额</span>
                        <span>{{exchangeExpress.orderNum}}</span>
                    </div>
                    <div class="item">
                        <span>售后审核结果</span>
                        <span>{{exchangeExpress.orderNum}}</span>
                    </div>
                    &lt;!&ndash;待商品寄回，售后完成&ndash;&gt;
                    <div class="item" v-if="exchangeExpress.status==2&&exchangeExpress.status==5">
                        <span>审核金额调整</span>
                        <span>{{exchangeExpress.orderNum}}</span>
                    </div>
                    <div class="item" v-if="exchangeExpress.status>=2">
                        <span>售后审核说明</span>
                        <span>{{exchangeExpress.orderNum}}</span>
                    </div>
                    &lt;!&ndash;待仓库确认，待平台处理&ndash;&gt;
                    <div class="item" v-if="exchangeExpress.status==2&&exchangeExpress.status==3&&exchangeExpress.status==4&&exchangeExpress.status==5">
                        <span>退货信息</span>
                        <span>{{exchangeExpress.orderNum}}</span>
                    </div>
                    <div class="item" v-if="exchangeExpress.status!=1">
                        <span>售后审核者</span>
                        <span>{{exchangeExpress.orderNum}}</span>
                    </div>
                    &lt;!&ndash;待仓库确认&ndash;&gt;
                    <div class="item" v-if="exchangeExpress.status==3&&exchangeExpress.status==4&&exchangeExpress.status==5">
                        <span>回寄物流公司</span>
                        <span>{{exchangeExpress.orderNum}}</span>
                    </div>
                    <div class="item" v-if="exchangeExpress.status==3&&exchangeExpress.status==4&&exchangeExpress.status==5">
                        <span>回寄物流单号</span>
                        <span>{{exchangeExpress.orderNum}}</span>
                    </div>
                    &lt;!&ndash;售后完成&ndash;&gt;
                    <div class="item" v-if="exchangeExpress.status==5&&exchangeExpress.status==6">
                        <span>售后处理结果</span>
                        <span>{{exchangeExpress.orderNum}}</span>
                    </div>
                    <div class="item" v-if="exchangeExpress.status==5&&exchangeExpress.status==6">
                        <span>售后处理说明</span>
                        <span>{{exchangeExpress.orderNum}}</span>
                    </div>
                    <div class="item" v-if="exchangeExpress.status==5&&exchangeExpress.status==6">
                        <span>售后处理者</span>
                        <span>{{exchangeExpress.orderNum}}</span>
                    </div>
                </div>-->
            </div>
            <div style="margin-top: 50px" v-if="orderCustomerServiceInfo.status==4||orderCustomerServiceInfo.status==5">
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
                    <el-table-column prop="orderProductNo" label="商品订单号" align="center"></el-table-column>
                    <el-table-column prop="" label="商品信息" align="center" min-width="400">
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
                    <el-table-column prop="unitPrice" label="实付单价" align="center">
                        <template slot-scope="scope">
                            {{scope.row.unitPrice|formatMoney}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="quantity" label="售后数量" align="center"></el-table-column>
                    <el-table-column prop="tokenCoinAmount" label="一元券" align="center">
                        <template slot-scope="scope">
                            {{scope.row.tokenCoinAmount|formatMoney}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="payAmount" label="实付金额" align="center">
                        <template slot-scope="scope">
                            {{scope.row.payAmount|formatMoney}}
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <!--待审核-->
            <div class="opr-area" v-if="orderCustomerServiceInfo.type!=1&&orderCustomerServiceInfo.status==1">
                <div class="title">操作</div>
                <el-form :model="form">
                    <el-form-item label="售后审核结果">
                        <el-radio-group v-model="form.result">
                            <el-radio label="1">审核通过</el-radio>
                            <el-radio label="2">审核驳回</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="审核金额调整" v-if="form.result!=2&&orderCustomerServiceInfo.type!=3">
                        <el-input v-model="form.adjustAmount"></el-input><span class="tip">元，请在¥0.00~{{warehouseOrderProduct.payAmount|formatMoney}}区间内调整，其中含运费{{warehouseOrderProduct.freightAmount|formatMoney}}</span>
                    </el-form-item>
                    <el-form-item label="退货地址" class="back-address" v-if="form.result!=2">
                        <div class="address-area">
                            <div>
                                <div>{{supplierRefundAddress.receiver}} {{supplierRefundAddress.receiverPhone}}</div>
                                <div>{{supplierRefundAddress.province}}{{supplierRefundAddress.city}}{{supplierRefundAddress.area}}{{supplierRefundAddress.address}}</div>
                            </div>
                            <!-- <div class="supplier-address" v-if="orderInfo.warehouseType==3">
                                 <el-radio label="1" v-model="form.address">供应商退货地址</el-radio>
                                 <div>{{supplierRefundAddress.receiver}} {{supplierRefundAddress.receiverPhone}}</div>
                                 <div>{{supplierRefundAddress.province}}{{supplierRefundAddress.city}}{{supplierRefundAddress.area}}{{supplierRefundAddress.address}}</div>
                             </div>
                             <div class="plat-address">
                                 <el-radio label="2" v-model="form.address">平台退货地址</el-radio>
                                 <div>{{platformRefundAddress.receiver}} {{platformRefundAddress.receiverPhone}}</div>
                                 <div>{{platformRefundAddress.province}}{{platformRefundAddress.city}}{{platformRefundAddress.area}}{{platformRefundAddress.address}}</div>
                             </div>
                             <div class="tip">如需修改，请联系相关人员修改退货信息后再审核</div>-->
                        </div>
                    </el-form-item>
                    <el-form-item label="售后审核说明">
                        <el-input type="textarea" maxlength="50" v-model="form.remarks"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" :loading="btnLoading" @click="submit('form')">提交</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <!--待平台处理-->
            <div class="opr-area" v-if="(orderCustomerServiceInfo.type==1&&orderCustomerServiceInfo.status==1||orderCustomerServiceInfo.status==3||orderCustomerServiceInfo.status==4)&&orderCustomerServiceInfo.subStatus!=9">
                <div class="title">操作</div>
                <el-form :model="form">
                    <el-form-item label="售后处理结果">
                        <el-radio-group v-model="form.result">
                            <el-radio label="1">审核通过</el-radio>
                            <el-radio label="2">审核驳回</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <!--换货-->
                    <el-form-item label="售后类型" v-if="orderCustomerServiceInfo.type==3&&(orderCustomerServiceInfo.type==3&&form.result!=2)">
                        <el-radio-group v-model="form.type">
                            <el-radio label="1">换货</el-radio>
                            <el-radio label="2">退货退款</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="处理金额调整" v-if="(orderCustomerServiceInfo.type==1||orderCustomerServiceInfo.type==2||form.type==2)&&form.result!=2">
                        <el-input v-model="form.adjustAmount"></el-input><span class="tip">元，请在¥0.00~{{warehouseOrderProduct.payAmount|formatMoney}}区间内调整，其中含运费{{warehouseOrderProduct.freightAmount|formatMoney}}</span>
                    </el-form-item>
                    <el-form-item label="售后处理说明">
                        <el-input type="textarea" maxlength="50" v-model="form.remarks"></el-input>
                    </el-form-item>
                    <el-form-item v-if="form.type!=2&&orderCustomerServiceInfo.type==3&&orderInfo.warehouseType!=4&&(orderCustomerServiceInfo.type==3&&form.result!=2)">
                        <el-checkbox v-model="checked" @change="chooseXnSend">虚拟发货</el-checkbox>
                    </el-form-item>
                    <!--换货-->
                    <el-form-item label="换货物流公司" v-if="form.type!=2&&orderCustomerServiceInfo.type==3&&orderInfo.warehouseType==4&&(orderCustomerServiceInfo.type==3&&form.result!=2)||checked">
                        <el-select v-model="form.expressCode">
                            <el-option v-for="(v,k) in logicList" :key="k" :value="v.code" :label="v.name"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="换货物流单号" v-if="form.type!=2&&orderCustomerServiceInfo.type==3&&orderInfo.warehouseType==4&&(orderCustomerServiceInfo.type==3&&form.result!=2)||checked">
                        <el-input v-model="form.expressNo"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" :loading="btnLoading" @click="submit('form')">提交</el-button>
                    </el-form-item>
                </el-form>
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
    import utils from '@/utils/index';

    export default {
        components: { vBreadcrumb, productDialog },
        mixins: [queryDictonary, myProductDialog],
        data() {
            return {
                nav: ['订单管理', '售后单管理', '售后单列表', '售后单详情'],
                serviceNo: '',
                tableData: [],
                // 订单信息
                orderInfo: {},
                exchangeExpress: {},
                orderCustomerServiceInfo: {},
                platformRefundAddress: {},
                refundExpress: {},
                supplierRefundAddress: {},
                warehouseOrderProduct: {},
                statusArr: ['待支付', '已付款', '待收货', '交易完成', '交易关闭 '], // 订单状态
                refundStatusArr: ['待审核', '待商品寄回', '待仓库确认', '待平台处理', '售后完成 ', '售后关闭'], // 售后状态
                typeArr: ['仅退款', '退货退款 ', '换货'], // 类型
                btnLoading: false,
                logicList: [],
                form: {},
                checked: false
            };
        },

        activated() {
            // 获取订单信息
            this.serviceNo = this.$route.query.afterSaleOrderInfoId;
            utils.cleanFormData(this.form);
            this.getInfo();
            this.getLogic();
            this.checked=false
        },
        methods: {
            //  获取信息
            getInfo() {
                this.tableData = [];
                request.lookDetail({ serviceNo: this.serviceNo }).then(res => {
                    this.orderInfo = res.data;
                    // if (res.data.warehouseType && res.data.warehouseType != 3) {
                    //     this.form.address = '2';
                    // }
                    this.tableData = [res.data.warehouseOrderProduct];
                    this.exchangeExpress = res.data.exchangeExpress || {};
                    this.orderCustomerServiceInfo = res.data.orderCustomerServiceInfo || {};
                    this.platformRefundAddress = res.data.platformRefundAddress || {};
                    this.refundExpress = res.data.refundExpress || {};
                    this.supplierRefundAddress = res.data.supplierRefundAddress || {};
                    this.warehouseOrderProduct = res.data.warehouseOrderProduct;
                    this.orderCustomerServiceInfo.imgList = this.orderCustomerServiceInfo && this.orderCustomerServiceInfo.imgList ? this.orderCustomerServiceInfo.imgList.split(',') : [];
                    this.tableData.forEach((v, k) => {
                        const tempTitle = v.specTitle.split('@');
                        const tempValue = v.specValues.substring(1, v.specValues.length - 1).split('@');
                        v.spec = [];
                        tempTitle.forEach((v1, k1) => {
                            const temp = v1 + ':' + tempValue[k1] + ' ';
                            v.spec.push(temp);
                        });
                        v.spec = v.spec.join('  ');
                    });
                }).catch(err => {
                    console.log(err);
                });
            },
            // 物流公司查询
            getLogic() {
                request.sysExpressQuery({ page: 1, pageSize: 10000 }).then(res => {
                    this.logicList = [];
                    this.logicList = res.data.data;
                });
            },
            // 提交
            submit(formName) {
                let url = '';
                const data = this.form;
                data.serviceNo = this.serviceNo;
                data.warehouseType = this.orderInfo.warehouseType;
                if (!data.result) {
                    return this.$message.warning('请选择售后处理结果');
                }
                const reg = /^(0|[1-9]\d*)([.]{1}[0-9]{1,2})?$/;
                if (data.adjustAmount && (data.adjustAmount > this.warehouseOrderProduct.payAmount || !reg.test(data.adjustAmount))) {
                    return this.$message.warning('请输入正确的处理金额');
                }
                if (this.orderCustomerServiceInfo.type != 1 && this.orderCustomerServiceInfo.status == 1) { // 待审核
                    if (this.form.result == 1) { // 审核通过
                        url = 'agreeApply';
                        if(!this.supplierRefundAddress.receiver||!this.supplierRefundAddress.receiverPhone||!this.supplierRefundAddress.address){
                             return this.$message.warning('退货信息缺失，请完善后再审核');
                        }
                    } else { // 审核驳回
                        url = 'refuse';
                    }
                    // if (this.orderInfo.warehouseType == 3 && !this.form.address) {
                    //     return this.$message.warning('请选择退货地址');
                    // }
                    // if (this.form.address == 1) {
                    //     data.warehouseCode = this.orderCustomerServiceInfo.warehouseCode;
                    // }
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
                            if (this.checked) {
                                data.warehouseType = 4;
                            }
                            if (!this.form.type) {
                                return this.$message.warning('请选择售后类型');
                            }
                            if (this.form.type == 1) {
                                url = 'agreeExchange';
                                if (data.warehouseType == 4 && (!data.expressNo || !data.expressCode)) {
                                    return this.$message.warning('请输入完整的物流信息');
                                }
                                this.logicList.forEach((v, k) => {
                                    if (this.form.expressCode == v.code) {
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
                    this.getInfo();
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
                    img{
                        width: 100px;
                        height: 100px;
                        margin-right: 5px;
                        vertical-align: top;
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
        .el-textarea{
            display: inline;
            .el-textarea__inner{
                resize: none;
                width: 600px;
                height: 100px;
            }
        }
        .color-blue{
            color: #33b4ff;
            cursor: pointer;
        }
    }
</style>
