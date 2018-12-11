<template>
    <el-dialog title="商品预览"  :visible.sync="mask">
        <iframe ref="area"></iframe>
    </el-dialog>
</template>

<script>
    export default {
        name: 'ProductDialog',
        props: ['src', 'mask'],
        mounted() {
            console.log(this.src);
            this.$refs.area.src = this.src;
        }
    };
</script>

<style scoped>

</style>
