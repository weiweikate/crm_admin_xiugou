<template>
    <div>
        <v-breadcrumb :nav="['会员管理','会员加盟管理']"></v-breadcrumb>
            <el-card style="margin:10px 0 20px">
                <el-form ref="form" :inline="true" :model="form">
                    <el-form-item prop="initiator" label="发起人" label-width="120">
                        <el-input style="width:200px" placeholder="请输入发起人姓名" v-model="form.initiator"></el-input>
                    </el-form-item>

                    <el-form-item>
                        <el-button @click="getList(1)" type="primary">查询</el-button>
                        <el-button @click="resetForm('form')">重置</el-button>
                    </el-form-item>
                </el-form>
            </el-card>
        <div class="table-block">
            <el-button v-if="p.addInvite" @click="sendInvite" style="margin-bottom: 20px" type="primary">发起邀请</el-button>
            <template>
                <el-table v-loading="tableLoading" :data="tableData" border style="width: 100%">
                    <el-table-column prop="id" label="邀请记录编码" align="center"></el-table-column>
                    <el-table-column prop="levelName" label="邀请层级" align="center"></el-table-column>
                    <el-table-column prop="dayLogin" label="授权渠道" align="center"></el-table-column>
                    <el-table-column prop="monthLogin" label="邀请代理品牌" align="center"></el-table-column>
                    <el-table-column prop="lastLoginTime" label="邀请时间" align="center">
                        <template slot-scope="scope">{{scope.row.create_time|formatDate}}</template>
                    </el-table-column>
                    <el-table-column prop="adminUser" label="发起者" align="center"></el-table-column>
                    <el-table-column v-if="p.findInviteInfo" label="操作" align="center">
                        <template slot-scope="scope">
                            <el-button type="warning" size="small" @click="detailItem(scope.$index,scope.row)">详情</el-button>
                            <el-button type="danger" size="small" @click="watchItem(scope.$index,scope.row.id)">查看邀请</el-button>
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

    </div>
</template>

<script>
import vBreadcrumb from '../../common/Breadcrumb.vue';
import icon from '../../common/ico.vue';
import * as api from '../../../api/api';
import utils from '../../../utils/index.js'
import * as pApi from '../../../privilegeList/index.js';
import { myMixinTable } from '@/JS/commom';
export default {
    components: {
        vBreadcrumb,icon
    },
    mixins:[myMixinTable],
    data() {
        return {
            // 权限控制
            p:{
                addInvite:false,
                findInviteInfo:false
            },

            tableData:[],
            tableLoading:false,
            height:'',
            formLabelWidth:'100px',
            form:{
                initiator:''
            },
            selected:''
        }
    },
    created(){
        this.pControl();
    },
    activated(){
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
                initiator:that.form.initiator
            };
            data.url=pApi.getInvitePageList;
            that.tableLoading = true;
            that.$axios
                .post(api.getInvitePageList, data)
                .then(res => {
                    if (res.data.code == 200) {
                        that.tableLoading=false;
                        that.tableData=res.data.data.data;
                        that.page.totalPage = res.data.data.resultCount;
                    } else {
                        that.$message.warning(res.data.msg);
                        that.tableLoading=false;
                    }
                })
                .catch(err => {
                    that.tableLoading = false;
                    console.log(err)
                })
        },
        //详情
        detailItem(index,row){
            sessionStorage.setItem('inviteDetail',JSON.stringify({ id:row.id }));
            this.$router.push({path:'/inviteDetail',query:{id:row.id}})
        },
        //查看邀请
        watchItem(index,id){
            sessionStorage.setItem('inviteLink',id);
            this.$router.push({path:'/inviteLink',query:{inviteLink:id}})
        },
        //发起邀请
        sendInvite(){
            this.$router.push('/sendInvite')
        },
        //重置表单
        resetForm(formName) {
            this.$refs[formName].resetFields();
            this.getList(this.page.currentPage)
        },
    }
}
</script>

<style>

</style>
