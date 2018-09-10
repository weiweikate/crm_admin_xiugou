<template>
    <div class="topic-manage">
        <v-breadcrumb :nav="['运营管理','专题管理','专题预览']"></v-breadcrumb>
        <el-card>

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
                id:'',
                topicTemplateId:''//模版id
            }
        },
        activated(){
            this.id=this.$route.query.topicId||sessionStorage.getItem('topicId');
            this.getDetail();
        },
        methods: {
            getDetail(){
                let data={
                    id:this.id,
                };
                this.$axios
                    .post(api.getTopic, data)
                    .then(res => {
                        if (res.data.code == 200) {
                            this.topicTemplateId=res.data.data.topicTemplateId;
                        } else {
                            this.$message.warning(res.data.msg);
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            }
        }
    }
</script>

<style lang="less" scoped>

</style>
