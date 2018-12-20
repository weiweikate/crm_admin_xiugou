<template>
    <div class="gift-info">
        <v-breadcrumb :nav="['运营管理','营销管理','产品礼包管理', '礼包详情']"></v-breadcrumb>
        <el-card :body-style="{ padding: '30px' }" v-loading="loading">
            <el-form label-width="130px">
                <el-form-item label="产品名称：">
                    {{name}}
                </el-form-item>
                <el-form-item label="产品视频：">
                    <video v-if="video" :src="video" controls="controls"></video>
                </el-form-item>
                <el-form-item label="产品图片：">
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
                <el-form-item label="产品参数：">
                    <p v-for="(v, k) in param" :key="k">{{v.paramName}}：{{v.paramValue}}</p>
                </el-form-item>
                <el-form-item label="产品详情：">
                    <!-- <div v-html='content'></div> -->
                     <div>
                        <img style="width:200px" v-for="(v,k) in content" :key="k" :src="v"  class="mr10"/>
                    </div>
                </el-form-item>
                <el-form-item label=" ">
                    <el-button type="primary" @click="$router.push('/giftManage')">返 回</el-button>
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
            loading: false,
            // 礼包id
            giftId: '',
            name: '礼包三', // 产品名称
            imgArr: [], // 图片列表
            categories: '', // 产品分类
            brand: '', // 品牌
            param: [], // 产品参数
            video: '', // 产品视频
            content: '' // 礼包详情
        };
    },

    created() {
        this.giftId = this.$route.query.giftId || sessionStorage.getItem('giftId');
        this.getGiftInfo();
    },

    methods: {
        getGiftInfo() {
            this.loading = true;
            request.findActivityPackageById({ packageId: this.giftId }).then(res => {
                this.loading = false;
                this.name = res.data.name;
                this.imgArr = res.data.imgFileList;
                this.categories = `${res.data.firstCategoryName}-${res.data.secCategoryName}-${res.data.thirdCategoryName}`;
                this.brand = res.data.brandName;
                this.content = res.data.content ? res.data.content.split(',') : [];
                this.param = res.data.paramValueList;
                this.video = res.data.videoUrl;
            }).catch(err => {
                this.loading = false;
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
