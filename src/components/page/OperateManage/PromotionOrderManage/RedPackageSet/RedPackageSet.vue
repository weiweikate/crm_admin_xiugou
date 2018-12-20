<template>
  <div class="red-package">
      <v-breadcrumb :nav="nav"></v-breadcrumb>
      <el-card v-loading="bodyLoading" :body-style="{ padding: '20px 40px',minHeight:'60vh' }">
          <div class="currency-title">红包翻倍周期设置</div>
          <div class="currency-wrap">
              <span class="currency-small-title">每</span>
              <el-input v-model="doubling_period" class="input-sty"></el-input><span class="point">天</span>
              <span class="currency-small-title">概率增加</span>
              <el-input v-model="increase_probability" class="input-sty" placeholder="默认0不翻倍"></el-input><span class="point">倍</span><br />
              <div class="btn-group">
                  <el-button :loading="btnLoading" type="primary" @click="submitForm">确定</el-button>
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
            nav: ['运营管理', '推广订单管理', '红包翻倍周期设置'],
            bodyLoading: false,
            btnLoading: false,
            doubling_period: '',
            increase_probability: ''
        };
    },

    activated() {
        this.getInfo();
    },

    methods: {
        // 获取数据
        getInfo() {
            const data = {
                codes: 'doubling_period,increase_probability'
            };
            this.bodyLoading = true;
            request.queryConfig(data).then(res => {
                this.doubling_period = res.data[0].value;
                this.increase_probability = res.data[1].value;
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
                        code: 'doubling_period',
                        value: this.doubling_period
                    },
                    {
                        code: 'increase_probability',
                        value: this.increase_probability
                    }
                ]
            };
            const reg = /^(0|[1-9]\d*)$/;
            const reg1 = /^(0|[1-9]\d*)([.]{1}[0-9]{1,2})?$/;
            if (!reg.test(this.doubling_period) || !reg1.test(this.increase_probability)) {
                this.$message.warning('请输入合法数据!');
                return;
            }
            this.btnLoading = true;
            request.addOrModifyList(data).then(res => {
                this.$message.success(res.msg);
                this.btnLoading = false;
            }).catch(err => {
                console.log(err);
                this.btnLoading = false;
            });
        }
    }
};
</script>
<style lang='less' scoped>
.red-package {
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
      width: 110px;
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
