<template>
    <el-dialog title="商品预览"  :visible.sync="showMask" :before-close="handleClose">
        <iframe :src="src" class="iframe"></iframe>
    </el-dialog>
</template>

<script>
    export default {
        name: 'ProductDialog',
        props: ['src', 'mask'],
        computed: {
            showMask() {
                return this.mask;
            }
        },
        methods: {
            handleClose() {
                this.showMask = false;
                this.$emit('msg', false);
            }
        }
    };
</script>

<style scoped lang="less">
    /deep/.el-dialog{
        width: 390px;
        height: 700px;
        .el-dialog__body{
            width:350px ;
            height: 600px;
        }
        .iframe{
            border: none;
            width: 100%;
            height: 100%;
        }
    }
</style>
