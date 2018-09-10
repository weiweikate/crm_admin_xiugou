<template>
    <div>
        <v-breadcrumb :nav="['经销商会员管理','经销商加盟管理','邀请发起']"></v-breadcrumb>
        <div class="send-invite">
            <div class="box">
                <div class="mask-content">
                    <el-form :model="form">
                        <div class="title-item">邀请层级</div>
                        <el-form-item>
                            <div class="level-area" v-for="(item,index) in levelList" @click="checkLevel(index,item.id)"
                                 :class="num==index?'checked':''">
                                <div class="upper">
                                    <icon class="icon" ico="icon-zhucedengluyonghuming"></icon>
                                    <div>{{item.name}}</div>
                                </div>
                                <div class="downer">已有人数：{{item.dealerNum}}</div>
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
                        <!--<div class="title-item">授权渠道</div>-->
                        <!--<el-form-item>-->
                            <!--&lt;!&ndash;<el-tabs v-model="activeName" type="card" @tab-click="handleClick">-->
                                <!--<el-tab-pane :label="item.name" :name="index" v-for="(item,index) in tabList">{{item.name}}</el-tab-pane>-->
                                <!--&lt;!&ndash;<el-tab-pane label="配置管理" name="second">配置管理</el-tab-pane>&ndash;&gt;-->
                                <!--&lt;!&ndash;<el-tab-pane label="角色管理" name="third">角色管理</el-tab-pane>&ndash;&gt;-->
                                <!--&lt;!&ndash;<el-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</el-tab-pane>&ndash;&gt;-->
                            <!--</el-tabs>&ndash;&gt;-->
                            <!--<div>-->
                                <!--<div class="tab-area">-->
                                    <!--<div class="tab-item" v-for="(item,index) in tabList" @click='changeTab(index,item.id)'-->
                                         <!--:class="tabNum==index?'tab-checked':''">{{item.name}}-->
                                    <!--</div>-->
                                <!--</div>-->
                                <!--<div class="select-area" v-for="(item,index) in tabList" v-if="tabNum==index">-->
                                    <!--<el-checkbox :indeterminate="item.isIndeterminate" v-model="item.checkAll"-->
                                                 <!--@change="handleCheckAllChange(item)">全选-->
                                    <!--</el-checkbox>-->
                                    <!--<el-checkbox-group v-model="item.checkedList"-->
                                                       <!--@change="handleCheckedListChange(item)">-->
                                        <!--<el-checkbox v-for="(childItem,ChildIndex) in item.statusONList"-->
                                                     <!--@change="changeChecked(childItem)" v-model="childItem.checked"-->
                                                     <!--:label="childItem" :key="ChildIndex">-->
                                            <!--{{childItem.name}}-->
                                        <!--</el-checkbox>-->
                                    <!--</el-checkbox-group>-->
                                <!--</div>-->
                            <!--</div>-->

                            <!--<div class="select-area" style="margin-top: 10px">-->
                                <!--<div style="margin: 0 10px;">已选择渠道</div>-->
                                <!--<div class="tag-area">-->
                                    <!--<el-tag-->
                                            <!--:key="item.name"-->
                                            <!--v-for="item in checkedList"-->
                                            <!--:disable-transitions="false"-->
                                    <!--&gt;-->
                                        <!--{{item.name}}-->
                                    <!--</el-tag>-->
                                <!--</div>-->
                            <!--</div>-->
                        <!--</el-form-item>-->
                        <!--<div class="title-item">授权品牌</div>-->
                        <!--<el-form-item>-->
                            <!--<v-choosearea @productcIds="productcIds" @brandsId="brandsId" v-model="form.productcIds"-->
                                          <!--:isLevel="true"></v-choosearea>-->
                            <!--<div class="clearfix"></div>-->
                        <!--</el-form-item>-->
                        <!--<div class="title-item">授权时间</div>-->
                        <!--<el-form-item class="time-area">-->
                            <!--<el-date-picker-->
                                    <!--v-model="form.date"-->
                                    <!--type="datetimerange"-->
                                    <!--format="yyyy-MM-dd"-->
                                    <!--start-placeholder="请选择授权开始时间"-->
                                    <!--end-placeholder="请选择授权结束时间"-->
                            <!--&gt;-->
                            <!--</el-date-picker>-->
                        <!--</el-form-item>-->
                        <!--<div class="clearfix"></div>-->
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
                    <el-button type="primary" v-loading="btnLoading" @click="submitForm('form')">确认保存</el-button>
                    <el-button @click="cancle">取消</el-button>
                </div>
            </div>
        </div>
    </div>

</template>
<script>
    import icon from '../../../common/ico';
    import vBreadcrumb from '../../../common/Breadcrumb.vue';
    import * as api from '../../../../api/api';
    import vChoosearea from '../../../common/chooseBrand.vue';
    import moment from 'moment';
    import * as pApi from '../../../../privilegeList/index.js';

    export default {
        components: {
            vBreadcrumb, icon, vChoosearea
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
                // checkAll: false,
                checkedList: [], // 选择的渠道
                statusONList: [], // 渠道二级
                tabList: [{
                    name: '线上',
                    id: 1,
                    isIndeterminate: false,
                    checkAll: false,
                    checkedList: [],
                    statusONList: [{
                        name: '京东',
                        id: 3,
                        checked: false
                    }, {
                        name: '天猫',
                        id: 4,
                        checked: false
                    }]
                }, {
                    name: '线下',
                    id: 2,
                    isIndeterminate: false,
                    checkAll: false,
                    checkedList: [],
                    statusONList: [{
                        name: '超市',
                        id: 5,
                        checked: false
                    }, {
                        name: '便利店',
                        id: 6,
                        checked: false
                    }]
                }], // 渠道一级
                // isIndeterminate: false,
                isUpdateUperMask: false,
                levelList: [], // 邀请层级
                num: -1, // 选择的层级
                tabNum: 0, // 渠道选项卡
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
            const that = this;
            that.form = {};
            that.num = -1;
            that.getLevelList();// 加载邀请层级列表
            // that.getStatusONList();//加载授权渠道列表
        },
        methods: {
            productcIds(productcIds) {
                this.form.categorys = productcIds.join(',');
                console.log(this.form.categorys);
            },
            brandsId(brandsId) {
                this.form.brands = brandsId.join(',');
                console.log(this.form.brands);
            },
            // 推送方式
            changeStyle() {
                if (this.form.invalidType == 1) {
                    this.dateDisabled = true;
                } else {
                    this.dateDisabled = false;
                }
            },
            // 获取邀请层级列表
            getLevelList() {
                const that = this;
                const data = {};
                that.$axios
                    .post(api.getLevelListWithDealerCount, data)
                    .then(res => {
                        if (res.data.code == 200) {
                            that.levelList = res.data.data;
                        } else {
                            that.$message.warning(res.data.msg);
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            },
            // 选择邀请层级
            checkLevel(index, id) {
                this.num = index;
                this.form.levelId = id;
            },
            // 获取授权渠道列表
            // getStatusONList() {
            //     let that = this;
            //     let data = {};
            //     that.$axios
            //         .post(api.getStatusONList, data)
            //         .then(res => {
            //             if (res.data.code == 200) {
            //                 for (let i in res.data.data) {
            //                     res.data.data[i].checkAll = false;
            //                     res.data.data[i].isIndeterminate = false;
            //                     res.data.data[i].statusONList = [];
            //                     res.data.data[i].checkedList = [];
            //                 }
            //                 that.tabList = res.data.data;
            //                 console.log(that.tabList)
            //                 let tabId = res.data.data[0].id;
            //                 // that.getStatusONListById(0, tabId)
            //             } else {
            //                 that.$message.warning(res.data.msg);
            //             }
            //         })
            //         .catch(err => {
            //             console.log(err)
            //         })
            // },
            // getStatusONListById(index, id) {
            //     let that = this;
            //     let data = {
            //         fatherid: id
            //     };
            //     that.$axios
            //         .post(api.getStatusONList, data)
            //         .then(res => {
            //             if (res.data.code == 200) {
            //                 for (let i in res.data.data) {
            //                     res.data.data.checked = false;
            //                     let tempList = {
            //                         parentId: id,
            //                         statusONList: res.data.data
            //                     };
            //                     for (let i in that.statusONList) {
            //                         if (that.statusONList[i] && that.statusONList[i].indexOf(id) == -1) {
            //                             that.tabList[index].statusONList.push(tempList)
            //                         }
            //                     }
            //                 }
            //             } else {
            //                 that.$message.warning(res.data.msg);
            //             }
            //         })
            //         .catch(err => {
            //             console.log(err)
            //         })
            // },
            //  取消弹窗
            // 取消
            cancle() {
                this.$router.push('/joinManage');
            },
            // 渠道选项卡
            // changeTab(index, id) {
            //     this.tabNum = index;
            //     // this.getStatusONListById(id)
            // },
            // 全选
            // handleCheckAllChange(item) {
            //     let that = this;
            //     item.checkAll = !item.checkAll;
            //     item.checkedList = item.checkAll ? item.statusONList : [];
            //     if (item.checkAll) {
            //         for (let i in item.statusONList) {
            //             let id = item.statusONList[i].id;
            //             if (that.form.channels.indexOf(id) == -1) {
            //                 that.form.channels.push(id)
            //             }
            //         }
            //     } else {
            //         for (let i in item.statusONList) {
            //             let id = item.statusONList[i].id;
            //             for (let j in that.form.channels) {
            //                 if (id == that.form.channels[j].id) {
            //                     that.form.channels = that.form.channels.splice(j, 1)
            //                 }
            //             }
            //         }
            //     }
            //     item.isIndeterminate = false;
            // },
            // 列表
            // handleCheckedListChange(item) {
            //     let checkedCount = 0;
            //     for (let i in item.statusONList) {
            //         if (item.statusONList[i].checked) {
            //             checkedCount++;
            //         }
            //     }
            //     item.checkAll = checkedCount === item.statusONList.length;
            //     item.isIndeterminate = checkedCount > 0 && checkedCount < item.statusONList.length;
            // },
            // changeChecked(childItem) {
            //     let that = this;
            //     childItem.checked = !childItem.checked;
            //     if (childItem.checked) {
            //         let id = childItem.id;
            //         if (that.form.channels.indexOf(id) == -1) {
            //             that.form.channels.push(id)
            //         }
            //     } else {
            //         for (let i in that.form.channels) {
            //             if (id == that.form.channels[i].id) {
            //                 that.form.channels = that.form.channels.splice(i, 1)
            //             }
            //         }
            //     }
            // },
            // 提交表单
            submitForm() {
                const that = this;
                const data = {};
                data.levelId = that.form.levelId;
                data.inviteType = that.form.inviteType;
                data.invalidType = that.form.invalidType;
                if (that.form.invalidType == 1) {
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
                if (that.form.invalidType == 1 && !data.clickTimes) {
                    that.$message.warning('请输入链接打开次数!');
                    return;
                }
                if (!data.invalidType) {
                    that.$message.warning('请设置邀请有效期!');
                    return;
                }
                if (that.form.invalidType == 2 && !data.invalidTime) {
                    that.$message.warning('请设置失效时间!');
                    return;
                }
                data.url = pApi.addInvite;
                that.btnLoading = true;
                this.$axios
                    .post(api.addInvite, data)
                    .then(res => {
                        that.btnLoading = false;
                        if (res.data.code == 200) {
                            that.$message.success(res.data.msg);
                            setTimeout(function() {
                                that.$router.push('/joinManage');
                            }, 1000);
                        } else {
                            that.$message.warning(res.data.msg);
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        that.btnLoading = false;
                    });
                // } else {
                //     console.log("error submit!!");
                //     that.btnLoading = false;
                //     return false;
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


