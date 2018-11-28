<template>
    <div class="market-tools">
        <v-breadcrumb :nav='nav'></v-breadcrumb>
        <el-card :body-style="{ padding: '20px 45px',color:'#666' }">
            <div>
                <div class="area">拼店基础设置</div>
                <div class="wrap">
                    <div class="item" v-for="(item,index) in list" :key="index" @click="toPage(item.page)">
                        <div class="left">
                            <img :src="item.img" alt="">
                        </div>
                        <div class="left content-area">
                            <span class="title">{{item.title}}</span><br>
                            <span>{{item.content}}</span>
                        </div>
                        <div class="clearfix"></div>
                    </div>
                </div>
            </div>
        </el-card>
    </div>
</template>

<script>
    import vBreadcrumb from '@/components/common/Breadcrumb.vue';

    export default {
        components: {
            vBreadcrumb
        },
        data() {
            return {
                nav: ['基础参数管理', '拼店基础设置'],
                list: [
                    {
                        img: 'static/img/package.png',
                        title: '拼店基础参数设置',
                        content: '可以设置拼店的基础参数',
                        page: '/groupBaseParam'
                    }, {
                        img: 'static/img/scratchCard.png',
                        title: '拼店结算周期设置',
                        content: '结算周期参数设置',
                        page: '/cycle'
                    }]
            };
        },
        methods: {
            toPage(page) {
                this.$router.push(page);
            }
        }
    };
</script>

<style scoped lang="less">
    .market-tools {
        .area {
            font-size: 18px;
            color: #222222;
            font-weight: 600;
            line-height: 40px;
        }
        .item {
            display: inline-block;
            width: 288px;
            height: 58px;
            background-color: #eeeeee;
            border-radius: 2px;
            margin-right: 30px;
            padding: 21px 26px;
            font-size: 14px;
            color: #222222;
            cursor: pointer;
            .title {
                font-size: 16px;
                font-weight: 600;
                margin-bottom: 15px;
                display: inline-block;
            }
            .left{
                float: left;
            }
            .content-area{
                margin:0 10px;
            }
            .clearfix{
                clear: both;
            }
        }
    }
</style>
