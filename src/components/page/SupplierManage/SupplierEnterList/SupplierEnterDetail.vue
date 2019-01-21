<template>
    <div class="supplier-enter">
        <v-breadcrumb :nav="['供应商管理','供应商申请入驻列表','供应商详情']"></v-breadcrumb>
        <el-card>
            <el-form>
                <div class="title">基本信息</div>
                <el-form-item required="" label="商家名称">{{detail.merchantName}}</el-form-item>
                <el-form-item required="" label="商家类型">{{detail.merchantType}}</el-form-item>
                <el-form-item required="" label="是否有资质证明">
                    <span v-if="detail.isLicenses==1">有</span>
                    <span v-else>无</span>
                </el-form-item>
                <el-form-item required="" label="联系人">{{detail.name}}</el-form-item>
                <el-form-item required="" label="联系电话">{{detail.telephone}}</el-form-item>
                <el-form-item label="联系邮箱">{{detail.email}}</el-form-item>
                <el-form-item label="微信">{{detail.wechatId}}</el-form-item>
                <el-form-item required="" label="公司地址">{{detail.address}}</el-form-item>
                <el-form-item required="" label="合作模式">{{detail.schemal}}</el-form-item>
                <el-form-item label="ERP系统">{{detail.erp}}</el-form-item>
                <div class="title">品牌信息</div>
                <el-form-item required="" label="供应品牌">{{detail.brandName}}</el-form-item>
                <el-form-item required="" label="品牌类型">{{detail.brandType}}</el-form-item>
                <el-form-item label="官网链接">{{detail.name}}</el-form-item>
                <el-form-item required="" label="商品清单">{{detail.productListUrl}}</el-form-item>
                <el-form-item label="其他电商合作平台">{{detail.otherPlatform}}</el-form-item>
                <el-form-item label="品牌详情页是否完整">{{detail.isBrandComplete}}</el-form-item>
                <el-form-item label="备注说明">{{detail.remark}}</el-form-item>
                <div style="margin:50px">
                    <el-button type="primary" @click="backToList">返回列表</el-button>
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
            request
                .findMerchantById(data)
                .then(res => {
                    this.brand = res.data.productSupplierBrandList;
                    this.loading = false;
                    this.detail = res.data;
                })
                .catch(err => {
                    this.loading = false;
                    console.log(err);
                });
        },
        // 返回列表
        backToList() {
            this.$router.push('/supplierEnterList');
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
    .el-form-item{
        margin-bottom: 0;
        
    }
    .el-form-item__label{
        width: 140px;
        text-align: left
    }
}
</style>
