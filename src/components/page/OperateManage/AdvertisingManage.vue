<template>
    <div>
        <v-breadcrumb :nav="['运营管理','广告位管理']"></v-breadcrumb>
        <div class="advertising">
            <div class="row">
                <p class="adv-title">首页广告位管理</p>
                <div class="item blue" @click="toPage(1,1)">
                    APP首页banner广告位管理
                </div>
                <div class="item blue" @click="toPage(2,2)">
                    APP首页推荐位管理
                </div>
                <div class="item blue" @click="toPage(1,3)">
                    APP首页明星店铺推荐位管理
                </div>
                <div class="item blue" @click="toPage(1,4)">
                    APP首页今日榜单广告位管理
                </div>
                <div class="item blue" @click="toPage(1,5)">
                    APP首页精品推荐广告位管理
                </div>
                <div class="item blue" @click="toPage(2,6)">
                    APP首页超值热卖广告位管理
                </div>
                <div class="item blue" @click="toPage(2,7)">
                    APP首页专题广告位管理
                </div>
                <div class="item blue" @click="toPage(2,8)">
                    APP首页为你推荐广告位管理
                </div>
            </div>
            <div class="row">
                <p class="adv-title">拼店广告位管理</p>
                <div class="item red" @click="toPage(1,9)">
                    拼店首页banner推荐位
                </div>
            </div>
            <div class="row">
                <p class="adv-title">其他广告位管理</p>
                <div class="item yellow" @click="toPage(3,10)">
                    类目搜索Banner广告位设置
                </div>
                <!--<div class="item yellow" @click="toPage(1,11)">-->
                    <!--秀场banner推荐图-->
                <!--</div>-->
                <!--<div class="item yellow" @click="toPage(4,12)">-->
                    <!--登录首页头图展示位-->
                <!--</div>-->
            </div>
        </div>
    </div>
</template>


<script>
    import vBreadcrumb from '@/components/common/Breadcrumb.vue';
    import icon from '@/components/common/ico.vue';

    export default {
        components: {
            icon, vBreadcrumb
        },
        data: function() {
            return {};
        },
        activated() {

        },
        methods: {
            toPage(status, page) {
                /**
                 * status:
                 * 1: 全部显示
                 * 2：无投放时间
                 * 3：无排序
                 * 4：只有banner图和备注说明
                 */
                sessionStorage.setItem('appBannerAdvStatus', status);
                sessionStorage.setItem('appBannerAdvPageType', page);
                this.$router.push({ path: '/appBannerAdv', query: { appBannerAdvStatus: status, appBannerAdvPageType: page }});
            }

        }
    };
</script>


<style lang="less" scoped>
    .advertising {
        padding: 40px;
        background: #fff;
        .adv-title{
            margin:0 0 15px 15px;
        }
        .item {
            display: inline-block;
            width: 350px;
            height: 150px;
            line-height: 150px;
            box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.3);
            border-radius: 10px;
            font-size: 20px;
            color: #fff;
            text-align: center;
            margin: 0 15px 20px 0;
            cursor: pointer;
        }
        .blue {
            background: #33b4ff;
        }
        .red {
            background: #ff6868;
        }
        .yellow {
            background: #f39c11;
        }
    }

</style>
