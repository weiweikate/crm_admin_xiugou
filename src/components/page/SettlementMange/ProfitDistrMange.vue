<template>
    <div class="profit-distr-mange">
        <v-breadcrumb :nav="['结算管理','利润分配设置']"></v-breadcrumb>
        <el-card :body-style="{ padding: '30px' }">
            <el-button type="primary" style="margin-bottom:10px" @click="createTpl">创建利润模板</el-button>
            <el-table :data="tableData" border stripe v-loading="tabLoading">
                <el-table-column type="index" :index="handleIndex" label="编号" align="center"></el-table-column>
                <el-table-column prop='name' label="利润分配模板名称" align="center"></el-table-column>
                <el-table-column prop='type' label="利润分配模板类型" align="center">
                    <template slot-scope="scope" v-if='scope.row.type'>
                        {{scope.row.type == '1'? '通用模版':'普通模版'}}
                    </template>
                </el-table-column>
                <el-table-column prop='startTime' label="启用时间" align="center">
                    <template slot-scope="scope" v-if='scope.row.startTime'>
                        {{scope.row.startTime | formatDateAll}}
                    </template>
                </el-table-column>
                <el-table-column prop='endTime' label="停用时间" align="center">
                    <template slot-scope="scope">
                        <span v-if='scope.row.type == 1'>{{'/'}}</span>
                        <span v-else-if='scope.row.endTime'>{{scope.row.endTime | formatDateAll}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop='status' label="状态" align="center">
                    <template slot-scope="scope">
                        <template v-if='scope.row.status==1'>待启用</template>
                        <template v-else-if='scope.row.status==0'>已停用</template>
                        <template v-else-if='scope.row.status==2'>启用中</template>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <!--<el-button @click="changeStatus(scope.row,1)" v-if='scope.row.status != 2 && scope.row.type == 2' type="primary">启 用</el-button>-->
                        <el-button @click="copyTpl(scope.row)" type="warning">复 制</el-button>
                        <el-button @click="delItem(scope.$index,scope.row.id)" v-if='(scope.row.status == 1 && scope.row.type == 1) || ((scope.row.status == 1 || scope.row.status == 2) && scope.row.type == 2)' type="danger">取消启用</el-button>
                        <!--<el-button @click="changeStatus(scope.row,2)" v-if='scope.row.status == 2 && scope.row.type == 2' type="danger">停 用</el-button>-->
                    </template>
                </el-table-column>
            </el-table>
            <div class="block">
                <el-pagination
                    background
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :page-size="page.pageSize"
                    :current-page="page.currentPage"
                    layout="total, prev, pager, next, jumper"
                    :total="page.totalPage">
                </el-pagination>
            </div>
        </el-card>
        <!--删除弹窗-->
        <delete-toast :id='delId' :url='delUrl' :uri='delUri' @msg='deleteToast' tip="取消启用" v-if="isShowDelToast"></delete-toast>
    </div>
</template>

<script>
import vBreadcrumb from '@/components/common/Breadcrumb.vue';
import deleteToast from '@/components/common/DeleteToast';
import { myMixinTable } from '@/JS/commom';
import request from '@/http/http';
export default {
    mixins: [myMixinTable],
    components: { vBreadcrumb, deleteToast },

    data() {
        return {
            tableData: [],
            tabLoading: false,
            isShowDelToast: false,
            delId: '',
            delUrl: '',
            delUri: ''
        };
    },

    activated() {
        this.getList(1);
    },

    methods: {
        //   获取列表信息
        getList(val) {
            const data = {
                pageSize: this.page.pageSize,
                page: val
            };
            this.tabLoading = true;
            request.querySettleTplList(data).then(res => {
                this.tabLoading = false;
                this.tableData = res.data.data;
                this.page.currentPage = res.data.currentPage;
                this.page.totalPage = res.data.totalNum;
            }).catch(err => {
                this.tabLoading = false;
                console.log(err);
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
        copyTpl(row) {
            const msg = {
                id: row.id,
                value: '2' // 1：编辑 2：复制
            };
            sessionStorage.setItem('settleProfitMsg', JSON.stringify(msg));
            this.$router.push({ name: 'profitTpl', query: { settleProfitMsg: JSON.stringify(msg) }});
        },
        // 删除
        delItem(index, id) {
            this.delId = id;
            this.delUrl = 'disableSettleProFitById';
            this.isShowDelToast = true;
        },
        // 删除弹窗
        deleteToast(msg) {
            this.isShowDelToast = msg;
            this.getList(this.page.currentPage);
        }
    }
};

</script>
<style lang='less' scoped>
.profit-distr-mange{}
</style>
