<template>
    <div class="package-info">
        <v-breadcrumb :nav='nav'></v-breadcrumb>
        <el-card :body-style="{ padding: '50px 65px' }">
            <el-form label-width="110px">
                <el-form-item label="套餐名称：">{{name}}</el-form-item>
                <el-form-item label="产品图片：">
                    <div class="img-wrap" v-for="(v,k) in productImg" :key="k">
                        <img :src="v" alt="">
                    </div>
                </el-form-item>
                <el-form-item label="产品分类：">{{productItem}}</el-form-item>
                <el-form-item label="产品品牌：">{{productBrand}}</el-form-item>
                <el-form-item label="产品详情：">
                    <div v-html='productDetail'></div>
                </el-form-item>
            </el-form>
            <el-button @click="backToList" type="primary">返回列表</el-button>
        </el-card>

    </div>
</template>

<script>
    import vBreadcrumb from "@/components/common/Breadcrumb.vue";
    import * as api from "@/api/OperateManage/MarketToolsManage/index.js";
    import * as pApi from "@/privilegeList/OperateManage/MarketToolsManage/index.js";
    import utils from "@/utils/index.js";

    export default {
        components: {
            vBreadcrumb
        },

        data() {
            return {
                nav: ["运营管理", "营销工具管理", "优惠套餐", "套餐详情"],
                packageInfoId: '',
                name: "",
                productImg: [],
                productItem: "",
                productBrand: "",
                productDetail: ''
            };
        },

        activated() {
            this.packageInfoId = this.$route.query.packageInfoId;
            this.getList();
        },

        methods: {
            getList() {
                this.$axios.post(api.findOperActivityPackageDetailsById, {id: this.packageInfoId})
                    .then((res) => {
                        res.data.data.imgList.forEach((v, k) => {
                            this.productImg.push(v.original_img)
                        });
                        this.name = res.data.data.name;
                        this.productItem = res.data.data.firstCategoryName + '-' + res.data.data.secondCategoryName;
                        this.productBrand = res.data.data.brandName;
                        this.productDetail = res.data.data.content;
                    }).catch((err) => {
                    console.log(err)
                });
            },
            backToList() {
                this.$router.push('/packageList')
            }
        }
    };
</script>
<style lang='less'>
    .package-info {
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
