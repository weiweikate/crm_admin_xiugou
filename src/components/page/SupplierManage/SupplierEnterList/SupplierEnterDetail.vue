<template>
    <div class="supplier-enter">
        <v-breadcrumb :nav="['供应商管理','供应商申请入驻列表','供应商详情']"></v-breadcrumb>
        <el-card>
            <el-form v-loading="loading">
                <div class="title">基本信息</div>
                <el-form-item label="商家名称">{{detail.merchantName}}</el-form-item>
                <el-form-item label="商家类型">{{detail.merchantType}}</el-form-item>
                <el-form-item label="是否有资质证明">
                    <div>
                        <span v-if="detail.isLicenses==0">有</span>
                        <span v-else>无</span>
                    </div>
                    <div v-for="(item,index) in detail.completeFileVOS" :key="index" class="mar">
                          <div class="img-area">
                                <img :src="item.completeFileUrl" alt="">
                                <span :title="item.completeFileName">{{item.completeFileName}}</span>  
                          </div>
                          <a :href="item.completeFileUrl" class="el-button el-button--primary">下载附件</a>
                    </div>
                </el-form-item>
                <el-form-item label="联系人">{{detail.name}}</el-form-item>
                <el-form-item label="联系电话">{{detail.telephone}}</el-form-item>
                <el-form-item label="联系邮箱">{{detail.email||`/`}}</el-form-item>
                <el-form-item label="微信">{{detail.wechatId||`/`}}</el-form-item>
                <el-form-item label="公司地址">{{detail.address}}</el-form-item>
                <el-form-item label="合作模式">{{detail.schemal}}</el-form-item>
                <el-form-item label="ERP系统">{{detail.erp||`/`}}</el-form-item>
                <div class="title line">品牌信息</div>
                <el-form-item label="供应品牌">{{detail.brandName}}</el-form-item>
                <el-form-item label="品牌类型">{{detail.brandType}}</el-form-item>
                <el-form-item label="官网链接">{{detail.url||`/`}}</el-form-item>
                <el-form-item label="商品清单" class="product-area">
                    <div class="sub-title">包括供货报价及零售价</div>
                        <div v-for="(item,index) in detail.productListFileVOS" :key="index" :class="index!=0?'mar':''">
                               <div class="img-area">
                                    <img src="/static/img/file.png" alt="">
                                    <span :title="item.productListFileName">{{item.productListFileName}}</span>  
                               </div>
                               <a :href="item.productListFileUrl" class="el-button el-button--primary">下载附件</a>
                        </div> 
                </el-form-item>
                <el-form-item label="其他电商合作平台">{{detail.otherPlatform||`/`}}</el-form-item>
                <el-form-item label="品牌详情页是否完整">{{detail.isBrandComplete==0?'是':'否'}}</el-form-item>
                <el-form-item label="备注说明">{{detail.remark||`/`}}</el-form-item>
                <div style="margin:50px">
                    <el-button type="primary" @click="$router.push({path:'/supplierEnterList'})">返回列表</el-button>
                </div>
            </el-form>
        </el-card>
       
    </div>
</template>

<script>
import vBreadcrumb from '@/components/common/Breadcrumb.vue';
import icon from '@/components/common/ico.vue';
import request from '@/http/http';

export default {
    components: {
        icon,
        vBreadcrumb
    },
    data: function() {
        return {
            detail: {},
            loading: false,
            id: ''
        };
    },
    activated() {
        this.id = this.$route.query.supplierEnterId;
        this.getDetail();
    },
    methods: {
        // 获取详情
        getDetail() {
            const data = {
                id: this.id
            };
            this.loading = true;
            request
                .findMerchantById(data)
                .then(res => {
                    this.loading = false;
                    this.detail = res.data;
                })
                .catch(err => {
                    this.loading = false;
                    console.log(err);
                });
        }
    }
};
</script>
<style scoped lang="less">
.supplier-enter{
    .el-form{
      padding: 0 50px;  
    }
    .title{
        font-weight: 600;
        line-height: 40px;
        font-size: 18px
    }
    .line{
        border-top: 1px dashed #aaa;
    }
    .el-form-item{
        margin-bottom: 0;
        
    }
    /deep/.el-form-item__label{
        width: 140px;
        text-align: left
    }
    .product-area{
        position: relative;
        .sub-title{
            position: absolute;
            left: 0;
            top:15px;
            color:#aaa;
            font-size: 12px
        }
    }
    .img-area{
        border:1px dashed #aaa;
        width: 300px;
        padding: 5px;
        margin-bottom: 5px;
        display: inline-block;
        img{
            width: 40px;
            height: 40px;
            vertical-align: middle;
        }
        span{
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            width: 240px;
            width: 250px;
            display: inline-block;
            vertical-align: middle;
        }
    }
    .mar{
        margin:0 0 0 140px;
    }
}
</style>
