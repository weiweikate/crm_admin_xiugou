<template>
    <div class="sensitive-library">
        <v-breadcrumb :nav="['运营管理','敏感词库']"></v-breadcrumb>
        <el-card :body-style="{ padding: '30px' }">
            <el-button v-if='p.addBadWord' type="primary" @click="dialogVisible = true" style="margin-bottom:20px">添加敏感词</el-button>
            <el-table v-loading="tableLoading" :data="tableData" border>
                <el-table-column type="index" :index="handleIndex" align="center" label="排序"></el-table-column>
                <el-table-column prop="name" align="center" label="敏感词"></el-table-column>
                <el-table-column v-if='p.deleteBadWord' align="center" label="操作">
                    <template slot-scope="scope">
                        <el-button @click="delItem(scope.row)" type="danger">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="block">
                <el-pagination
                        background
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="page.currentPage"
                        layout="total, prev, pager, next, jumper"
                        :total="page.totalPage">
                </el-pagination>
            </div>
        </el-card>
        <!--删除弹窗-->
        <delete-toast :id='delId' :url='delUrl' :uri='delUri' @msg='deleteToast' v-if="isShowDelToast"></delete-toast>
        <!-- 添加弹窗 -->
        <el-dialog title="添加敏感词" :visible.sync="dialogVisible" width="30%">
            <p style="text-align:center">
                <span>敏感词</span>
                <el-input v-model="senWord" style='width:210px'></el-input>
            </p>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addSen">确 定</el-button>
                <el-button @click="dialogVisible = false">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import vBreadcrumb from '@/components/common/Breadcrumb.vue';
import deleteToast from '../../common/DeleteToast';
import * as api from '@/api/OperateManage/SensitiveLibrary.js';
import * as pApi from '@/privilegeList/OperateManage/SensitiveLibrary.js';
import utils from '@/utils/index.js';
import { myMixinTable } from '@/JS/commom';
import request from '@/http/http';
export default {
    components: { vBreadcrumb, deleteToast },

    mixins: [myMixinTable],

    data() {
        return {
        // 权限控制
            p: {
                deleteBadWord: false,
                addBadWord: false
            },
            tableLoading: false,
            tableData: [],
            delId: '', // 删除id
            delUrl: '', // 删除url
            delUri: '', // 权限
            isShowDelToast: false,
            dialogVisible: false,
            senWord: '', // 敏感词
            rowMsg: '' // 删除信息
        };
    },

    activated() {
        this.getList(1);
        this.pControl();
    },

    methods: {
    // 权限控制
        pControl() {
            for (const k in this.p) {
                this.p[k] = utils.pc(pApi[k]);
            }
        },
        //  添加敏感词
        addSen() {
            request.addBadWord({ name: this.senWord }).then(res => {
                this.$message.success(res.msg);
                this.getList(this.page.currentPage);
                this.dialogVisible = false;
            }).catch(err => {
                console.log(err);
            });
        },
        //  获取数据
        getList(val) {
            this.tableLoading = true;
            request.queryBadWord({ page: val, pageSize: 10 }).then(res => {
                this.tableLoading = false;
                this.page.totalPage = res.data.totalNum;
                this.tableData = res.data.data;
            }).catch(err => {
                this.tableLoading = false;
                console.log(err);
            });
        },
        // 删除
        delItem(row) {
            this.delId = row.id;
            this.delUrl = 'deleteBadWord';
            this.delUri = pApi.deleteBadWord;
            this.isShowDelToast = true;
        },
        // 删除弹窗
        deleteToast(msg) {
            this.isShowDelToast = msg;
            this.getList(this.page.currentPage);
        },
        handleIndex(index) {
            return index + 1;
        }
    }
};

</script>
<style lang='less' scoped>
.sensitive-library{
    .block{
        margin: 10px 0;
    }
    /deep/.el-dialog{
        border-radius: 10px;
        .el-dialog__header{border-bottom: 1px solid #ddd;
            .el-dialog__title{color: #ff6868}
        }
    }
}
</style>
