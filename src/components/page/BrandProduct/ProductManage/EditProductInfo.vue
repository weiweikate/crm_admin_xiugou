<template>
    <div class="edit-product">
        <v-breadcrumb :nav='nav'></v-breadcrumb>
        <el-card>
            <div v-if="selectedCate.length !== 0">
                <span style="font-weight: 900">您当前选择的分类是</span>: {{selectedCate[0].label || ''}} > {{selectedCate[1].label || ''}} > {{selectedCate[2].label || ''}}
                <el-button @click="toggleCate" type="primary" style="margin-left: 30px">切换分类</el-button>
            </div>
        </el-card>
        <el-card v-loading="pageLoading">
            <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                <el-tab-pane label="基础参数编辑" name="baseParam">
                    <v-prod-param @nextName="getNextName" @productInfo="getProdInfo" :selectedCate='selectedCate' ref="baseParam"></v-prod-param>
                </el-tab-pane>
                <el-tab-pane label="库存编辑" name="inventory">
                    <v-inventory @nextName="getNextName" @productInfo="getProdInfo" :productInfo="productInfo" :selectedCate='selectedCate' ref="inventory"></v-inventory>
                </el-tab-pane>
                <el-tab-pane label="商品详情编辑" name="info">
                    <v-info ref="info" @isKeepAlive="isKeepAlive" :selectedCate='selectedCate' :productInfo="productInfo"></v-info>
                </el-tab-pane>
            </el-tabs>
        </el-card>
    </div>
</template>

<script>
import vBreadcrumb from '@/components/common/Breadcrumb.vue';
import vProdParam from './productRelease/_baseParam.vue';
import vInventory from './productRelease/_inventory.vue';
import vInfo from './productRelease/_info.vue';
import request from '@/http/http';
export default {
    components: {
        vBreadcrumb,
        vProdParam,
        vInventory,
        vInfo
    },
    data() {
        return {
            nav: ['品牌产品管理', '产品管理', '发布商品'],
            pageLoading: false,
            prodCode: '',
            keepAlive: true,
            activeName: 'baseParam',
            productInfo: {},
            selectedCate: []
        };
    },
    created() {
        this.selectedCate = JSON.parse(this.$route.query.cate) || [];
    },
    mounted() {
        this.prodCode = this.$route.query.prodCode || null;
        this.getProductInfo();
    },
    methods: {
        // 获取产品详情
        async getProductInfo() {
            if (this.prodCode) {
                console.log('编辑产品', this.prodCode);
                let data = {};
                this.pageLoading = true;
                await request.findProductDetailsByCode({ code: this.prodCode }).then(res => {
                    data = res.data || {};
                }).catch(err => {
                    this.pageLoading = false;
                    console.log(err);
                });
                // 添加商品第一步赋值
                const firstStep = this.$refs['baseParam'];
                await firstStep.getSupplyList();
                await firstStep.selectBrand(data.supplierCode);
                await firstStep.getNaturalList();
                if (firstStep.naturalAttribute.length !== 0) {
                    firstStep.naturalAttribute.forEach((v, k) => {
                        data.paramList.forEach(v1 => {
                            if (v1.paramName == v.name) {
                                if (v.options.length !== 0) {
                                    const arr = [];
                                    v.options.forEach(v2 => {
                                        arr.push(v2.value);
                                    });
                                    if (arr.includes(v1.paramValue)) {
                                        v.value = v1.paramValue;
                                    } else {
                                        v.defParam = v1.paramValue;
                                    }
                                    this.$set(firstStep.naturalAttribute, k, v);
                                }
                            }
                        });
                    });
                }
                firstStep.form = {
                    prodCode: data.prodCode,
                    name: data.name,
                    secondName: data.secondName,
                    supplierCode: data.supplierCode,
                    warehouseType: data.warehouseType.toString(),
                    type: data.type.toString(),
                    selfProduct: data.selfProduct.toString(),
                    businessType: data.businessType.toString(),
                    // taxRate: '',
                    brandId: data.brandId
                };
                // 添加商品第二步赋值
                const secondStep = this.$refs['inventory'];
                await secondStep.getSalesList();
                secondStep.checkStatus = data.checkStatus;
                if (secondStep.salesAttrArr.length !== 0) {
                    secondStep.salesAttrArr.forEach(v => {
                        if (data.specifies.length !== 0) {
                            data.specifies.forEach(v1 => {
                                if (v.name == v1.specName) {
                                    if (v1.specValues.length !== 0) {
                                        v1.specValues.forEach(v2 => {
                                            if (v.options.length !== 0) {
                                                let flag = true;
                                                v.options.forEach(v3 => {
                                                    if (v2.specValue == v3.label) {
                                                        v3.value = true;
                                                        v3.defType = 1;
                                                        v3.imgUrl = v2.specImg;
                                                        flag = false;
                                                    }
                                                });
                                                // flag:true  自定义属性
                                                if (flag) {
                                                    v.options.push({
                                                        defType: 2,
                                                        imgUrl: v2.specImg,
                                                        label: v2.specValue,
                                                        value: v2.specValue
                                                    })
                                                }
                                            }
                                        });
                                    }
                                }
                            });
                        }
                    });
                }
                console.log(secondStep.salesAttrArr);
                this.pageLoading = false;
            } else {
                this.$refs['baseParam'].form.prodCode = '';
                console.log('添加产品');
            }
        },
        // 切换分类
        toggleCate() {
            this.$confirm('切换后系统不会保留您本次的编辑', '您确定要切换分类吗？', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.keepAlive = false;
                this.$router.push('/releaseProduct');
            }).catch(() => {});
        },
        // 切换产品编辑信息
        handleClick(tab) {
            this.activeName = tab.name;
        },
        // 获取商品信息
        getProdInfo(info) {
            this.productInfo = info;
        },
        // 获取下一步参数
        getNextName(name) {
            this.activeName = name;
        },
        // 组件缓存状态
        isKeepAlive(status) {
            this.keepAlive = status;
        }
    },
    // 路由离开钩子
    beforeRouteLeave(to, from, next) {
        from.meta.noKeepAlive = !this.keepAlive;
        to.meta.noKeepAlive = !this.keepAlive;
        if (from.meta.noKeepAlive) {
            this.activeName = 'baseParam';
        }
        next();
    }
};
</script>

<style lang="less" scoped>
.edit-product{

}
</style>
