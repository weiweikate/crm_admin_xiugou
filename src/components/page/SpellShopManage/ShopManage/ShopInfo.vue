<template>
    <div class="shop-info">
        <v-breadcrumb :nav='nav'></v-breadcrumb>
        <el-card :body-style="{ padding: '20px 50px' }">
            <div class="shop-box" style="height:220px;">
                <p class="shop-title">店铺信息</p>
                <div class="shop-wrap">
                    <div class="shop-left">
                        <p class="shop-msg">
                            <span>店铺名称：{{detail.name}}</span>
                        </p>
                    </div>
                    <div class="shop-right">
                        <p class="shop-msg">
                            <span>创建时间：{{detail.createTime|formatDateAll}}</span>
                        </p>
                    </div>
                </div>
                <div class="shop-wrap">
                    <div class="shop-left">
                        <p class="shop-msg">
                            <span>店铺ID：{{detail.showNumber}}</span>
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
                            <span>店长：<span @click="showShopLeader(detail.userCode)" class="font-href">{{detail.storeUserName}}</span></span>
                            <span class="inf">实名认证</span>
                            <!--<span @click="shopTransfer" class="font-href">店铺转让</span>-->
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
                        <!--<img v-if='avatar == ""' src="../../../../assets/images/avatar.jpg" alt="">-->
                        <!--<img v-else :src="detail.headUrl" alt="">-->
                    <!--</el-upload>-->
                    <img v-if='!detail.headUrl' src="../../../../assets/images/avatar.jpg" alt="">
                    <img v-else :src="detail.headUrl" alt="">
                    <p style="margin-top:10px">
                        <el-button @click="spellShopAcc" type="primary" v-auth="'pindian.shopList.pdzh'">拼店账户</el-button>
                    </p>
                    <p style="margin-top:10px">
                        <el-button @click="memberManage" type="primary">成员管理</el-button>
                    </p>
                    <p style="margin-top:10px">
                        <el-button @click="shopAnnouncement" type="primary" v-auth="'pindian.shopList.dpgggl'">店铺公告管理</el-button>
                    </p>
                    <p style="margin-top:10px">
                        <el-button @click="updateLevel" type="primary">修改店铺层级</el-button>
                    </p>
                </div>
            </div>
            <hr style="border:none;height:1px;background-color:#e2e2e2"/>
            <div class="shop-box">
                <p class="shop-title">店铺交易记录</p>
                <div class="shop-wrap">
                    <div class="shop-left">
                        <p class="shop-msg">
                            <span>店铺拼店分红总额：￥{{detail.totalTradeBalance||0+detail.tradeBalance||0}}</span>
                        </p>
                    </div>
                </div>
                <!--<div class="reportSpellShop-wrap">-->
                    <!--<div class="reportSpellShop-left">-->
                        <!--<p class="reportSpellShop-msg">-->
                            <!--<span>店铺拼店分红总额：￥{{detail.totalTradeVolume+detail.tradeVolume}}</span>-->
                            <!--<span style="color:red">(已经交易的加上现阶段未分红的总额)</span>-->
                        <!--</p>-->
                    <!--</div>-->
                <!--</div>-->
                <div class="shop-wrap">
                    <div class="shop-left">
                        <p class="shop-msg">
                            <span>店铺分红次数：{{detail.bonusCount||0}}次</span>
                            <span style="margin-left:20px" @click="shareBoneMsg" class="font-href" v-auth="'pindian.shopList.dpfhck'">查看详情</span>
                        </p>
                    </div>
                </div>
                <div class="shop-wrap">
                    <div class="shop-left">
                        <p class="shop-msg">
                            <span>店铺分红总金额：￥{{detail.totalTradeBalance||0}}</span>
                        </p>
                    </div>
                </div>
                <div class="shop-wrap">
                    <div class="shop-left">
                        <p class="shop-msg">
                            <span>店长分红总金额：￥{{detail.bossBonus||0}}</span>
                        </p>
                    </div>
                </div>
                <div class="shop-wrap">
                    <div class="shop-left">
                        <p class="shop-msg">
                            <span>店员分红总金额：￥{{detail.saleBonus||0}}</span>
                        </p>
                    </div>
                </div>
                <!--<div class="shop-wrap">-->
                    <!--<div class="shop-left">-->
                        <!--<p class="shop-msg">-->
                            <!--<span>最快拼店记录：{{detail.quickBonusBeginTime|formatDateAll}}-{{detail.quickBonusEndTime|formatDateAll}}</span>-->
                        <!--</p>-->
                    <!--</div>-->
                <!--</div>-->
            </div>
            <hr style="border:none;height:1px;background-color:#e2e2e2"/>
            <div class="shop-box">
                <div class="shop-wrap">
                    <div class="shop-left">
                        <p class="shop-msg">
                            <span>拼店金额目标：￥{{detail.bonusNeedMoney}}</span>
                        </p>
                    </div>
                </div>
            </div>
        </el-card>
       <el-dialog title="修改店铺层级" :visible.sync="mask">
           <el-form>
               <el-form-item label="当前：">
                   {{detail.starName}}
               </el-form-item>
               <el-form-item label="更改">
                   <el-select v-model="starId" placeholder="请选择店铺等级">
                       <el-option
                           v-for="item in shopLevelArr"
                           :key="item.id"
                           :label="item.name"
                           :value="item.id">
                       </el-option>
                   </el-select>
               </el-form-item>
           </el-form>
           <div slot="footer" class="dialog-footer">
               <el-button type="primary" :loading="btnLoading" @click="sure">确 认</el-button>
               <el-button @click="mask=false">取 消</el-button>
           </div>
       </el-dialog>
    </div>
</template>

<script>
    import vBreadcrumb from '@/components/common/Breadcrumb.vue';
    // import * as pApi from '@/privilegeList/SpellShopManage/index';
    import utils from '@/utils/index.js';
    import request from '@/http/http.js';

    export default {
        components: { vBreadcrumb },

        data() {
            return {

                nav: ['拼店管理', '店铺管理', '店铺详情'],
                shopId: '',
                avatar: '',
                detail: {},
                mask: false,
                shopLevelArr: [],
                starId: '',
                btnLoading: false
            };
        },

        activated() {
            this.shopId = this.$route.query.shopInfoId || sessionStorage.getItem('shopInfoId');
            this.getInfo();
        },

        methods: {
            //  获取信息
            getInfo() {
                const data = {
                    storeCode: this.shopId
                };
                request.getStoreDetail(data).then(res => {
                    this.detail = res.data;
                    this.starId = res.data.storeStarId;
                }).catch(error => {
                    console.log(error);
                });
            },
            // 查看店长
            showShopLeader(id) {
                localStorage.setItem('memberToInfo', id);
                this.$router.push({ path: '/memberDetail', query: { memberToInfo: id }});
            },
            // 店铺转让
            shopTransfer() {
            },
            // 查看分红详情
            shareBoneMsg() {
                sessionStorage.setItem('recruitShopId', this.shopId);
                sessionStorage.setItem('groupMoney', this.detail.groupMoney);
                this.$router.push({ name: 'shareBonusInfo', query: { 'recruitShopId': this.shopId, 'groupMoney': this.detail.groupMoney }});
            },
            // 上传成功
            uploadSuccess(res) {
                this.avatar = res.data.imageUrl;
            },
            // 拼店账户
            spellShopAcc() {
                sessionStorage.setItem('recruitShopId', this.shopId);
                sessionStorage.setItem('bonusNeedMoney', this.detail.bonusNeedMoney || 0);
                sessionStorage.setItem('totalTradeBalance', this.detail.totalTradeBalance || 0);
                this.$router.push({ name: 'spellShopAccount', query: { 'recruitShopId': this.shopId, 'bonusNeedMoney': this.detail.bonusNeedMoney || 0, 'totalTradeBalance': this.detail.totalTradeBalance || 0 }});
            },
            // 成员管理
            memberManage() {
                sessionStorage.setItem('recruitShopId', this.shopId);
                sessionStorage.setItem('groupMoney', this.detail.groupMoney);
                this.$router.push({ name: 'shopMemberManage', query: { 'recruitShopId': this.shopId, 'groupMoney': this.detail.groupMoney }});
            },
            // 店铺公告
            shopAnnouncement() {
                sessionStorage.setItem('recruitShopId', this.shopId);
                this.$router.push({ name: 'shopAnnouncement', query: { 'recruitShopId': this.shopId }});
            },
            // 获取店铺等级
            getAllStoreStar() {
                request.getAllStoreStar({}).then(res => {
                    this.shopLevelArr = [];
                    this.shopLevelArr = res.data;
                }).catch(error => {
                    console.log(error);
                });
            },
            // 修改店铺层级
            updateLevel() {
                this.mask = true;
                this.getAllStoreStar();
            },
            sure() {
                const data = {
                    storeCode: this.shopId,
                    starId: this.starId
                };
                this.btnLoading = true;
                request.updateShopLevel(data).then(res => {
                    this.$message.success(res.msg);
                    this.mask = false;
                    this.btnLoading = false;
                    this.getInfo();
                }).catch(err => {
                    this.btnLoading = false;
                });
            }
        }
    };
</script>
<style lang='less'>
    .shop-info {
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
