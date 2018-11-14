<template>
    <div>
        <v-breadcrumb :nav="['经销商会员管理','会员管理','会员详情','会员树状图']"></v-breadcrumb>
        <!--<transition name="move" appear>-->
        <!--<el-card style="margin:10px 0 20px">-->
        <!--<el-form ref="form" :inline="true" :model="form" label-width="120">-->
        <!--<el-form-item label="用户名">-->
        <!--<el-input style="width:200px" placeholder="用户名" v-model="form.name"></el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="用户ID">-->
        <!--<el-input style="width:200px" placeholder="请输入用户昵称" v-model="form.id"></el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="授权码">-->
        <!--<el-input style="width:200px" placeholder="请输入授权码" v-model="form.code"></el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item>-->
        <!--<el-button @click="search" type="primary">查询</el-button>-->
        <!--<el-button>重置</el-button>-->
        <!--</el-form-item>-->
        <!--</el-form>-->
        <!--</el-card>-->
        <!--</transition>-->
        <div class="tree-block" v-loading="loading">
            <!--上级代理-->
            <div class="first-title" v-if="upUser">
                <div class="click-area">
                    <span>上级代理</span>
                    <!--<i :class="dealerAndUp.checked?'el-icon-caret-bottom':'el-icon-caret-top'"></i>-->
                </div>
                <div class="first-child jump">
                    <div class="img-area">
                        <img v-if="upUser.headImg" :src="upUser.headImg" alt="">
                        <img v-else src="../../../../assets/images/logo.png" alt="">
                    </div>
                    <div class="tree-detail-area">
                        <div>用户名：{{dealerAndUp.nickname}}</div>
                        <div>用户ID：{{dealerAndUp.id}}<span>授权号：{{dealerAndUp.code}}</span></div>
                    </div>
                    <div class="clearfix"></div>
                </div>
            </div>
            <!--用户本人-->
            <div class="first-title" :class="dealerAndUp.upRealname?'line':''">
                <div class="click-area">
                    <span>当前用户</span>
                    <!--<i :class="dealerAndUp.checked?'el-icon-caret-bottom':'el-icon-caret-top'"></i>-->
                </div>
                <div class="first-child">
                    <div class="img-area">
                        <img v-if="dealerAndUp.headImg" :src="dealerAndUp.headImg" alt="">
                        <img v-else src="../../../../assets/images/logo.png" alt="">
                    </div>
                    <div class="tree-detail-area">
                        <div>用户名：{{dealerAndUp.nickname}}</div>
                        <div>用户ID：{{dealerAndUp.id}}<span>授权号：{{dealerAndUp.code}}</span></div>
                    </div>
                    <div class="clearfix"></div>
                </div>
            </div>
            <!--下级代理-->
            <div class="first-title" v-if="firstList">
                <div @click="expandLower()" class="click-area">
                    <span>下级代理</span>
                    <span class="count-area">{{lower.totalCount}}人</span>
                    <i :class="lower.checked?'el-icon-caret-bottom':'el-icon-caret-top'"></i>
                </div>
                <div v-show="lower.checked">
                    <!--直接代理-->
                    <div class="direct-area">
                        <div @click="expendDirect()" class="click-area">
                            <span class="direct-title">直接代理：<span>{{firstList.length}}</span>人</span>
                            <i :class="checked?'el-icon-caret-bottom':'el-icon-caret-top'"></i>
                        </div>
                        <div v-show="checked">
                            <div>
                                <div v-for="(direct,index) in firstList">
                                    <div class="direct-item" @click="toDetail(direct.id)">
                                        <img v-if="direct.headImg" :src="direct.headImg" alt="">
                                        <img v-else src="../../../../assets/images/logo.png" alt="">
                                        <span>用户名：{{direct.nickname}}</span>
                                        <span>用户ID：{{direct.id}}</span><span>授权号：{{direct.code}}</span>
                                    </div>
                                    <div @click="expendIndirect(index)" class="click-area">
                                        <span class="direct-title">间接代理：<span>{{direct.secCount?direct.secCount:0}}</span>人</span>
                                        <i :class="direct.checked?'el-icon-caret-bottom':'el-icon-caret-top'"></i>
                                    </div>
                                    <div v-show="direct.checked">
                                        <!--间接代理-->
                                        <div v-for="indirect in direct.secList" class="indirect-area"
                                             @click="toDetail(indirect.id)">
                                            <span>用户名：{{indirect.nickname}}</span>
                                            <span>用户ID：{{indirect.id}}</span><span>授权号：{{indirect.code}}</span>
                                        </div>
                                    </div>
                                    <!--</div>-->
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import vBreadcrumb from '../../../common/Breadcrumb.vue';
    import icon from '../../../common/ico.vue';
    import * as api from '../../../../api/api';
    import * as pApi from '../../../../privilegeList/index.js';
    import request from '@/http/http';

    export default {
        components: {
            vBreadcrumb, icon
        },
        data() {
            return {
                form: {
                    id: '',
                    name: '',
                    code: '',
                    idCard: '',
                    phone: ''
                },
                dealerAndUp: {},
                upUser: {},
                firstList: [],
                lower: {
                    totalCount: '',
                    checked: false
                },
                checked: false,
                loading: false
            };
        },
        activated() {
            this.firstList = [];
            this.lower.totalCount = '';
            this.lower.checked = false;
            this.checked = false;
            this.id = this.$route.query.memberTreeInfo;
            this.getDetail();
        },
        methods: {
            // 获取列表
            getDetail() {
                const that = this;
                const data = {
                    id: that.id
                };
                that.loading = true;
                request.findDealerTreeById(data).then(res => {
                    console.log(res);
                    res.data.userAndUp.checked = false;
                    that.dealerAndUp = res.data.userAndUp;
                    that.upUser = res.data.userDTO;
                    that.lower.totalCount = res.data.totalCount;
                    for (const i in res.data.firstList) {
                        res.data.firstList[i].checked = false;
                        for (const j in res.data.firstList[i].secList) {
                            res.data.firstList[i].secList[j].checked = false;
                        }
                        that.firstList.push(res.data.firstList[i]);
                    }
                    that.loading = false;
                }).catch(err => {
                    that.loading = false;
                    console.log(err);
                });
            },
            // 查询
            search() {

            },
            // 展开收起上级代理
            expandHigher() {
                this.dealerAndUp.checked = !this.dealerAndUp.checked;
            },
            // 展开收起下级代理
            expandLower() {
                this.lower.checked = !this.lower.checked;
            },
            // 展开收起直接代理
            expendDirect() {
                this.checked = !this.checked;
            },
            // 展开收起直接代理
            expendIndirect(index) {
                this.firstList[index].checked = !this.firstList[index].checked;
            },
            // 跳到详情页
            toDetail(id) {
                localStorage.setItem('memberDetail', id);
                this.$router.push({ path: '/memberDetail', query: { id: id }});
            }
        }
    };
</script>

<style lang="less">
    .tree-block {
        padding: 20px 60px;
        background: #fff;
        width: auto;
        i {
            color: #999;
        }
        .first-area .el-collapse-item__header {
            width: 100px;
        }
        .el-collapse {
            border: none
        }
        .el-collapse-item__content {
            padding-bottom: 0
        }
        .count-area {
            margin: 0 10px
        }
        .line {
            border-top: 1px solid #dfdfdf;
        }
        .jump {
            cursor: pointer
        }
        .first-child {
            display: flex;
            padding: 10px 0;
            .img-area {
                float: left;
                width: 80px;
                img {
                    width: 60px;
                    height: 60px;
                    border-radius: 4px;
                    border: 2px solid #dfdfdf
                }
            }
            .tree-detail-area {
                float: left;
                /*margin-top: 10px;*/
                color: #666;
                font-size: 14px;
                line-height: 30px;
                span {
                    margin-left: 10px
                }
            }
        }
        .click-area {
            cursor: pointer;
            line-height: 40px;
        }
        .direct-area {
            font-size: 14px;
            color: #999999;
            margin-left: 20px;
            img {
                width: 40px;
                height: 40px;
                border-radius: 4px;
                border: 2px solid #dfdfdf;
                vertical-align: middle;
            }
            .direct-item {
                /*width: 460px;*/
                height: 60px;
                line-height: 60px;
                border-radius: 5px;
                border: 1px solid #dfdfdf;
                padding: 0 30px;
                margin: 0 10px 10px;
                span {
                    margin: 0 20px;
                }
                display: inline-block;
                cursor: pointer;
            }
            .click-area {
                display: inline-block;
                margin-left: 10px
            }
            .indirect-area {
                width: 520px;
                height: 40px;
                line-height: 40px;
                border-radius: 5px;
                border: 1px solid #dfdfdf;
                margin: 0 10px 10px 30px;
                span {
                    margin: 0 20px;
                }
                cursor: pointer;
            }
        }
    }

</style>
