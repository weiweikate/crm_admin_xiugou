<template>
    <div>
        <v-breadcrumb :nav="['经销商会员管理','会员管理','会员详情','TA的账户']"></v-breadcrumb>
        <div class="accountInfod">
            <ul class="card-box">
                <li class="Account">
                    <div class="card-title">
                        <icon class="ico" ico='icon-ffffff'/>
                        现金账户 （元）
                    </div>
                    <div class="card-content">
                        <div class="card-amout">
                            可提现：{{accountInfo.available_balance}}
                        </div>
                        <div class="frozen">
                            冻结中：{{accountInfo.blocked_balances}}
                        </div>
                    </div>
                    <span class="spanBtn" @click="btnClicked(1)">收支明细</span>
                </li>
                <li class="userToken">
                    <div class="card-title">
                        <icon class="ico" ico='icon-jinbiqian'/>
                        代币账户（币）
                    </div>
                    <div class="card-content">
                        <div class="card-amout">
                            代币数：{{accountInfo.token_coin}}
                        </div>
                        <div class="frozen">
                            冻结中：{{accountInfo.blocked_coin}}
                        </div>
                    </div>
                    <span class="spanBtn" @click="btnClicked(2)">收支明细</span>
                </li>
                <li class="UserBonus">
                    <div class="card-title">
                        <icon class="ico" ico='icon-xianjindai'/>
                        收益账户（元）
                    </div>
                    <div class="card-content">
                        <div class="card-amout">
                            收益数：{{accountInfo.bonus_point || 0}}
                        </div>
                    </div>
                    <span class="spanBtn"  @click="btnClicked(3)">收支明细</span>
                </li>
                <li class="userIntegral">
                    <div class="card-title">
                        <icon class="ico" ico='icon-youhuiquan'/>
                        积分账户（分）
                    </div>
                    <div class="card-content">
                        <div class="card-amout">
                            积分数：{{accountInfo.user_score}}
                        </div>
                    </div>
                    <span class="spanBtn" @click="btnClicked(4)">收支明细</span>
                </li>
                <li class="userCard">
                    <div class="card-title">
                        <icon class="ico" ico='icon-tubiaolunkuo-'/>
                        银行卡（张）
                    </div>
                    <div class="card-content">
                        <div class="card-amout">
                            已绑定银行卡：{{accountInfo.count}}
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
                            可提现：{{accountInfo.count  || 0}}
                        </div>
                    </div>
                    <span class="spanBtn"  @click="btnClicked(6)">查看详情</span>
                </li>
            </ul>

        </div>
    </div>
</template>


<script>
    import vBreadcrumb from '../../../common/Breadcrumb.vue';
    import icon from '../../../common/ico.vue';
    import * as api from '../../../../api/api.js';
    import * as pApi from '../../../../privilegeList/index.js';
    export default {
        components: {
            icon, vBreadcrumb
        },
        data: function () {
            return {
                id:'',
                accountInfo:''
            }
        },
        activated() {
            this.id =
                this.$route.query.memberId ||
                JSON.parse(sessionStorage.getItem("memberId"));
            this.getQueryDealerAccount(this.id)
        },
        methods: {
            btnClicked(id) {
                let that=this;
                let memberInfo = {};
                memberInfo.memberId = that.id;
                memberInfo.nickname = that.accountInfo.nickname;
                sessionStorage.setItem('memberId', that.id);
                switch(id) {
                    case 1:
                        this.$router.push({path:'/cashAccountBalance',query:{'memberId':that.id}});
                        break;
                    case 2:
                        this.$router.push({path:'/tokenAccountBalance',query:{'memberId':that.id}});
                        break;
                    case 3:
                        sessionStorage.setItem('memberInfo',memberInfo);
                        this.$router.push({path:'/shareAccountBalance',query:{'memberInfo':memberInfo}});
                        break;
                    case 4:
                        this.$router.push({path:'/integralAccountBalance',query:{'memberId':that.id}});
                        break;
                    case 5:
                        this.$router.push({path:'/MemberCard',query:{'memberId':that.id}});
                        break;
                    case 6:
                        sessionStorage.setItem('memberInfo',memberInfo);
                        this.$router.push({path:'/withDrawAccount',query:{'memberInfo':memberInfo}});
                        break;
                    default:
                }
            },
            getQueryDealerAccount(id){
                let data={
                    url:pApi.queryDealerAccount,
                    id:id
                };
                this.$axios.post(api.queryDealerAccount, data)
                    .then(res => {
                       if (res.data.code == 200) {
                        this.accountInfo = res.data.data
                       } else {
                           this.$message.warning(res.data.msg);
                       }
                }).catch(err => {
                    console.log(err);
                })
            }
        }
    }
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
        }
    }

</style>
