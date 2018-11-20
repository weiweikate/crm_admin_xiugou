<template>
  <div class="product-info">
      <v-breadcrumb :nav='nav'></v-breadcrumb>
      <el-card :body-style="{ padding: '50px 65px' }" v-loading="loading">
          <el-form label-width="110px">
            <el-form-item label="产品名称：">{{name}}</el-form-item>
              <el-form-item label="产品视频：">
                  <video v-if="video" :src="video" controls="controls"></video>
              </el-form-item>
            <el-form-item label="产品图片：">
                <div class="img-wrap" v-for="(v,k) in productImg" :key="k">
                    <img :src="v" alt="">
                </div>
            </el-form-item>
            <el-form-item label="产品分类：">{{productItem}}</el-form-item>
              <el-form-item label="产品参数：">
                  <p v-for="(v, k) in param" :key="k">{{v.param}}：{{v.paramValue}}</p>
              </el-form-item>
            <el-form-item label="产品品牌：">{{productBrand}}</el-form-item>
            <el-form-item label="产品详情：">
              <div v-html='productDetail'></div>
            </el-form-item>
            <el-form-item>
              <el-button @click="goBack" type="primary">返回列表</el-button>
            </el-form-item>
          </el-form>
      </el-card>

  </div>
</template>

<script>
import vBreadcrumb from '@/components/common/Breadcrumb.vue';
import request from '@/http/http';
export default {
    components: {
        vBreadcrumb
    },

    data() {
        return {
            nav: ['品牌产品管理', '产品管理', '产品详情'],
            loading: false,
            param: [],
            video: [],
            productId: '',
            name: '',
            productImg: [],
            productItem: '',
            productBrand: '',
            productDetail: ''
        };
    },

    activated() {
        this.productId = this.$route.query.productInfoId || sessionStorage.getItem('productInfo');
        this.getList();
    },

    methods: {
        getList() {
            this.loading = true;
            request.findProductDetailsById({ id: this.productId }).then(res => {
                this.loading = false;
                this.productImg = [];
                this.productDetail = res.data.infoValue;
                this.name = res.data.name;
                this.productItem = `${res.data.firstCategoryName || ''} - ${res.data.secCategoryName || ''} - ${res.data.thirdCategoryName || ''}`;
                this.productBrand = res.data.brandName;
                this.productDetail = res.data.content;
                res.data.imgFileList.forEach((v, k) => {
                    this.productImg.push(v.originalImg);
                });
                this.param = res.data.productParamValueVOList;
                this.video = res.data.videoUrl;
            }).catch(err => {
                this.loading = false;
                console.log(err);
            });
        },
        // 返回产品列表
        goBack(){
            this.$router.replace('productList')
        }
    }
};
</script>
<style lang='less'>
.product-info {
  .el-form-item__label,
  .el-form-item__content {
    font-size: 18px;
    color: #666;
  }
  .img-wrap {
    display: inline-block;
    width: 188px;
    height: 188px;
    border: 1px solid #ddd;
    border-radius: 5px;
    overflow: hidden;
    margin-right: 5px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .product-detail {
    img {
      border: 1px solid #ddd;
      border-radius: 5px;
    }
  }
}
</style>
