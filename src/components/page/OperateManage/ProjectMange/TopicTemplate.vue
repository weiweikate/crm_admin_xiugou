<template>
    <div class="topic-template">
        <v-breadcrumb :nav="['运营管理','专题管理','专题模板']"></v-breadcrumb>
        <el-card>
            <div class="area">
                <div class="item" v-for="(item,k) in list" :key="k">
                    <div class="title">{{item.name}}</div>
                    <img :src="item.imgUrl" alt="">
                </div>
            </div>
        </el-card>
    </div>
</template>

<script>
    import vBreadcrumb from "@/components/common/Breadcrumb.vue"
    import * as api from '@/api/OperateManage/topicManage.js'
    import * as pApi from '@/privilegeList/OperateManage/topicManage.js';

    export default {
        components: {vBreadcrumb},
        data() {
            return {
               list:[]
            }
        },

        activated(){
            this.getTplList();
        },

        methods: {
            // 获取模板列表
            getTplList(){
                this.$axios.post(api.tplList,{}).then(res=>{
                    if(!res.data.data) return false;
                    this.list = res.data.data;
                })
            }
        }
    }
</script>

<style lang="less" scoped>
    .topic-template{
        .area{
            display: flex;
            justify-content: flex-start;
            overflow-x: auto;
            .item{
                margin-right: 100px;
                text-align: center;
                .title{
                    color: #ff6868;
                }
                img{
                    width: 375px;
                    height: 1277px;
                }
            }
        }
    }
</style>
