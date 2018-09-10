<template>
  <div class="order-info">
      <v-breadcrumb :nav='nav'></v-breadcrumb>
      <el-card :body-style="{ padding: '28px 50px' }">
        <!-- 订单状态 -->
        <div class="order-status">
            <div :class="{'s-block':true,'s-block-bgcolor':boolFirst}"><div class="s-block-content">买家下单</div></div>
            <div :class="{'s-block':true,'s-block-bgcolor':boolsec}"><div class="s-block-content">买家付款</div></div>
            <div :class="{'s-block':true,'s-block-bgcolor':boolThr}"><div class="s-block-content">发货</div></div>
            <div :class="{'s-block':true,'s-block-bgcolor':boolFor}"><div class="s-block-content">买家确认收货</div></div>
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
            <br/><br/><br/>
            <el-button v-if="orderStatus == 2 && p.orderSendOutGift" @click='orderSendOut' class="cloud-delivery-btn" type="danger">云仓发货</el-button>
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
            <p class="info-title">物流信息</p>
            <p class="info-content">
                <span class="smal-span">物流公司名称：{{orderMsg.expressName}}</span>
                <span class="smal-span">运单号：{{orderMsg.expressNo}}</span>
                <span v-if='orderStatus ==3 || orderStatus ==7' style="color:#33b4ff;cursor:pointer" @click="showLogisticsMsg">查看物流信息</span>
            </p>
        </div>
        <!-- 发货人信息 -->
        <!-- <div class="delivery">
            <p class="info-content">
                <span class="smal-span">发货方：代理商</span>
                <span class="smal-span">联系方式：17601056863</span>
            </p>
        </div> -->
        <!-- 订单信息 -->
        <div class="order-info">
            <p class="info-content">
                <span class="content-con">订单号：{{ orderMsg.orderNum }}</span>
                <span class="content-con">创建时间：{{ orderMsg.createTime | formatDate }}</span>
                <span v-if='orderStatus != 8' class="content-con">平台支付时间：{{ orderMsg.payTime | formatDate }}</span>
                <span v-if='orderStatus != 1 && orderStatus != 8' class="content-con">第三方支付时间：{{ orderMsg.payTime | formatDate }}</span>
            </p>
            <p class="info-content">
                <span v-if='orderStatus == 3 || orderStatus == 7' class="content-con">发货时间：{{ orderMsg.sendTime | formatDate }}</span>
                <span v-if='orderStatus == 8' class="content-con">关闭时间：{{ orderMsg.cancleTime }}</span>
                <span v-if='orderStatus != 1 && orderStatus != 8' class="content-con">支付宝（第三方支付）交易号：{{ orderMsg.tradeNo }}</span>
                <span v-if='orderStatus == 7' class="content-con">完成时间：{{orderMsg.deliveryTime | formatDate}}</span>
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
              <el-table-column label="买家" align="center">
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
              <el-table-column prop="id" label="实收款" align="center">
                  <template slot-scope="scope">
                      代币支付:{{scope.row.tokenCoin}}枚<br/>
                      余额支付:{{scope.row.balance | handleMoney}}<br/>
                      积分抵扣:{{scope.row.userScore}}<br/>
                      <template v-if='(scope.row.type & 1) != 0'>平台支付</template>
                      <template v-if='(scope.row.type & 2) != 0'>微信小程序 </template>
                      <template v-if='(scope.row.type & 4) != 0'>APP支付 </template>
                      <template v-if='(scope.row.type & 8) != 0'>支付宝 </template>
                      <template v-if='(scope.row.type & 16) != 0'>银联 </template>
                      {{scope.row.amounts | handleMoney}}
                  </template>
              </el-table-column>
            </el-table>
        </div>
      </el-card>
  </div>
</template>

<script>
import vBreadcrumb from "@/components/common/Breadcrumb.vue";
import * as api from "@/api/OrderManage/GiftOrder/index.js";
import * as pApi from "@/privilegeList/OrderManage/GiftOrder/index.js";
import utils from "@/utils/index.js";
export default {
  components: { vBreadcrumb },

  data() {
    return {
      nav: ["订单管理", "订单详情"],
      p:{
          orderSendOutGift:false,   // 推送云仓
      },
      detailUrl: "",
      orderId: "",
      boolFirst: false,
      boolsec: false,
      boolThr: false,
      boolFor: false,
      isShowPop:false,
      isShowWarehouse: false, // 更换提货仓
      orderStatus: "", //总订单状态: 1:待支付 2:待发货 3:待确认 7:已完成 8:已关闭 
      pickedUp:"", // 是否自提状态（1.正常 2.自提完成）
      markArr: [
        { label: "red", value: "1" },
        { label: "skyblue", value: "2" },
        { label: "lightgreen", value: "3" },
        { label: "orange", value: "4" },
        { label: "purple", value: "5" }
      ],
      tableData: [],
      warehouseArr: [],
      orderFreeTime: "",
      orderFinishTime: "",
      orderFreePayTime: "",
      // 订单信息
      orderMsg: {
        starIndex:'', // 标记颜色序号
        status: "", //订单状态
        star: "", //星级
        adminRemark: "", //备注
        nickName: "", //昵称
        phone: "", //联系方式
        receiver: "", //收货人
        recevicePhone: "", //收货人电话
        receiveAddress: "", //收货地址
        buyerRemark: "", //卖家备注
        storehouseName: "", //提货点
        orderNum: "", //订单号
        createTime: "", //订单创建时间
        payTime: "", //第三方/平台支付时间
        deliveryTime: "", // 确认时间
        tradeNo: "", //第三方支付交易号
        sendTime:"",//发货时间
        cancleTime:"",//取消时间，
        expressName:'', // 快递公司名称
        expressNo:'', // 快递单号
      },
      // 标记颜色
      markArr: [
          { label: "red", value: "1" },
          { label: "skyblue", value: "2" },
          { label: "lightgreen", value: "3" },
          { label: "orange", value: "4" },
          { label: "purple", value: "5" }
      ],
    };
  },

  activated() {
    // 获取订单信息
    this.orderId = this.$route.query.giftOrderInfoId || sessionStorage.getItem("giftOrderInfoId");
    this.getInfo();
    this.orderFinishTimeDown();
    this.pControl();
  },

  deactivated(){
    clearInterval(this.freeTimer);
    clearInterval(this.confirmTimer);
  },

  methods: {
     // 权限控制
    pControl() {
      for (const k in this.p) {
        this.p[k] = utils.pc(pApi[k]);
      }
    },
    //  获取信息
    getInfo() {
      this.$axios
        .post(api.getGiftBagOrderDetail, { giftBagOrderId: this.orderId })
        .then(res => {
          this.orderMsg.status = res.data.data.status;
          this.orderStatus = res.data.data.status;
          this.getProgressStu(this.orderStatus.toString());
          this.orderMsg.starIndex = res.data.data.star || 1;
          this.orderMsg.star =
            res.data.data.star == null
              ? ""
              : this.markArr[res.data.data.star - 1].label;
          this.orderMsg.adminRemark = res.data.data.adminRemark;
          this.orderMsg.nickName = res.data.data.nickname;
          this.orderMsg.phone = res.data.data.phone;
          this.orderMsg.receiver = res.data.data.receiver;
          this.orderMsg.recevicePhone = res.data.data.recevicePhone;
          this.orderMsg.receiveAddress = `${
            res.data.data.province == undefined ? "" : res.data.data.province
          }${res.data.data.city}${res.data.data.area}`;
          this.orderMsg.buyerRemark = res.data.data.buyerRemark;
          this.orderMsg.orderNum = res.data.data.orderNum;
          this.orderMsg.createTime = res.data.data.createTime;  // 创建时间
          this.orderMsg.payTime = res.data.data.payTime;  // 第三方支付时间
          this.orderMsg.deliveryTime = res.data.data.deliveryTime;  // 确认时间
          this.orderMsg.sendTime = res.data.data.sendTime; // 发货时间
          // this.order.cancleTime = res.data.data.sendTime; // 取消时间
          this.orderMsg.tradeNo = res.data.data.tradeNo;
          // this.orderFreePayTime = res.data.data.createTime; // 倒计时
          this.orderMsg.expressName = res.data.data.expressName;// 快递公司名称
          this.orderMsg.expressNo = res.data.data.expressNo; // 快递单号
          this.tableData = [];
          this.pickedUp = res.data.data.pickedUp;
          res.data.data.list.forEach((v, k) => {
            v.totalPrice = res.data.data.totalPrice;
            v.freightPrice = res.data.data.freightPrice;
            v.tokenCoin =
              res.data.data.tokenCoin == null ? "0" : res.data.data.tokenCoin;
            v.balance =
              res.data.data.balance == null ? "0" : res.data.data.balance;
            v.userScore =
              res.data.data.userScore == null ? "0" : res.data.data.userScore;
            v.type = res.data.data.payType;
            v.amounts =
              res.data.data.amounts == null ? "0" : res.data.data.amounts;
            this.tableData.push(v);
          });
          // 待支付剩余时间
          if(res.data.data.overtimeClosedTime){
              this.orderFreeTimeDown(res.data.data.overtimeClosedTime);
          }
          // 待完成剩余时间
          if(res.data.data.autoConfirmTime){
              this.orderFinishTimeDown(res.data.data.autoConfirmTime)
          }
        })
        .catch(err => {
          console.log(res);
        });
    },
    //  重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 判断进度条状态
    getProgressStu(n) {
      switch (n) {
        case "1":
          this.boolFirst = true;
          this.boolsec = true;
          this.boolThr = true;
          this.boolFor = false;
          break;
        case "2":
          this.boolFirst = true;
          this.boolsec = true;
          this.boolThr = true;
          this.boolFor = false;
          break;
        case "3":
          this.boolFirst = true;
          this.boolsec = true;
          this.boolThr = true;
          this.boolFor = false;
          break;
        case "7":
          this.boolFirst = true;
          this.boolsec = true;
          this.boolThr = true;
          this.boolFor = true;
          break;
        case "8":
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
    // 订单剩余时间倒计时
    orderFreeTimeDown(createTime) {
        let date = createTime;
        let that = this;
        this.freeTimer = setInterval(function () {
            let nowDate = new Date().getTime();
            let time = date - nowDate;
            if (time <= 0) {
                that.orderFreeTime = "00:00:00";
                clearInterval(this.freeTimer);
                return;
            }
            let hour = Math.floor((time / 1000 / 60 / 60) % 60);
            let minute = Math.floor((time / 1000 / 60) % 60);
            let second = Math.floor((time / 1000) % 60);
            hour = hour > 9 ? hour : "0" + hour;
            minute = minute > 9 ? minute : "0" + minute;
            second = second > 9 ? second : "0" + second;
            that.orderFreeTime = `${hour}:${minute}:${second}`;
        }, 1000);
    },
    // 订单待完成时间倒计时
    orderFinishTimeDown(createTime) {
        let date = createTime;
        let that = this;
        this.confirmTimer = setInterval(function () {
            let nowDate = new Date().getTime();
            let time = date - nowDate;
            if (time <= 0) {
                clearInterval(this.confirmTimer);
                that.orderFinishTime = "00:00:00";
                return;
            }
            let hour = Math.floor((time / 1000 / 60 / 60) % 60);
            let minute = Math.floor((time / 1000 / 60) % 60);
            let second = Math.floor((time / 1000) % 60);
            hour = hour > 9 ? hour : "0" + hour;
            minute = minute > 9 ? minute : "0" + minute;
            second = second > 9 ? second : "0" + second;
            that.orderFinishTime = `${hour}:${minute}:${second}`;
        }, 1000);
    },
    // 查看物流信息
    showLogisticsMsg() {
      sessionStorage.setItem('findExpressId',this.orderId);
      this.$router.push({name:'logistics',query:{findExpressId:this.orderId}});
    },
    // 云仓发货
    orderSendOut(){
      this.$axios
        .post(api.orderSendOut, {orderId:this.orderId})
        .then(res => {
          this.$message.success(res.data.data);
          this.getInfo();
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 备注
    changeColor(status,v) {
      let data = {};
      data.orderId = this.orderId;
      data.star = status == 1?v.value:this.orderMsg.starIndex;
      data.remarks = this.orderMsg.adminRemark;
      this.$axios.post(api.orderSign, data)
          .then(res => {
              this.$message.success(res.data.data);
              this.orderMsg.star = this.markArr[Number(data.star) - 1].label;
              this.isShowPop = false; 
          })
          .catch(err => {
              console.log(res);
          });
    },
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
      display: block;
      margin: 0 0 10px 0;
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
      margin-top: 5px;
    }
    .star {
      // float: left;
      font-size: 24px;
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
