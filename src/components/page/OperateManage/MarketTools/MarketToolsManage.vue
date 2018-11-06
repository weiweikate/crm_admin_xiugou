<template>
    <div class="market-tools">
        <v-breadcrumb :nav='nav'></v-breadcrumb>
        <el-card :body-style="{ padding: '20px 45px',color:'#666' }">
            <div>
                <div class="area">营销工具</div>
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
            <!--<div style="margin-top: 50px">-->
                <!--<div class="area">设置</div>-->
                <!--<div>-->
                    <!--<div class="item" @click="toPage('/prizePoll')">-->
                        <!--<div class="left">-->
                            <!--<img src="/static/img/prizePoll.png" alt="">-->
                        <!--</div>-->
                        <!--<div class="left content-area">-->
                            <!--<span class="title">奖品池管理</span><br>-->
                            <!--<span>活动奖品编辑</span>-->
                        <!--</div>-->
                    <!--</div>-->
                <!--</div>-->
            <!--</div>-->
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
                nav: ['运营管理', '营销工具管理'],
                list: [
                    // {
                    //     img: 'static/img/discountCode.png',
                    //     title: '优惠码',
                    //     content: '向客户发放平台优惠码',
                    //     page: '/discountCode'
                    // },
                    {
                        img: 'static/img/secKill.png',
                        title: '秒杀',
                        content: '快速抢购引导顾客更多消费',
                        page: '/secKill'
                    }, {
                        img: 'static/img/depreciate.png',
                        title: '降价拍',
                        content: '价格随时间下降的促销活动',
                        page: '/depreciate'
                    },
                    // {
                    //     img: 'static/img/package.png',
                    //     title: '优惠套餐',
                    //     content: '创建商品套餐让顾客购买',
                    //     page: '/packageList'
                    // },
                    {
                        img: 'static/img/package.png',
                        title: '刮刮卡',
                        content: '创建商品套餐让顾客购买',
                        page: '/scratchCardsList'
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
