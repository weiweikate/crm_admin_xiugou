<template>
    <el-dialog title="商品预览"  :visible.sync="mask">
        <div ref="area"></div>
    </el-dialog>
</template>

<script>
    export default {
        name: 'ProductDialog',
        props: ['src', 'mask'],
        mounted() {
            // console.log(this.$refs);
            // this.$refs.productArea.html(this.src);
        }
    };
</script>

<style scoped>

</style>
