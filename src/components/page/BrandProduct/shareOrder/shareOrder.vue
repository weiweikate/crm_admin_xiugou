<template>
    <div class="coupon-list">
        <v-breadcrumb :nav='nav'></v-breadcrumb>
        <el-card class="query-panue" :body-style="{ padding: '20px 20px'}">
            <el-form :model="form" ref="form" inline label-width="120px" @submit.native.prevent>
                <el-form-item prop="productName" label="商品名称">
                    <el-input v-model="form.productName" placeholder="请输入商品名称"></el-input>
                </el-form-item>
                <el-form-item prop="prodCode" label="商品SUP编码">
                    <el-input v-model="form.prodCode" placeholder="请输入商品SUP编码"></el-input>
                </el-form-item>
                <el-form-item prop="phone" label="用户账号">
                    <el-input v-model="form.phone" placeholder="请输入用户账号"></el-input>
                </el-form-item>
                <el-form-item prop="stick" label="置顶">
                    <el-select v-model="form.stick">
                        <el-option value="" label="全部"></el-option>
                        <el-option value="true" label="已置顶"></el-option>
                        <el-option value="false" label="未置顶"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="stars" label="星级筛选">
                    <el-select v-model="form.stars">
                        <el-option value="" label="全部"></el-option>
                        <el-option v-for="(v,k) in starArr" :key="k" :value=v.value :label=v.label></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="type" label="评论内容">
                    <el-select v-model="form.type">
                        <el-option value="" label="全部"></el-option>
                        <el-option value="1" label="默认评论"></el-option>
                        <el-option value="2" label="自主评论"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="reply" label="回复">
                    <el-select v-model="form.reply">
                        <el-option value="" label="全部"></el-option>
                        <el-option value="true" label="已回复"></el-option>
                        <el-option value="false" label="未回复"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label=" ">
                    <el-button type="primary" native-type="submit" @click="getList(1)">查询</el-button>
                    <el-button @click="resetForm('form')">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card style='margin-top:20px;minHeight:90vh;' :body-style="{ padding: '20px 50px' }">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="全部" name="all">
                    <v-tab-content ref="all"></v-tab-content>
                </el-tab-pane>
                <el-tab-pane label="已上架" name="2">
                    <v-tab-content ref="0"></v-tab-content>
                </el-tab-pane>
                <el-tab-pane label="已下架" name="3">
                    <v-tab-content ref="1"></v-tab-content>
                </el-tab-pane>
            </el-tabs>
        </el-card>

    </div>
</template>

<script>
import vBreadcrumb from '@/components/common/Breadcrumb.vue';
import vTabContent from './_list';
import { myMixinTable } from '@/JS/commom';

export default {
    components: {
        vBreadcrumb,
        vTabContent
    },
    mixins: [myMixinTable],

    data() {
        return {
            nav: ['品牌产品管理', '晒单管理'],
            activeName: 'all',
            form: {
                productName: '',
                prodCode: '',
                phone: '',
                stick: '',
                stars: '',
                type: '',
                reply: ''
            },
            starArr: [{ label: '一星', value: 1 }, { label: '二星', value: 2 }, { label: '三星', value: 3 }, { label: '四星', value: 4 }, { label: '五星', value: 5 }]
        };
    },
    mounted() {
        this.handleClick({ name: 'all' });
    },
    methods: {
        handleClick(tab) {
            this.activeName = tab.name;
            this.getList();
        },
        // 提交表单
        getList() {
            const data = {};
            Object.assign(data, this.form);
            // this.$utils.deleteEmptyString(data,'stick');
            // this.$utils.deleteEmptyString(data,'reply');
            if (data.stars === '') {
                this.$utils.deleteEmptyString(data, 'stars');
            } else {
                data.stars = [data.stars];
            }
            this.$refs[this.activeName].page.currentPage = 1;
            data.status = this.activeName === 'all' ? '' : this.activeName;
            this.$nextTick(() => {
                this.$refs[this.activeName].data = data;
                this.$refs[this.activeName].getList(this.page.currentPage);
            });
        },
        //  重置表单
        resetForm(formName) {
            this.$refs[formName].resetFields();
            this.getList({ name: 'all' });
        }
    }
};
</script>
<style lang='less'>
.coupon-list {
    .add-coupon {
        margin: 0 0 20px 0;
        position: absolute;
        right: 87px;
        z-index: 99999;
    }
    .el-tabs__active-bar {
        background-color: #ff1e30;
    }
    .el-tabs__item.is-active,
    .el-tabs__item:hover {
        color: #ff1e30;
    }
}
</style>
