<template>
    <div class="showvalue-account">
        <breadcrumb :nav='nav'></breadcrumb>
        <el-card>
            <p class="mb10">{{name}}的现金账户明细</p>
            <el-table border :data="tableData">
                <el-table-column type="index" label="编号" align="center"></el-table-column>
                <el-table-column label="类型" align="center" ></el-table-column>
                <el-table-column prop="balance" label="金额（元）" align="center" width="200"></el-table-column>
                <el-table-column label="说明" align="center"></el-table-column>
                <el-table-column label="时间" align="center" min-width="180">
                    <template slot-scope="scope" v-if='scope.row.create_time'>
                        {{scope.row.create_time|formatDate}}
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
    import { myMixinTable } from '@/JS/commom';
    export default {
        mixins: [myMixinTable],
        components: {
            breadcrumb
        },
        data() {
            return {
                nav: ['会员管理', '秀值账户收支明细'],
                tableData: [],
                name: '杨二盟',
                tableLoading: false
            };
        },
        activated() {
            this.id = this.$route.query.memberId || JSON.parse(sessionStorage.getItem('memberId'));
            this.getList(this.page.currentPage);
        },
        methods: {
            // 获取数据
            getList(val) {

            }
        }
    };
</script>
<style lang="less" scoped>
    .showvalue-account{

    }
</style>


