<template>
    <div>
        <breadcrumb :nav='nav'></breadcrumb>
        <el-card>
            <p class="title">{{name}}的秀豆账户明细</p>
            <el-table border :data="tableData" v-loading="tableLoading">
                <el-table-column prop="serialNo" label="流水号" align="center" min-width="180"></el-table-column>
                <el-table-column label="收入/支出" align="center" width="200">
                    <template slot-scope="scope">
                        <template v-if="scope.row.biType==1">收入</template>
                        <template v-else-if="scope.row.biType==2">支出</template>
                        <template v-else >-</template>
                    </template>
                </el-table-column>
                <el-table-column label="秀豆（枚）" align="center" width="200">
                    <template slot-scope="scope">
                        <template v-if="scope.row.biType==1">{{`+￥${scope.row.balance || 0}`}}</template>
                        <template v-else-if="scope.row.biType==2">{{`-￥${scope.row.balance || 0}`}}</template>
                        <template v-else >-</template>
                    </template>
                </el-table-column>
                <el-table-column label="类型" align="center" width="200">
                    <template slot-scope="scope">
                        <template v-if="scope.row.useType==1">注册赠送</template>
                        <template v-else-if="scope.row.useType==2">活动赠送</template>
                        <template v-else-if="scope.row.useType==3">商品购买抵扣</template>
                        <template v-else-if="scope.row.useType==4">兑换一元券</template>
                        <template v-else-if="scope.row.useType==5">签到</template>
                        <template v-else-if="scope.row.useType==6">任务</template>
                        <template v-else>-</template>
                    </template>
                </el-table-column>
                <el-table-column label="时间" align="center" min-width="180">
                    <template slot-scope="scope" v-if='scope.row.createTime'>
                        {{scope.row.createTime|formatDateAll}}
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
    </div>
</template>
<script>
    import breadcrumb from '@/components/common/Breadcrumb';
    import request from '@/http/http';
    import { myMixinTable } from '@/JS/commom';

    export default {
        mixins: [myMixinTable],
        components: {
            breadcrumb
        },
        data() {
            return {
                nav: ['会员管理', '经销商会员管理', '会员详情', '会员账户管理', '秀豆账户明细'],
                tableData: [],
                page: {
                    currentPage: 1,
                    totalPage: 0
                },
                name: '',
                tableLoading: false
            };
        },
        activated() {
            this.code = this.$route.query.memberAccMsg.memberCode;
            this.name = this.$route.query.memberAccMsg.nickname;
            this.getList();
        },
        methods: {
            // 获取数据
            getList() {
                const data = {
                    userCode: this.code,
                    page: this.page.currentPage,
                    pageSize: this.page.pageSize
                };
                this.tableLoading = true;
                request.queryMemBeanList(data).then(res => {
                    this.tableLoading = false;
                    this.tableData = res.data.data;
                    this.page.currentPage = res.data.currentPage;
                    this.page.totalPage = res.data.totalNum;
                }).catch(err => {
                    this.tableLoading = false;
                    console.log(err);
                });
            }
        }
    };
</script>
<style scoped>
    .title {
        margin-bottom: 20px;
    }

    .block {
        margin: 10px 0;
        float: right;
    }
</style>


