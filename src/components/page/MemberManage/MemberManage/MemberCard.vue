<template>
    <div>
        <v-breadcrumb :nav="['经销商会员管理','会员管理','会员详情','TA的账户']"></v-breadcrumb>
        <div class="accountInfod" v-loading="tableLoading">
            <ul class="card-box">
                <li v-for="(item,index) in card" :key="index" :style="{backgroundImage: 'url('+  (test || defaultCard) +')'}" >
                    <div class="userCard">
                        <div class="cardName">
                           {{item.bankName}}
                        </div>
                        <div class="cardType">
                            {{item.cardType == 1? '储蓄卡': '信用卡'}}
                        </div>
                    </div>
                    <div class="card-num" v-if="item.cardNo">
                        <span>{{item.cardNo.slice(0,4)}}</span>
                        <span>****</span>
                        <span>****</span>
                        <span>{{item.cardNo.slice(-4)}}</span>
                    </div>
                    <div class="delete">
                        <div>持卡人：{{item.account}}</div>
                        <div class="spanBtn" @click="dismiss(item.id)">删除</div>
                    </div>
                </li>
            </ul>

        </div>
        <!--删除弹窗-->
        <delete-toast :id='delId' :url='delUrl' :uri='delUri' @msg='deleteToast' v-if="isShowDelToast"></delete-toast>
    </div>

</template>


<script>
    import vBreadcrumb from '@/components/common/Breadcrumb.vue';
    import icon from '@/components/common/ico.vue';
    import deleteToast from '@/components/common/DeleteToast';
    import request from '@/http/http';

    export default {
        components: {
            icon, vBreadcrumb, deleteToast
        },
        activated() {
            this.id = this.$route.query.memberAccMsg.memberId || sessionStorage.getItem('memberAccMsg').memberId;
            this.getFindBindBankInfoBydealerId();
        },
        data() {
            return {
                test: '',
                tableLoading: '',
                defaultCard: require('../../../../assets/images/userCard-default.png'),
                card: [],
                delId: '',
                delUrl: '',
                delUri: '',
                isShowDelToast: false
            };
        },
        methods: {
            getFindBindBankInfoBydealerId() {
                this.tableLoading = true;
                request.queryCardByUserId({id: this.id}).then(res=>{
                    this.tableLoading = false;
                    this.card = res.data;
                }).catch(err=>{
                    this.tableLoading = false;
                    console.log(err);
                })
            },
            dismiss(id) {
                this.delId = id;
                this.delUrl = 'deleteAccountCardById';
                this.delUri = '';
                this.isShowDelToast = true;
            },
            // 删除弹窗
            deleteToast(msg) {
                this.isShowDelToast = msg;
                this.getFindBindBankInfoBydealerId();
            }
        }
    };
</script>


<style  lang="less" scoped>
    ol, ul, li { list-style:none; }
    .card-box{
        overflow: hidden;
        display: flex;
        flex-wrap:wrap;
        padding:50px 0 40px 60px;
        color:#fff;
        background:#fff;
        box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
        li{
            margin:0 15px 20px 15px;
            border:1px solid #ddd;
            box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
            width: 420px;
            height: 240px;
            border-radius: 20px;
            box-sizing: border-box;
            padding:32px 21px 19px 35px;
            .userCard{
                padding-left: 80px;
                margin-bottom:35px;
                .cardName{
                    font-size: 24px;
                    margin-bottom: 6px;
                }
                .cardType{
                    font-size: 18px;
                }
            }
            .card-num{
               font-size: 24px;
               display: flex;
               align-items: center;
               justify-content: space-between;
               width:290px;
               margin: auto;
               margin-bottom:20px;
            }
            .delete{
                display: flex;
                align-items: center;
                justify-content: space-between;
                .spanBtn{
                    display: inline-block;
                    width: 89px;
                    height: 40px;
                    line-height: 40px;
                    text-align: center;
                    border: 1px solid;
                    border-radius: 5px;
                    cursor: pointer;
                }
            }
        }
    }

</style>
