<template>
    <div class="order-info">
        <v-breadcrumb :nav='nav'></v-breadcrumb>
        <el-card :body-style="{ padding: '28px 50px' }">
            <div class="wrap">
                <div class="item-wrap">
                    <div class="title">订单基础信息</div>
                    <div class="item">
                        <span>平台订单号</span>
                        <span>{{orderMsg.orderNum}}</span>
                    </div>
                    <div class="item">
                        <span>仓库订单号</span>
                        <span>{{orderMsg.orderNum}}</span>
                    </div>
                    <div class="item">
                        <span>订单状态</span>
                        <span>{{orderMsg.orderNum}}</span>
                    </div>
                    <div class="item">
                        <span>售后单号</span>
                        <span>{{orderMsg.orderNum}}</span>
                    </div>
                    <div class="item">
                        <span>供应商名称</span>
                        <span>{{orderMsg.orderNum}}</span>
                    </div>
                </div>
                <div class="item-wrap">
                    <div class="title">售后信息</div>
                    <div class="item">
                        <span>售后类型</span>
                        <span>{{orderMsg.orderNum}}</span>
                    </div>
                    <div class="item">
                        <span>用户申请退款金额</span>
                        <span>{{orderMsg.orderNum}}</span>
                    </div>
                    <div class="item">
                        <span>售后状态</span>
                        <span>{{orderMsg.orderNum}}</span>
                    </div>
                    <div class="item">
                        <span>售后单创建时间</span>
                        <span>{{orderMsg.orderNum}}</span>
                    </div>
                    <div class="item">
                        <span>申请售后原因</span>
                        <span>{{orderMsg.orderNum}}</span>
                    </div>
                    <div class="item">
                        <span>问题描述</span>
                        <span>{{orderMsg.orderNum}}</span>
                    </div>
                    <div class="item">
                        <span>图片信息</span>
                        <span>{{orderMsg.orderNum}}</span>
                    </div>
                </div>
                <div class="item-wrap">
                    <div class="title">协商记录</div>
                    <div class="item">
                        <span>售后审核结果</span>
                        <span>{{orderMsg.orderNum}}</span>
                    </div>
                    <!--待付款，交易完成-->
                    <div class="item" v-if="orderMsg.status==1&&orderMsg.status==4&&orderMsg.status==5">
                        <span>发票类型</span>
                        <span>{{orderMsg.orderNum}}</span>
                    </div>
                    <div class="item" v-if="orderMsg.status==1">
                        <span>发票抬头</span>
                        <span>{{orderMsg.orderNum}}</span>
                    </div>
                    <div class="item" v-if="orderMsg.status==1">
                        <span>发票内容</span>
                        <span>{{orderMsg.orderNum}}</span>
                    </div>
                    <div class="item" v-if="orderMsg.status==1">
                        <span>发票金额</span>
                        <span>{{orderMsg.orderNum}}</span>
                    </div>
                    <!--交易完成-->
                    <div class="item" v-if="orderMsg.status>=4">
                        <span>单位名称</span>
                        <span>{{orderMsg.orderNum}}</span>
                    </div>
                    <div class="item" v-if="orderMsg.status>=4">
                        <span>纳税人识别号</span>
                        <span>{{orderMsg.orderNum}}</span>
                    </div>
                    <div class="item" v-if="orderMsg.status>=4">
                        <span>注册电话</span>
                        <span>{{orderMsg.orderNum}}</span>
                    </div>
                    <div class="item" v-if="orderMsg.status>=4">
                        <span>开户银行</span>
                        <span>{{orderMsg.orderNum}}</span>
                    </div>
                    <div class="item" v-if="orderMsg.status>=4">
                        <span>银行账户</span>
                        <span>{{orderMsg.orderNum}}</span>
                    </div>
                </div>
            </div>
            <div class="">
                <div class="title">仓库反馈</div>
            </div>
            <div class="goods-info">
                <div class="title">商品信息</div>
                <el-table border :data="tableData">
                    <el-table-column prop="" label="商品订单号"></el-table-column>
                    <el-table-column prop="" label="商品信息">
                        <div class="name">
                            <img :src="v.specImg" alt="">
                            <span class="pro-name">{{v.productName}}</span>
                            <span class="pro-spec">{{v.spec}}</span>
                        </div>
                    </el-table-column>
                    <el-table-column prop="" label="SKU编码"></el-table-column>
                    <el-table-column prop="" label="供应商SKU编码"></el-table-column>
                    <el-table-column prop="" label="实付单价"></el-table-column>
                    <el-table-column prop="" label="售后数量"></el-table-column>
                    <el-table-column prop="" label="一元券"></el-table-column>
                    <el-table-column prop="" label="实付金额"></el-table-column>
                </el-table>
            </div>
            <div class="">
                <div class="title">操作</div>
                <el-form>
                    <el-form-item label="售后审核结果">
                        <el-radio-group>
                            <el-radio label="1">审核通过</el-radio>
                            <el-radio label="2">审核驳回</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="审核金额调整">
                        <el-input></el-input><span>元，请在¥0.00~¥20.00区间内调整</span>
                    </el-form-item>
                    <el-form-item label="退货信息">
                        <el-radio-group>
                            <el-radio label="1">供应商退货地址</el-radio>
                            <el-radio label="2">平台退货地址</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="售后审核说明">
                        <el-input></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary">提交</el-button>
                    </el-form-item>
                </el-form>
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
                nav: ['订单管理', '售后单管理', '售后单列表', '售后单详情'],
                detailUrl: '',
                orderId: '',
                boolFirst: false,
                boolsec: false,
                boolThr: false,
                boolFor: false,
                isShowPop: false, // 订单标记颜色是否显示
                isShowPreferential: false, // 优惠活动
                isShowWarehouse: false, // 更换提货仓
                orderStatus: '', // 总订单状态: 1:待支付 2:待发货 3:待收货 4:确认收货 5:已完成 6:退货关闭 7:用户关闭 8:超时关闭
                // pickedUp: '', // 是否自提状态（1.正常 2.自提完成）
                markArr: [
                    { label: 'red', value: '1' },
                    { label: 'skyblue', value: '2' },
                    { label: 'lightgreen', value: '3' },
                    { label: 'orange', value: '4' },
                    { label: 'purple', value: '5' }
                ],
                tableData: [],
                warehouseArr: [],
                orderFreeTime: '',
                orderFinishTime: '',
                orderFreePayTime: '',
                agreeMask: false,
                productId: '',
                refundForm: {
                    returnBalance: '',
                    returnAmounts: '',
                    returnTokenCoin: '',
                    outTradeNo: '',
                    badReason: '',
                    scrapReason: '',
                    hadScrap: false // 是否选择产品报损
                },
                payType: '',
                value: [],
                // 报损原因
                reasonList: [],
                // 订单信息
                orderMsg: {
                    starIndex: '', // 标记颜色序号
                    url: '', // 按钮状态(批量)
                    sinUrl: '', // 按钮状态(单个)
                    status: '', // 订单状态
                    star: '', // 星级
                    adminRemark: ``, // 备注
                    nickName: '', // 昵称
                    phone: '', // 联系方式
                    receiver: '', // 收货人
                    recevicePhone: '', // 收货人电话
                    receiveAddress: '', // 收货地址
                    buyerRemark: ``, // 卖家备注
                    storehouseName: '', // 提货点
                    orderNum: '', // 订单号
                    createTime: '', // 订单创建时间
                    payTime: '', // 第三方/平台支付时间
                    deliveryTime: '', // 确认时间
                    tradeNo: '', // 第三方支付交易号
                    sendTime: '', // 发货时间
                    cancleTime: '', // 取消时间
                    expressName: '', // 物流公司名称
                    expressNo: '', // 物流单号
                    freeTimer: '', // 待支付倒计时
                    confirmTimer: '' // 待确认倒计时
                }
            };
        },

        created() {
            // 获取订单信息
            this.orderId = this.$route.query.orderInfoId;
            this.getInfo();
        },
        methods: {
            //  获取信息
            getInfo() {
                request.orderDetail({ id: this.orderId }).then(res => {
                    this.orderMsg = res.data;
                    this.tableData = [];
                    res.data.orderPayRecord = res.data.orderPayRecord ? res.data.orderPayRecord : {};
                    res.data.orderProductList.forEach((v, k) => {
                        if (k == 0) {
                            v.returnProductList = [{ id: 1, salesStatus: '11' }, { id: 1, salesStatus: '22' }];
                            v.logicList = [{ id: 1, logicStatus: '11' }];
                        } else {
                            v.returnProductList = [{ id: 2, salesStatus: '11' }];
                            v.logicList = [{ id: 2, logicStatus: '11' }, { id: 2, logicStatus: '22' }];
                        }
                        const length = v.returnProductList.length > v.logicList.length ? v.returnProductList.length : v.logicList.length;
                        v.rows = length;
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
    }
</style>
