<template>
    <div class="coupon-template">
        <v-breadcrumb :nav="['运营管理','优惠券设置','优惠券模版']"></v-breadcrumb>
        <el-card>
            <div class="area">
                <div class="item" v-for="(item,k) in list" :key="k">
                    <img :src="item.imgUrl" alt="">
                </div>
            </div>
        </el-card>
    </div>
</template>

<script>
    import vBreadcrumb from '@/components/common/Breadcrumb.vue';
    import request from '@/http/http.js';

    export default {
        components: { vBreadcrumb },
        data() {
            return {
                list: []
            };
        },

        activated() {
            this.getTplList();
        },

        methods: {
            // 获取模板列表
            getTplList() {
                request.queryTemplateList({}).then(res => {
                    if (!res.data) return false;
                    this.list = res.data;
                }).catch(error => {
                    console.log(error);
                });
            }
        }
    };
</script>

<style lang="less" scoped>
    .coupon-template{
        .area{
            .item{
                .title{
                    color: #ff6868;
                }
                img{
                    width: 375px;
                    height: 200px;
                    border-radius: 20px;
                }
            }
        }
    }
</style>
