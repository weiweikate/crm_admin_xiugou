<template>
    <div>
        <v-breadcrumb :nav="['服务管理','公告/通知','公告/通知详情']"></v-breadcrumb>
        <div class="container">
            <div class="inf-box">
                <div style="margin: -30px 0 20px 80px">
                    <div class="tab-item" :class="checked[0]?'checked':''">公告</div>
                    <div class="tab-item" :class="checked[1]?'checked':''" style="margin-left: -5px">
                        通知
                    </div>
                </div>
                <el-form :model="form" ref="form" v-loading="loading">
                    <el-form-item prop="title" v-if="checked[0]">
                        <span class="label"><span class="required">*</span>公告标题</span>
                        <el-input placeholder="请输入公告标题" disabled="" v-model="title"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <span class="label" v-if="checked[0]"><span class="required">*</span>公告详情</span>
                        <span class="label" v-else><span class="required">*</span>通知详情</span>
                        <template>
                            <el-input type="textarea" class="detail-content" maxlength="180" disabled="" v-model="form.content" placeholder="请输入"></el-input>
                        </template>
                    </el-form-item>

                    <el-form-item label="推送方式" style="position: relative">
                        <el-radio-group v-model="form.pushType" disabled="">
                            <el-radio label="1" value="1">即时推送</el-radio>
                            <el-radio label="2" value="2">定时推送</el-radio>
                        </el-radio-group>
                        <el-date-picker
                                v-model="date"
                                type="datetime"
                                disabled=""
                                format="yyyy-MM-dd HH:mm:ss"
                                placeholder="选择日期时间">
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
                    </el-form-item>
                    <el-form-item label="推送区域" class="region-area">
                        <el-radio-group v-model="form.pushCountry" disabled="">
                            <el-radio label="1" value="1">全国</el-radio>
                            <el-radio label="2" value="2">国外</el-radio>
                        </el-radio-group>
                        <div class="el-cascader" v-if="form.pushCountry==3">
                            <region @regionMsg='getRegion' :regionMsg='address' :isDisabled="true"></region>
                        </div>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>

</template>
<script>
    import icon from '@/components/common/ico';
    import vBreadcrumb from '@/components/common/Breadcrumb.vue';
    import Quill from 'quill';
    import * as api from '@/api/api';
    import moment from 'moment';
    import region from '@/components/common/Region';
    import request from '@/http/http.js';
    import xss from 'xss';
    export default {
        components: {
            vBreadcrumb, icon, region
        },
        data() {
            return {
                checked: [true, false],
                title: '', //   标题
                form: {
                    type: 100, //   100:公告   200：通知
                    content: '', //   内容
                    pushType: '1', //   1：即时推送  2：定时推送
                    pushWay: '', //   推送人群
                    pushCountry: '', //   1：全国 2：国外 3：定省
                    provinceId: '', //   省
                    cityId: '', //   市
                    areaId: '', //   区
                    createAdmin: '', //   发布人
                    original_img: '',
                    small_img: '',
                    name: ''
                },
                imageUrl: '',
                date: '',
                loading: false,
                checkAll: false,
                checkedUsers: [],
                users: [],
                isIndeterminate: false,
                content: '', // 文章内容
                id: '',
                address: ''
            };
        },
        created() {
        },
        activated() {
            this.id =
                this.$route.query.id ||
                JSON.parse(sessionStorage.getItem('noticeInformDetail').id);
            this.getDetail();
        },
        methods: {
            // 获取详情
            getDetail() {
                const that = this;
                const data = {
                    id: that.id
                };
                that.loading = true;
                request.queryNoticeById(data).then(res => {
                    that.form = res.data;
                    that.title = res.data.title;
                    that.form.content = xss(that.form.content);
                    if (res.data.type == 100) {
                        that.checked = [true, false];
                    } else {
                        that.checked = [false, true];
                    }
                    request.getUserLevelList({}).then(resData => {
                        let count = 0;
                        // const arr = res.data.push_way.split(',');
                        // for (const i in resData.data.data) {
                        //     const name = resData.data.data[i].name;
                        //     if (that.users.indexOf(name) == -1) {
                        //         that.users.push(name);
                        //     }
                        //     for (const j in arr) {
                        //         if (arr[j] == resData.data.data[i].id) {
                        //             count++;
                        //             if (that.checkedUsers.indexOf(name) == -1) {
                        //                 that.checkedUsers.push(name);
                        //             }
                        //         }
                        //     }
                        // }
                        // if (count == resData.data.length) {
                        //     that.checkAll = true;
                        //     that.isIndeterminate = false;
                        // }
                    })
                        .catch(err => {
                            console.log(err);
                        });

                    that.date = res.data.order_time ? moment(res.data.order_time).format('YYYY-MM-DD HH:mm:ss') : '';
                    that.loading = false;
                })
                    .catch(err => {
                        that.loading = false;
                    });
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
            margin-left: 112px;
        }
        .el-radio {
            display: block;
            margin-left: 0;
            line-height: 32px;
        }
        .el-date-editor {
            position: absolute;
            top: 32px;
            left: 210px;
            .el-input__inner {
                width: 200px;
            }
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


