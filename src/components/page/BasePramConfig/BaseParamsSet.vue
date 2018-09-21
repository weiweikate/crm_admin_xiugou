<template>
  <div class="base-params">
      <v-breadcrumb :nav="nav"></v-breadcrumb>
      <el-card v-loading="bodyLoading" :body-style="{ padding: '20px 40px',minHeight:'60vh' }">
          <div class="currency-title">参数设置</div>
          <div class="currency-wrap">
              <span class="currency-small-title">订单取消倒计时时间设置</span><br/>
              <el-input v-model="orderCancleTime" class="input-sty"></el-input><span class="point">分钟</span><br />
              <span class="currency-small-title">支付超时退款时间设置</span><br/>
              <el-input v-model="payOvertime" class="input-sty"></el-input><span class="point">分钟</span><br />
              <span class="currency-small-title">待确认收货时间设置</span><br/>
              <el-input v-model="toBeConfirmTime" class="input-sty"></el-input><span class="point">天</span><br />
              <!-- <span class="currency-small-title">默认用户退货发货时间</span><br/>
              <el-input v-model="returnGoodsTime" class="input-sty"></el-input><span class="point">天</span><br /> -->
              <span class="currency-small-title">退货/换货申请运单提交倒计时</span><br/>
              <el-input v-model="returnDownTime" class="input-sty"></el-input><span class="point">天</span><br />
              <div class="btn-group">
                  <el-button :loading="btnLoading" type="primary" @click="submitForm">确认提交</el-button>
                  <el-button @click="cancle" >取消</el-button>
              </div>
          </div>
      </el-card>

  </div>
</template>

<script>
import vBreadcrumb from '@/components/common/Breadcrumb.vue';
import request from '@/http/http';
export default {
    components: { vBreadcrumb },

    data() {
        return {
            nav: ['运营管理', '交易基础参数设置'],
            bodyLoading: false,
            btnLoading: false,
            orderCancleTime: '',
            toBeConfirmTime: '',
            returnGoodsTime: '',
            returnDownTime: '',
            payOvertime: ''
        };
    },

    activated() {
        this.getInfo();
    },

    methods: {
        // 获取数据
        getInfo() {
            const data = {
                codes: 'time_order_cancel,pay_overtime,time_goods_confirm,time_express_send'
            };
            this.bodyLoading = true;
            request.queryConfig(data).then(res => {
                this.orderCancleTime = res.data[0].value;
                this.toBeConfirmTime = res.data[2].value;
                this.returnDownTime = res.data[3].value;
                this.payOvertime = res.data[1].value;
                this.bodyLoading = false;
            }).catch(err => {
                this.bodyLoading = false;
                console.log(err);
            });
        },
        //   提交表单
        submitForm() {
            const data = {
                configVOS: [
                    {
                        code: 'time_order_cancel',
                        name: '订单自动取消时间',
                        value: this.orderCancleTime,
                        value_type: 1,
                        status: 1
                    },
                    {
                        code: 'pay_overtime',
                        name: '支付超时退款时间',
                        value: this.payOvertime,
                        value_type: 1,
                        status: 1
                    },
                    {
                        code: 'time_goods_confirm',
                        name: '待确认收货时间',
                        value: this.toBeConfirmTime,
                        value_type: 1,
                        status: 1
                    },
                    {
                        code: 'time_express_send',
                        name: '退货/换货申请运单提交倒计时',
                        value: this.returnDownTime,
                        value_type: 1,
                        status: 1
                    }
                ]
            };
            this.btnLoading = true;
            request.addOrModifyList(data).then(res => {
                this.$message.success(res.msg);
                this.btnLoading = false;
            }).catch(err => {
                console.log(err);
                this.btnLoading = false;
            });
        },
        // 取消
        cancle() {
            this.getInfo();
        }
    }
};
</script>
<style lang='less' scoped>
.base-params {
  .currency-title {
    width: 100%;
    height: 60px;
    background-color: #f7f7f7;
    line-height: 60px;
    padding: 0 20px;
    box-sizing: border-box;
  }
  .currency-wrap {
    padding: 0 20px;
    box-sizing: border-box;
    .currency-small-title {
      display: inline-block;
      margin: 20px 0;
      box-sizing: border-box;
      font-size: 14px;
    }
    .input-sty {
      width: 350px;
      margin-bottom: 20px;
    }
    .point {
      font-size: 14px;
      padding: 0 15px 0 5px;
    }
    .btn-group {
      margin-top: 40px;
    }
  }
}
</style>
