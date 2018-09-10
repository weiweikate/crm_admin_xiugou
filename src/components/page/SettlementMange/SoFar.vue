<template>
    <div class="so-far">
        <v-breadcrumb :nav="['结算管理','收益金比例设置']"></v-breadcrumb>
        <el-card :body-style="{ padding: '30px' }">
            <p>
                收益金总额占比设置：1 元收益金 = 
                <el-input-number @change="change" v-model="freeMoney" :min="0" :max="1" :precision="2" :step="0.01"></el-input-number> 余额 + 
                <el-input style='width:100px' v-model="coin" disabled></el-input> 代币
            </p><br/>
            <el-button type="primary" @click="submitForm">提交</el-button>
        </el-card>
    </div>
</template>

<script>
import vBreadcrumb from '@/components/common/Breadcrumb.vue';
import * as api from '@/api/SettlementMange/index.js';
export default {
  components: {vBreadcrumb},

  data () {
    return {
        freeMoney:'', // 余额
        coin:'', //代币
    };
  },

  activated(){
      this.getInfo();
  },

  methods: {
    //   获取数据
    getInfo(){
        this.$axios.post(api.findConfig,{}).then(res=>{
            this.freeMoney = res.data.data.balanceInProfitRatio;
            this.coin = (1-this.freeMoney).toFixed(2);
        })
    },
    //  提交表单
    submitForm(){
        this.$axios.post(api.updateConfigBalanceInProfitRatio,{balanceInProfitRatio:this.freeMoney}).then(res=>{
            this.$message.success(res.data.msg);
        })
    },
    change(){
        this.coin = (1-this.freeMoney).toFixed(2);
    }
  }
}

</script>
<style lang='less' scoped>
.so-far{
    /deep/.el-input__inner{
        border-radius: 0px;
    }
}
</style>