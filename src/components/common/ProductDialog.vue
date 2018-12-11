<template>
    <el-dialog title="商品预览"  :visible.sync="mask">
        <iframe :src="src" class="iframe"></iframe>
    </el-dialog>
</template>

<script>
    export default {
        name: 'ProductDialog',
        props: ['src', 'mask']
    };
</script>

<style scoped lang="less">
    /deep/.el-dialog{
        width: 400px;
        height: 800px;
        .iframe{
            border: none;
            width: 100%;
            height: 100%;
        }
    }
</style>
