<template>
    <div class="profit-distr-mange">
        <v-breadcrumb :nav="['结算管理','利润分配设置']"></v-breadcrumb>
        <el-card :body-style="{ padding: '30px' }">
            <el-button type="primary" style="margin-bottom:10px" @click="createTpl">创建利润模板</el-button>
            <el-table :data="tableData" border>
                <el-table-column type="index" :index="handleIndex" label="编号" align="center"></el-table-column>
                <el-table-column prop='name' label="利润分配模板名称" align="center"></el-table-column>
                <el-table-column prop='enableTime' label="启用时间" align="center">
                    <template slot-scope="scope" v-if='scope.row.enableTime'>
                        {{scope.row.enableTime | formatDate}}
                    </template>
                </el-table-column>
                <el-table-column prop='stopTime' label="停用时间" align="center">
                    <template slot-scope="scope" v-if='scope.row.stopTime'>
                        {{scope.row.stopTime | formatDate}}
                    </template>
                </el-table-column>
                <el-table-column prop='status' label="状态" align="center">
                    <template slot-scope="scope">
                        <template v-if='scope.row.status==1'>启用中</template>
                        <template v-else-if='scope.row.status==2'>已停用</template>
                        <template v-else-if='scope.row.status==3'>已删除</template>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button @click="changeStatus(scope.row,1)" v-if='scope.row.status == 2 && scope.row.type == 2' type="primary">启用</el-button>
                        <el-button @click="editTpl(scope.row)" v-if='scope.row.status != 3' type="warning">编辑</el-button>
                        <el-button @click="changeStatus(scope.row,3)" v-if='scope.row.status == 2 && scope.row.type == 2' type="danger">删除</el-button>
                        <el-button @click="changeStatus(scope.row,2)" v-if='scope.row.status == 1 && scope.row.type == 2' type="danger">停用</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>
import * as api from '@/api/SettlementMange/index.js';
import vBreadcrumb from '../../common/Breadcrumb.vue';
export default {
    components: { vBreadcrumb },

    data() {
        return {
            tableData: []
        };
    },

    activated() {
        this.getPageList();
    },

    methods: {
        //   获取列表信息
        getPageList() {
            this.$axios.post(api.querySettlementConfigList, {}).then(res => {
                this.tableData = res.data.data;
            });
        },
        //  处理编号
        handleIndex(index) {
            return index + 1;
        },
        // 创建利润模板
        createTpl() {
            this.$router.push({ name: 'profitTpl' });
        },
        // 编辑利润模板
        editTpl(row) {
            sessionStorage.setItem('profitTplId', row.id);
            this.$router.push({ name: 'profitTpl', query: { profitTplId: row.id }});
        },
        // 修改状态
        changeStatus(row, status) {
        // status: 1:启用 2：停用 3：删除
            const data = {};
            data.id = row.id;
            data.status = status;
            this.$axios.post(api.updateSettlementConfigStatus, data).then(res => {
                this.$message.success(res.data.msg);
                this.getPageList();
            });
        }
    }
};

</script>
<style lang='less' scoped>
.profit-distr-mange{}
</style>
