<template>
    <div class="show-value-list">
        <v-breadcrumb :nav="nav"></v-breadcrumb>
        <el-card>
            <el-button type="primary" style="margin-bottom: 10px" @click="$router.push('showValueSet')">创建利润模版</el-button>
            <el-table v-loading="loading" :data="tableData" border stripe>
                <el-table-column type="index" label="编号" align="center"></el-table-column>
                <el-table-column prop="name" label="秀值分配模板名称" align="center"></el-table-column>
                <el-table-column prop="activeTime" label="启用时间" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.activeTime">{{scope.row.activeTime | formatDateAll}}</span>
                        <span v-else>-</span>
                    </template>
                </el-table-column>
                <el-table-column prop="stopTime" label="停用时间" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.stopTime">{{scope.row.stopTime | formatDateAll}}</span>
                        <span v-else>-</span>
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="状态" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status == 1">待启用</span>
                        <span v-else-if="scope.row.status == 2">启用中</span>
                        <span v-else-if="scope.row.status == 0">停用</span>
                        <span v-else>-</span>
                    </template>
                </el-table-column>
                <el-table-column prop="id" label="操作" align="center" min-width="150px">
                    <template slot-scope="scope">
                        <!--<el-button v-if="scope.row.status == '0' && scope.row.defuaultTemplate == '0'" @click="operateTpl(scope.row, '2')" type="primary">开启</el-button>-->
                        <el-button v-if="(scope.row.status == 2 || scope.row.status == '1') && scope.row.defuaultTemplate == '0'"  @click="operateTpl(scope.row, '0')" type="primary">取消启用</el-button>
                        <!--<el-button v-if="scope.row.status == '0' && scope.row.defuaultTemplate == '0'" type="warning" @click="editTpl(scope.row)">编辑</el-button>-->
                        <!--<el-button v-if="scope.row.status == '0' && scope.row.defuaultTemplate == '0'" @click="delItem(scope.$index,scope.row.id)" type="danger">删除</el-button>-->
                        <el-button type="success" @click="copyTpl(scope.row)">复制</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="block">
                <el-pagination
                    background
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :page-size="page.pageSize"
                    :current-page="page.currentPage"
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
                nav: ['秀值模块', '秀值分配设置'],
                tableData: [],
                loading: false,
                isShowDelToast: false,
                delId: '',
                delUrl: '',
                delUri: ''
            };
        },
        mounted() {
            this.getList();
        },
        methods: {
            getList() {
                this.loading = true;
                const data = {
                    page: this.page.currentPage,
                    // pageSize: this.page.pageSize
                    pageSize: 10
                };
                request.queryProfitTemplatePageList(data).then(res => {
                    this.loading = false;
                    this.tableData = res.data.data || [];
                    this.page.totalPage = res.data.totalNum;
                }).catch(err => {
                    this.loading = false;
                    console.log(err);
                });
            },
            // 启用/停用模版
            operateTpl(row, status) {
                this.$msgbox({
                    title: '提示',
                    message: '是否停用模版？',
                    showCancelButton: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    beforeClose: (action, instance, done) => {
                        if (action === 'confirm') {
                            instance.confirmButtonLoading = true;
                            request.updateProfitTemplateStatus({ id: row.id, status: status }).then(res => {
                                instance.confirmButtonLoading = false;
                                done();
                                this.$message.success(res.msg);
                                this.getList();
                            }).catch(err => {
                                instance.confirmButtonLoading = false;
                                console.log(err);
                            });
                        } else {
                            done();
                        }
                    }
                }).then(action => {}).catch(err => {});
            },
            // 复制模版
            copyTpl(row) {
                this.$router.push({ name: 'showValueSet', query: { 'showValueTplId': row.id, copy: true }});
            },
            // 编辑模版
            editTpl(row) {
                this.$router.push({ name: 'showValueSet', query: { 'showValueTplId': row.id }});
            },
            // 删除
            delItem(index, id) {
                this.delId = id;
                this.delUrl = 'deleteProfitTemplate';
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
.show-value-list{
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
