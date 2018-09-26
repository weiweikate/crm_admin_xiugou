<template>
    <div>
        <v-breadcrumb :nav="['经销商会员管理','经销商加盟管理','邀请详情']"></v-breadcrumb>
        <div class="container" v-loading="loading">
            <div class="basic-inf-area line">
                <div class="item-row">
                    邀请层级：{{detail.levelName}}
                </div>
                <div class="item-row">
                    类型：
                    <span v-if="detail.invite_type==1">网信经销商</span>
                    <span v-if="detail.invite_type==2">供货经销商</span>
                    <span v-if="detail.invite_type==3">网红经销商</span>
                </div>
                <div class="item-row" v-if="detail.invalid_type==1">
                    邀请链接打开次数：
                    {{detail.click_times}}
                </div>
                <div class="item-row" v-else>
                    邀请失效期：
                    {{detail.invalid_time|formatDate}}
                </div>

                <div class="item-row">
                    邀请管理员：
                    {{detail.adminName}}
                </div>
                <div class="item-row">
                    邀请时间：
                    {{detail.create_time|formatDate}}
                </div>

            </div>
            <div class="basic-inf-area">
                <div class="title">
                    邀请成功：
                </div>
                <div v-if="list.length>0">
                    <div class="succ-item" v-for="item in list">
                        <div class="left">
                            <img v-if="item.head_img" :src="item.head_img" alt="">
                            <img v-else src="../../../../assets/images/logo.png" alt="">
                        </div>
                        <div class="center">
                            <div>{{item.nickname}}</div>
                            <div>{{item.levelName}}</div>
                        </div>
                        <div class="right">
                            <div>联系方式：{{item.phone}}</div>
                            <div class="color-blue" @click="toUserDetail(item)">用户详情 》</div>
                        </div>
                        <div class="clearfix"></div>
                    </div>
                </div>
                <div v-else>
                    暂无数据~
                </div>
            </div>
            <div style="margin:50px">
                <el-button type="primary" @click="backToList">返回列表</el-button>
            </div>
        </div>
    </div>
</template>

<script>
    import vBreadcrumb from '../../../common/Breadcrumb.vue';
    import icon from '../../../common/ico.vue';
    import * as api from '../../../../api/api';
    export default {
        components: {
            icon, vBreadcrumb
        },
        data: function() {
            return {
                detail: {},
                id: '',
                loading: false,
                list: ''
            };
        },
        activated() {
            this.id =
                this.$route.query.id ||
                JSON.parse(sessionStorage.getItem('inviteDetail').id);
            this.getDetail();
        },
        methods: {
            // 获取详情
            getDetail() {
                const that = this;
                const data = {
                    id: that.id
                };
                that.$axios
                    .post(api.findInviteInfo, data)
                    .then(res => {
                        if (res.data.code == 200) {
                            that.loading = false;
                            that.detail = res.data.data.invite;
                            that.list = res.data.data.list;
                            console.log(that.list);
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
            // 返回列表
            backToList() {
                this.$router.push('/joinManage');
            },
            // 跳到用户详情页面
            toUserDetail(item) {
                localStorage.setItem('memberDetail', item.id);
                this.$router.push({ path: '/memberDetail', query: { id: item.id }});
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

    .title {
        margin-bottom: 10px;
        font-size: 16px;
        color: #666
    }

    .tags-area {
        margin-top: 10px
    }

    .line {
        border-bottom: 1px solid #e2e2e2;
        margin-bottom: 20px;
    }

    .left {
        float: left;
        width: 60px;
    }

    .center {
        float: left;
        width: 100px;
    }

    .right {
        float: right;
        text-align: right;
    }

    .clearfix {
        clear: both
    }

    .item-row {
        height: 40px;
        line-height: 40px;
    }

    .color-blue {
        color: #20a0ff;
        cursor: pointer;
    }

    img {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        border: 1px solid #999;
    }

    .el-tag {
        height: 32px;
        line-height: 32px;
        margin-right: 10px;
        vertical-align: middle;
    }

    .input-new-tag {
        width: 200px
    }

    .succ-item {
        width: 370px;
        height: 52px;
        line-height: 27px;
        border-radius: 5px;
        border: 1px solid #dfdfdf;
        padding: 8px 12px;
        display: inline-block;
        margin: 0 10px 10px 0;
    }
</style>
