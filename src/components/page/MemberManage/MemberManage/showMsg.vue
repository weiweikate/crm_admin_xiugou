<template>
    <div class="shop-msg">
        <v-breadcrumb :nav="['经销商会员管理','会员管理','会员详情','店铺信息']"></v-breadcrumb>
        <el-card>
            <el-table :data="tableData" border>
                <el-table-column prop="id" label="编号" align="center" width="80"></el-table-column>
                <el-table-column prop="id" label="行为" align="center"></el-table-column>
                <el-table-column prop="id" label="结果" align="center"></el-table-column>
                <el-table-column prop="id" label="时间" align="center"></el-table-column>
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
        </el-card>
    </div>
</template>

<script>
    import vBreadcrumb from '@/components/common/Breadcrumb.vue';
    import { myMixinTable } from '@/JS/commom';
    import request from '@/http/http';
    export default {
        components: {
            vBreadcrumb
        },
        mixins: [myMixinTable],
        data() {
            return {
                tableData: []
            };
        }
    };
</script>

<style lang="less" scoped>
.shop-msg{
    .block{
        margin: 10px 0;
    }
}
</style>
