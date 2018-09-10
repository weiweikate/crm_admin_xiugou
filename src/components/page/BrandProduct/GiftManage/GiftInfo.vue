<template>
    <div class="gift-info">
        <v-breadcrumb :nav="['品牌产品管理','礼包管理','价格库存管理']"></v-breadcrumb>
        <el-card :body-style="{ padding: '30px' }">
            <el-form label-width="130px">
                <el-form-item label="礼包名称：">
                    {{name}}
                </el-form-item>
                <el-form-item label="礼包图片：">
                    <div>
                        <img style="width:200px" v-for="(v,k) in imgArr" :key="k" :src="v.original_img" />
                    </div>
                </el-form-item>
                <el-form-item label="产品分类：">
                    {{categories}}
                </el-form-item>
                <el-form-item label="产品品牌：">
                    {{brand}}
                </el-form-item>
                <el-form-item label="产品详情：">
                    <div v-html='content'></div>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script>
import vBreadcrumb from "@/components/common/Breadcrumb.vue";
import * as api from "@/api/BrandProduct/GiftMange/index.js";
import * as pApi from "@/privilegeList/BrandProduct/GiftMange/index.js";
import utils from "@/utils/index.js";
export default {
  components: {vBreadcrumb},

  data () {
    return {
        // 礼包id
        giftId:'',
        name:'礼包三',   // 产品名称
        imgArr:[],  // 图片列表
        categories:'', // 产品分类
        brand:'', // 品牌
        content:'', // 礼包详情
    };
  },

  activated(){
      this.giftId = this.$route.query.giftId || sessionStorage.getItem('giftId');
      this.getGiftInfo();
  },

  methods: {
        getGiftInfo(){
            this.$axios.post(api.getGiftBagDetail,{id:this.giftId}).then(res=>{
                this.name = res.data.data.name;
                this.imgArr = res.data.data.imgList;
                this.categories = res.data.data.categoryName;
                this.brand = res.data.data.brandName;
                this.content = res.data.data.content;
            })
        }
  }
}

</script>
<style lang='less' scoped>
.gift-info{

}
</style>