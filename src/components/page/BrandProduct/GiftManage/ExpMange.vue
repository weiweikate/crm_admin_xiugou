<template>
    <div class="exp-mange">
        <v-breadcrumb :nav='["品牌产品管理", "礼包管理","经验值管理"]'></v-breadcrumb>
        <el-card :body-style="{ padding: '30px' }">
            <div class="exp-title">购买礼包后赠送的经验值设置</div>
            <p class="exp-wrap">
                <span>设置赠送的经验值</span>
                <el-input  class="my-inp" v-model.trim="expNum" maxlength="16" placeholder="请输入参数"></el-input>点
            </p>
            <p style="margin: 30px 0 0 40px">
                <el-button type="primary" @click="submitForm">确认</el-button>
                <el-button @click="goBack" >取消</el-button>
            </p>
        </el-card>
    </div>
</template>

<script>
import vBreadcrumb from "@/components/common/Breadcrumb.vue";
import * as api from "@/api/BrandProduct/GiftMange/index.js";
import * as pApi from "@/privilegeList/BrandProduct/GiftMange/index.js";
import utils from "@/utils/index.js";
export default {
  components: { vBreadcrumb },

  data() {
    return {
      giftId: "", // 礼包ID
      expNum:"",    // 设置的经验值
    };
  },

  activated() {
    this.giftId = this.$route.query.expMangeId || sessionStorage.getItem("expMangeId");
    this.getExpInfp();
  },

  methods: {
    // 提交表单
    submitForm(){
        let reg = /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/;
        if(!reg.test(this.expNum)){
            this.$message.warning('请输入正数，长度1-16字节');
            return;
        }
        this.$axios.post(api.setExperience,{experience:this.expNum,id:this.giftId}).then(res=>{
            this.$message.success(res.data.msg);
            this.expNum = '';
            this.$router.push('giftManage');
        })
    },
    // 经验值回显
    getExpInfp(){
        this.$axios.post(api.findExpById,{id:this.giftId}).then(res=>{
            this.expNum = res.data.data || '';
        })
    },
    goBack(){
        this.$router.push('giftManage');
    }
  }
};
</script>
<style lang='less' scoped>
.exp-mange {
    .exp-title{
        width: 100%;
        height: 60px;
        line-height: 60px;
        background-color: #f7f7f7;
        padding-left: 20px;
        box-sizing: border-box;
    }
    .my-inp{
        width: 215px;
        margin: 0 20px;
    }
    .exp-wrap{
        margin: 20px 0 0 20px;
    }
}
</style>