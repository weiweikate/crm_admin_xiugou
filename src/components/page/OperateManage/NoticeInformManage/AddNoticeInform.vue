<template>
    <div>
        <v-breadcrumb :nav="['服务管理','公告/通知','发布公告/通知']"></v-breadcrumb>
        <div class="container">
            <div class="inf-box">
                <div style="margin: -30px 0 20px 80px">
                    <div class="tab-item" :class="index==0?'checked':''" @click="change(0)">公告</div>
                    <div class="tab-item" :class="index==1?'checked':''" @click="change(1)" style="margin-left: -5px">
                        通知
                    </div>
                </div>
                <el-form :model="form" ref="form" :rules="rules" v-loading="loading">
                    <el-form-item prop="title" :label="info[index].name">
                        <el-input maxlength="16" v-model="form.title"></el-input>
                    </el-form-item>
                    <el-form-item prop="content" :label="info[index].detail" class="content-area">
                        <el-input type="textarea" class="detail-content" maxlength="180" @input="getContentCount" v-model="form.content" placeholder="请输入"></el-input>
                        <span class="content-count">{{count}}/180</span>
                    </el-form-item>
                    <el-form-item label="推送时间">
                        <el-date-picker
                            v-model="form.date"
                            type="datetimerange"
                            format="yyyy-MM-dd HH:mm:ss"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                        >
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="推送人群">
                        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">
                            全部用户
                        </el-checkbox>
                        <div style="margin: 15px 0;"></div>
                        <el-checkbox-group v-model="checkedUsers" @change="handleCheckedUsersChange">
                            <el-checkbox v-for="(item,index) in users" :label="item" :key="index">{{item.name}}
                            </el-checkbox>
                        </el-checkbox-group>
                        <div style="margin-left: 112px" v-if="index==0">
                            <el-checkbox v-model="notRegist">
                                未注册用户
                            </el-checkbox>
                        </div>
                        <div style="margin-left: 112px">
                            <el-checkbox v-model="newRegist">
                                新注册用户
                            </el-checkbox>
                        </div>
                    </el-form-item>
                    <el-form-item label="推送区域" prop="pushCountry" class="region-area">
                        <div style="margin-left: 112px">
                            <div v-for="(v,k) in form.provinces" :key="k">{{v.provinceName}}:{{v.cityNames}}</div>
                            <el-button type="primary" @click="chooseSendArea">选择区域</el-button>
                        </div>
                    </el-form-item>
                    <div class="submit-btn">
                        <el-button type="primary" :loading="btnLoading" @click="submitForm('form')">确认保存</el-button>
                        <el-button @click="cancel">取消</el-button>
                    </div>
                </el-form>
            </div>
        </div>
        <!--选择区域-->
        <choose-area @getArea='chooseAreaToast' :chooseData="chooseData" :preData="chooseData" :isNotice="true" v-if="isShowArea"></choose-area>
    </div>

</template>
<script>
    import icon from '@/components/common/ico';
    import vBreadcrumb from '@/components/common/Breadcrumb.vue';
    import region from '@/components/common/Region';
    import moment from 'moment';
    import utils from '@/utils/index';
    import request from '@/http/http.js';
    import * as api from '@/api/api.js';
    import chooseArea from '@/components/common/chooseArea';

    export default {
        components: {
            vBreadcrumb, icon, chooseArea
        },
        data() {
            var checkTitle = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('标题不能为空'));
                } else {
                    callback();
                }
            };
            var checkContent = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('详情不能为空'));
                } else {
                    callback();
                }
            };
            return {
                rules: {
                    title: [{ validator: checkTitle, trigger: 'blur' }],
                    content: [{ validator: checkContent, trigger: 'blur' }]
                },
                info: [{
                    name: '公告标题',
                    detail: '公告详情'
                }, {
                    name: '通知标题',
                    detail: '通知详情'
                }],
                index: 0,
                form: {
                    title: '',
                    type: 100, //   1:公告   2：通知
                    content: '', //   内容
                    date: '',
                    provinces: [],
                    effectDay: ''// 有效天数
                },
                count: 0, // 详情长度
                loading: false,
                checkAll: false,
                checkedUsers: [],
                users: [],
                isIndeterminate: false,
                id: '',
                btnLoading: false,
                dateDisabled: true,
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() < new Date() - 8.64e7;
                    }
                },
                time: '',
                notRegist: false, // 未注册用户
                newRegist: false, // 新注册用户
                isShowArea: false,
                chooseData: []
            };
        },
        created() {
        },
        activated() {
            this.formData();
            this.getLevelList();
        },
        methods: {
            formData() {
                this.form = {
                    title: '',
                    type: 100, //   1:公告   2：通知
                    content: '', //   内容
                    date: '',
                    provinces: [],
                    effectDay: ''// 有效天数
                };
                this.isIndeterminate = false;
                this.checkAll = false;
            },
            // 取消
            cancel() {
                this.$router.push('/noticeInformManage');
            },
            // 获取详情长度
            getContentCount() {
                const length = this.form.content.length;
                this.count = length;
            },
            // 推送方式
            changeStyle() {
                if (this.form.pushType == 1) {
                    this.dateDisabled = true;
                } else {
                    this.dateDisabled = false;
                }
            },
            // 获取用户层级列表
            getLevelList() {
                request.getUserLevelList({}).then(res => {
                    this.users = res.data;
                }).catch(err => {
                    console.log(err);
                });
            },
            // 推送人群选择
            handleCheckAllChange(val) {
                this.checkedUsers = val ? this.users : [];
                this.isIndeterminate = false;
                if (val) {
                    let result = '';
                    for (let i = 0; i < this.users.length; i++) {
                        result += this.users[i].id + ',';
                    }
                    this.form.userLevel = result;
                } else {
                    this.form.userLevel = '';
                }
            },
            handleCheckedUsersChange(value) {
                const checkedCount = value.length;
                let result = '';
                for (const i in this.users) {
                    for (const j in value) {
                        if (this.users[i].id == value[j].id) {
                            result += this.users[i].id + ',';
                        }
                    }
                }
                this.form.userLevel = result;
                this.checkAll = checkedCount === this.users.length;
                this.isIndeterminate = checkedCount > 0 && checkedCount < this.users.length;
            },
            // 选项卡切换
            change(num) {
                this.formData();
                this.index = num;
                this.info[num].checked = true;
                this.info[1 - num].checked = false;
                this.form.type = num == 0 ? 100 : 200;
                this.isIndeterminate = false;
                this.checkAll = false;
                this.getLevelList();
            },
            // 提交表单
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (!valid) {
                        return;
                    } else {
                        const params = this[formName];
                        if (!this.form.date.length) {
                            this.$message.warning('请选择推送时间');
                            return;
                        } else {
                            params.startTime = moment(this.form.date[0]).format('YYYY-MM-DD HH:mm:ss');
                            params.endTime = moment(this.form.date[1]).format('YYYY-MM-DD HH:mm:ss');
                        }
                        if (!params.userLevel) {
                            this.$message.warning('请选择推送人群');
                            return;
                        }
                        if (this.newRegist) {
                            params.userLevel += 'new' + '，';
                        }
                        if (this.notRegist) {
                            params.userLevel += 'no' + '，';
                        }
                        params.userLevel = params.userLevel.slice(0, -1);
                        this.btnLoading = true;
                        request.saveNotice(params).then(res => {
                            this.$message.success(res.msg);
                            this.$router.push('/noticeInformManage');
                            this.btnLoading = false;
                        }).catch(err => {
                            this.btnLoading = false;
                        });
                    }
                });
            },
            // 选择区域
            chooseSendArea() {
                this.isShowArea = true;
                this.chooseData = this.form.provinces;
            },
            // 选择区域
            chooseAreaToast(getArea) {
                this.isShowArea = false;
                if (getArea) {
                    this.form.provinces = [];
                    let includeAreaName = ''; let includeArea = '';
                    for (const i in getArea) {
                        includeAreaName += getArea[i].provinceName + ':' + getArea[i].cityNames + ',';
                        includeArea += getArea[i].provinceCode + ':' + getArea[i].cityCodes + ',';
                        const tempItem = {
                            provinceCode: getArea[i].provinceCode,
                            cityCodes: getArea[i].cityCodes,
                            provinceName: getArea[i].provinceName,
                            cityNames: getArea[i].cityNames,
                            includeAreaName: includeAreaName.slice(0, -1),
                            includeArea: includeArea.slice(0, -1)
                        };
                        this.form.provinces.push(tempItem);
                    }
                }
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
            cursor: pointer;
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
            cursor: pointer
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
            margin-left: 0 !important;
            line-height: 32px;
        }
        .send-type{
            .el-date-editor {
                position: absolute;
                top: 32px;
                left: 210px;
                .el-input__inner {
                    width: 200px;
                }
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
        .quill-editor {
            width: 800px;
        }
        .detail-content,.el-textarea__inner{
           width: 350px;
           height: 200px;
           resize: none;
           overflow: hidden;
        }
        .content-area{
            position: relative;
            .content-count{
                position: absolute;
                left: 345px;
                bottom: 0;
                color: #a5a5a5;
                display: inline-block;
                width: 100px;
                text-align: right;
            }
        }
        .el-form-item__error{
            margin-left: 110px;
        }
    }
</style>


