<template>
  <div class="spell-shop-acount">
    <v-breadcrumb :nav='nav'></v-breadcrumb>
    <el-card :body-style="{ padding: '50px 100px',height:'65vh'}">
        <div class="card">
            <p class="spell-shop-title">
                <img src="../../../../assets/images/spell-shop-ico.png" class="title-ico">
                <span>拼店账户（元）</span>
            </p>
            <p class="spell-shop-content" style="font-size: 22px;">拼店额：￥{{totalTradeBalance||0}}/￥{{bonusNeedMoney}}</p>
            <!--<p class="spell-shop-content">分红金：￥60000</p>-->
            <p class="spell-shop-content">交易利润：￥{{totalTradeBalance||0}}</p>
            <!--<p class="btn" @click="showInfo">账户明细</p>-->
        </div>
    </el-card>
  </div>
</template>

<script>
import vBreadcrumb from '@/components/common/Breadcrumb.vue';
import request from '@/http/http.js';

export default {
    components: { vBreadcrumb },

    data() {
        return {
            nav: ['拼店管理', '店铺管理', '店铺详情', '拼店账户'],
            id: '',
            bonusNeedMoney: '',
            totalTradeBalance: ''
        };
    },
    activated() {
        this.id = this.$route.query.recruitShopId || sessionStorage.getItem('recruitShopId');
        this.bonusNeedMoney = this.$route.query.bonusNeedMoney || sessionStorage.getItem('bonusNeedMoney');
        this.totalTradeBalance = this.$route.query.totalTradeBalance || sessionStorage.getItem('totalTradeBalance');
        this.getSpellINfo();
    },
    methods: {
    // 获取拼店账户详情
        getSpellINfo() {

        },
        // 查看交易明细
        showInfo() {
            sessionStorage.setItem('tradeInfoId', 1);
            this.$router.push({ name: 'tradeInfo', query: { 'tradeInfoId': 1 }});
        }
    }
};

</script>
<style lang='less' scoped>
.spell-shop-acount{
    .card{
        background-color: red;
        background-image: url('../../../../assets/images/spell-shop-card.png');
        width: 420px;
        height: 240px;
        border-radius: 20px;
        overflow: hidden;
        .spell-shop-title{
            margin: 15px 30px;
            font-size: 16px;
            color: #fff;
            font-weight: 600;
            .title-ico{
                vertical-align:middle;
                margin-right: 10px;
            }
        }
        .spell-shop-content{
            margin: 15px 30px;
            color: #fff;
            font-size: 20px;
        }
        .btn{
            width: 110px;
            height: 40px;
            border: 2px solid #fff;
            border-radius: 10px;
            margin: 40px auto 0;
            text-align: center;
            line-height: 40px;
            cursor: pointer;
            color: #fff;
        }
    }
}
</style>
