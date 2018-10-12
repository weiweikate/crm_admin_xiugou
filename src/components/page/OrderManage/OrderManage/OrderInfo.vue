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
                <span v-if='orderStatus == 1' class="activite-status">当前订单状态：待支付</span>
                <span v-if='orderStatus == 2' class="activite-status">当前订单状态：待发货</span>
                <span v-if='orderStatus == 3' class="activite-status">当前订单状态：待收货</span>
                <span v-if='orderStatus == 4' class="activite-status">当前订单状态：待自提</span>
                <span v-if='orderStatus == 5' class="activite-status">当前订单状态：已完成（确认收货）</span>
                <span v-if='orderStatus == 6' class="activite-status">当前订单状态：已关闭（退款关闭）</span>
                <span v-if='orderStatus == 7' class="activite-status">当前订单状态：已完成</span>
                <span v-if='orderStatus == 8' class="activite-status">当前订单状态：已关闭</span>
                <span v-if='orderStatus == 9' class="activite-status">当前订单状态：用户删除</span>
                <span v-if='orderStatus == 10' class="activite-status">当前订单状态：超时关闭</span>
                <span v-if='orderStatus==1' class="pay-time">订单剩余时间：{{orderFreeTime}}</span>
                <span v-if='orderStatus==3' class="pay-time">订单待完成时间：{{orderFinishTime}}</span>
                <br/>
                <el-button v-if="orderStatus == 2" @click='orderSendOut' class="cloud-delivery-btn"
                           type="danger">云仓发货
                </el-button>
                <el-button v-if="orderStatus == 4" @click='changeStatus(orderMsg.url)'
                           class="cloud-delivery-btn" type="danger">已提货
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
                    <span class="smal-span">昵称：{{orderMsg.nickName}}</span>
                    <span class="smal-span">联系方式：{{orderMsg.phone}}</span>
                </p>
                <p v-if='orderStatus == 3 || orderStatus == 5 || orderStatus == 7' class="info-title">收货地址</p>
                <p v-if='orderStatus == 3 || orderStatus == 5 || orderStatus == 7' class="info-content">
                    <span class="smal-span">收货人：{{orderMsg.receiver}}</span>
                    <span class="smal-span">收货人联系方式：{{orderMsg.recevicePhone}}</span>
                </p>
                <p v-if='(orderStatus == 3 || orderStatus == 5 || orderStatus == 7) && pickedUp !=2'
                   class="info-content">
                    <span class="smal-span">收货地址：{{orderMsg.receiveAddress}}</span>
                </p>
                <p class="info-content">
                    <span class="smal-span">买家备注：{{orderMsg.buyerRemark}}</span>
                </p>
                <p v-if='orderStatus == 4 || orderStatus == 5 || orderStatus == 7' class="info-title">买家自提</p>
                <p v-if='orderStatus == 4 || orderStatus == 5 || orderStatus == 7' class="info-content">
                    <span class="smal-span">提货点：{{orderMsg.storehouseName}}</span>
                    <el-button v-if='orderStatus == 4' type="primary" @click="isShowWarehouse = true">更换提货仓</el-button>
                </p>
                <p v-if='orderStatus == 3 || orderStatus == 5 || orderStatus == 7' class="info-title">物流信息</p>
                <p v-if='orderStatus == 3 || orderStatus == 5 || orderStatus == 7' class="info-content">
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
                    <span v-if='orderStatus != 9' class="content-con">订单号：{{ orderMsg.orderNum }}</span>
                    <span v-if='orderStatus != 9' class="content-con">创建时间：{{ orderMsg.createTime | formatDate }}</span>
                    <span v-if='orderStatus != 9' class="content-con">平台支付时间：{{ orderMsg.payTime | formatDate }}</span>
                    <span v-if='orderStatus != 1 && orderStatus != 2 && orderStatus != 9' class="content-con">第三方支付时间：{{ orderMsg.payTime | formatDate }}</span>
                </p>
                <p class="info-content">
                    <span v-if='orderStatus == 3 || orderStatus == 4 || orderStatus == 5 || orderStatus == 7'
                          class="content-con">发货时间：{{ orderMsg.sendTime | formatDate }}</span>
                    <span v-if='orderStatus == 6 || orderStatus == 8 || orderStatus == 10' class="content-con">取消时间：{{ orderMsg.cancleTime }}</span>
                    <span v-if='orderStatus != 1 && orderStatus != 2 && orderStatus != 9' class="content-con">支付宝（第三方支付）交易号：{{ orderMsg.tradeNo }}</span>
                    <span v-if='orderStatus == 5 || orderStatus == 7' class="content-con">确认时间：{{orderMsg.deliveryTime | formatDate}}</span>
                </p>
                <el-table border :data="tableData" :span-method="spanMethod">
                    <el-table-column label="产品名称" align="center" width="500px">
                        <template slot-scope="scope">
                            <div class="name">
                                <img :src="scope.row.imgUrl" alt="">
                                <span class="pro-name">{{scope.row.productName}}</span>
                                <span class="pro-spec">{{scope.row.spec}}</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="price" label="单价" align="center"></el-table-column>
                    <el-table-column prop="num" label="数量" align="center"></el-table-column>
                    <el-table-column label="收货人" align="center">
                        <template slot-scope="scope">
                            <span>收货人：{{scope.row.receiver}}</span><br/>
                            <span>{{scope.row.recevicePhone}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="status" label="交易状态" align="center">
                        <template slot-scope="scope">
                            <template v-if='scope.row.status == 1'>待支付</template>
                            <template v-else-if='scope.row.status == 2'>待收货</template>
                            <template v-else-if='scope.row.status == 3'>确认收货</template>
                            <template v-else-if='scope.row.status == 4'>退款中</template>
                            <template v-else-if='scope.row.status == 5'>退货中</template>
                            <template v-else-if='scope.row.status == 6'>换货中</template>
                            <template v-else-if='scope.row.status == 8'>已完成</template>
                            <template v-else-if='scope.row.status == 9'>已关闭</template>
                        </template>
                    </el-table-column>
                    <el-table-column label="实收款" align="center">
                        <template slot-scope="scope">
                            实收款:{{scope.row.totalPrice | handleMoney}}<br/>
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
                            <template v-if='(scope.row.type & 2) != 0'>微信小程序 </template>
                            <template v-if='(scope.row.type & 4) != 0'>APP支付 </template>
                            <template v-if='(scope.row.type & 8) != 0'>支付宝 </template>
                            <template v-if='(scope.row.type & 16) != 0'>银联 </template>
                            {{scope.row.amounts | handleMoney}}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center">
                        <template slot-scope="scope">
                            <template v-if="scope.row.returnType">
                                <el-button @click='toAfterSale(scope.row.id)'type="primary">{{`${returnTypeArr[Number(scope.row.returnType)-1]}${afterSaleStatusArr[Number(scope.row.returnProductStatus)-1]}`}}</el-button>
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
        <!-- 更换提货仓 -->
        <el-dialog title="更换提货仓" width="30%" :visible.sync="isShowWarehouse">
            <div class="warehouse-wrap">
                <div v-for="(v,k) in warehouseArr" @click="changeWarehouse(v)" :key="k"
                     :class="{'warehouse-box':true,'warehouse-box-active':v.active}">
                    <!-- <p class="warehouse-box-tit">{{v.title}}</p> -->
                    <p class="warehouse-box-con">{{(v.province==undefined?'':v.province) +v.city+v.area+v.address}}</p>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import vBreadcrumb from '@/components/common/Breadcrumb.vue';
    import utils from '@/utils/index.js';
    import request from '@/http/http.js';

    export default {
        components: { vBreadcrumb },

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
                orderStatus: '', // 总订单状态: 1:待支付 2:待发货 3:待确认 4:待自提 5:确认收货 6:退款（关闭） 7:正常已完成 8:已关闭 9:用户删除 10:超时关闭
                pickedUp: '', // 是否自提状态（1.正常 2.自提完成）
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
            // 获取提货仓列表
            // this.getStoreList();
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
                    // pickedUp: 1：发货 2：自提
                    // if(res.data.pickedUp == 1 && res.data.status==7){
                    //   this.orderStatus = 7;
                    // }else if(res.data.pickedUp == 2 && res.data.status==7){
                    //   this.orderStatus = 9;
                    // }else{
                    //   this.orderStatus = res.data.status;
                    // }
                    this.orderStatus = res.data.status;
                    this.getProgressStu(this.orderStatus.toString());
                    this.orderMsg.starIndex = res.data.star || 1;
                    this.orderMsg.star =
                        res.data.star == null
                            ? ''
                            : this.markArr[res.data.star - 1].label;
                    this.orderMsg.adminRemark = res.data.adminRemark;
                    this.orderMsg.nickName = res.data.nickname;
                    this.orderMsg.phone = res.data.phone;
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
                    this.orderMsg.deliveryTime = res.data.deliveryTime; // 确认时间
                    this.orderMsg.sendTime = res.data.sendTime; // 发货时间
                    // this.order.cancleTime = res.data.sendTime; // 取消时间
                    this.orderMsg.tradeNo = res.data.tradeNo;
                    // this.orderFreePayTime = res.data.createTime; // 倒计时
                    this.orderMsg.expressName = res.data.expressName; // 物流公司名称
                    this.orderMsg.expressNo = res.data.expressNo; // 物流单号
                    this.tableData = [];
                    this.pickedUp = res.data.pickedUp;
                    res.data.orderProductList.forEach((v, k) => {
                        v.totalPrice = res.data.totalPrice;
                        v.freightPrice = res.data.freightPrice;
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
                    if (res.data.overtimeClosedTime) {
                        this.orderFreeTimeDown(res.data.overtimeClosedTime);
                    }
                    // 待完成剩余时间
                    if (res.data.autoConfirmTime) {
                        this.orderFinishTimeDown(res.data.autoConfirmTime);
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
                        this.orderMsg.url = 'pickUpGoods';
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
                    case '9':
                        this.boolFirst = true;
                        this.boolsec = true;
                        this.boolThr = true;
                        this.boolFor = true;
                        break;
                    case '9':
                        this.boolFirst = true;
                        this.boolsec = true;
                        this.boolThr = true;
                        this.boolFor = true;
                        break;
                    case '9':
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
                sessionStorage.setItem('findExpressId', this.orderId);
                this.$router.push({ name: 'logistics', query: { findExpressId: this.orderId }});
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
            // 更换提货仓
            changeWarehouse(row) {
                this.warehouseArr.forEach((v, k) => {
                    v.active = false;
                });
                row.active = true;
                const data = {
                    orderId: this.orderId,
                    storeHouseId: row.id
                };
                request.changeStoreHouse(data).then(res => {
                    this.$message.success(res.msg);
                    this.orderMsg.storehouseName =
                        row.province == undefined
                            ? ''
                            : row.province + row.city + row.area + row.address;
                }).catch(err => {
                    console.log(err);
                });
            },
            // 云仓发货
            orderSendOut() {
                request.orderSendOut({ orderId: this.orderId }).then(res => {
                    this.$message.success(res.msg);
                    this.getInfo();
                }).catch(err => {
                    console.log(err);
                });
            },
            // 备注
            changeColor(status, v) {
                const data = {};
                data.orderId = this.orderId;
                data.star = status == 1 ? v.value : this.orderMsg.starIndex;
                data.remarks = this.orderMsg.adminRemark;
                request.orderSign(data).then(res => {
                    this.$message.success(res.mag);
                    this.orderMsg.star = this.markArr[Number(data.star) - 1].label;
                    this.isShowPop = false;
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
    }
</style>
