<template>
    <div class="remark-area">
        <span class="remark">备注：</span>
        <el-tooltip class="item" placement="right" effect="light">
            <div slot="content">
                <span v-for="(item,index) in contents" :key="index">{{item}} <br></span>
            </div>
            <i class="el-icon-question"></i>
        </el-tooltip>
    </div>

</template>

<script>
    export default {
        components: {},
        props: ['contents'],
        data() {
            return {};
        },
        methods: {}
    };
</script>
<style lang='less' scoped>
    .remark-area {
        margin-bottom: 5px;
        .remark {
            font-size: 14px;
            color: #666;
        }
        i {
            color: #ff6868;
        }
    }
</style>
