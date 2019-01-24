<template>
    <div class="tab-content">
        <el-table v-loading="tableLoading" border :data="tableData">
            <el-table-column type="index" label="序号" align="center"></el-table-column>
            <el-table-column prop="merchantName" label="商家名称" align="center"></el-table-column>
            <el-table-column prop="merchantType" label="商家类型" align="center"></el-table-column>
            <el-table-column prop="brandName" label="品牌名称" align="center"></el-table-column>
            <el-table-column prop="brandType" label="产品类型" align="center"></el-table-column>
            <el-table-column prop="name" label="联系人" align="center"></el-table-column>
            <el-table-column prop="telephone" label="联系方式" align="center"></el-table-column>
            <el-table-column prop="remark" label="备注说明" align="center"></el-table-column>
            <el-table-column label="创建时间" align="center">
                <template slot-scope="scope">{{scope.row.createTime|formatDateAll}}</template>
            </el-table-column>
            <el-table-column prop="userAccount" label="操作者" align="center"></el-table-column>
            <el-table-column prop="" label="操作时间" align="center">
                <template slot-scope="scope">{{scope.row.updateTime|formatDateAll}}</template>
            </el-table-column>
            <el-table-column label="操作" width="150">
                <template slot-scope="scope">
                    <a :href="'#/supplierEnterDetail?supplierEnterId='+`${scope.row.id}`" class="el-button el-button--primary el-button--small" v-auth="'supplier.supplierEnterList.xq'">查看</a>
                    <el-button type="success" v-if="scope.row.status==0" @click="handleItem(scope.row.id)" v-auth="'supplier.supplierEnterList.cl'">处理</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="block">
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page.currentPage" :page-size="page.pageSize" layout="total, prev, pager, next, jumper" :total="page.totalPage">
            </el-pagination>
        </div>
        <el-dialog title="是否确认处理" :visible.sync="mask">
            <div style="text-align:center">
                是否已经受理该商家提交信息?
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="mask = false">取消</el-button>
                <el-button type="primary" :loading="btnLoading" @click="handle">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { myMixinTable } from '@/JS/commom';
import request from '@/http/http.js';

export default {
    props: ['name'],
    components: {},
    mixins: [myMixinTable],

    data() {
        return {
            status: '',
            tableData: [],
            tableLoading: false,
            data: {},
            mask: false,
            itemId: '',
            btnLoading: false
        };
    },
    created() {},
    activated() {
        this.getList(this.page.currentPage);
    },

    methods: {
        //  提交表单
        getList(val) {
            this.data.page = val;
            this.data.size = this.page.pageSize;
            this.page.currentPage = val;
            this.tableLoading = true;
            request
                .queryMerchant(this.data)
                .then(res => {
                    if (!res.data) return;
                    this.tableData = [];
                    this.tableData = res.data.data;
                    this.page.totalPage = res.data.totalNum;
                    request
                        .merchantCount()
                        .then(resData => {
                            if (!resData.data) return;
                            this.$emit('unProcessed', resData.data.unProcessed || 0);
                        })
                        .catch(error => {
                            console.log(error);
                        });
                    this.tableLoading = false;
                })
                .catch(error => {
                    console.log(error);
                    this.tableLoading = false;
                });
        },
        // 处理
        handleItem(id) {
            this.mask = true;
            this.itemId = id;
        },
        handle() {
            const data = {
                id: this.itemId
            };
            this.btnLoading = true;
            request
                .processed(data)
                .then(res => {
                    this.$message.success(res.msg);
                    this.mask = false;
                    this.getList(this.page.currentPage);
                    this.btnLoading = false;
                })
                .catch(error => {
                    console.log(error);
                    this.mask = false;
                    this.btnLoading = false;
                });
        }
    }
};
</script>
<style lang='less'>
.tab-content {
    .search-pane {
        width: 100%;
        padding: 30px 0 0 0;
        margin-bottom: 20px;
        background-color: #f7f7f7;
        box-sizing: border-box;
    }
    .el-input-group__append,
    .el-input-group__prepend {
        padding: 0 4px;
    }
    .operate {
        button {
            margin-right: 10px;
            margin-top: 5px;
        }
        button:nth-child(3) {
            margin-right: 0px;
        }
    }
    .operate-table {
        margin-top: 10px;
    }
    .el-button + .el-button {
        margin-left: 0px;
    }
    .block {
        float: right;
        margin-top: 10px;
    }
    .mask {
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.3);
        position: fixed;
        top: 0;
        left: 0;
        z-index: 2;
        .content {
            margin: 300px auto;
            background: #fff;
            padding: 30px;
            width: 400px;
            border-radius: 10px;
            .item {
                line-height: 40px;
                span {
                    width: 80px;
                    display: inline-block;
                    margin-left: 50px;
                }
                .el-input {
                    width: 210px;
                }
            }
            .el-button:first-child {
                margin-right: 30px;
            }
        }
    }
    .blue {
        color: #33b4ff;
        cursor: pointer;
    }
}
</style>
