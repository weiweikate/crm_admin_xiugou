<template>
    <div class="show-value-list">
        <v-breadcrumb :nav="nav"></v-breadcrumb>
        <el-card>
            <el-button type="primary" style="margin-bottom: 10px" @click="$router.push('showValueSet')">创建利润模版</el-button>
            <el-table v-loading="loading" :data="tableData" border stripe>
                <el-table-column prop="id" label="编号" align="center"></el-table-column>
                <el-table-column prop="name" label="秀值分配模板名称" align="center"></el-table-column>
                <el-table-column prop="activeTime" label="启用时间" align="center">
                    <template slot-scope="scope" v-if="scope.row.activeTime">
                        {{scope.row.activeTime | formatDateAll}}
                    </template>
                </el-table-column>
                <el-table-column prop="stopTime" label="停用时间" align="center">
                    <template slot-scope="scope" v-if="scope.row.stopTime">
                        {{scope.row.stopTime | formatDateAll}}
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="状态" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status == 1">待启用</span>
                        <span v-else-if="scope.row.status == 2">启用中</span>
                        <span v-else>停用</span>
                    </template>
                </el-table-column>
                <el-table-column prop="id" label="操作" align="center" min-width="150px">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.status == '0'" @click="operateTpl(scope.row, '2')" type="primary">开启</el-button>
                        <el-button v-else-if="scope.row.status == 2"  @click="operateTpl(scope.row, '0')" type="primary">取消启用</el-button>
                        <el-button v-if="scope.row.status == '0'" type="warning" @click="editTpl(scope.row)">编辑</el-button>
                        <el-button v-if="scope.row.status == '0'" @click="delItem(scope.$index,scope.row.id)" type="danger">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
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
        activated() {
            this.getList();
        },
        methods: {
            getList() {
                this.loading = true;
                request.queryProfitTemplatePageList({}).then(res => {
                    this.loading = false;
                    this.tableData = res.data.data || [];
                }).catch(err => {
                    this.loading = false;
                    console.log(err);
                });
            },
            operateTpl(row, status) {
                request.updateProfitTemplateStatus({ id: row.id, status: status }).then(res => {
                    this.$message.success(res.msg);
                    this.getList();
                }).catch(err => {
                    console.log(err);
                });
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
