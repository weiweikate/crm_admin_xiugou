<template>
    <div class="account-recharge">
        <v-breadcrumb :nav="['经销商会员管理','账户充值']"></v-breadcrumb>
        <transition name="move" appear>
            <el-card style="margin:10px 0 20px">
                <el-form ref="form" :inline="true" :model="form">
                    <el-form-item prop="nickname" label="会员昵称" label-width="120">
                        <el-input style="width:200px" placeholder="请输入会员昵称" v-model="form.nickname"></el-input>
                    </el-form-item>
                    <el-form-item prop="phone" label="手机号" label-width="120">
                        <el-input style="width:200px" placeholder="请输入手机号" v-model="form.phone"></el-input>
                    </el-form-item>
                    <el-form-item prop="status" label="状态" label-width="120">
                        <el-select v-model="form.status" placeholder="请选择">
                            <el-option label="全部记录" value=""></el-option>
                            <el-option label="待审核" value="0"></el-option>
                            <el-option label="已同意" value="1"></el-option>
                            <el-option label="驳回" value="2"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="date" label="时间" label-width="120">
                        <el-date-picker
                            v-model="form.date"
                            type="datetimerange"
                            format="yyyy-MM-dd"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                        >
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-button @click="getList(1)" type="primary">查询</el-button>
                        <el-button @click="resetForm('form')">重置</el-button>
                    </el-form-item>
                </el-form>
            </el-card>
        </transition>
        <div class="table-block">
            <el-button @click="recharge" type="primary" v-if="p.addRechargeRecord" style="margin-bottom: 20px">账户充值</el-button>
            <template>
                <el-table :data="tableData" :height="height" border style="width: 100%">
                    <el-table-column type="index" label="编号" width="60" align="center"></el-table-column>
                    <el-table-column prop="phone" label="手机号" align="center"></el-table-column>
                    <el-table-column prop="nickname" label="会员昵称" align="center"></el-table-column>
                    <el-table-column label="账户类型" align="center">
                        <template slot-scope="scope">
                            <template v-if="scope.row.accountType==1">现金余额账户</template>
                            <template v-if="scope.row.accountType==2">代币账户</template>
                        </template>
                    </el-table-column>
                    <el-table-column prop="rechargeBalance" label="充值金额" align="center"></el-table-column>
                    <el-table-column prop="remark" label="备注" align="center"></el-table-column>
                    <el-table-column label="充值时间" align="center">
                        <template slot-scope="scope" v-if='scope.row.createTime'>
                            <template>{{scope.row.createTime|formatDate}}</template>
                        </template>
                    </el-table-column>
                    <el-table-column prop="operator" label="操作人" align="center"></el-table-column>
                    <el-table-column prop="status" label="状态" align="center">
                        <template slot-scope="scope">
                            <template v-if="scope.row.status==0">待审核</template>
                            <template v-if="scope.row.status==1">已同意</template>
                            <template v-if="scope.row.status==2">驳回</template>
                        </template>
                    </el-table-column>
                    <el-table-column v-if="p.updateRechargeRecord" label="操作" align="center">
                        <template slot-scope="scope" v-if="scope.row.status==0">
                            <el-button type="primary" size="small"
                                       @click="updateStatus(1,scope.row)">通过
                            </el-button>
                            <el-button type="primary" size="small"
                                       @click="updateStatus(2,scope.row)">驳回
                            </el-button>

                        </template>
                    </el-table-column>
                </el-table>
            </template>
            <div class="block">
                <el-pagination
                    background
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="page.currentPage"
                    layout="total, prev, pager, next, jumper"
                    :total="page.totalPage">
                </el-pagination>
            </div>
        </div>
        <!--消息确认弹窗-->
        <div class="pwd-mask" v-if="tipsMask">
            <div class="box">
                <div class="mask-title">
                    <icon class="ico" ico='icon-jinggao'/>
                    温馨提示
                </div>
                <div class="mask-content">
                    <span class="del-tip">{{info}}</span>
                    <div class="del-btn-group">
                        <el-button :loading="btnLoading" @click="oprSure(true)" class="del-btn" type="danger">确认
                        </el-button>
                        <el-button @click="tipsMask=false">取消</el-button>
                    </div>
                </div>
            </div>
        </div>
        <!--账户充值弹窗-->
        <el-dialog title="账户充值" :visible.sync="addMask">
            <el-form v-model="addForm" :label-width="formLabelWidth">
                <el-form-item prop="name" label="手机号">
                    <el-input v-model="addForm.phone" @blur="findMember" auto-complete="off" placeholder="请输入用户手机号查找"></el-input>
                </el-form-item>
                <div class="detail" v-if="showDetail">
                    <div class="member-item">
                        <span class="member-title">会员编号：</span><span>{{detail.code}}</span>
                    </div>
                    <div class="member-item">
                        <span class="member-title">昵称：</span><span>{{detail.nickname}}</span>
                    </div>
                    <div class="member-item">
                        <span class="member-title">手机号：</span><span>{{detail.phone}}</span>
                    </div>
                    <div class="member-item">
                        <span class="member-title">姓名：</span><span>{{detail.realname}}</span>
                    </div>
                    <div class="member-item">
                        <span class="member-title">身份证号：</span><span>{{detail.idcard}}</span>
                    </div>
                </div>
                <el-form-item label="充值账户类型">
                    <el-select v-model="addForm.type" placeholder="请选择账户类型">
                        <el-option value="1" label="现金余额账户"></el-option>
                        <el-option value="2" label="代币账户"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="money" label="充值金额">
                    <el-input v-model="addForm.money" auto-complete="off" placeholder="请输入充值金额"></el-input>
                </el-form-item>
                <el-form-item label="备注说明" class="remark-area">
                    <el-input type="textarea" v-model="addForm.remark" auto-complete="off" placeholder="请输入备注说明"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" v-loading="btnLoading" @click="addRechargeRecord('addForm')">确定保存</el-button>
                <el-button @click="cancel">取消</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
import vBreadcrumb from '../../common/Breadcrumb.vue';
import icon from '../../common/ico.vue';
import * as api from '../../../api/api';
import moment from 'moment'
import {getList} from "../../../api/api";
import utils from '../../../utils/index.js'
import * as pApi from '../../../privilegeList/index.js';
import { myMixinTable } from '@/JS/commom';

export default {
    components: {
        vBreadcrumb, icon
    },
    mixins:[myMixinTable],
    data() {
        return {
            // 权限控制
            p: {
                addRechargeRecord: false,
                updateRechargeRecord: false,
            },

            tableData: [],
            height: '',
            tipsMask: false,
            info: '',
            formLabelWidth: '100px',
            form: {
                status: '',
                nickname: '',
                date: ''
            },
            id: '',
            btnLoading: false,
            addMask: false,
            addForm: {
                phone: '',
                money: '',
                type: '1',
                remark: ''
            },
            showDetail:false,
            detail:{},
            dealerId:'',
            opr:{
                id:'',
                status:''
            }
        }
    },
    created() {
        let winHeight = window.screen.availHeight - 520;
        this.height = winHeight;
        this.pControl();
    },
    activated() {
        this.getList(this.page.currentPage);
        this.pControl();
    },
    methods: {
        // 权限控制
        pControl() {
            for (const k in this.p) {
                this.p[k] = utils.pc(pApi[k]);
            }
        },
        //获取列表
        getList(val) {
            let that = this;
            let data = {
                page: val,
                nickname: that.form.nickname,
                phone: that.form.phone,
                status: that.form. status,
                startTime: that.form.date ? moment(that.form.date[0]).format('YYYY-MM-DD') : '',
                endTime: that.form.date ? moment(that.form.date[1]).format('YYYY-MM-DD') : '',
            };
            data.url = pApi.queryRechargeRecordPageList;
            that.tableLoading = true;
            that.$axios
                .post(api.queryRechargeRecordPageList, data)
                .then(res => {
                    if (res.data.code == 200) {
                        that.tableLoading = false;
                        that.tableData = res.data.data.data;
                        that.page.totalPage = res.data.data.resultCount;
                    } else {
                        that.$message.warning(res.data.msg);
                        that.tableLoading = false;
                    }
                })
                .catch(err => {
                    that.tableLoading = false;
                    console.log(err)
                })
        },
        //充值
        recharge() {
            this.addMask = true;
            this.addForm.phone='';
            this.addForm.money='';
            this.addForm.type='1';
            this.addForm.remark='';
            this.showDetail=false
        },
        findMember(){
            let reg=/^1[3-8]\d{9}$/;
            let that=this;
            if(!reg.test(that.addForm.phone)){
                that.$message.warning('请输入正确的手机号!');
                return
            }else{
                let data={
                    phone:that.addForm.phone,
                    // url:pApi.findDealerByPhone
                };
                that.$axios
                    .post(api.findDealerByPhone, data)
                    .then(res => {
                        if (res.data.code == 200) {
                            // this.$message.success(res.data.msg);
                            that.showDetail=true;
                            that.detail=res.data.data;
                            that.dealerId=res.data.data.id;
                        } else {
                            this.$message.warning(res.data.msg);
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            }
        },
        //账号充值
        addRechargeRecord(formName) {
            let data = {};
            data.type=this[formName].type;
            data.money=this[formName].money;
            data.dealerId=this.dealerId;
            if(!data.dealerId){
                this.$message.warning('请输入用户手机号!');
                return
            }
            if(!data.type){
                this.$message.warning('请选择充值账户类型!');
                return
            }
            if(!data.money){
                this.$message.warning('请输入充值金额!');
                return
            }
            data.remark=this[formName].remark;
            data.url=pApi.addRechargeRecord;
            this.$axios
                .post(api.addRechargeRecord, data)
                .then(res => {
                    if (res.data.code == 200) {
                        this.$message.success(res.data.msg);
                        this.addMask = false;
                        this.getList(this.page.currentPage);
                    } else {
                        this.$message.warning(res.data.msg);
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        },
        //取消
        cancel(){
            this.addMask = false;
            this.getList(this.page.currentPage)
        },
        //通过驳回
        updateStatus(num,row){
            let that=this;
            that.tipsMask=true;
            if(num==1){
                that.info='确定通过？'
            }else{
                that.info='确定驳回？'
            }
            that.opr.id=row.id;
            that.opr.status=num;
        },
        oprSure(){
            let that=this;
            let data=that.opr;
            data.url=pApi.updateRechargeRecord;
            this.$axios
                .post(api.updateRechargeRecord, data)
                .then(res => {
                    if (res.data.code == 200) {
                        this.$message.success(res.data.msg);
                        this.tipsMask = false;
                        this.getList(this.page.currentPage);
                    } else {
                        this.$message.warning(res.data.msg);
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        },
        //重置表单
        resetForm(formName) {
            this.$refs[formName].resetFields();
            this.form.date = '';
            this.getList(this.page.currentPage)
        },
    }
}
</script>

<style lang="less">
    .account-recharge {
        /*表格样式*/
        .table-block {
            padding: 20px 20px 60px;
            background: #fff
        }
        .block {
            float: right;
            margin-top: 10px
        }
        .content {
            padding: 40px 40px 0
        }
        .table-block .el-form-item {
            margin-bottom: 0 !important;
        }
        .search-area {
            margin-bottom: 20px
        }
        .search-area .el-input__inner {
            width: 160px
        }

        /*弹窗样式*/
        .el-dialog {
            width: 530px;
            border-radius: 10px
        }

        .el-dialog__header {
            border-bottom: 1px solid #eee;
            padding: 20px 20px 10px 50px
        }

        .el-dialog__title {
            color: #ff6868
        }

        .el-dialog .el-input {
            display: inline
        }

        .el-dialog .el-input__inner {
            width: 270px
        }

        .remark-area .el-input__inner {
            width: 360px
        }

        .el-dialog .el-upload--text {
            width: 100px;
            height: 40px;
            border: none
        }

        .el-input__suffix {
            line-height: 24px
        }

        .icon-uploader {
            float: right;
            margin-right: 31px;
            height: 33px
        }

        .icon-uploader .el-button--small {
            border-radius: 5px;
            width: 100px
        }

        .el-upload--text .el-icon-upload {
            line-height: 0;
            margin: 0;
            color: #fff;
            font-size: 14px
        }

        .el-dialog__footer {
            margin-right: 30px
        }

        .el-upload-list {
            display: none
        }
        .detail{
            margin: -10px 100px 10px;
            width: 250px;
            height: 120px;
            background-color: #33b4ff;
            border-radius: 5px;
            color: #fff;
            padding: 10px;
        }
        .member-title{
            display: inline-block;
        }
        .pwd-mask {
            display: flex;
            align-items: center;
            justify-content: center;
            position: fixed;
            top: 0;
            left: 0;
            z-index: 99;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.2);
            .box {
                position: relative;
                width: 530px;
                height: 305px;
                background-color: #fff;
                border-radius: 10px;
                overflow: hidden;
                .mask-title {
                    width: 100%;
                    height: 56px;
                    border-bottom: 1px solid #ccc;
                    padding-left: 45px;
                    box-sizing: border-box;
                    text-align: center;
                    line-height: 56px;
                    color: #ff6868;
                    font-weight: 700;
                    .ico {
                        position: absolute;
                        top: 16px;
                        left: 228px;
                        color: red;
                        font-size: 20px;
                    }
                }
                .mask-content {
                    position: relative;
                    width: 100%;
                    height: 248px;
                    overflow: hidden;
                    padding: 30px 45px 0 45px;
                    box-sizing: border-box;
                    .del-tip {
                        position: absolute;
                        top: 30%;
                        left: 50%;
                        transform: translateX(-50%);
                        font-size: 22px;
                    }
                    .del-btn-group {
                        width: 180px;
                        display: flex;
                        justify-content: space-between;
                        position: absolute;
                        left: 50%;
                        transform: translateX(-50%);
                        bottom: 15%;
                        .del-btn {
                            background-color: #ff6868;
                        }
                    }
                }
            }
        }
        .el-textarea__inner{
            width: 346px;
            height: 150px;
            border-radius: 5px;
            border: solid 1px #dddddd;
            resize: none;
        }
    }


</style>
