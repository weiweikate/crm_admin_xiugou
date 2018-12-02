<template>
    <div class="recruit-shop-info">
        <v-breadcrumb :nav='nav'></v-breadcrumb>
        <el-card :body-style="{ padding: '30px 90px',minHeight:'60vh' }">
            <div class="shop-box">
                <p class="shop-title">店铺信息</p>
                <div class="shop-wrap">
                    <div class="shop-left">
                        <p class="shop-msg">
                            <span>店铺名称：{{detail.name}}</span>
                        </p>
                    </div>
                    <div class="shop-right">
                        <p class="shop-msg">
                            <span>创建时间：{{detail.createTime|formatDate}}</span>
                        </p>
                    </div>
                </div>
                <div class="shop-wrap">
                    <div class="shop-left">
                        <p class="shop-msg">
                            <span>店铺ID：{{detail.storeNumber}}</span>
                        </p>
                    </div>
                    <div class="shop-right">
                        <p class="shop-msg">
                            <span>店铺等级：{{detail.starName}}</span>
                        </p>
                    </div>
                </div>
                <div class="shop-wrap">
                    <div class="shop-left">
                        <p class="shop-msg">
                            <span>保证金：￥{{detail.deposit||0}}</span>
                        </p>
                    </div>
                    <div class="shop-right">
                        <p class="shop-msg">
                            <span>店铺Exp：{{detail.experience||0}}</span>
                        </p>
                    </div>
                </div>
                <div class="shop-wrap">
                    <div class="shop-left">
                        <p class="shop-msg">
                            <span>店长：<span @click="showShopLeader(detail.userId)" class="font-href">{{detail.storeUserName}}</span></span>
                            <span class="inf">实名认证</span>
                        </p>
                    </div>
                    <div class="shop-right">
                        <p class="shop-msg">
                            <span>店铺成员数：{{detail.storeUserNum||0}}/{{detail.maxUser}}</span>
                        </p>
                    </div>
                </div>
                <div class="avatar-wrap">
                    <!--<el-upload :show-file-list='false' :on-success='uploadSuccess'-->
                               <!--action="/admin/ossClient/aliyunOSSUploadImage">-->
                        <!--<img v-if='detail.headUrl == ""' src="../../../../assets/images/avatar.jpg" alt="">-->
                        <!--<img v-else :src="detail.headUrl" alt="">-->
                    <!--</el-upload>-->
                    <img v-if='!detail.headUrl' src="../../../../assets/images/avatar.jpg" alt="">
                    <img v-else :src="detail.headUrl" alt="">
                <p style="font-size:14px">店铺头像</p>
                <!--<p style="margin-top:10px">-->
                    <!--<el-button @click="memberManage" type="primary">成员管理</el-button>-->
                <!--</p>-->
            </div>
        </div>
    </el-card>

</div>
</template>

<script>
import vBreadcrumb from '@/components/common/Breadcrumb.vue';
import * as pApi from '@/privilegeList/SpellShopManage/index';
import request from '@/http/http.js';

export default {
    components: { vBreadcrumb },

    data() {
        return {
            nav: ['拼店管理', '招募店铺管理', '店铺详情'],
            shopId: '',
            avatar: '',
            detail: {}
        };
    },

    activated() {
        this.shopId =
            this.$route.query.recruitShopId ||
            sessionStorage.getItem('recruitShopId');
        this.getInfo();
    },

    methods: {
        //  获取信息
        getInfo() {
            const data = {
                id: this.shopId
            };
            request.getStoreDetail(data).then(res => {
                this.detail = res.data;
            }).catch(error => {
                console.log(error);
            });
        },
        // 上传成功
        uploadSuccess(res) {
            this.avatar = res.data.imageUrl;
        },
        // 成员管理
        memberManage() {
            sessionStorage.setItem('recruitShopId', this.shopId);
            this.$router.push({ name: 'shopMemberManage', query: { 'recruitShopId': this.shopId }});
        },
        // 查看店长
        showShopLeader(id) {
            localStorage.setItem('memberToInfo', id);
            this.$router.push({ path: '/memberDetail', query: { memberToInfo: id }});
        }
    }
};
</script>
<style lang='less'>
.recruit-shop-info {
    .inf {
        width: 80px;
        height: 30px;
        line-height: 30px;
        display: inline-block;
        text-align: center;
        border-radius: 5px;
        background: #f56c6c;
        color:#fff
    }
    .el-upload-dragger,
    .el-upload--text {
        width: 105px;
        height: 105px;
        border: none;
    }
    .shop-box {
        position: relative;
        margin: 30px 0 0 0;
        .shop-title {
            font-size: 18px;
            margin-bottom: 10px;
        }
        .shop-wrap {
            overflow: hidden;
            .shop-left,
            .shop-right {
                width: 45%;
                float: left;
                .shop-msg {
                    font-size: 14px;
                    line-height: 40px;
                    .font-href {
                        color: #20a0ff;
                        cursor: pointer;
                    }
                }
            }
        }
        .shop-wrap:last-child {
            margin-bottom: 10px;
        }
        .avatar-wrap {
            position: absolute;
            top: -30px;
            right: 0px;
            width: 110px;
            text-align: center;
            img {
                width: 100px;
                height: 100px;
                border: 2px solid #dfdfdf;
                border-radius: 10px;
                margin: 0 auto;
            }
        }
    }
}
</style>
