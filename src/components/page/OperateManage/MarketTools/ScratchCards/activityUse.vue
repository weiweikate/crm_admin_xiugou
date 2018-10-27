<template>
    <div class="scratch-cards">
        <v-breadcrumb :nav='nav'></v-breadcrumb>
        <el-card>
            <el-table :data="tableDate" border stripe>
                <el-table-column prop="id" label="活动名称" align="center"></el-table-column>
                <el-table-column prop="id" label="活动类型" align="center"></el-table-column>
                <el-table-column prop="id" label="使用数量" align="center"></el-table-column>
                <el-table-column prop="id" label="绑定时间" align="center"></el-table-column>
                <el-table-column prop="id" label="操作" align="center" width="320px">
                    <template slot-scope="scope">
                        <el-button type="success">查 看</el-button>
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
    import vBreadcrumb from '@/components/common/Breadcrumb.vue';
    import { myMixinTable } from '@/JS/commom';
    export default {
        mixins: [myMixinTable],
        components: { vBreadcrumb },
        data() {
            return {
                id: '',
                nav: ['运营管理', '营销工具管理', '刮刮卡', '当前活动使用'],
                tableDate: [{ id: 1 }]
            };
        },
        activated() {
            this.id = this.$route.query.activityUseId;
        },
        methods: {
            getList(val) {

            }
        }
    };
</script>

<style lang="less" scoped>
    .scratch-cards{}
</style>
