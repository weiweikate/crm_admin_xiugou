<template>
    <div class="found-cate">
        <v-breadcrumb :nav="nav"></v-breadcrumb>
        <el-card>
            <el-form ref="form" :model="form" inline >
                <el-form-item prop="code" label="编号">
                    <el-input v-model="form.code"></el-input>
                </el-form-item>
                <el-form-item prop="userName" label="绑定发布者">
                    <el-input v-model="form.userName"></el-input>
                </el-form-item>
                <el-form-item prop="time" label="发布时间">
                    <el-date-picker v-model="time" type="datetimerange" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
                </el-form-item>
                <el-form-item prop="adminName" label="发布人">
                    <el-input v-model="form.adminName"></el-input>
                </el-form-item>
                <el-form-item label=" ">
                    <el-button type="primary" @click="getList">查询</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card style="margin-top: 10px">
            <el-button type="primary" style="margin-bottom: 10px" @click="$router.push('addFound')">新建发现文章</el-button>
            <el-table v-loading="tabLoading" :data="tableData" border stripe @sort-change="sortChange">
                <el-table-column prop="code" label="编号" align="center"></el-table-column>
                <el-table-column prop="pureContent" label="内容" align="center">
                    <template slot-scope="scope">
                        <div class="over-hidden" :title="scope.row.pureContent">
                            {{scope.row.pureContent}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="nickName" label="绑定发布者" align="center"></el-table-column>
                <el-table-column prop="click" label="浏览量" sortable align="center">
                    <template slot-scope="scope">
                        {{scope.row.click?scope.row.click:'0'}}
                    </template>
                </el-table-column>
                <el-table-column prop="collect" label="收藏数" sortable align="center">
                    <template slot-scope="scope">
                        {{scope.row.collect?scope.row.collect:'0'}}
                    </template>
                </el-table-column>
                <el-table-column prop="praise" label="点赞数" sortable align="center">
                    <template slot-scope="scope">
                        {{scope.row.praise?scope.row.praise:'0'}}
                    </template>
                </el-table-column>
                <el-table-column label="推广入口" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.generalize == 1">精选</span>
                        <span v-else-if="scope.row.generalize == 2">热门</span>
                        <span v-else-if="scope.row.generalize == 3">推荐</span>
                        <span v-else>/</span>
                    </template>
                </el-table-column>
                <el-table-column label="发布时间/发布人" align="center">
                    <template slot-scope="scope">
                        <span>{{scope.row.createTime | formatDateAll}}</span><br>
                        <span>{{scope.row.adminName}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="id" label="操作" align="center" min-width="150px">
                    <template slot-scope="scope">
                        <el-button type="primary" @click="showInfo(scope.row)">查看</el-button>
                        <el-button type="warning" @click="editFound(scope.row)">编辑</el-button>
                        <el-button @click="delItem(scope.$index,scope.row.id)" type="danger">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="block">
                <el-pagination
                    background
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="page.currentPage"
                    :page-size="page.pageSize"
                    layout="total, prev, pager, next, jumper"
                    :total="page.totalPage">
                </el-pagination>
            </div>
        </el-card>
        <!--删除弹窗-->
        <delete-toast :id='delId' :url='delUrl' :uri='delUri' @msg='deleteToast' v-if="isShowDelToast"></delete-toast>
    </div>
</template>

<script>
    import vBreadcrumb from '@/components/common/Breadcrumb.vue';
    import deleteToast from '@/components/common/DeleteToast';
    import utils from '@/utils/index';
    import { myMixinTable } from '@/JS/commom';
    import request from '@/http/http';
    export default {
        mixins: [myMixinTable],
        components: { vBreadcrumb, deleteToast },
        data() {
            return {
                nav: ['运营管理', '发现管理', '发现列表'],
                tableData: [],
                tabLoading: false,
                form: {
                    code: '',
                    userName: '',
                    beginTime: '',
                    endTime: ''
                },
                time: [],
                isShowDelToast: false,
                delId: '',
                delUrl: '',
                delUri: ''
            };
        },
        activated() {
            this.getList();
        },
        methods: {
            // 获取文章列表
            getList() {
                if (!this.time) this.time = [];
                this.form.beginTime = this.time.length != 0 ? utils.formatTime(this.time[0]) : '';
                this.form.endTime = this.time.length != 0 ? utils.formatTime(this.time[1]) : '';
                const data = {
                    ...this.form,
                    page: this.page.currentPage,
                    pageSize: this.page.pageSize
                };
                this.tabLoading = true;
                request.queryDiscoverArticlePageList(data).then(res => {
                    this.tabLoading = false;
                    this.tableData = res.data.data;
                    this.page.totalPage = res.data.totalNum;
                }).catch(err => {
                    this.tabLoading = false;
                    console.log(err);
                });
            },
            // 排序
            sortChange({ column, prop, order }) {
                delete this.form['clickRank'];
                delete this.form['collectRank'];
                delete this.form['praiseRank'];
                if (prop) {
                    this.form[`${prop}Rank`] = order === 'ascending' ? 'asc' : 'desc';
                }
                this.getList();
            },
            // 编辑
            editFound(row) {
                sessionStorage.setItem('foundId', row.id);
                this.$router.push({ name: 'addFound', query: { 'foundId': row.id }});
            },
            // 查看详情
            showInfo(row) {
                sessionStorage.setItem('foundInfoId', row.id);
                this.$router.push({ name: 'articalInfo', query: { 'foundInfoId': row.id }});
            },
            // 删除
            delItem(index, id) {
                this.delId = id;
                this.delUrl = 'deleteDiscoverArticleById';
                this.isShowDelToast = true;
            },
            // 删除弹窗
            deleteToast(msg) {
                this.isShowDelToast = msg;
                this.getList(this.page.currentPage);
            }
        }
    };
</script>

<style lang="less" scoped>
    .found-cate{
        img {
            width: 50px;
            height: 50px;
            border-radius: 5px;
        }
        .block {
            float: right;
            margin: 10px 0;
        }
    }
</style>
