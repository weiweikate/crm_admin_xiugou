<template>
    <div class="show-value-set">
        <v-breadcrumb :nav="nav"></v-breadcrumb>
        <el-card>

        </el-card>
    </div>
</template>

<script>
    import vBreadcrumb from '@/components/common/Breadcrumb.vue';
    import { myMixinTable } from '@/JS/commom';
    import request from '@/http/http';
    export default {
        mixins: [myMixinTable],
        components: { vBreadcrumb },
        data() {
            return {
                nav: ['运营管理', '发现管理', '发现列表'],
            };
        },
        methods: {
        }
    };
</script>

<style lang="less" scoped>
    .show-value-set{

    }
</style>
