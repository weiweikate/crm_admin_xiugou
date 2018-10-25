<template>
    <div class="show-t-l">
        <el-table :data="tableData" border stripe>
            <el-table-column prop="id" label="编号" align="center"></el-table-column>
            <el-table-column prop="id" label="任务名称" align="center"></el-table-column>
            <el-table-column prop="id" label="分享任务人" align="center"></el-table-column>
            <el-table-column prop="id" label="接收时间" align="center"></el-table-column>
            <el-table-column prop="id" label="完成时间" align="center"></el-table-column>
            <el-table-column prop="id" label="秀值账户金额" align="center"></el-table-column>
            <el-table-column prop="id" label="任务类型" align="center"></el-table-column>
            <el-table-column prop="id" label="本次任务秀值金" align="center"></el-table-column>
            <el-table-column prop="id" label="已领取秀值金" align="center"></el-table-column>
            <el-table-column prop="id" label="已领取秀豆" align="center"></el-table-column>
            <el-table-column prop="id" label="分享点击次数" align="center"></el-table-column>
            <el-table-column prop="id" label="状态" align="center"></el-table-column>
        </el-table>
        <div class="block">
            <el-pagination
                background
                @size-change="handleSizeChange"
                :page-size="page.pageSize"
                @current-change="handleCurrentChange"
                :current-page="page.currentPage"
                layout="total, prev, pager, next, jumper"
                :total="page.totalPage">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    import { myMixinTable } from '@/JS/commom';
    export default {
        props: ['status'],
        mixins: [myMixinTable],
        data() {
            return {
                tableData: [{id: 1}],
                form: {}
            }
        },
        methods: {
            getList() {
                this.form.status = this.status;
                console.log(this.form);
            }
        }
    };
</script>

<style lang="less" scoped>
.show-t-l{}
</style>
