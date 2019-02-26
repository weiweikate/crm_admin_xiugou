<template>
    <div class="scratch-cards">
        <v-breadcrumb :nav='nav'></v-breadcrumb>
        <el-card>
            <mr-flying parentClass="content-box">
                <el-pagination
                    background
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="page.currentPage"
                    :page-size="page.pageSize"
                    layout="total, prev, pager, next, jumper"
                    :total="page.totalPage">
                </el-pagination>
            </mr-flying>
            <el-table :data="tableData" border stripe>
                <el-table-column prop="name" label="活动名称" align="center"></el-table-column>
                <el-table-column prop="type" label="活动类型" align="center">
                    <template slot-scope="scope">
                        <template v-if="scope.row.type==1">分享任务</template>
                    </template>
                </el-table-column>
                <el-table-column prop="num" label="使用数量" align="center"></el-table-column>
                <el-table-column label="绑定时间" align="center">
                    <template slot-scope="scope">{{scope.row.bindingTime|formatDateAll}}</template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button type="success" @click="watchActivity(scope.row.id)">查 看</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>
    import vBreadcrumb from '@/components/common/Breadcrumb.vue';
    import { myMixinTable } from '@/JS/commom';
    import request from '@/http/http.js';

    export default {
        mixins: [myMixinTable],
        components: { vBreadcrumb },
        data() {
            return {
                code: '',
                nav: ['运营管理', '营销工具管理', '刮刮卡', '当前活动使用'],
                tableData: []
            };
        },
        activated() {
            this.code = this.$route.query.activityUseId || sessionStorage.getItem('activityUseId');
            this.getList(this.page.currentPage);
        },
        methods: {
            getList(val) {
                const data = {
                    page: val,
                    pageSize: this.page.pageSize,
                    code: this.code
                };
                this.page.currentPage = val;
                this.tableData = [];
                request.queryByCodeList(data).then(res => {
                    this.tableData = res.data.data;
                    this.page.totalPage = res.data.totalNum;
                }).catch(err => {
                    console.log(err);
                });
            },
            watchActivity(id) {
                sessionStorage.setItem('activityCode', id);
                this.$router.push({ name: 'showCashTaskList', query: { activityCode: id }});
            }
        }
    };
</script>

<style lang="less" scoped>
    .scratch-cards{}
</style>
