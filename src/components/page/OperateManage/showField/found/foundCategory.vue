<template>
    <div class="found-cate">
        <v-breadcrumb :nav="nav"></v-breadcrumb>
        <el-card>
            <el-form ref="form" :model="form" inline >
                <el-form-item prop="status" label="状态">
                    <el-select v-model="form.status">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="正常" value="1"></el-option>
                        <el-option label="已停用" value="0"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label=" ">
                    <el-button type="primary" @click="getList">查询</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card style="margin-top: 10px">
            <el-button type="primary" style="margin-bottom: 10px" @click="$router.push('addFoundCategory')">新建分类</el-button>
            <el-table v-loading="loading" :data="tableData" border stripe @sort-change="sortChange">
                <el-table-column type="index" label="编号" align="center"></el-table-column>
                <el-table-column label="图标" align="center">
                    <template slot-scope="scope">
                        <img :src="scope.row.icon" alt="">
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="分类" align="center"></el-table-column>
                <el-table-column prop="articleNum" label="发布秀场" sortable align="center"></el-table-column>
                <el-table-column prop="status" label="状态" align="center">
                    <template slot-scope="scope">
                        <span>{{scope.row.status == 1? '正常':'已停用'}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="id" label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.status == 0" @click="changeStatus(scope.row,'1')" type="primary">开启</el-button>
                        <el-button v-else @click="changeStatus(scope.row,'0')" type="primary">关闭</el-button>
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
    import { myMixinTable } from '@/JS/commom';
    import request from '@/http/http';
    export default {
        mixins: [myMixinTable],
        components: { vBreadcrumb, deleteToast },
        data() {
            return {
                nav: ['运营管理', '发现管理', '发布者管理'],
                tableData: [],
                loading: false,
                form: {},
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
            getList() {
                this.form.page = this.page.currentPage;
                this.form.pageSize = this.page.pageSize;
                this.loading = true;
                request.queryDiscoverCategoryPageList(this.form).then(res => {
                    this.loading = false;
                    this.tableData = res.data.data;
                    this.page.totalPage = res.data.totalNum;
                    this.page.currentPage = res.data.currentPage;
                }).catch(err => {
                    this.loading = false;
                    console.log(err);
                });
            },
            sortChange({ column, prop, order }) {
                if(order === 'ascending'){
                    this.form.rank = 'asc';
                }else{
                    this.form.rank = 'desc';
                }
                this.getList();
            },
            // 编辑
            editFound(row) {
                sessionStorage.setItem('foundId', row.id);
                this.$router.push({ name: 'addFoundCategory', query: { 'foundId': row.id }});
            },
            // 开启、关闭
            changeStatus(row, status) {
                request.updateDiscoverCategory({ id: row.id, status: status, updateType: '2' }).then(res => {
                    this.$message.success(res.msg);
                    row.status = status;
                }).catch(err => {
                });
            },
            // 删除
            delItem(index, id) {
                this.delId = id;
                this.delUrl = 'deleteDiscoverCategoryById';
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
