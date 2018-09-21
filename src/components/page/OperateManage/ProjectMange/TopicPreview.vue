<template>
    <div class="topic-manage">
        <v-breadcrumb :nav="['运营管理','专题管理','专题预览']"></v-breadcrumb>
        <el-card>

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
                id: '',
                topicTemplateId: ''// 模版id
            };
        },
        activated() {
            this.id = this.$route.query.topicId || sessionStorage.getItem('topicId');
            this.getDetail();
        },
        methods: {
            getDetail() {
                const data = {
                    id: this.id
                };
                request.getTopic(data).then(res => {
                    this.topicTemplateId = res.data.data.topicTemplateId;
                }).catch(err => {
                    console.log(err);
                });
            }
        }
    };
</script>

<style lang="less" scoped>

</style>
