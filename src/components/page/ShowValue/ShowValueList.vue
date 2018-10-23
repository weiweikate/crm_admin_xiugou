<template>
    <div class="show-value-list">
        <v-breadcrumb :nav="nav"></v-breadcrumb>
        <el-card>
            <el-button type="primary" style="margin-bottom: 10px" @click="$router.push('showValueSet')">创建利润模版</el-button>
            <el-table :data="tableData" border stripe>
                <el-table-column prop="id" label="编号" align="center"></el-table-column>
                <el-table-column prop="id" label="秀值分配模板名称" align="center"></el-table-column>
                <el-table-column prop="id" label="启用时间" align="center"></el-table-column>
                <el-table-column prop="id" label="停用时间" align="center"></el-table-column>
                <el-table-column prop="id" label="状态" align="center"></el-table-column>
                <el-table-column prop="id" label="操作" align="center" min-width="150px">
                    <template slot-scope="scope">
                        <el-button type="primary">开启</el-button>
                        <el-button type="warning" @click="editTpl(scope.row)">编辑</el-button>
                        <el-button type="danger">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="block">
                <el-pagination
                    background
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="page.currentPage"
                    :page-size="page.pageSize"
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
        mixins: [myMixinTable],
        components: { vBreadcrumb },
        data() {
            return {
                nav: ['秀值模块', '秀值分配设置'],
                tableData: [{ id: 1, imgUrl: 'https://mr-test-sg.oss-cn-hangzhou.aliyuncs.com/sharegoods/TB2mMgxiIyYBuNkSnfoXXcWgVXa_!!2867551008.jpg' }]
            };
        },
        methods: {
            // 编辑模版
            editTpl(row){
                sessionStorage.setItem('showValueTplId', row.id)
                this.$router.push({name: 'showValueSet', query: {'showValueTplId': row.id}});
            }
        }
    };
</script>

<style lang="less" scoped>
.show-value-list{
    img {
        width: 50px;
        height: 50px;
        border-radius: 5px;
    }
    .block {
        float: right;
        margin: 10px 0;
    }
}
</style>
