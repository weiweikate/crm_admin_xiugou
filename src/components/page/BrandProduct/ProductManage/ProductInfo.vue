<template>
  <div class="product-info">
      <v-breadcrumb :nav='nav'></v-breadcrumb>
      <el-card :body-style="{ padding: '50px 65px' }" v-loading="loading">
          <el-form label-width="120px">
              <div class="pro-title">基础信息</div>
              <el-form-item label="商品标题：">{{info.name}}</el-form-item>
              <el-form-item label="商品副标题：">{{info.secondName}}</el-form-item>
              <el-form-item label="选择供应商：">{{info.supplierName}}</el-form-item>
              <el-form-item label="商品类型：">
                  <template v-if="info.type == 1">普通商品</template>
                  <template v-else-if="info.type == 2">内购商品</template>
                  <template v-else-if="info.type == 3">虚拟商品</template>
                  <template v-else-if="info.type == 4">卡券商品</template>
              </el-form-item>
              <el-form-item label="发货仓库：">
                  <!--<template v-if="info.warehouseType == 1">自建仓</template>-->
                  <template v-else-if="info.warehouseType == 2">加盟仓</template>
                  <template v-else-if="info.warehouseType == 3">虚拟仓库</template>
                  <!--<template v-else-if="info.warehouseType == 4">供应商</template>-->
              </el-form-item>
              <el-form-item label="贸易类型：">
                  <template v-if="info.businessType == 1">一般贸易</template>
                  <template v-else-if="info.businessType == 2">跨境保税</template>
                  <template v-else-if="info.businessType == 3">海外直邮</template>
                  <template v-else-if="info.businessType == 4">海淘</template>
              </el-form-item>
              <!--<el-form-item label="是否自营：">{{info.needDeliver? '是': '否'}}</el-form-item>-->
              <el-form-item label="品牌：">{{info.brandName}}</el-form-item>
              <div class="pro-title">自然属性</div>
              <el-form-item>
                  <el-form-item v-for="(v, k) in info.paramList" :key="k" :label="v.paramName">{{ v.paramValue}}</el-form-item>
              </el-form-item>
              <div class="pro-title">销售属性</div>
              <el-form-item>
                  <el-form-item v-for="(v, k) in info.specifies" :key="k" :label="v.specName">
                      <el-form-item v-for="(v1, k1) in v.specValues" :key="`${k1}-1`">
                          <span >{{v1.specValue}}</span>
                          <img v-show="v1.specImg" :src="v1.specImg" alt="" style="width: 50px;height: 50px;vertical-align: middle;margin-left: 20px">
                      </el-form-item>
                  </el-form-item>
              </el-form-item>
              <div class="pro-title">销售信息编辑</div>
              <el-table :data="info.skuList" border stripe>
                  <el-table-column prop="propertyValues" label="属性" width="225" align="center">
                      <template slot-scope="scope">
                          {{scope.row.propertyValues.split('@').join('-')}}
                      </template>
                  </el-table-column>
                  <el-table-column prop="originalPrice" label="原价" align="center" width="225">
                      <template slot-scope="scope">
                          {{scope.row.originalPrice | formatMoney}}
                      </template>
                  </el-table-column>
                  <el-table-column prop="v0" label="v0" align="center" width="225">
                      <template slot-scope="scope">
                          {{scope.row.v0 | formatMoney}}
                      </template>
                  </el-table-column>
                  <el-table-column prop="v1" label="v1" align="center" width="225">
                      <template slot-scope="scope">
                          {{scope.row.v1 | formatMoney}}
                      </template>
                  </el-table-column>
                  <el-table-column prop="v2" label="v2" align="center" width="225">
                      <template slot-scope="scope">
                          {{scope.row.v2 | formatMoney}}
                      </template>
                  </el-table-column>
                  <el-table-column prop="v3" label="v3" align="center" width="225">
                      <template slot-scope="scope">
                          {{scope.row.v3 | formatMoney}}
                      </template>
                  </el-table-column>
                  <el-table-column prop="v4" label="v4" align="center" width="225">
                      <template slot-scope="scope">
                          {{scope.row.v4 | formatMoney}}
                      </template>
                  </el-table-column>
                  <el-table-column prop="v5" label="v5" align="center" width="225">
                      <template slot-scope="scope">
                          {{scope.row.v5 | formatMoney}}
                      </template>
                  </el-table-column>
                  <el-table-column prop="v6" label="v6" align="center" width="225">
                      <template slot-scope="scope">
                          {{scope.row.v6 | formatMoney}}
                      </template>
                  </el-table-column>
                  <el-table-column prop="groupPrice" label="拼店价" align="center" width="225">
                      <template slot-scope="scope">
                          {{scope.row.groupPrice | formatMoney}}
                      </template>
                  </el-table-column>
                  <el-table-column prop="settlementPrice" label="结算价" align="center" width="225">
                      <template slot-scope="scope">
                          {{scope.row.settlementPrice | formatMoney}}
                      </template>
                  </el-table-column>
                  <el-table-column label="最低支付价" align="center" width="225">
                      <template slot-scope="scope">
                          {{scope.row.minPrice | formatMoney}}
                      </template>
                  </el-table-column>
                  <el-table-column prop="weight" label="重量（kg）" align="center" width="225"></el-table-column>
                  <el-table-column prop="skuCode" label="SKU编码" align="center" width="225"></el-table-column>
                  <el-table-column prop="barCode" label="SKU条形码" align="center" width="225"></el-table-column>
                  <el-table-column prop="supplierSkuCode" label="供应商SKU编码" align="center" width="225"></el-table-column>
              </el-table>
              <el-table class="mt10" :data="info.skuList" border stripe>
                  <el-table-column prop="propertyValues" label="属性" align="center">
                      <template slot-scope="scope">
                          {{scope.row.propertyValues.split('@').join('-')}}
                      </template>
                  </el-table-column>
                  <el-table-column prop="stockUnit" label="单位" align="center"></el-table-column>
                  <el-table-column prop="warehouseStock" label="仓库同步库存" align="center"></el-table-column>
                  <el-table-column prop="sellStock" label="可售库存" align="center"></el-table-column>
              </el-table>
              <div class="pro-title mb10">图文描述</div>
              <el-form-item label="商品主图：">
                  <div v-if="info.videoUrl && info.videoUrl!== ''" class="img-list fl" style="margin-right: 0px">
                      <video :src="info.videoUrl" style="width: 150px;height: 150px" controls="controls"></video>
                  </div>
                  <div v-if="info.videoUrl && info.videoUrl!== ''" class="sep-video fl"></div>
                  <div v-for="(v,k) in info.mainImg" class="fl" :key="k">
                      <div class="img-list">
                          <img v-if="v && v!== ''" :src="v" alt="">
                      </div>
                  </div>
              </el-form-item>
              <el-form-item label="商品详情：">
                  <div v-for="(v,k) in info.contentImgArr" :key="k">
                      <div class="img-list"><br/>
                          <img :src="v" alt="">
                      </div>
                  </div>
              </el-form-item>
              <div class="pro-title">物流信息</div>
              <el-form-item label="运费模板：">{{info.freightTemplateName}}</el-form-item>
              <el-form-item label="不支持配送区域：">
                  <div class="area-list" v-if="info.unSupportsssAreasDataArr && info.unSupportsssAreasDataArr.length !== 0">
                      <el-tag type="primary" v-for="(v, k) in info.unSupportsssAreasDataArr" :key="k">{{v}}</el-tag>
                  </div>
              </el-form-item>
              <div class="pro-title">其他信息</div>
              <el-form-item label="上架时间：">
                  <template v-if="info.upType == 1">立即上架</template>
                  <template v-else-if="info.upType == 2">{{info.upTime | formatDateAll}}</template>
                  <template v-else>放入仓库</template>
              </el-form-item>
              <el-form-item label="限购：">
                  <template v-if="info.buyLimit == -1">不限购</template>
                  <template v-else>{{info.buyLimit}}</template>
              </el-form-item>
              <el-form-item label="平台服务：">
                    <template v-if="info.restrictions == 1">支持使用优惠券</template>
                    <template v-else-if="info.restrictions == 2">提供发票</template>
                    <template v-else-if="info.restrictions == 3">支持使用优惠券, 提供发票</template>
                    <template v-else-if="info.restrictions == 4">支持7天无理由退换</template>
                    <template v-else-if="info.restrictions == 5">支持使用优惠券, 支持7天无理由退换</template>
                    <template v-else-if="info.restrictions == 6">提供发票, 支持7天无理由退换</template>
                    <template v-else-if="info.restrictions == 7">支持使用优惠券, 提供发票, 支持7天无理由退换</template>
              </el-form-item>
              <el-form-item label="售后保障：">
                  <template v-if="info.afterSaleServiceDays>0">{{info.afterSaleServiceDays}}天</template>
              </el-form-item>
              <el-form-item label="自动下架：">{{info.autoUnShelve? '是':'否'}}</el-form-item>
              <div class="pro-title">标签信息</div>
              <el-form-item label="已有标签：">
                <el-tag type="primary" v-for="(v, k) in info.selectedTag" :key="k">{{v}}</el-tag>
              </el-form-item>
              <el-form-item>
                  <el-button type="primary" @click="$router.push('/productList')">返回列表页</el-button>
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
            nav: ['产品管理', '产品详情'],
            prodCode: '',
            loading: false,
            info: {}
        };
    },

    activated() {
        this.prodCode = this.$route.query.prodCode || null;
        this.getList();
    },

    methods: {
        getList() {
            this.loading = true;
            request.findProductDetailsByCode({ code: this.prodCode }).then(res => {
                this.loading = false;
                this.info = res.data || {};
                const mainImgArr = [];
                console.log(this.info);
                mainImgArr.push(this.info.imgUrl);
                if (this.info.imgFileList.length !== 0) {
                    this.info.imgFileList.forEach(v => {
                        mainImgArr.push(v.originalImg);
                    });
                }
                this.info.mainImg = mainImgArr;
                this.info.contentImgArr = this.info.content ? this.info.content.split(',') : '';
                let str = '';
                if (this.info.undeliveredList && this.info.undeliveredList.length !== 0) {
                    this.info.undeliveredList.forEach(v => {
                        str += v.cityNames + ',';
                    });
                }
                const cArr = str.split(',');
                cArr.splice(cArr.length - 1, 1);
                this.info.unSupportsssAreasDataArr = cArr;
                const tagArr = [];
                if (this.info.tagList.length !== 0) {
                    this.info.tagList.forEach(v => {
                        tagArr.push(v.tagName);
                    });
                }
                this.info.selectedTag = tagArr;
            }).catch(err => {
                this.loading = false;
                console.log(err);
            });
        },
        // 返回产品列表
        goBack() {
            this.$router.replace('productList');
        }
    }
};
</script>
<style lang='less'>
.product-info {
    .pro-title {
        width: 100%;
        height: 60px;
        background-color: #f7f7f7;
        line-height: 60px;
        padding: 0 25px;
        box-sizing: border-box;
        margin-bottom: 20px;
    }
    .sep-video{
        width: 2px;
        height: 150px;
        border-radius: 1px;
        margin: 0 20px;
        background: #e2e2e2;
    }
    .area-list{
        padding: 10px;
        box-sizing: border-box;
        width: 50%;
        border: 1px solid #ccc;
        border-radius: 5px;
        margin-bottom: 10px;
    }
    .img-list{
        cursor: pointer;
        position: relative;
        width: 150px;
        height: 150px;
        border-radius: 6px;
        margin: 0 10px 40px 0;
        /*overflow: hidden;*/
        img {
            width: 150px;
            height: 150px;
        }
    }
}
</style>
