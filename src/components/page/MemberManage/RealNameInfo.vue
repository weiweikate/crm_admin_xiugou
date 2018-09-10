<template>
    <div class="realname-info">
        <breadcrumb :nav='nav'></breadcrumb>
        <el-card>
            <div class="wrap">
                <span class='title'>基本信息</span>
                <p>证件类型：{{detail.drType==1?'身份证':'身份证'}}</p>
                <p>姓名：{{detail.realName}}</p>
                <p>身份证号：{{detail.idcardNo}}</p>
                <span class='title'>图片</span>
                <div class="info">
                    <div class="card" v-for="(v,k) in img" :key="k">
                        <img :src="v" alt="">
                    </div>
                </div>
            </div>
        </el-card>
    </div>
</template>
<script>
import breadcrumb from '../../common/Breadcrumb'
import * as api from '../../../api/api.js';
import * as pApi from '../../../privilegeList/index.js';
import {getUserId} from '../../../JS/commom.js';

export default {
    components: {
        breadcrumb
    },
    mixins: [getUserId],
    data () {
        return {
            nav: ["经销商会员管理", "会员管理", "会员详情","实名认证"],
            img:[],
            detail:{},
            id:''
        }
    },
    activated(){
        this.id = this.$route.query.memberId || sessionStorage.getItem('memberId');
        this.getUserId();
        this.getDetail()
    },
    methods:{
        getDetail(){
            let that=this;
            that.img=[];
            let data={
                id:that.id,
            };
            that.$axios
                .post(api.findDealerRealnameInfo, data)
                .then(res => {
                    if (res.data.code == 200) {
                        that.detail = res.data.data;
                        that.img.push(res.data.data.frontPhoto,res.data.data.backPhoto)
                    } else {
                        that.$message.warning(res.data.msg);
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }
}
</script>
<style lang='less' scoped>
.realname-info{
    .wrap{
        margin: 10px 50px;
        color: #666;
        .title{
            font-size: 16px;
            line-height: 40px;
        }
        p{
            font-size: 14px;
            line-height: 25px;
        }
        .info{
            .card{
                display: inline-block;
                width: 265px;
                height: 165px;
                border: 1px solid #ccc;
                border-radius: 5px;
                margin: 5px 11px;
                padding: 10px;
                box-sizing: border-box;
                img{
                    width: 100%;
                    height: 100%;
                }
            }
        }
    }
}
</style>


