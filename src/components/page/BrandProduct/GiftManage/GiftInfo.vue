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
                        <img style="width:200px" v-for="(v,k) in imgArr" :key="k" :src="v.originalImg" />
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
import vBreadcrumb from '@/components/common/Breadcrumb.vue';
import request from '@/http/http';
export default {
    components: { vBreadcrumb },

    data() {
        return {
        // 礼包id
            giftId: '',
            name: '礼包三', // 产品名称
            imgArr: [], // 图片列表
            categories: '', // 产品分类
            brand: '', // 品牌
            content: '' // 礼包详情
        };
    },

    activated() {
        this.giftId = this.$route.query.giftId || sessionStorage.getItem('giftId');
        this.getGiftInfo();
    },

    methods: {
        getGiftInfo() {
            request.findActivityPackageById({ packageId: this.giftId }).then(res => {
                this.name = res.data.name;
                this.imgArr = res.data.imgFileList;
                this.categories = `${res.data.firstCategoryName}-${res.data.secCategoryName}-${res.data.thirdCategoryName}`;
                this.brand = res.data.brandName;
                this.content = res.data.content;
            }).catch(err => {
                console.log(err);
            });
        }
    }
};

</script>
<style lang='less' scoped>
.gift-info{

}
</style>
