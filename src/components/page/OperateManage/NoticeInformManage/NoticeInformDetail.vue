<template>
    <div>
        <v-breadcrumb :nav="['服务管理','公告/通知','公告/通知详情']"></v-breadcrumb>
        <div class="container">
            <div class="inf-box">
                <div style="margin: -30px 0 20px 80px">
                    <div class="tab-item" :class="index==0?'checked':''">公告</div>
                    <div class="tab-item" :class="index==1?'checked':''" style="margin-left: -5px">
                        通知
                    </div>
                </div>
                <el-form :model="form" ref="form" v-loading="loading">
                    <el-form-item prop="title" :label="nav[index]">
                        <el-input placeholder="请输入公告标题" disabled="" v-model="form.title"></el-input>
                    </el-form-item>
                    <el-form-item :label="detail[index]">
                        <el-input type="textarea" class="detail-content" maxlength="180" disabled="" v-model="form.content" placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item label="推送时间">
                        <el-date-picker
                            v-model="form.date"
                            disabled=""
                            type="datetimerange"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                        >
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="推送人群">
                        <el-checkbox :indeterminate="isIndeterminate" disabled="" v-model="checkAll">
                            全部用户
                        </el-checkbox>
                        <div style="margin: 15px 0;"></div>
                        <el-checkbox-group v-model="checkedUsers" disabled="">
                            <el-checkbox v-for="item in users" :label="item" :key="item">{{item}}
                            </el-checkbox>
                        </el-checkbox-group>
                        <div style="margin-left: 112px" v-if="index==0">
                            <el-checkbox v-model="notRegist" disabled="">
                                未注册用户
                            </el-checkbox>
                        </div>
                        <div style="margin-left: 112px">
                            <el-checkbox v-model="newRegist" disabled="">
                                新注册用户
                            </el-checkbox>
                        </div>
                    </el-form-item>
                    <el-form-item label="推送区域" class="region-area">
                        <div style="margin-left: 112px">
                            <div v-for="(v,k) in form.provinces" :key="k">{{v.provinceName}}:{{v.cityNames}}</div>
                        </div>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="back">返回列表</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>

</template>
<script>
    import icon from '@/components/common/ico';
    import vBreadcrumb from '@/components/common/Breadcrumb.vue';
    import moment from 'moment';
    import request from '@/http/http.js';
    import utils from '@/utils/index.js';

    export default {
        components: {
            vBreadcrumb, icon
        },
        data() {
            return {
                form: {},
                loading: false,
                checkAll: false,
                checkedUsers: [],
                users: [],
                isIndeterminate: false,
                id: '',
                index: 0,
                title: '',
                notRegist: false,
                newRegist: false,
                nav: ['公告标题', '通知标题'],
                detail: ['公告详情', '通知详情']
            };
        },
        created() {
        },
        activated() {
            this.id =
                this.$route.query.noticeInformId || sessionStorage.getItem('noticeInformId');
            this.newRegist = false;
            this.notRegist = false;
            this.checkAll = false;
            this.isIndeterminate = false;
            this.users = [];
            this.checkedUsers = [];
            this.getDetail();
        },
        methods: {
            // 获取详情
            getDetail() {
                const data = {
                    id: this.id
                };
                this.loading = true;
                request.queryNoticeById(data).then(res => {
                    this.form = res.data;
                    this.form.date = [];
                    this.index = res.data.type === 100 ? 0 : 1;
                    this.form.date[0] = res.data.startTime ? moment(res.data.startTime).format('YYYY-MM-DD HH:mm:ss') : '';
                    this.form.date[1] = res.data.endTime ? moment(res.data.endTime).format('YYYY-MM-DD HH:mm:ss') : '';
                    request.getUserLevelList({}).then(resData => {
                        let count = 0;
                        const arr = res.data.userLevel.split(',');
                        for (const i in resData.data) {
                            const level = 'V' + resData.data[i].level;
                            if (this.users.indexOf(level) === -1) {
                                this.users.push(level);
                            }
                            for (const j in arr) {
                                if (utils.stringToNumber(arr[j]) === utils.stringToNumber(resData.data[i].id)) {
                                    count++;
                                    if (this.checkedUsers.indexOf(level) === -1) {
                                        this.checkedUsers.push(level);
                                    }
                                }
                                if (arr[j] === 'new') {
                                    this.newRegist = true;
                                }
                                if (arr[j] === 'no') {
                                    this.notRegist = true;
                                }
                            }
                        }
                        if (count === resData.data.length) {
                            this.checkAll = true;
                            this.isIndeterminate = false;
                        }
                    }).catch(err => {
                        console.log(err);
                    });
                    this.loading = false;
                }).catch(err => {
                    this.loading = false;
                    console.log(err);
                });
            },
            // 返回列表
            back() {
                this.$router.push('/noticeInformManage');
            }
        }
    };
</script>
<style lang="less">
    .inf-box {
        .tab-item {
            width: 116px;
            height: 50px;
            line-height: 50px;
            border-radius: 0 0 5px 5px;
            text-align: center;
            color: #fff;
            background: #dddddd;
            display: inline-block;
        }
        .checked {
            background: #ff6868;
        }
        .label {
            width: 100px;
            text-align: right;
            display: inline-block;
            margin-right: 10px;
            vertical-align: top;
        }
        .el-input {
            width: 350px
        }
        .el-input__inner {
            width: 350px
        }
        .classify-area {
            .el-input {
                width: 200px
            }
            .el-input__inner {
                width: 200px
            }
        }
        .required {
            color: #ff1e30;
            margin-right: 5px;
        }
        .el-form-item__label {
            width: 112px;
        }
        .opr-area {
            float: left;
            width: 150px;
            text-align: center;
            margin-left: -10px;
        }
        .opr-area .el-button {
            margin-top: 30px
        }
        .opr-area .el-button:nth-child(2) {
            margin-left: 0
        }
        .check-area {
            float: left;
            width: 191px;
            font-size: 12px;
            color: #999;
            border: 1px solid #dfdfdf;
            margin-right: 10px;
            border-radius: 5px;
        }
        .clearfix {
            clear: both;
            content: ''
        }
        .title {
            background: #eee;
            height: 28px;
            line-height: 28px;
            text-align: center;
            border-bottom: 1px solid #dfdfdf;
        }
        ul {
            line-height: 25px;
            height: 120px;
            overflow-y: auto;
            overflow-x: hidden
        }
        ul li {
            list-style: none;
            padding-left: 10px;
        }
        ul li.selected {
            background: #409EFF;
            color: #fff
        }

        .select-area {
            width: 500px;
            max-height: 150px;
            overflow-x: hidden;
            overflow-y: auto;
            border: 1px solid #eee;
            border-radius: 10px;
        }
        .select-area .el-checkbox {
            margin: 0 10px 0
        }
        .select-area .el-checkbox-group {
            font-size: 12px;
            line-height: 10px
        }
        .submit-btn {
            padding: 0 50px 20px 100px
        }
        .el-checkbox-group {
            margin-left: 135px;
        }
        .el-radio {
            display: block;
            margin-left: 0;
            line-height: 32px;
        }

        .el-date-editor.el-input {
            width: 200px
        }
        .region-area {
            position: relative;
            .el-checkbox {
                display: block;
                margin-left: 0;
            }
        }
        .el-cascader {
            position: absolute;
            top: -5px;
            left: 180px;
            .el-input {
                width: 150px;
            }
            .el-input__inner {
                width: 150px;
            }
        }
        .detail-content,.el-textarea__inner{
            width: 350px;
            height: 200px;
            resize: none;
            overflow: hidden;
        }
    }
</style>


