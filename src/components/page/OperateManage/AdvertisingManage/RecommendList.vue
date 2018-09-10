<template>
  <div class="recommend-list">
      <v-breadcrumb :nav="['运营管理','推荐位管理']"></v-breadcrumb>
    <el-card :body-style="{ padding: '40px 50px' }">
        <div class="box" @click="goPage()">产品推荐位1</div>
        <div class="box">产品推荐位2</div>
        <div class="box">产品推荐位3</div>
        <div class="box">产品推荐位4</div>
        <div class="box">产品推荐位5</div>
        <div class="box">产品推荐位6</div>
    </el-card>
    
  </div>
</template>

<script>
import vBreadcrumb from "../../../common/Breadcrumb.vue";
export default {
  components: {vBreadcrumb},

  data () {
    return {
    };
  },

  methods: {
      goPage(){
          this.$router.push({name:'recommendMange'});
      }
  }
}

</script>
<style lang='less' scoped>
.recommend-list{
    .box{
        display: inline-block;
        margin: 0 20px 20px 0;
        width: 350px;
        height: 150px;
        background-color: #33b4ff;
        border-radius: 10px;
        box-shadow: 0px 0px 10px -2px #000;
        line-height: 150px;
        text-align: center;
        cursor: pointer;
        color: #fff;
        font-size: 20px;
    }
}
</style>