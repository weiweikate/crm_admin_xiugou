<template>
    <div class="featured">
        <v-breadcrumb :nav="['运营管理','推荐位管理']"></v-breadcrumb>
        <!--<div class="row">-->
            <div class="item" @click="toPage(1)">
                <div class="name">产品推荐位1</div>
                <div class="tip">（首页产品推荐）</div>
            </div>
            <div class="item">
                <div class="name">产品推荐位2</div>
                <div class="tip">（预留）</div>
            </div>
            <div class="item">
                <div class="name">产品推荐位3</div>
                <div class="tip">（预留）</div>
            </div>
        <!--</div>-->
        <!--<div class="row">-->
            <div class="item">
                <div class="name">产品推荐位4</div>
                <div class="tip">（预留）</div>
            </div>
        <!--</div>-->
    </div>
</template>

<script>
    import vBreadcrumb from '../../common/Breadcrumb.vue';
    import icon from '../../common/ico.vue';

    export default {
        components: {
            vBreadcrumb,
            icon
        },
        data() {
            return {

            };
        },
        created() {
        },

        methods: {
            toPage(id) {
                sessionStorage.getItem('pageType', id);
                this.$router.push({ path: '/featuredManage', query: { pageType: id }});
            }
        }
    };
</script>

<style lang="less" scoped>
    .featured{
        padding: 40px;
        background: #fff;
        .item{
            display: inline-block;
            width: 350px;
            height: 150px;
            box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.3);
            border-radius: 10px;
            font-size: 20px;
            color: #fff;
            text-align: center;
            margin: 0 15px 20px 0;
            cursor: pointer;
            background: #33b4ff;
            .name{
                font-size: 20px;
                margin: 50px 0 5px;
            }
            .tip{
                font-size: 14px;
            }
        }
    }
</style>
