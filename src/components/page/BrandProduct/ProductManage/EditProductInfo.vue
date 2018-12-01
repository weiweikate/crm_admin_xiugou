<template>
    <div class="edit-product">
        <v-breadcrumb :nav='nav'></v-breadcrumb>
        <el-card>
            <div v-if="selectedCate.length !== 0">
                <span style="font-weight: 900">您当前选择的分类是</span>: {{selectedCate[0].label}} > {{selectedCate[1].label}} > {{selectedCate[2].label}}
                <el-button type="primary" style="margin-left: 30px">切换分类</el-button>
            </div>
        </el-card>
        <el-card>
            <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                <el-tab-pane label="基础参数编辑" name="baseParam">
                    <v-prod-param @nextName="getNextName" @productInfo="getProdInfo" :selectedCate='selectedCate' ref="baseParam"></v-prod-param>
                </el-tab-pane>
                <el-tab-pane label="库存编辑" name="inventory">
                    <v-inventory @nextName="getNextName" @productInfo="getProdInfo" :productInfo="productInfo" :selectedCate='selectedCate' ref="inventory"></v-inventory>
                </el-tab-pane>
                <el-tab-pane label="商品详情编辑" name="info">
                    <v-info ref="info" :selectedCate='selectedCate' :productInfo="productInfo"></v-info>
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
            activeName: 'baseParam',
            productInfo: {},
            selectedCate: []
        };
    },
    created() {
        this.selectedCate = JSON.parse(this.$route.query.cate) || [];
    },
    methods: {
        // 切换产品编辑信息
        handleClick(tab) {
            this.activeName = tab.name;
        },
        getProdInfo(info) {
            console.log(info);
            this.productInfo = info;
        },
        // 获取下一步参数
        getNextName(name) {
            this.activeName = name;
        }
    }
};
</script>

<style lang="less" scoped>
.edit-product{

}
</style>
