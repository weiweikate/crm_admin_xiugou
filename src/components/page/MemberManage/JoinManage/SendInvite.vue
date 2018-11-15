<template>
    <div>
        <v-breadcrumb :nav="['经销商会员管理','经销商加盟管理','邀请发起']"></v-breadcrumb>
        <div class="send-invite">
            <div class="box">
                <div class="mask-content">
                    <el-form :model="form">
                        <div class="title-item">邀请层级</div>
                        <el-form-item>
                            <div class="level-area" v-for="(item,index) in levelList" @click="checkLevel(index,item.levelId)"
                                 :class="num==index?'checked':''">
                                <div class="upper">
                                    <icon class="icon" ico="icon-zhucedengluyonghuming"></icon>
                                    <div>{{item.name || 0}}</div>
                                </div>
                                <div class="downer">已有人数：{{item.count == null?0 : item.count}}</div>
                            </div>
                        </el-form-item>
                        <div class="title-item">邀请经销商类型</div>
                        <el-form-item>
                            <el-radio-group v-model="form.inviteType">
                                <el-radio label="1">网信经销商</el-radio>
                                <el-radio label="2">供货经销商</el-radio>
                                <el-radio label="3">网红经销商</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <div class="title-item">邀请有效期</div>
                        <el-form-item class="valid-area">
                            <el-radio-group @change="changeStyle" v-model="form.invalidType">
                                <el-radio label="1">
                                    链接打开次数
                                    <el-input class="small-inp" v-model="form.clickTimes"></el-input>
                                    次
                                </el-radio>
                                <el-radio label="2">
                                    设置失效时间
                                    <el-date-picker
                                            v-model="form.invalidTime"
                                            type="datetime"
                                            :disabled="dateDisabled"
                                            :picker-options="pickerOptions"
                                            placeholder="请选择失效时间">
                                    </el-date-picker>
                                </el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="submit-btn">
                    <el-button type="primary" :loading="btnLoading" @click="submitForm('form')">确认保存</el-button>
                    <el-button @click="cancle">取消</el-button>
                </div>
            </div>
        </div>
    </div>

</template>
<script>
    import icon from '@/components/common/ico';
    import vBreadcrumb from '@/components/common/Breadcrumb.vue';
    import vChoosearea from '@/components/common/chooseBrand.vue';
    import moment from 'moment';
    import request from '@/http/http';
    import { mapGetters } from 'vuex';

    export default {
        components: {
            vBreadcrumb, icon, vChoosearea
        },
        computed: {
            ...mapGetters([
                'user'
            ])
        },
        data() {
            return {
                form: {
                    invalidTime: '',
                    clickTimes: '',
                    levelId: '',
                    inviteType: '1',
                    invalidType: '1'
                },
                levelList: [], // 邀请层级
                num: -1, // 选择的层级
                tabId: '',
                btnLoading: false,
                dateDisabled: true,
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() < new Date() - 8.64e7;
                    }
                }
            };
        },
        activated() {
            this.form = {
                invalidTime: '',
                clickTimes: '',
                levelId: '',
                inviteType: '1',
                invalidType: '1'
            }
            this.num = -1;
            this.getLevelList();// 加载邀请层级列表
        },
        methods: {
            productcIds(productcIds) {
                this.form.categorys = productcIds.join(',');
            },
            brandsId(brandsId) {
                this.form.brands = brandsId.join(',');
            },
            // 推送方式
            changeStyle() {
                if (this.form.invalidType == '1') {
                    this.dateDisabled = true;
                } else {
                    this.dateDisabled = false;
                }
            },
            // 获取邀请层级列表
            getLevelList() {
                const data = {};
                request.queryLevelGroupUserCount({}).then(res => {
                    this.levelList = res.data;
                }).catch(err => {
                    console.log(err);
                });
            },
            // 选择邀请层级
            checkLevel(index, id) {
                this.num = index;
                this.form.levelId = id;
            },
            // 取消
            cancle() {
                this.$router.push('/joinManage');
            },
            // 提交表单
            submitForm() {
                const that = this;
                const data = {};
                data.levelId = that.form.levelId.toString();
                data.inviteType = that.form.inviteType;
                data.invalidType = that.form.invalidType;
                data.adminId = this.user.id;
                if (that.form.invalidType == '1') {
                    data.clickTimes = that.form.clickTimes;
                } else {
                    data.invalidTime = that.form.invalidTime ? moment(that.form.invalidTime).format('YYYY-MM-DD HH:mm:ss') : '';
                }
                if (!data.levelId) {
                    that.$message.warning('请选择邀请层级!');
                    return;
                }
                if (!data.inviteType) {
                    that.$message.warning('请选择经销商类型!');
                    return;
                }
                if (that.form.invalidType == '1' && !data.clickTimes) {
                    that.$message.warning('请输入链接打开次数!');
                    return;
                }
                if (that.form.invalidType == '2' && !data.invalidTime) {
                    that.$message.warning('请设置失效时间!');
                    return;
                }
                that.btnLoading = true;
                request.addInvite(data).then(res => {
                    that.$message.success(res.msg);
                    that.btnLoading = false;
                    that.$router.replace('/joinManage');
                }).catch(err => {
                    that.btnLoading = false;
                    console.log(err);
                });
            }
        }
    };
</script>
<style lang="less">
    .send-invite {
        .title-item {
            padding: 10px 0 20px
        }
        .box {
            background-color: #fff;
            border-radius: 10px;
            .mask-content {
                position: relative;
                width: 100%;
                padding: 20px 45px 30px 45px;
                box-sizing: border-box;
                .submit-btn {
                    margin-top: 30px;
                    padding-left: 225px;
                    box-sizing: border-box;
                }
            }
        }
        .el-form-item__label {
            float: none;
            text-align: left
        }
        .special .el-form-item__label {
            float: left;
            width: 80px
        }
        .el-input {
            width: 200px
        }
        .el-input__inner {
            width: 200px
        }
        .tip {
            color: #ff1e30
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
        .time-area {
            float: left;
            width: 234px
        }
        .time-area span {
            color: #999;
            margin: 0 10px 0 -20px;
        }
        .select-area {
            width: 500px;
            max-height: 150px;
            overflow-x: hidden;
            overflow-y: auto;
            border: 1px solid #eee;
            border-radius: 10px;
            margin-top: 10px;
        }
        .select-area .el-checkbox {
            margin: 0 10px 0
        }
        .select-area .el-checkbox-group {
            font-size: 12px;
            line-height: 10px
        }
        .el-tabs__content {
            display: none
        }
        .level-area {
            width: 130px;
            height: 100px;
            box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.33);
            border-radius: 5px;
            color: #999;
            display: inline-block;
            margin-right: 10px;
            cursor: pointer;
            .upper {
                text-align: center;
                /*font-size: 14px*/
            }
            .icon {
                font-size: 18px
            }
            .downer {
                padding: 0 10px;
                font-size: 12px;
                border-top: 1px solid #ddd
            }
        }
        .level-area.checked {
            background-color: #33b4ff;
            color: #fff;
            .downer {
                border-top: 1px solid #fff
            }
        }
        .valid-area {
            .el-radio-group {
                .el-radio {
                    display: block;
                    margin: 0 0 10px;
                }
                .small-inp.el-input {
                    width: 100px;
                }
                .small-inp .el-input__inner {
                    width: 100px;
                }
                .lar-inp .el-input__inner {
                    width: 180px;
                }
            }
        }
        .submit-btn {
            padding: 0 50px 20px 100px
        }
        .tab-area {
            border-bottom: 1px solid #e2e2e2;
        }
        .tab-item {
            display: inline-block;
            min-width: 100px;
            text-align: center;
            height: 40px;
            line-height: 40px;
            background-color: #ffffff;
            border-radius: 5px 5px 0 0;
            border: solid 1px #e2e2e2;
            border-bottom: none;
            margin-right: 3px;
            cursor: pointer;
        }
        .tab-checked {
            border: 1px solid #33b4ff;
        }
        .el-range-input {
            width: 200px;
        }
        .time-area .el-input__inner {
            width: 500px;
        }
        .tag-area {
            padding: 0 10px;
            .el-tag--small {
                margin-right: 5px;
            }
        }
    }
</style>


