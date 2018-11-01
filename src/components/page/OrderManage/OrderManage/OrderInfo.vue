<template>
    <div class="order-info">
        <v-breadcrumb :nav='nav'></v-breadcrumb>
        <el-card :body-style="{ padding: '28px 50px' }">
            <!-- 订单状态 -->
            <div class="order-status">
                <div :class="{'s-block':true,'s-block-bgcolor':boolFirst}">
                    <div class="s-block-content">买家下单</div>
                </div>
                <div :class="{'s-block':true,'s-block-bgcolor':boolsec}">
                    <div class="s-block-content">买家付款</div>
                </div>
                <div :class="{'s-block':true,'s-block-bgcolor':boolThr}">
                    <div class="s-block-content">发货</div>
                </div>
                <div :class="{'s-block':true,'s-block-bgcolor':boolFor}">
                    <div class="s-block-content">买家确认收货</div>
                </div>
            </div>
            <div class="top">
                <span v-if='orderStatus == 1&&orderMsg.outTradeNo' class="activite-status">当前订单状态：继续支付</span>
                <span v-if='orderStatus == 1&&!orderMsg.outTradeNo' class="activite-status">当前订单状态：待支付</span>
                <span v-if='orderStatus == 2' class="activite-status">当前订单状态：待发货</span>
                <span v-if='orderStatus == 3' class="activite-status">当前订单状态：待收货</span>
                <span v-if='orderStatus == 4' class="activite-status">当前订单状态：确认收货</span>
                <span v-if='orderStatus == 5' class="activite-status">当前订单状态：已完成</span>
                <span v-if='orderStatus == 6' class="activite-status">当前订单状态：已关闭(退货退款关闭)</span>
                <span v-if='orderStatus == 7' class="activite-status">当前订单状态：已关闭(用户关闭)</span>
                <span v-if='orderStatus == 8' class="activite-status">当前订单状态：已关闭(超时关闭)</span>
                <span v-if='orderStatus==1' class="pay-time">订单剩余时间：{{orderFreeTime}}</span>
                <span v-if='orderStatus==3' class="pay-time">订单待完成时间：{{orderFinishTime}}</span>
                <br/>
                <el-button v-if="orderStatus == 2" @click='orderSendOut' class="cloud-delivery-btn"
                           type="danger">推送云仓
                </el-button>
                <p class="preferential-info" @click='isShowPreferential = true'>优惠详情</p>
                <span class="mark">标记</span>
                <el-popover placement="bottom" width="150" v-model="isShowPop" trigger="hover">
                    <span slot="reference" style="cursor:pointer"><span class="star" :style="{color:orderMsg.star}">★</span></span>
                    <span v-for="(v,k) in markArr" :key="k" @click="changeColor(1,v)" :style="{color:v.label,fontSize:'22px',cursor:'pointer',marginRight:'5px'}">★</span>
                </el-popover>
                <el-input v-model="orderMsg.adminRemark" type="textarea" @blur="changeColor()" placeholder="请输入备注" :rows="5" style="width:50%;float:right;margin-right:42%"></el-input>
                <!-- <span class="star" :style="{color:orderMsg.star}">★</span>
                <span class="tip">备注：</span>
                <div class="tip-content">{{orderMsg.adminRemark}}</div> -->
            </div>
            <!-- 收货人信息 -->
            <div class="user-info">
                <p class="info-title">买家信息</p>
                <p class="info-content">
                    <span class="smal-span">昵称：{{orderMsg.dealerName}}</span>
                    <span class="smal-span">联系方式：{{orderMsg.dealerPhone}}</span>
                </p>
                <p class="info-title">收货地址</p>
                <p class="info-content">
                    <span class="smal-span">收货人：{{orderMsg.receiver}}</span>
                    <span class="smal-span">收货人联系方式：{{orderMsg.recevicePhone}}</span>
                </p>
                <p class="info-content">
                    <span class="smal-span">收货地址：{{orderMsg.receiveAddress}}</span>
                </p>
                <p class="info-content">
                    <span class="smal-span">买家备注：{{orderMsg.buyerRemark}}</span>
                </p>
                <p v-if='orderStatus == 3 || orderStatus == 4 || orderStatus == 5' class="info-title">物流信息</p>
                <p v-if='orderStatus == 3 || orderStatus == 4 || orderStatus == 5' class="info-content">
                    <span class="smal-span">物流公司名称：{{orderMsg.expressName}}</span>
                    <span class="smal-span">运单号：{{orderMsg.expressNo}}</span>
                    <span style="color:#33b4ff;cursor:pointer" @click="showLogisticsMsg">查看物流信息</span>
                </p>
            </div>
            <!-- 发货人信息 -->
            <!--<div class="delivery">-->
                <!--<p class="info-content">-->
                    <!--<span class="smal-span">发货方：代理商</span>-->
                    <!--<span class="smal-span">联系方式：17601056863</span>-->
                <!--</p>-->
            <!--</div>-->
            <!-- 订单信息 -->
            <div class="order-info">
                <p class="info-content">
                    <span class="content-con">订单号：{{ orderMsg.orderNum }}</span>
                    <span class="content-con">创建时间：{{ orderMsg.createTime | formatDateAll }}</span>
                    <span class="content-con" v-if="orderMsg.payTime">平台支付时间：{{ orderMsg.payTime | formatDateAll }}</span>
                    <span v-if='orderStatus == 5' class="content-con">第三方支付时间：{{ orderMsg.payTime | formatDateAll }}</span>
                </p>
                <p class="info-content">
                    <span v-if='orderStatus == 3 || orderStatus == 4 || orderStatus == 5'
                          class="content-con">发货时间：{{ orderMsg.sendTime | formatDateAll }}</span>
                    <span v-if='orderStatus == 6 || orderStatus == 7 || orderStatus == 8' class="content-con">取消时间：{{ orderMsg.cancleTime | formatDateAll }}</span>
                    <span v-if='orderStatus != 1 && orderStatus != 2 ' class="content-con">支付交易号：{{ orderMsg.outTradeNo }}</span>
                    <span v-if='orderStatus == 4 || orderStatus == 5' class="content-con">确认时间：{{orderMsg.deliverTime | formatDateAll}}</span>
                </p>
                <el-table border :data="tableData" :span-method="spanMethod">
                    <el-table-column label="产品名称" align="center" width="500px">
                        <template slot-scope="scope">
                            <div class="name">
                                <img :src="scope.row.specImg" alt="">
                                <span class="pro-name">{{scope.row.productName}}</span>
                                <span class="pro-spec">{{scope.row.spec}}</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="price" label="单价" align="center"></el-table-column>
                    <el-table-column prop="num" label="数量" align="center"></el-table-column>
                    <el-table-column label="买家" align="center">
                        <template slot-scope="scope">
                            <span>{{scope.row.dealerName}}</span><br/>
                            <span>{{scope.row.dealerPhone}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="status" label="交易状态" align="center">
                        <template slot-scope="scope">
                            <template v-if='scope.row.status == 1'>待支付</template>
                            <template v-else-if='scope.row.status == 2'>待发货</template>
                            <template v-else-if='scope.row.status == 3'>待收货</template>
                            <template v-else-if='scope.row.status == 4'>退货中</template>
                            <template v-else-if='scope.row.status == 5'>确认收货</template>
                            <template v-else-if='scope.row.status == 6'>已完成</template>
                            <template v-else-if='scope.row.status == 7'>已关闭</template>
                        </template>
                    </el-table-column>
                    <el-table-column label="实收款" align="center">
                        <template slot-scope="scope">
                            实收款:{{scope.row.totalPrice+scope.row.freightPrice | handleMoney}}<br/>
                            （含运费:{{scope.row.freightPrice | handleMoney}}）
                        </template>
                    </el-table-column>
                    <el-table-column prop="id" label="支付详情" align="center">
                        <template slot-scope="scope">
                            代币支付:{{scope.row.tokenCoin}}枚<br/>
                            余额支付:{{scope.row.balance | handleMoney}}<br/>
                            积分抵扣:{{scope.row.userScore}}<br/>
                            优惠券抵扣:{{scope.row.couponPrice | handleMoney}}<br/>
                            <template v-if='(scope.row.type & 1) != 0'>平台支付</template>
                            <template v-else-if='(scope.row.type & 2) != 0'>微信小程序 </template>
                            <template v-else-if='(scope.row.type & 4) != 0'>APP支付 </template>
                            <template v-else-if='(scope.row.type & 8) != 0'>支付宝 </template>
                            <template v-else-if='(scope.row.type & 16) != 0'>银联 </template>
                            {{scope.row.amounts | handleMoney}}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center">
                        <template slot-scope="scope">
                            <template v-if="scope.row.returnType">
                                <el-button @click='toAfterSale(scope.row.returnProductId)' type="primary">{{`${returnTypeArr[Number(scope.row.returnType)-1]}${afterSaleStatusArr[Number(scope.row.returnProductStatus)-1]}`}}</el-button>
                            </template>
                            <template v-else-if="scope.row.isBusinessRefund">
                                <el-button @click='refundMask(scope.row)' type="primary">商家退款</el-button>
                            </template>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-card>
        <!-- 优惠活动 -->
        <el-dialog title="端午活动专题" width="30%" :visible.sync="isShowPreferential">
            <h2 style="margin-bottom:10px">券值：30元</h2>
            <p>使用限制：满100可用</p>
            <p>可用周期：2018/02/04 12:00 - 2018/02/08 13:00</p>
            <p>可用品类：全品类</p>
            <p>可使用用户层级：V0,V1</p>
            <p>发放数量：999</p>
            <p>优惠券说明：优惠券仅限于商品购物使用，只有满足消费100元才可以使用。</p>
            <p>发布人：杨小猛</p>
        </el-dialog>
        <!--同意退款弹窗-->
        <el-dialog title="确认退款金额" class="agreeMask" :visible.sync="agreeMask">
            <el-form v-model="refundForm" label-width="110px">
                <el-form-item label="买家支付方式：">{{payType}}</el-form-item>
                <el-form-item label="退还余额">
                    <el-input v-model="refundForm.returnBalance" @blur="changeMoney(0,refundForm.returnBalance)"
                              auto-complete="off" placeholder="请输入退还余额"></el-input>
                    <span class="mar-left5">元</span>
                </el-form-item>
                <el-form-item label="三方账户">
                    <el-input auto-complete="off" v-model="refundForm.returnAmounts" placeholder="0" @blur="changeMoney(1,refundForm.returnAmounts)"></el-input>
                    <span class="mar-left5">元</span>
                </el-form-item>
                <el-form-item label="退还1元现金券">
                    <el-input auto-complete="off" v-model="refundForm.returnTokenCoin" placeholder="0" @blur="changeMoney(2,refundForm.returnTokenCoin)"></el-input>
                    <span class="mar-left5">张</span>
                </el-form-item>
                <el-form-item label="支付交易号">{{refundForm.outTradeNo}}</el-form-item>
                <el-form-item style="margin-left: -84px">
                    <el-checkbox v-model="refundForm.hadScrap">产品报损</el-checkbox>
                    <el-select v-model="refundForm.badReason" :disabled="!refundForm.hadScrap" @change="chooseBadReason" placeholder="请选择报损原因">
                        <el-option label="请选择报损原因" value=""></el-option>
                        <el-option v-for="(v,k) in reasonList" :key="k" :label="v.value" :value="v.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="报损说明">
                    <el-input type="textarea" :disabled="!refundForm.hadScrap" v-model="refundForm.scrapReason" auto-complete="off"
                              placeholder="请输入说明文字"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="refundSubmit('refundForm')">确认退款金额</el-button>
            </div>
        </el-dialog>


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
                },
                // returnType状态
                returnTypeArr: ['退款', '退货', '换货'],
                // 售后状态
                afterSaleStatusArr: ['申请中', '已同意', '已拒绝', '发货中', '云仓发货中', '已完成', '已关闭', '超时关闭']
            };
        },

        activated() {
            // 获取订单信息
            this.orderId =
                this.$route.query.orderInfoId || sessionStorage.getItem('orderInfoId');
            this.getInfo();
            this.getDictionaryData();
        },

        deactivated() {
            clearInterval(this.freeTimer);
            clearInterval(this.confirmTimer);
        },

        methods: {
            //  获取信息
            getInfo() {
                request.orderDetail({ id: this.orderId }).then(res => {
                    this.orderMsg.status = res.data.status;
                    this.orderStatus = res.data.status;
                    this.orderMsg = res.data;
                    this.getProgressStu(this.orderStatus.toString());
                    this.orderMsg.starIndex = res.data.star || 1;
                    this.orderMsg.star =
                        res.data.star == null
                            ? ''
                            : this.markArr[res.data.star - 1].label;
                    this.orderMsg.adminRemark = res.data.adminRemark;
                    this.orderMsg.dealerName = res.data.dealerName;
                    this.orderMsg.dealerPhone = res.data.dealerPhone;
                    this.orderMsg.receiver = res.data.receiver;
                    this.orderMsg.recevicePhone = res.data.recevicePhone;
                    this.orderMsg.receiveAddress = `${
                        res.data.province == undefined ? '' : res.data.province
                    }${res.data.city}${res.data.area}`;
                    this.orderMsg.buyerRemark = res.data.buyerRemark;
                    res.data.storehouseProvince = res.data.storehouseProvince == null ? '' : res.data.storehouseProvince;
                    res.data.storehouseCity = res.data.storehouseCity == null ? '' : res.data.storehouseCity;
                    res.data.storehouseArea = res.data.storehouseArea == null ? '' : res.data.storehouseArea;
                    res.data.storehouseAddress = res.data.storehouseAddress == null ? '' : res.data.storehouseAddress;
                    this.orderMsg.storehouseName = `${
                        res.data.storehouseProvince == null
                            ? ''
                            : res.data.storehouseProvince
                    }${res.data.storehouseCity}${res.data.storehouseArea}${
                        res.data.storehouseAddress
                    }`;
                    this.orderMsg.orderNum = res.data.orderNum;
                    this.orderMsg.createTime = res.data.createTime; // 创建时间
                    this.orderMsg.payTime = res.data.payTime; // 第三方支付时间
                    this.orderMsg.sendTime = res.data.sendTime; // 发货时间
                    // this.order.cancleTime = res.data.sendTime; // 取消时间
                    // this.orderFreePayTime = res.data.createTime; // 倒计时
                    this.orderMsg.expressName = res.data.expressName; // 物流公司名称
                    this.orderMsg.expressNo = res.data.expressNo; // 物流单号
                    this.tableData = [];

                    // this.pickedUp = res.data.pickedUp;
                    res.data.orderProductList.forEach((v, k) => {
                        v.totalPrice = res.data.totalPrice;
                        v.freightPrice = res.data.freightPrice;
                        v.isBusinessRefund = false;
                        v.dealerName = res.data.dealerName;
                        v.dealerPhone = res.data.dealerPhone;
                        const present = new Date().getTime();
                        if ((!v.finishTime && v.status > 1 && v.status < 6) || present < v.finishTime || v.returnProductId && (v.returnProductStatus == 7 || v.returnProductStatus == 8)) {
                            v.isBusinessRefund = true;
                        }
                        v.tokenCoin =
                            res.data.tokenCoin == null ? '0' : res.data.tokenCoin;
                        v.balance =
                            res.data.balance == null ? '0' : res.data.balance;
                        v.userScore =
                            res.data.userScore == null ? '0' : res.data.userScore;
                        v.type = res.data.payType;
                        v.amounts =
                            res.data.amounts == null ? '0' : res.data.amounts;
                        v.couponPrice =
                            res.data.couponPrice == null ? '0' : res.data.couponPrice;
                        this.tableData.push(v);
                    });
                    // 待支付剩余时间
                    if (res.data.shutOffTime) {
                        this.orderFreeTimeDown(res.data.shutOffTime);
                    }
                    // 待完成剩余时间
                    if (res.data.autoReceiveTime) {
                        this.orderFinishTimeDown(res.data.autoReceiveTime);
                    }
                }).catch(err => {
                    console.log(err);
                });
            },
            //  重置表单
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            // 判断进度条状态
            getProgressStu(n) {
                switch (n) {
                    case '1':
                        this.boolFirst = true;
                        this.boolsec = false;
                        this.boolThr = false;
                        this.boolFor = false;
                        break;
                    case '2':
                        this.boolFirst = true;
                        this.boolsec = true;
                        this.boolThr = false;
                        this.boolFor = false;
                        break;
                    case '3':
                        this.boolFirst = true;
                        this.boolsec = true;
                        this.boolThr = true;
                        this.boolFor = false;
                        break;
                    case '4':
                        this.boolFirst = true;
                        this.boolsec = true;
                        this.boolThr = true;
                        this.boolFor = false;
                        break;
                    case '5':
                        this.boolFirst = true;
                        this.boolsec = true;
                        this.boolThr = true;
                        this.boolFor = true;
                        break;
                    case '6':
                        this.boolFirst = true;
                        this.boolsec = true;
                        this.boolThr = true;
                        this.boolFor = true;
                        break;
                    case '7':
                        this.boolFirst = true;
                        this.boolsec = true;
                        this.boolThr = true;
                        this.boolFor = true;
                        break;
                    case '8':
                        this.boolFirst = true;
                        this.boolsec = true;
                        this.boolThr = true;
                        this.boolFor = true;
                        break;
                }
            },
            // 合并单元格
            spanMethod({ row, column, rowIndex, columnIndex }) {
                if (columnIndex == 5 || columnIndex == 6) {
                    if (rowIndex == 0) {
                        return {
                            rowspan: this.tableData.length,
                            colspan: 1
                        };
                    } else {
                        return [0, 0];
                    }
                }
            },
            // 获取订单
            // 订单剩余时间倒计时
            orderFreeTimeDown(createTime) {
                const date = createTime;
                const that = this;
                this.freeTimer = setInterval(function() {
                    const nowDate = new Date().getTime();
                    const time = date - nowDate;
                    if (time <= 0) {
                        that.orderFreeTime = '00:00:00';
                        clearInterval(this.freeTimer);
                        return;
                    }
                    let hour = Math.floor((time / 1000 / 60 / 60) % 60);
                    let minute = Math.floor((time / 1000 / 60) % 60);
                    let second = Math.floor((time / 1000) % 60);
                    hour = hour > 9 ? hour : '0' + hour;
                    minute = minute > 9 ? minute : '0' + minute;
                    second = second > 9 ? second : '0' + second;
                    that.orderFreeTime = `${hour}:${minute}:${second}`;
                }, 1000);
            },
            // 订单待完成时间倒计时
            orderFinishTimeDown(createTime) {
                const date = createTime;
                const that = this;
                this.confirmTimer = setInterval(function() {
                    const nowDate = new Date().getTime();
                    const time = date - nowDate;
                    if (time <= 0) {
                        clearInterval(this.confirmTimer);
                        that.orderFinishTime = '00:00:00';
                        return;
                    }
                    let hour = Math.floor((time / 1000 / 60 / 60) % 60);
                    let minute = Math.floor((time / 1000 / 60) % 60);
                    let second = Math.floor((time / 1000) % 60);
                    hour = hour > 9 ? hour : '0' + hour;
                    minute = minute > 9 ? minute : '0' + minute;
                    second = second > 9 ? second : '0' + second;
                    that.orderFinishTime = `${hour}:${minute}:${second}`;
                }, 1000);
            },
            // 更改订单状态(批量)
            changeStatus(url) {
                request[url]({ orderId: this.orderId }).then(res => {
                    this.$message.success(res.msg);
                    this.getInfo();
                }).catch(err => {
                    console.log(err);
                });
            },
            // 跳到售后详情
            toAfterSale(id) {
                sessionStorage.setItem('afterSaleOprId', id);
                this.$router.push({
                    path: '/afterSaleOpr',
                    query: { afterSaleOprId: id }
                });
            },
            // 查看物流信息
            showLogisticsMsg() {
                sessionStorage.setItem('findExpressId', this.orderMsg.expressNo);
                this.$router.push({ name: 'logistics', query: { findExpressId: this.orderMsg.expressNo }});
            },
            // 获取提货仓列表
            getStoreList() {
                this.warehouseArr = [];
                request.queryStoreHouseList({ }).then(res => {
                    res.data.forEach((v, k) => {
                        v.active = false;
                        this.warehouseArr.push(v);
                    });
                }).catch(err => {
                    console.log(err);
                });
            },
            // 云仓发货
            orderSendOut() {
                request.orderSendOut({ expressName: '申通', 'expressNo': 28123152342345, id: this.orderId }).then(res => {
                    this.$message.success(res.msg);
                    this.getInfo();
                }).catch(err => {
                    console.log(err);
                });
            },
            // 备注
            changeColor(status, v) {
                const data = {};
                data.id = this.orderId;
                data.adminStars = status == 1 ? v.value : this.orderMsg.starIndex;
                data.adminRemark = this.orderMsg.adminRemark;
                request.orderSign(data).then(res => {
                    this.$message.success(res.mag);
                    this.orderMsg.star = this.markArr[Number(data.star) - 1].label;
                    this.isShowPop = false;
                }).catch(err => {
                    console.log(err);
                });
            },
            // 产品报损数据字典
            async getDictionaryData() {
                await this.queryDictonary('CPBS');
                this.reasonList = this.tmpAxiosData;
            },
            changeMoney(num, pre) {
                if (pre > this.value[num]) {
                    if (num === 0) {
                        this.$message.warning('超过最大可退还余额!');
                        this.refundForm.returnBalance = this.value[0];
                    } else if (num === 1) {
                        this.$message.warning('超过最大可退还三方账户金额!');
                        this.refundForm.returnAmounts = this.value[1];
                    } else {
                        this.$message.warning('超过最大可退还退还1元现金券!');
                        this.refundForm.returnTokenCoin = this.value[2];
                    }
                }
            },
            // 选择报损原因
            chooseBadReason() {
                this.refundForm.scrapReason = this.refundForm.badReason;
            },
            // 获取退款金额详情
            getMoney() {
                const data = {
                    orderProductId: this.productId
                };
                request.businessRefund(data).then(res => {
                    this.refundForm = res.data;
                    const tmpType = '';
                    // if ((res.data.payType & 1) != 0) {
                    //     tmpType += `三方支付`;
                    // }
                    // if ((res.data.payType & 2) != 0) {
                    //     tmpType += `余额支付`;
                    // }
                    // if ((res.data.payType & 4) != 0) {
                    //     tmpType += `1元券支付`;
                    // }
                    this.payType = this.getType(res.data.payType);
                    this.value.push(this.refundForm.returnBalance, this.refundForm.returnAmounts, this.refundForm.returnTokenCoin);
                }).catch(err => {
                    console.log(err);
                });
            },
            getType(value) {
                let result = '';
                switch (value) {
                    case 1:
                        result = '三方支付';
                        break;
                    case 2:
                        result = '余额支付';
                        break;
                    case 3:
                        result = '余额支付+三方支付';
                        break;
                    case 4:
                        result = '1元券支付';
                        break;
                    case 5:
                        result = '三方支付+1元券支付';
                        break;
                    case 6:
                        result = '余额支付+1元券支付';
                        break;
                    case 7:
                        result = '余额支付+三方支付+1元券支付';
                        break;
                }
                return result;
            },
            // 商家退款
            refundMask(row) {
                this.agreeMask = true;
                this.productId = row.id;
                this.getMoney();
            },
            // 是否同意退款提交
            refundSubmit(form) {
                const data = this[form];
                data.hadScrap = this[form].hadScrap ? 1 : 2;
                data.orderProductId = this.productId;
                request.doBusinessRefund(data).then(res => {
                    this.$message.success(res.msg);
                    this.getInfo();
                    this.agreeMask = false;
                    this[form].hadScrap = false;
                }).catch(err => {
                    console.log(err);
                });
            }
        }
    };
</script>
<style lang='less'>
    .order-info {
        min-width: 960px;
        .el-dialog {
            padding: 0 20px;
            .el-dialog__header {
                border-bottom: 1px solid #ccc;
                .el-dialog__title {
                    color: #ff6868;
                    font-weight: 600;
                }
            }
        }
        .order-status {
            height: 55px;
            min-width: 1000px;
            .s-block {
                float: left;
                width: 200px;
                height: 53px;
                border: 1px solid #eee;
                border-right: none;
                transform: skew(-30deg);
                text-align: center;
                line-height: 53px;
                color: #999;
                .s-block-content {
                    display: inline-block;
                    transform: skew(30deg);
                }
            }
            .s-block:first-child {
                margin-left: 25px;
            }
            .s-block:last-child {
                border-right: 1px solid #eee;
            }
            .s-block-bgcolor {
                background-color: #33b4ff;
                color: #fff;
            }
        }
        .top {
            position: relative;
            padding: 30px 55px;
            box-sizing: border-box;
            border-bottom: 1px solid #ddd;
            overflow: hidden;
            .activite-status {
                display: inline-block;
                color: #666;
                font-size: 14px;
            }
            .cloud-delivery-btn {
                margin: 20px 0 0 0;
            }
            .preferential-info {
                margin: 20px 0 10px 0;
                font-size: 14px;
                cursor: pointer;
                color: #33b4ff;
            }
            .mark {
                float: left;
                font-size: 14px;
                cursor: pointer;
                color: #33b4ff;
            }
            .star {
                vertical-align: top;
                float: left;
                font-size: 20px;
                cursor: pointer;
                margin: -5px 0 0 10px;
            }
            .tip {
                float: left;
                margin-left: 35px;
                font-size: 14px;
                cursor: pointer;
                color: #33b4ff;
            }
            .tip-content {
                float: left;
                display: inline-block;
                background-color: #f7f7f7;
                border: 1px solid #eee;
                font-size: 14px;
                width: 500px;
                height: auto;
                color: #999;
                margin-top: 5px;
                padding: 10px;
                box-sizing: border-box;
            }
            .pay-time {
                color: #ff6868;
                font-size: 14px;
                margin-left: 150px;
            }
        }
        .user-info,
        .delivery {
            color: #666;
            padding: 30px 0 8px 0;
            border-bottom: 1px solid #ddd;
            .info-title {
                margin-bottom: 20px;
            }
            .info-content {
                padding-left: 50px;
                margin-bottom: 22px;
                box-sizing: border-box;
                font-size: 14px;
                .smal-span {
                    margin-right: 50px;
                }
            }
        }
        .order-info {
            padding: 30px 0 8px 0;
            color: #666;
            .info-content {
                padding-left: 50px;
                margin-bottom: 22px;
                box-sizing: border-box;
                font-size: 14px;
                .content-con {
                    margin-right: 40px;
                }
            }
        }
        .name {
            position: relative;
            display: inline-block;
            width: 100%;
            height: 100px;
            img {
                position: absolute;
                left: 0;
                top: 0;
                width: 100px;
                height: 100px;
                border-radius: 5px;
                border: 1px solid #eee;
            }
            .pro-name {
                position: absolute;
                top: 5px;
                left: 110px;
                display: inline-block;
            }
            .pro-spec {
                position: absolute;
                bottom: 5px;
                left: 110px;
                display: inline-block;
            }
        }
        .warehouse-wrap {
            width: 100%;
            max-height: 400px;
            padding: 5px 0;
            box-sizing: border-box;
            overflow-y: scroll;
            .warehouse-box {
                box-shadow: 0px 0px 2px 1px #ccc;
                margin: 0 auto;
                height: 100px;
                width: 80%;
                border-radius: 10px;
                padding: 20px;
                box-sizing: border-box;
                cursor: pointer;
                margin-bottom: 20px;
                .warehouse-box-tit {
                    font-size: 20px;
                }
                .warehouse-box-con {
                    font-size: 14px;
                    margin-top: 10px;
                }
            }
            .warehouse-box-active {
                box-shadow: 0px 0px 2px 1px #33b4ff;
                background-color: #33b4ff;
                color: #fff;
            }
        }
        .agreeMask {
            .el-dialog {
                width: 530px;
            }
            .el-dialog .el-input__inner {
                width: 180px;
            }
            .el-dialog .el-input {
                width: 180px;
            }
            .el-select .el-input__inner {
                width: 180px;
            }

            .icon-area .el-input__inner {
                width: 180px;
            }
            .el-dialog__footer {
                text-align: center;
            }
            .mar-left5 {
                margin-left: 5px;
            }
        }
    }
</style>
