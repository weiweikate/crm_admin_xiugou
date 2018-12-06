<template>
    <div>
        <v-breadcrumb :nav="['会员管理','供应商管理','供应商详情']"></v-breadcrumb>
        <div class="container" v-loading="loading">
            <div class="basic-inf-area">
                <div class="item-row">
                    供应商账号：{{detail.loginName}}
                </div>
                <div class="item-row">
                    供应商名称：{{detail.name}}
                </div>
                <div class="item-row">
                    供应商ID：{{detail.code}}
                </div>
                <div class="item-row">
                    供应商类型：
                    <span v-if="detail.type==1">产品供应商</span>
                    <span v-if="detail.type==2">服务供应商</span>
                </div>
                <div class="item-row">
                    供应商姓名：
                    {{detail.userName}}
                </div>
                <div class="item-row">
                    联系方式：
                    {{detail.telephone}}
                </div>
                <div class="item-row">
                    手机号码：
                    {{detail.mobile}}
                </div>
                <div class="item-row">
                    供应商账户：
                    {{detail.bankName}} <span style="margin-left: 30px" v-if="detail.bankCard">{{detail.bankCard | bankCard}}</span>
                </div>
                <div class="item-row">
                    供应商地址：
                    <span v-if="detail.country==2">海外</span>
                    <span v-else>
                        {{detail.provinceName}}{{detail.cityName}}{{detail.areaName}}{{detail.address}}
                    </span>
                </div>
                <div class="item-row supplier-product">
                    供应产品品类品牌：
                    <div style="margin-top: -40px">
                        <div v-for="p in brand" class="area">
                            <div class="product-item">{{p.name}}</div>
                            <span>供应产品数：<span @click="toProductList(p,4)"
                                              class="color-blue">{{p.porductNum}}</span></span>
                        </div>
                    </div>
                </div>
                <div class="item-row">
                    供应商结算帐期：
                    每月15日
                </div>
            </div>
            <div style="margin:50px">
                <el-button type="primary" @click="backToList">返回列表</el-button>
            </div>
        </div>
    </div>
</template>

<script>
    import vBreadcrumb from '@/components/common/Breadcrumb.vue';
    import icon from '@/components/common/ico.vue';
    import request from '@/http/http';

    export default {
        components: {
            icon, vBreadcrumb
        },
        data: function() {
            return {
                detail: {},
                brand: [],
                code: '',
                loading: false,
                list: ''
            };
        },
        activated() {
            this.code = this.$route.query.supplierInfo;
            this.getDetail();
        },
        methods: {
            // 获取详情
            getDetail() {
                const data = {
                    code: this.code
                };
                request.findSupplierById(data).then(res => {
                    this.brand = res.data.productSupplierBrandList;
                    this.loading = false;
                    this.detail = res.data;
                }).catch(err => {
                    this.loading = false;
                    console.log(err);
                });
            },
            // 返回列表
            backToList() {
                this.$router.push('/supplierManage');
            },
            // 跳到产品列表页
            toProductList(item, num) {
                sessionStorage.setItem('supplierId', this.id);
                sessionStorage.setItem('brandId', item.brandId);
                sessionStorage.setItem('flag', num);
                this.$router.push({ path: '/productList',
                    query: {
                        'supplierCode': this.code,
                        'brandId': item.brandId,
                        'flag': num // 0:上架
                    }
                });
            }
        }
    };
</script>
<style scoped lang="less">
    .container {
        font-size: 14px;
        color: #606266;
        height: auto;
        margin-bottom: 20px;
        padding: 30px 0 30px 80px;
    }

    .title {
        margin-bottom: 10px;
        font-size: 16px;
        color: #666
    }

    .tags-area {
        margin-top: 10px
    }

    .line {
        border-bottom: 1px solid #e2e2e2;
        margin-bottom: 20px;
    }

    .left {
        float: left;
        width: 60px;
    }

    .center {
        float: left;
        width: 100px;
    }

    .right {
        float: right;
        text-align: right;
    }

    .clearfix {
        clear: both
    }

    .item-row {
        height: 40px;
        line-height: 40px;
    }

    .color-blue {
        color: #20a0ff;
        cursor: pointer;
    }

    img {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        border: 1px solid #999;
    }

    .el-tag {
        height: 32px;
        line-height: 32px;
        margin-right: 10px;
        vertical-align: middle;
    }

    .input-new-tag {
        width: 200px
    }

    .succ-item {
        width: 370px;
        height: 52px;
        line-height: 27px;
        border-radius: 5px;
        border: 1px solid #dfdfdf;
        padding: 8px 12px;
        display: inline-block;
        margin: 0 10px 10px 0;
    }

    .supplier-product {
        display: inline-block;
        .area {
            width: 400px;
        }
        .product-item {
            display: inline-block;
            line-height: 30px;
            width: 120px;
            margin-left: 130px;
        }
    }
</style>
