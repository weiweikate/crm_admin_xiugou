<template>
    <div>
        <v-breadcrumb :nav="['经销商会员管理','会员管理','会员详情','TA的账户']"></v-breadcrumb>
        <div class="accountInfod">
            <ul class="card-box">
                <li v-for="(item,index) in card" :key="index" :style="{backgroundImage: 'url('+  (test || defaultCard) +')'}" >
                    <div class="userCard">
                        <div class="cardName">
                           {{item.bank_name}}
                        </div>
                        <div class="cardType">
                            {{item.cardType}}
                        </div>
                    </div>
                    <div class="card-num">
                        <span>****</span>
                        <span>****</span>
                        <span>****</span>
                        <span>{{item.Num }}</span>
                    </div>
                    <div class="delete">
                        <div>持卡人：{{item.name}}</div>
                        <div class="spanBtn" @click="dismiss(item.id,index)">删除</div>
                    </div>
                </li>
            </ul>

        </div>
        <!--删除弹窗-->
        <delete-toast :id='delId' :url='delUrl' :uri='delUri' @msg='deleteToast' v-if="isShowDelToast"></delete-toast>
    </div>

</template>


<script>
    import vBreadcrumb from '../../../common/Breadcrumb.vue';
    import icon from '../../../common/ico.vue';
    import deleteToast from "../../../common/DeleteToast";
    import { findBindBankInfoBydealerId, deleteBindBankInfo } from '../../../../api/api.js';
    import * as pApi from '../../../../privilegeList/index.js';

    export default {
        components: {
            icon, vBreadcrumb,deleteToast
        },
        activated() {
            this.id = this.$route.query.memberId || JSON.parse(sessionStorage.getItem("memberId"));
            this.getFindBindBankInfoBydealerId(this.id)
        },
        data() {
            return {
                // 权限控制
                test:'',
                defaultCard:require('../../../../assets/images/userCard-default.png'),
                card:[],
                delId: '',
                delUrl: '',
                delUri:'',
                isShowDelToast: false,
            }
        },
        methods: {
            getFindBindBankInfoBydealerId(id){
                this.$axios.post(findBindBankInfoBydealerId, {dealerId:id,status:1})
                    .then(res => {
                    if (res.data.code == 200) {
                        let datas = res.data.data
                        datas.forEach((item) =>{
                            item.cardType =  item.card_type == 1 ? '储蓄卡':'信用卡'
                            let length = item.card_no.length;
                            item.Num = item.card_no.substring(length-3,length);
                            item.name =item.account?item.account.length>1? item.account.slice(0,1)+'*'+ item.account.slice(2) : item.account:'';    
                        })
                        this.card = datas
                    } else {
                        this.$message.warning(res.data.msg);
                    }
                }).catch(err => {
                    console.log(err);
                })
            },
            dismiss(id,index){
                this.delId = id;
                this.delUrl = deleteBindBankInfo;
                this.delUri = pApi.queryDealerAccount;
                this.isShowDelToast = true;
            },
            // 删除弹窗
            deleteToast(msg) {
                this.isShowDelToast = msg;
                this.getFindBindBankInfoBydealerId(this.id)
            },
        }
    }
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
