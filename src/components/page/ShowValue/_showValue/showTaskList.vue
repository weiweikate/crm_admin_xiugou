<template>
    <div class="show-t-l">
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
        <el-table v-loading="loading" :data="tableData" border stripe>
            <el-table-column type="index" label="编号" align="center"></el-table-column>
            <el-table-column prop="name" label="任务名称" align="center"></el-table-column>
            <el-table-column prop="realname" label="分享任务人" align="center">
                <template slot-scope="scope" v-if="scope.row.realname">
                    <span @click="showUser(scope.row)" class="link">{{scope.row.realname}}</span>
                </template>
            </el-table-column>
            <el-table-column label="接收时间" align="center">
                <template slot-scope="scope" v-if="scope.row.createTime">
                    {{scope.row.createTime | formatDateAll}}
                </template>
            </el-table-column>
            <el-table-column prop="completeTime" label="完成时间" align="center">
                <template slot-scope="scope" v-if="scope.row.completeTime">
                    {{scope.row.completeTime | formatDateAll}}
                </template>
            </el-table-column>
            <el-table-column prop="showValue" label="秀值账户金额" align="center">
                <template slot-scope="scope" v-if="scope.row.showValue">
                    <span @click="showShareAccount(scope.row)" class="link">{{scope.row.id}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="type" label="任务类型" align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.type == 1">点击分享</span>
                    <span v-else>新加类型和我说一下</span>
                </template>
            </el-table-column>
            <el-table-column prop="shareMoney" label="本次任务秀值金" align="center"></el-table-column>
            <el-table-column prop="recieveMoney" label="已领取秀值金" align="center"></el-table-column>
            <el-table-column prop="recieveBean" label="已领取秀豆" align="center"></el-table-column>
            <el-table-column prop="shareHits" label="分享点击次数" align="center"></el-table-column>
            <el-table-column prop="status" label="状态" align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.status == 1">进行中</span>
                    <span v-else>已结束</span>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    import { myMixinTable } from '@/JS/commom';
    import request from '@/http/http';
    export default {
        props: ['status'],
        mixins: [myMixinTable],
        data() {
            return {
                tableData: [],
                loading: false,
                form: {}
            };
        },
        methods: {
            getList(val) {
                this.form.status = this.status;
                this.form.page = val;
                const data = {
                    ...this.form,
                    pageSize: this.page.pageSize
                };
                this.loading = true;
                request.userTaskQuery(data).then(res => {
                    this.loading = false;
                    this.tableData = [];
                    if (res.data) {
                        res.data.data.forEach(v => {
                            const nameArr = v.name.split(',');
                            if (nameArr[1] == -1) {
                                nameArr[1] = '无限';
                            }
                            this.tableData.push(v);
                        });
                    }
                    this.page.currentPage = res.data.currentPage;
                    this.page.totalPage = res.data.totalNum;
                }).catch(err => {
                    this.loading = false;
                    console.log(err);
                });
            },
            // 查看分享任务人
            showUser(row) {
                if (row.userId) {
                    this.$router.push({ name: 'memberDetail', query: { memberToInfo: row.userId }});
                }
            },
            // 查看秀值账户
            showShareAccount(row) {
                if (row.userId) {
                    const memberInfo = {};
                    memberInfo.memberId = row.userId;
                    memberInfo.nickname = row.realname || '';
                    sessionStorage.setItem('memberAccMsg', memberInfo);
                    this.$router.push({ name: 'showValueAccount', query: { memberAccMsg: memberInfo }});
                }
            }
        }
    };
</script>

<style lang="less" scoped>
.show-t-l{
    .link{
        cursor: pointer;
        color: #33b4ff;
    }
}
</style>
