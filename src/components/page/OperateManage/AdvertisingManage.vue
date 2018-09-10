<template>
    <div>
        <v-breadcrumb :nav="['运营管理','广告位管理']"></v-breadcrumb>
        <div class="advertising">
            <div class="row">
                <div class="item blue" @click="toPage(1, 1)">
                    APP首页banner广告位
                </div>
                <div class="item yellow" @click="toPage(1, 2)">
                    拼店首页banner推荐位
                </div>
                <div class="item red" @click="toPage(1, 3)">
                    登录首页头图展示图
                </div>
                <div class="item yellow" @click="toPage(1, 4)">
                   发现模块banner推荐图
               </div>
                <!-- <div class="item yellow" @click="toPage(2)">
                    APP首页产品推荐广告位
                </div>
                <div class="item red" @click="toPage(3)">
                    APP首页专题广告位
                </div> -->
            </div>
            <div class="row">
                <div class="item red" @click="toPage(1,5)">
                    首页长条广告位管理
                </div>
                <div class="item blue" @click="toPage(5)">
                    搜索热门搜索关键词
                </div>
            </div>
           <!-- <div class="row">
               <div class="item yellow" @click="toPage(1, 4)">
                   发现模块banner推荐图
               </div>
           </div> -->
        </div>
    </div>
</template>


<script>
    import vBreadcrumb from '../../common/Breadcrumb.vue';
    import icon from '../../common/ico.vue';
    import * as api from '../../../api/api.js';
    import * as pApi from '../../../privilegeList/index.js';
    export default {
        components: {
            icon, vBreadcrumb
        },
        data: function() {
            return {

            };
        },
        activated() {

        },
        methods: {
            toPage(id, index) {
                sessionStorage.setItem('pageType', index);
                switch (id) {
                    case 1:
                        sessionStorage.setItem('appBannerAdvId',index);
                        this.$router.push(
                            {
                                path: '/appBannerAdv',
                                query: {
                                    appBannerAdvId: index
                                }
                            }
                        );
                        break;
                    case 2:
                        this.$router.push('/featured');
                        break;
                    case 3:
                        this.$router.push('/topicManage');
                        break;
                    case 4:
                        this.$router.push();
                        break;
                    case 5:
                        this.$router.push('/keyWords');
                        break;
                    default:
                }
            }

        }
    };
</script>


<style  lang="less" scoped>
    .advertising{
        padding: 40px;
        background: #fff;
        .item{
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
        .blue{
            background: #33b4ff;
        }
        .red{
            background: #ff6868;
        }
        .yellow{
            background: #f39c11;
        }
    }

</style>
