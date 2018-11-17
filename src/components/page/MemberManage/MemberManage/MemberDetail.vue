<template>
    <div>
        <v-breadcrumb :nav="['经销商会员管理','会员管理','会员详情']"></v-breadcrumb>
        <div class="container" v-loading="loading">
            <div class="basic-inf-area line">
                <div class="left">
                    <div class="title">
                        <h3>基础信息</h3>
                    </div>
                    <div class="item-row">
                        <div class="item">会员ID：{{dealer.id}}</div>
                        <div class="item">微信openid：{{dealer.openid}}</div>
                    </div>
                    <div class="item-row">
                        <div class="item">昵称：{{dealer.nickname}}</div>
                        <div class="item">微信名称：{{dealer.wechatName}}</div>
                    </div>
                    <div class="item-row">
                        <div class="item">手机号：{{dealer.phone}}</div>
                    </div>
                    <div class="item-row">
                        <div class="item">姓名：{{dealer.realname}}</div>
                        <div class="item">身份证号：{{dealer.idcard}}</div>
                    </div>
                    <div class="item-row">
                        <div class="item">地址信息 ：{{dealer.province}}{{dealer.city}}{{dealer.area}}{{dealer.address}}</div>
                    </div>
                    <div class="item-row">
                        <div class="item">注册时间：{{dealer.regTime|formatDateAll}}</div>
                        <div class="item">最近登录时间：{{dealer.lastLoginTime|formatDateAll}}</div>
                    </div>
                </div>
                <div class="center">
                    <el-button @click="updateBasicInf">修改</el-button>
                </div>
                <div class="right">
                    <div>
                        <img class="img" v-if="dealer.headImg" :src="dealer.headImg" alt="">
                        <img class="img" v-else src="../../../../assets/images/logo.png" alt="">
                    </div>
                    <div>
                        <el-button type="primary" @click="btnClicked('lowerMemberManage', 'memberToLowListPage')">
                            下级代理({{dealer.junior || 0}})
                        </el-button>
                    </div>
                    <div>
                        <el-button type="primary" @click="btnClicked('memberTree', 'memberTreeInfo')"
                                   style="margin-left: 0">查看会员树状图
                        </el-button>
                    </div>
                    <!--<div>-->
                        <!--<el-button type="primary" @click="btnClicked('/operateLog')" style="margin-left: 0">用户操作日志-->
                        <!--</el-button>-->
                    <!--</div>-->
                    <!--<div>-->
                        <!--<el-button type="primary" @click="btnClicked('memberAccount', 'memberInfoAccount')"-->
                                   <!--style="margin-left: 0">他的账户-->
                        <!--</el-button>-->
                    <!--</div>-->
                    <div>
                        <el-button type="primary" @click="btnClicked('realNameInfo', 'memberInfoRealName')"
                                   style="margin-left: 0">实名信息{{dealer.realnameStatus == '1'?'(已实名)':''}}
                        </el-button>
                    </div>
                    <div>
                        <el-button type="primary" @click="btnClicked('shopInfo', 'shopInfo')"
                                   style="margin-left: 0">店铺信息
                        </el-button>
                    </div>
                </div>
                <div class="clearfix"></div>
            </div>
            <div class="author-inf-area line">
                <div class="left">
                    <div class="title">
                        <h3>授权信息</h3>
                    </div>
                    <div class="item-row">
                        <div class="item">上级代理：{{dealer.upUserName}}</div>
                        <div class="item">会员类型：
                            <span v-if="dealer.userType==1">网信经销商</span>
                            <span v-if="dealer.userType==2">供货经销商</span>
                            <span v-if="dealer.userType==3">网红经销商</span>
                        </div>
                    </div>
                    <div class="item-row">
                        <div class="item">授权码：{{dealer.code}}</div>
                        <div class="item">授权层级：{{dealer.levelName}}</div>
                    </div>
                    <div class="item-row">
                        <div class="item">经验值：{{dealer.experience}}</div>
                    </div>
                </div>
                <div class="center">
                    <el-button @click="updateAuthorInf">修改</el-button>
                </div>
                <div class="clearfix"></div>
            </div>
            <div class="line">
                <div class="left">
                    <div class="title">
                        <h3>拼店信息</h3>
                    </div>
                    <div class="item-row">
                        <div class="item" style="cursor: pointer;color: #20a0ff" v-if="dealer.roleType == 1">参与店铺：{{dealer.storeName}}</div>
                        <div class="item" style="cursor: pointer;color: #20a0ff" v-if="dealer.roleType == 0">开设店铺：{{dealer.storeName}}</div>
                    </div>
                </div>
                <div class="clearfix"></div>
            </div>
            <div class="promote-inf-area line">
                <div class="left">
                    <div class="title">
                        <h3>晋升记录</h3>
                    </div>
                    <div class="item-row" v-for="(v,k) in record" :key="k">
                        <div class="item">
                            <span>{{v.oldLevelName}} -- {{v.levelName}}</span>
                            <span style="margin-left: 20px">{{v.createTime | formatDateAll}}</span>
                        </div>
                    </div>
                </div>
                <div class="clearfix"></div>
            </div>
            <div class="promote-inf-area line">
                <div class="left">
                    <div class="title">
                        <h3>其他信息</h3>
                    </div>
                    <div class="item-row" >
                        <div class="item">
                            <span>消费金额{{dealer.balance || 0}}元</span>
                        </div>
                    </div>
                </div>
                <div class="clearfix"></div>
            </div>
            <div style="margin:50px">
                <el-button type="primary" @click="backToList">返回列表</el-button>
            </div>
        </div>
        <!--基础信息修改弹窗-->
        <edit-basic @msg='basicToast' :dealer='dealer' :id="id" v-show="isShowEditBasic"></edit-basic>
        <!--授权信息修改弹窗-->
        <edit-author @msg='authorToast' :dealer='dealer' :id="id" v-show="isShowEditAuthor"></edit-author>
    </div>
</template>

<script>
    import vBreadcrumb from '@/components/common/Breadcrumb.vue';
    import editBasic from './editBasicInf';
    import editAuthor from './editAuthorInf';
    import icon from '@/components/common/ico.vue';
    import request from '@/http/http';

    export default {
        components: {
            icon, vBreadcrumb, editBasic, editAuthor
        },
        data() {
            return {
                dealer: {},
                dynamicTags: [],
                inputVisible: false,
                inputValue: '',
                isShowEditBasic: false,
                isShowEditAuthor: false,
                formLabelWidth: '100px',
                id: '',
                loading: false,
                // 店铺id
                storeId: '',
                // 参与的店铺
                otherStore: '',
                // 开设的店铺
                myStore: '',
                // 晋升记录
                record: []
            };
        },
        created() {
            this.id = this.$route.query.memberToInfo;
            this.getDetail();
        },
        activated() {
            this.id = this.$route.query.memberToInfo;
            this.getDetail();
        },
        methods: {
            basicToast(msg) {
                const that = this;
                that.isShowEditBasic = msg;
                setTimeout(function() {
                    that.getDetail();
                }, 2000);
            },
            authorToast(msg) {
                const that = this;
                that.isShowEditAuthor = msg;
                setTimeout(function() {
                    that.getDetail();
                }, 2000);
            },
            // 获取详情
            getDetail() {
                // todo  缺少开设店铺字段
                const data = {
                    id: this.id
                };
                this.loading = true;
                request.findDealerById(data).then(res => {
                    this.loading = false;
                    this.dealer = res.data;
                    this.record = res.data.levelChangeList;
                    this.storeId = res.data.storeId;
                }).catch(err => {
                    this.loading = false;
                    console.log(err);
                });
            },
            // 返回列表
            backToList() {
                this.$router.push('/memberManage');
            },
            // 修改基础信息
            updateBasicInf() {
                this.isShowEditBasic = true;
            },
            // 修改授权信息
            updateAuthorInf() {
                this.isShowEditAuthor = true;
            },
            // 页面跳转
            btnClicked(page, paramName) {
                this.$router.push({ name: page, query: { [paramName]: this.id }});
            }
        }
    };
</script>
<style scoped>
    .container {
        font-size: 14px;
        color: #606266;
        height: auto;
        margin-bottom: 20px;
        padding: 30px 0 30px 80px;
    }

    .left {
        float: left;
        width: 70%;
        height: auto
    }

    .center {
        float: left;
        width: 10%;
        height: auto
    }

    .right {
        float: right;
        width: 20%;
        height: auto;
        text-align: center;
    }

    .title {
        margin-bottom: 10px
    }

    .tags-area {
        margin-top: 10px
    }

    .line {
        border-bottom: 1px solid #e2e2e2;
        margin-bottom: 20px;
    }

    .clearfix {
        clear: both
    }

    .item-row {
        height: 40px;
        line-height: 40px;
    }

    .item {
        width: 50%;
        float: left;
    }

    .color-blue {
        color: #20a0ff
    }

    .color-red {
        color: #ff1e30;
        font-size: 20px
    }

    .img {
        width: 100px;
        height: 100px;
        border-radius: 10px;
        border: 2px solid #dfdfdf;
    }

    .right .el-button {
        width: 160px;
        height: 40px;
        margin-top: 10px
    }

    .el-tag {
        height: 32px;
        line-height: 32px;
        margin-right: 10px
    }

    .input-new-tag {
        width: 200px
    }

</style>
