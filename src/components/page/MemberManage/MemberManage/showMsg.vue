<template>
    <div class="shop-msg">
        <v-breadcrumb :nav="['经销商会员管理','会员管理','会员详情','店铺信息']"></v-breadcrumb>
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
            <el-table :data="tableData" border>
                <el-table-column prop="id" label="编号" align="center" width="80"></el-table-column>
                <el-table-column prop="id" label="行为" align="center"></el-table-column>
                <el-table-column prop="id" label="结果" align="center"></el-table-column>
                <el-table-column prop="id" label="时间" align="center"></el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>
    import vBreadcrumb from '@/components/common/Breadcrumb.vue';
    import { myMixinTable } from '@/JS/commom';
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
