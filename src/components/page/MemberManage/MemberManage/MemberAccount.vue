<template>
    <div>
        <v-breadcrumb :nav="['经销商会员管理','会员管理','会员详情','TA的账户']"></v-breadcrumb>
        <div class="accountInfod">
            <ul class="card-box">
                <li class="Account">
                    <div class="card-title">
                        <icon class="ico" ico='icon-ffffff'/>
                        现金账户（元）
                    </div>
                    <div class="card-content">
                        <div class="card-amout">
                            可提现：{{accountInfo.cash || 0}}
                        </div>
                    </div>
                    <span class="spanBtn spanFirBtn" @click="$router.push('/showValReCharge')">账户充值</span>
                    <span class="spanBtn spanFirBtn" @click="btnClicked(1)">收支明细</span>
                </li>
                <li class="userToken">
                    <div class="card-title">
                        <icon class="ico" ico='icon-jinbiqian'/>
                        秀豆账户（分）
                    </div>
                    <div class="card-content">
                        <div class="card-amout">
                            代币数：{{accountInfo.bean || 0}}
                        </div>
                    </div>
                    <span class="spanBtn" @click="btnClicked(2)">收支明细</span>
                </li>
                <li class="UserBonus">
                    <div class="card-title">
                        <icon class="ico" ico='icon-xianjindai'/>
                        收益账户
                    </div>
                    <div class="card-content">
                        <div class="card-amout">
                            收益账户
                        </div>
                    </div>
                    <span class="spanBtn"  @click="btnClicked(3)">收支明细</span>
                </li>
                <li class="userCard">
                    <div class="card-title">
                        <icon class="ico" ico='icon-tubiaolunkuo-'/>
                        银行卡（张）
                    </div>
                    <div class="card-content">
                        <div class="card-amout">
                            已绑定银行卡：{{accountInfo.bank || 0}}
                        </div>
                    </div>
                    <span class="spanBtn"  @click="btnClicked(5)">查看详情</span>
                </li>
                <li class="withdrawAccount">
                    <div class="card-title">
                        <icon class="ico" ico='icon-tixian1'/>
                        待提现账户（元）
                    </div>
                    <div class="card-content">
                        <div class="card-amout">
                            可提现：{{accountInfo.withdrawal || 0}}
                        </div>
                    </div>
                    <span class="spanBtn"  @click="btnClicked(6)">查看详情</span>
                </li>
                <li class="Account">
                    <div class="card-title">
                        <icon class="ico" ico='icon-ffffff'/>
                        秀值账户（元）
                    </div>
                    <div class="card-content">
                        <div class="card-amout">
                            秀值账户
                        </div>
                    </div>
                    <span class="spanBtn" @click="btnClicked(4)">收支明细</span>
                </li>
            </ul>

        </div>
    </div>
</template>


<script>
    import vBreadcrumb from '@/components/common/Breadcrumb.vue';
    import icon from '@/components/common/ico.vue';
    import request from '@/http/http';
    export default {
        components: {
            icon, vBreadcrumb
        },
        data() {
            return {
                id: '',
                pageLoading: false,
                accountInfo: {}
            };
        },
        activated() {
            this.id = this.$utils.getParam.call(this, 'memberInfoAccount');
            this.getQueryDealerAccount();
        },
        methods: {
            btnClicked(id) {
                const that = this;
                const memberInfo = {};
                memberInfo.memberId = that.id;
                memberInfo.nickname = that.accountInfo.name;
                switch (id) {
                    case 1:
                        this.$router.push({ path: '/cashAccountBalance', query: { 'memberAccMsg': memberInfo }});
                        break;
                    case 2:
                        this.$router.push({ path: '/tokenAccountBalance', query: { 'memberAccMsg': memberInfo }});
                        break;
                    case 3:
                        this.$router.push({ path: '/shareAccountBalance', query: { 'memberAccMsg': memberInfo }});
                        break;
                    case 4:
                        this.$router.push({ path: '/showValueAccount', query: { 'memberAccMsg': memberInfo }});
                        break;
                    case 5:
                        this.$router.push({ path: '/MemberCard', query: { 'memberAccMsg': memberInfo }});
                        break;
                    case 6:
                        this.$router.push({ path: '/withDrawAccount', query: { 'memberAccMsg': memberInfo }});
                        break;
                    default:
                }
            },
            getQueryDealerAccount() {
                this.pageLoading = true;
                request.memberAccountListInfo({id: this.id}).then(res => {
                    this.pageLoading = false;
                    this.accountInfo = res.data;
                }).catch(err => {
                    this.pageLoading = false;
                });
            }
        }
    };
</script>


<style  lang="less" scoped>
    ol, ul, li { list-style:none; }
    .svg-icon{
        width: 25px;
        height: 25px;
        margin-right: 13px;
    }
    #bgImg (@url){
        background:url(@url) no-repeat;
    }
    #displayFlex(){
        display: flex;
        align-items: center;
    }
    .card-box{
        overflow: hidden;
        #displayFlex;
        flex-wrap:wrap;
        padding:40px 0 40px 60px;
        color:#fff;
        background:#fff;
        box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
        .userToken{
            #bgImg('../../../../assets/images/userToken.png');
        }
        .Account{
            #bgImg('../../../../assets/images/userAccount.png');
        }
        .UserBonus{
            #bgImg('../../../../assets/images/userFH.png');
        }
        .userCard{
            #bgImg('../../../../assets/images/userCard.png');
        }
        .userIntegral{
            #bgImg('../../../../assets/images/userJF.png');
        }
        .withdrawAccount{
            #bgImg('../../../../assets/images/withdrawAccount.png');
        }
        li{
            /*margin:0 10px 20px 10px;*/
            /*box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);*/
            width: 460px;
            height:272px;
            border-radius: 20px;
            box-sizing: border-box;
            padding:44px 32px 40px 45px;
            .card-title{
                font-size: 18px;
                margin-bottom: 20px;
                display: flex;
            }
            .card-content{
                #displayFlex;
                flex-direction:column;
                height:70px;
                justify-content: center;
                .card-amout{
                    font-size:30px ;
                }
                .frozen{
                    font-size: 20px;
                    margin-top: 10px;
                }
            }
            .spanBtn{
                display: block;
                margin: auto;
                margin-top: 27px;
                width:109px;
                height:40px;
                border:2px solid;
                border-radius:5px;
                text-align: center;
                line-height: 40px;
                cursor: pointer;
            }
            .spanFirBtn {
                height:30px;
                line-height: 30px;
                margin-top: 10px;
            }
        }
    }

</style>
