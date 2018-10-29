<template>
    <div class="scratch-cards">
        <v-breadcrumb :nav='nav'></v-breadcrumb>
        <el-card class="mb10">
            <el-form :model="form" ref="form" inline label-width="120px">
                <el-form-item prop="code" label="编号">
                    <el-input v-model="form.code"></el-input>
                </el-form-item>
                <el-form-item prop="createUser" label="创建人">
                    <el-select v-model="form.createUser">
                        <el-option label="全部" value=""></el-option>
                        <el-option v-for="(v, k) in createUserArr" :key="k" :label="v.name" :value="v.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="createTime" label="创建时间">
                    <el-date-picker type="datetimerange" format="yyyy-MM-dd" v-model="form.createTime" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
                </el-form-item>
                <el-form-item prop="name" label="刮刮卡名称">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item prop="updateName" label="修改人">
                    <el-select v-model="form.updateUser">
                        <el-option label="全部" value=""></el-option>
                        <el-option v-for="(v, k) in createUserArr" :key="k" :label="v.name" :value="v.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="updateTime" label="修改时间">
                    <el-date-picker type="datetimerange" format="yyyy-MM-dd" v-model="form.updateTime" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
                </el-form-item>
                <el-form-item label=" ">
                    <el-button @click="getList(1)" type="primary">查 询</el-button>
                    <el-button @click="resetForm('form')" >重 置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card>
            <el-button type="primary" class="mb10" @click="$router.push('cardMange')">新增刮刮卡</el-button>
            <el-table :data="tableData" border stripe>
                <el-table-column prop="code" label="编号" align="center"></el-table-column>
                <el-table-column prop="name" label="刮刮卡名称" align="center"></el-table-column>
                <el-table-column prop="numItems" label="奖项数" align="center"></el-table-column>
                <el-table-column prop="stockNum" label="奖品发放数" align="center"></el-table-column>
                <el-table-column prop="totalSurplusNum" label="剩余数量" align="center"></el-table-column>
                <el-table-column prop="id" label="当前活动使用数" align="center">
                    <template slot-scope="scope">
                        <el-tag style="cursor: pointer" @click="showUse(scope.row)">{{scope.row.id}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="状态" align="center">
                    <template slot-scope="scope">
                        <template v-if="scope.row.status==1">正常</template>
                        <template v-if="scope.row.status==2">已暂停</template>
                    </template>
                </el-table-column>
                <el-table-column label="创建人/创建时间" align="center">
                    <template slot-scope="scope">{{scope.row.createName}}<br>{{scope.row.createTime|formatDateAll}}</template>
                </el-table-column>
                <el-table-column label="修改人/修改时间" align="center">
                    <template slot-scope="scope">{{scope.row.updateName}}<br>{{scope.row.updateTime|formatDateAll}}</template>
                </el-table-column>
                <el-table-column label="操作" width="320px">
                    <template slot-scope="scope">
                        <el-button type="primary" v-if="scope.row.status==1" @click="showTip(scope.row.code, '1')">暂停</el-button>
                        <el-button type="primary" v-if="scope.row.status==2" @click="showTip(scope.row.code, '2')">开启</el-button>
                        <el-button type="warning" @click="editCard(scope.row.id)">编辑</el-button>
                        <el-button type="success" @click="toDetail(scope.row.id)">详情</el-button>
                        <el-button type="danger" v-if="scope.row.status==1" @click="showTip(scope.row.code, '3')">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="block">
                <el-pagination
                    background
                    :page-size="page.pageSize"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="page.currentPage"
                    layout="total, prev, pager, next, jumper"
                    :total="page.totalPage">
                </el-pagination>
            </div>
        </el-card>
        <toask ref="toask"></toask>
    </div>
</template>

<script>
    import vBreadcrumb from '@/components/common/Breadcrumb.vue';
    import { myMixinTable } from '@/JS/commom';
    import toask from './components/toask';
    import request from '@/http/http.js';
    import utils from '@/utils/index.js';

    export default {
        mixins: [myMixinTable],
        components: { vBreadcrumb, toask },
        data() {
            return {
                nav: ['运营管理', '营销工具管理', '刮刮卡'],
                form: {
                    code: '',
                    createUser: '',
                    createTime: [],
                    name: '',
                    updateUser: '',
                    updateTime: []
                },
                createUserArr: [],
                tableData: []
            };
        },
        activated() {
            this.getList(1);
            this.getCreateUserList();// 加载发布人列表
        },
        methods: {
            // 获取发布人列表
            getCreateUserList() {
                request.queryAdminUserList({}).then(res => {
                    this.createUserArr = [];
                    this.createUserArr = res.data;
                }).catch(err => {
                    console.log(err);
                });
            },
            getList(val) {
                const data = {
                    page: val,
                    pageSize: this.page.pageSize,
                    code: this.form.code,
                    createUser: this.form.createUser,
                    name: this.form.name,
                    updateUser: this.form.updateUser,
                    startTime: this.form.createTime ? utils.formatTime(this.form.createTime[0], 1) : '',
                    endTime: this.form.createTime ? utils.formatTime(this.form.createTime[1], 1) : '',
                    updateStartTime: this.form.updateTime ? utils.formatTime(this.form.updateTime[0], 1) : '',
                    updateEndTime: this.form.updateTime ? utils.formatTime(this.form.updateTime[1], 1) : ''
                };
                request.queryScratchCardList(data).then(res => {
                    this.tableData = res.data.data;
                    this.page.totalPage = res.data.totalNum;
                }).catch(err => {
                    console.log(err);
                });
            },
            //   重置表单
            resetForm(formName) {
                this.$refs[formName].resetFields();
                this.getList(1);
            },
            showTip(code, val) {
                // 1: 开启 2：暂停 3：删除
                this.$refs['toask'].status = val;
                this.$refs['toask'].code = code;
                this.$refs['toask'].toask = true;
            },
            editCard(id) {
                sessionStorage.setItem('cardId', id);
                this.$router.push({ name: 'cardMange', query: { cardId: id }});
            },
            showUse(row) {
                this.$router.push({ name: 'activityUse', query: { activityUseId: row.id }});
            },
            // 详情
            toDetail(id) {
                sessionStorage.setItem('cardInfoId', id);
                this.$router.push({ name: 'cardInfo', query: { cardInfoId: id }});
            }
        }
    };
</script>

<style lang="less" scoped>
.scratch-cards{}
</style>
