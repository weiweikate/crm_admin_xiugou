<template>
    <div class="market-tools">
        <v-breadcrumb :nav='nav'></v-breadcrumb>
        <el-card :body-style="{ padding: '20px 45px',color:'#666' }">
            <div>
                <div class="area">推广订单管理</div>
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
                nav: ['运营管理', '推广订单管理'],
                list: [
                    {
                        img: 'static/img/promotionOrderList.png',
                        title: '推广订单管理设置',
                        auth: 'yunying.promotionOrderManage.tgddglsz',
                        content: '查看所有的推广订单',
                        page: '/promotionOrderList'
                    }, {
                        img: 'static/img/packageManage.png',
                        title: '套餐管理',
                        auth: 'yunying.promotionOrderManage.tcgl',
                        content: '查看设置推广套餐',
                        page: '/packageManage'
                    }, {
                        img: 'static/img/redPackageSet.png',
                        title: '红包翻倍周期设置',
                        auth: 'yunying.promotionOrderManage.hbfbzqsz',
                        content: '可以设置红包推荐概率',
                        page: '/RedPackageSet'
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
