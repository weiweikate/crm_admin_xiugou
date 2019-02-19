<template>
    <div>
        <breadcrumb :nav='nav'></breadcrumb>
        <el-card style="margin-bottom: 10px">
            <el-form ref="form" inline :model="form" label-width="120px">
                <!--<el-form-item prop="no" label="编号">-->
                    <!--<el-input v-model="form.no"></el-input>-->
                <!--</el-form-item>-->
                <el-form-item prop="no" label="订单号">
                    <el-input v-model="form.orderNum"></el-input>
                </el-form-item>
                <el-form-item prop="time" label="完成时间">
                    <el-date-picker type="datetimerange" v-model="form.time" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
                </el-form-item>
                <el-form-item prop="no" label=" ">
                    <el-button type="primary" @click="getList(1)">搜 索</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card>
            <p class="title">{{name}}的秀值账户明细</p>
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
            <el-table border :data="tableData" v-loading="tableLoading">
                <el-table-column type="index" label="编号" align="center"></el-table-column>
                <el-table-column label="类型" align="center" width="200">
                    <template slot-scope="scope">
                        <template v-if="scope.row.recordType==1">收入</template>
                        <template v-else >-</template>
                    </template>
                </el-table-column>
                <el-table-column label="金额（元）" align="center">
                    <template slot-scope="scope">
                        <template v-if="scope.row.recordType==1">{{`+￥${scope.row.balance || 0}`}}</template>
                        <template v-else >{{`-￥${scope.row.balance || 0}`}}</template>
                    </template>
                </el-table-column>
                <el-table-column label="说明" align="center">
                    <template slot-scope="scope">
                        <template v-if="scope.row.useType==1">销售品牌奖励</template>
                        <template v-else-if="scope.row.useType==2">推广品牌奖励</template>
                        <template v-else-if="scope.row.useType==3">消费品牌奖励</template>
                        <template v-else-if="scope.row.useType==4">任务奖励</template>
                        <template v-else>-</template>
                    </template>
                </el-table-column>
                <el-table-column label="时间" align="center" min-width="180">
                    <template slot-scope="scope" v-if='scope.row.createTime'>
                        {{scope.row.createTime|formatDateAll}}
                    </template>
                </el-table-column>
            </el-table>
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
                nav: ['会员管理', '经销商会员管理', '会员详情', '会员账户管理', '秀值账户明细'],
                tableData: [],
                form: {
                    no: '',
                    orderNum: '',
                    time: ''
                },
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
            getList(val) {
                if (!this.form.time) this.form.time = [];
                const data = {
                    userCode: this.code,
                    page: val,
                    pageSize: this.page.pageSize,
                    beginTime: this.form.time.length === 0 ? '' : this.$utils.formatTime(this.form.time[0]),
                    endTime: this.form.time.length === 0 ? '' : this.$utils.formatTime(this.form.time[1])
                };
                this.tableLoading = true;
                request.queryMemshowValueList(this.$utils.trimForm(data)).then(res => {
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


