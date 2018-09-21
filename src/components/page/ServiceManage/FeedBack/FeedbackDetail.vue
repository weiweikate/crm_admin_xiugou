<template>
    <div>
        <v-breadcrumb :nav="['服务管理','问题反馈','问题详情']"></v-breadcrumb>
        <div class="container">
            <div class="feed-area" v-loading="loading">
                <div class="detail-area">
                    <div class="detail-item">
                        反馈人：{{detail.nickname}}
                    </div>
                    <div class="detail-item">
                        联系电话：{{detail.phone}}
                    </div>
                    <div class="detail-item">
                        用户层级：{{detail.levelName}}
                    </div>
                    <div class="detail-item">
                        所在区域：{{detail.address}}
                    </div>
                    <div class="detail-item">
                        反馈问题类型：
                        <el-select placeholder="请选择" v-model="detail.typeKey">
                            <el-option v-for="(v,k) in typeList" :key="k" :label="v.value" :value="v.detailId"></el-option>
                        </el-select>
                    </div>
                    <div class="detail-title">问题描述：</div>
                    <div>
                        <el-input type="textarea" disabled v-model="detail.content"></el-input>
                    </div>
                    <div class="detail-title">图片：</div>
                    <div>
                        <img v-for="(item,index) in detail.imgList" :key="index" :src="item" alt="">
                    </div>
                    <div class="detail-title">回复：</div>
                    <div>
                        <el-input type="textarea" :readonly="detail.status==2" v-model="detail.replyContent"></el-input>
                    </div>
                    <div class="detail-item">
                        处理人：{{username}}
                    </div>
                    <div style="margin-top: 30px" v-if="detail.status==1">
                        <el-button type="primary" v-loading="btnLoading" @click="update('reply')">确认回复</el-button>
                        <el-button type="success" v-loading="btnLoading" @click="update('update')">修改问题类型</el-button>
                        <el-button @click="cancel">取消</el-button>
                    </div>
                </div>
                <div v-for="(item,index) in list" :key="index">
                    <div class="feed-item" @click="expandItem(item)">
                        <div class="item" style="width: 15%">反馈人：{{item.nickname}}</div>
                        <div class="item" style="width: 18%">反馈问题类型：
                        <template>
                            <template>{{item.problemName}}</template>
                        </template>
                        </div>
                        <div class="item" style="width: 20%">反馈时间：{{item.createTime|formatDate}}</div>
                        <div class="item" style="width: 10%">状态：
                            <template>
                                <template v-if="item.status == 1">待处理</template>
                                <template v-if="item.status == 2">已处理</template>
                            </template>
                        </div>
                        <div class="item" style="width: 20%">处理时间：{{item.replyTime|formatDate}}</div>
                        <div class="item" style="width: 10%">处理人员：{{item.adminName}}</div>
                        <div class="item" style="width: 4%"><i :class="item.checked?'el-icon-caret-bottom':'el-icon-caret-top'"></i></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import vBreadcrumb from '@/components/common/Breadcrumb.vue';
    import icon from '@/components/common/ico.vue';
    import moment from 'moment';
    import utils from '@/utils/index.js';
    import { queryDictonary } from '@/JS/commom';
    import request from '@/http/http.js';

    export default {
        components: {
            vBreadcrumb, icon
        },
        mixins: [queryDictonary],
        data() {
            return {

                typeList: [], // 问题类型
                dValue: '', // 问题类型
                list: [],
                detail: {},
                id: '',
                loading: false,
                btnLoading: false,
                username: '',
                userId: '',
                item: {
                    typeKey: '1'
                },
                typeKey: '',
                replyContent: ''
            };
        },
        activated() {
            this.id =
                this.$route.query.id ||
                JSON.parse(sessionStorage.getItem('feedDetail').id);
            this.getDetail();
            this.username = localStorage.getItem('ms_username');
            this.userId = localStorage.getItem('ms_userID');
        },
        methods: {
            // 获取详情
            async getDetail() {
                const that = this;
                await this.queryDictonary('WTLX');
                that.typeList = that.tmpAxiosData;
                const data = {
                    id: that.id
                };
                that.loading = true;
                request.findFeedbackById(data).then(res => {
                    that.detail = res.data;
                    that.detail.checked = true;
                    that.detail.typeKey = res.data.typeKey;
                    that.list = res.data.historyList;
                    that.loading = false;
                }).catch(error => {
                    that.loading = false;
                });
            },
            // 展开
            expandItem(item) {
                this.id = item.id;
                this.getDetail();
            },
            // 取消
            cancel() {
                this.$router.push('/feedBack');
            },
            // 修改
            update(status) {
                const that = this;
                const params = {
                    id: that.id
                };
                if (status == 'reply') { // 回复
                    params.replyContent = that.detail.replyContent;
                    if (!params.replyContent) {
                        that.$message.warning('请输入回复内容!');
                        return;
                    }
                } else {
                    params.typeKey = that.detail.typeKey;
                }
                that.btnLoading = true;
                request.updateFeedback(params).then(res => {
                    that.btnLoading = false;
                    that.$router.push('/feedBack');
                }).catch(error => {
                    that.btnLoading = false;
                });
            }
        }
    };
</script>

<style lang="less">
    .feed-area {
        width: 100%;
        height: 100%;
        background: #fff;
        border-radius: 5px;
        border: 2px solid #e8edf0;
        font-size: 14px;
    }

    .detail-area {
        /*height: 742px;*/
        /*border-radius: 10px;*/
        /*border: solid 1px #dddddd;*/
        padding: 10px 50px 40px;
        margin: 0 10px;
        color: #666;
        font-size: 14px;
        line-height: 30px;
        .detail-title {
            color: #000;
            font-size: 16px;
        }
        img {
            width: 100px;
            height: 100px;
            border-radius: 5px;
            border: solid 2px #cacaca;
        }
        .el-textarea {
            width: 440px;
            height: 110px;
            .el-textarea__inner {
                width: 100%;
                height: 110px;
                min-height: 110px !important;
                max-height: 110px;
                resize: none
            }
        }

    }

    .feed-item {
        width: 100%;
        height: 60px;
        line-height: 60px;
        color: #666;
        cursor: pointer;
        background: #f7f7f7;
        .item {
            display: inline-block;
            text-align: center;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
    }
</style>
