<template>
    <div>
        <v-breadcrumb :nav="['经销商会员管理','会员管理','会员详情']"></v-breadcrumb>
        <div class="container">
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
                        <div class="item">微信号：{{dealer.wechatId}}</div>
                    </div>
                    <div class="item-row">
                        <div class="item">手机号：{{dealer.phone}}</div>
                    </div>
                    <div class="item-row">
                        <div class="item">姓名：{{dealer.realname}}</div>
                        <div class="item">身份证号：{{dealer.idcard}}</div>
                    </div>
                    <div class="item-row">
                        <div class="item">地址信息 ：{{dealer.addrPreFix}}{{dealer.address}}</div>
                    </div>
                    <div class="item-row">
                        <div class="item">注册时间：{{dealer.regTime|formatDate}}</div>
                        <div class="item">最近登录时间：{{dealer.lastLoginTime|formatDate}}</div>
                    </div>
                </div>
                <div class="center">
                    <el-button @click="updateBasicInf">修改</el-button>
                </div>
                <div class="right">
                    <div>
                        <img class="img" v-if="dealer.head_img" :src="dealer.head_img" alt="">
                        <img class="img" v-else src="../../../../assets/images/logo.png" alt="">
                    </div>
                    <!--<div>-->
                        <!--<el-button type="primary" @click="btnClicked('/lowerMemberManage')">-->
                            <!--下级代理({{dealer.sub_level_num}})-->
                        <!--</el-button>-->
                    <!--</div>-->
                    <div>
                        <el-button type="primary" @click="btnClicked('/memberTree')"
                                   style="margin-left: 0">查看会员树状图
                        </el-button>
                    </div>
                    <!--<div>-->
                        <!--<el-button type="primary" @click="btnClicked('/operateLog')" style="margin-left: 0">用户操作日志-->
                        <!--</el-button>-->
                    <!--</div>-->
                    <!--<div>-->
                        <!--<el-button type="primary" @click="btnClicked('/memberAccount')"-->
                                   <!--style="margin-left: 0">他的账户-->
                        <!--</el-button>-->
                    <!--</div>-->
                    <div>
                        <el-button type="primary" @click="realName"
                                   style="margin-left: 0">实名信息
                        </el-button>
                    </div>
                    <!--<div v-if='storeId'>-->
                        <!--<el-button type="primary" @click="shopInfo"-->
                                   <!--style="margin-left: 0">店铺信息-->
                        <!--</el-button>-->
                    <!--</div>-->
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
                            <span v-if="dealer.dtype==1">网信经销商</span>
                            <span v-if="dealer.dtype==2">供货经销商</span>
                            <span v-if="dealer.dtype==3">网红经销商</span>
                        </div>
                    </div>
                    <div class="item-row">
                        <div class="item">授权码：{{dealer.code}}</div>
                        <div class="item">授权层级：{{dealer.levelName}}级</div>
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
                        <div class="item">参与店铺：{{otherStore}}</div>
                        <div class="item">开设店铺：{{myStore}}</div>
                    </div>
                </div>
                <div class="clearfix"></div>
            </div>
            <div class="promote-inf-area line">
                <div class="left">
                    <div class="title">
                        <h3>晋升记录</h3>
                    </div>
                    <div class="item-row">
                        <div class="item">
                            <span>实习省代--省级代理</span>
                            <span style="margin-left: 20px">2018-05-12 12:32:31</span>
                        </div>
                    </div>
                    <div class="item-row">
                        <div class="item">
                            <span>实习省代--省级代理</span>
                            <span style="margin-left: 20px">2018-05-12 12:32:31</span>
                        </div>
                    </div>
                </div>
                <div class="clearfix"></div>
            </div>
            <!-- <div class="others-inf-area line">
                <div class="left">
                    <div class="title">
                        <h3>其他信息</h3>
                    </div>
                    <div class="item-row">
                        <div class="item-row">
                            <div class="item">获得荣誉：<span class="color-blue">{{dealer.id}}</span></div>
                            <div class="item">消费金额：<span class="color-red">{{dealer.id}}</span>/元</div>
                        </div>
                        <div class="item-row">
                            <div class="item">活跃度积分：{{dealer.id}}分</div>
                            <div class="item">活跃等级：{{dealer.id}}</div>
                        </div>

                    </div>
                </div>
                <div class="clearfix"></div>
            </div> -->
            <div class="user-tag-area">
                <div class="title">
                    <h3>用户标签</h3>
                </div>
                <div class="tags-area">
                    <el-tag
                        :key="tag.tagName"
                        v-for="tag in dynamicTags"
                        closable
                        color="#fff"
                        :disable-transitions="false"
                        @close="handleClose(tag.id)">
                        {{tag.tagName}}
                    </el-tag>
                    <div style="margin-top: 20px">
                        <el-input
                            class="input-new-tag"
                            v-if="inputVisible"
                            v-model="inputValue"
                            ref="saveTagInput"
                            @keyup.enter.native="handleInputConfirm"
                            @blur="handleInputConfirm"
                            placeholder="请输入标签文字"
                        >
                        </el-input>
                        <el-button type="primary" class="button-new-tag" @click="showInput" v-if="dynamicTags.length<20">添加标签</el-button>
                    </div>
                </div>
            </div>
            <div style="margin:50px">
                <el-button type="primary" @click="backToList">返回列表</el-button>
            </div>
        </div>
        <!--基础信息修改弹窗-->
        <edit-basic @msg='basicToast' :dealer='dealer' :id="id" v-if="isShowEditBasic"></edit-basic>
        <!--授权信息修改弹窗-->
        <edit-author @msg='authorToast' :dealer='dealer' :id="id" v-if="isShowEditAuthor"></edit-author>
    </div>
</template>

<script>
    import vBreadcrumb from '@/components/common/Breadcrumb.vue';
    import editBasic from './editBasicInf';
    import editAuthor from './editAuthorInf';
    import icon from '@/components/common/ico.vue';
    import * as api from '@/api/api';
    import request from '@/http/http';

    export default {
        components: {
            icon, vBreadcrumb, editBasic, editAuthor
        },
        data: function() {
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
                myStore: ''
            };
        },
        activated() {
            this.id =
                this.$route.query.id || sessionStorage.getItem('memberDetail');
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
                const data = {
                    id: this.id
                };
                this.loading = true;
                request.findDealerById(data).then(res => {
                    this.dealer = res.data;
                }).catch(err => {
                    console.log(err);
                });
            },
            // 删除标签
            handleClose(tag) {
                this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
                this.deleteTag(tag);
            },
            deleteTag(tag) {
                const that = this;
                const data = {
                    id: tag
                };
                that.$axios
                    .post(api.deleteTagDealer, data)
                    .then(res => {
                        if (res.data.code == 200) {
                            that.loading = false;
                            that.$message.success(res.data.msg);
                            that.getDetail();
                        } else {
                            that.$message.warning(res.data.msg);
                            that.loading = false;
                        }
                    })
                    .catch(err => {
                        that.loading = false;
                        console.log(err);
                    });
            },
            // 添加标签
            showInput() {
                this.inputVisible = true;
                this.$nextTick(_ => {
                    this.$refs.saveTagInput.$refs.input.focus();
                });
            },
            handleInputConfirm() {
                const inputValue = this.inputValue;
                if (inputValue) {
                    for (const i in this.dynamicTags) {
                        if (this.dynamicTags[i].tagName == inputValue) {
                            this.$message.warning('标签名不能重复!');
                            return;
                        }
                    }
                    const data = {
                        dealerId: this.id,
                        name: inputValue
                    };
                    this.addTag(data, inputValue);
                }
                this.inputVisible = false;
                this.inputValue = '';
            },
            addTag(data, inputValue) {
                const that = this;
                that.$axios
                    .post(api.addTagDealer, data)
                    .then(res => {
                        that.loading = false;
                        that.getDetail();
                    })
                    .catch(err => {
                        that.loading = false;
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
            //页面跳转
            btnClicked(page) {
                const id = this.id;
                sessionStorage.setItem('memberId', id);
                this.$router.push({ path: page, query: { 'memberId': id }});
            },
            // 跳转到店铺详情
            shopInfo() {
                sessionStorage.setItem('shopInfoId', this.storeId);
                this.$router.push({ name: 'shopInfo', query: { 'shopInfoId': this.storeId }});
            },
            // 实名认证页面
            realName() {
                sessionStorage.setItem('memberId', this.id);
                this.$router.push({ name: 'realNameInfo', query: { 'memberId': this.id }});
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
        float: left
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
