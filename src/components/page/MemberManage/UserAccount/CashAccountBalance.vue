<template>
    <div>
        <breadcrumb :nav='nav'></breadcrumb>
        <el-card>
            <p class="title">{{name}}的现金账户明细</p>
            <el-table border :data="tableData">
                <el-table-column prop="serial_no" label="流水号" align="center" min-width="180"></el-table-column>
                <el-table-column label="状态" align="center" width="200">
                    <template slot-scope="scope">
                        <template v-if="scope.row.status==1">有效</template>
                        <template v-if="scope.row.status==2">冻结</template>
                        <template v-if="scope.row.status==3">删除</template>
                    </template>
                </el-table-column>
                <el-table-column prop="balance" label="金额（元）" align="center" width="200"></el-table-column>
                <el-table-column label="类型" align="center" width="200">
                    <template slot-scope="scope">
                        <template v-if="scope.row.use_type==1">店主分红</template>
                        <template v-if="scope.row.use_type==2">提现</template>
                        <template v-if="scope.row.use_type==3">分红点兑换</template>
                        <template v-if="scope.row.use_type==4">交易提成</template>
                        <template v-if="scope.row.use_type==5">消费</template>
                    </template>
                </el-table-column>
                <el-table-column label="时间" align="center" min-width="180">
                    <template slot-scope="scope" v-if='scope.row.create_time'>
                        {{scope.row.create_time|formatDate}}
                    </template>
                </el-table-column>
            </el-table>
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
        </el-card>
    </div>
</template>
<script>
    import breadcrumb from '../../../common/Breadcrumb'
    import * as api from '../../../../api/api.js';
    import * as pApi from '../../../../privilegeList/index.js';

    export default {
        components: {
            breadcrumb
        },
        data() {
            return {
                nav: ["会员管理", "经销商会员管理", "会员详情", "TA的账户", "现金账户明细"],
                tableData: [],
                page: {
                    currentPage: 1,
                    totalPage: 0
                },
                name: '杨二盟',
                tableLoading: false,
            }
        },
        activated() {
            this.id =
                this.$route.query.memberId ||
                JSON.parse(sessionStorage.getItem("memberId"));
            this.getList(this.page.currentPage);
        },
        methods: {
            // 获取数据
            getList(val) {
                let that = this;
                let data = {
                    page: val,
                    dealerId: that.id,
                    url:pApi.queryDealerAccount
                };
                that.tableLoading = true;
                that.$axios
                    .post(api.queryDetailBalanceList, data)
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
                        console.log(err);
                        that.tableLoading = false;
                    })
            },
            //分页
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
                this.page.currentPage = val;
                this.getList(val)
            },
        }
    }
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


