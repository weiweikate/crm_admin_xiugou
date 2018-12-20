<template>
    <div class="prize-poll">
        <v-breadcrumb :nav='nav'></v-breadcrumb>
        <el-card :body-style="{ padding: '30px 45px',minHeight:'80vh' }">
            <div class="tab-content">
                <el-table v-loading="tableLoading" border :data="tableData">
                    <el-table-column prop="id" label="名称" align="center"></el-table-column>
                    <el-table-column prop="id" label="活动类型" align="center"></el-table-column>
                    <el-table-column prop="id" label="冻结数量" align="center"></el-table-column>
                    <el-table-column label="开始/结束时间" align="center">
                        <!--<template slot-scope="scope">-->
                            <!--{{scope.row.createTime | formatDate}}<br/>{{scope.row.adminName}}-->
                        <!--</template>-->
                    </el-table-column>
                    <el-table-column label="操作" align="center">
                        <template slot-scope="scope">
                            <el-button type="primary" @click="watchItem(scope.row)">查看</el-button>
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
            </div>
        </el-card>

    </div>

</template>

<script>
    import vBreadcrumb from '@/components/common/Breadcrumb.vue';
    import * as api from '@/api/OperateManage/MarketToolsManage/index.js';
    import * as pApi from '@/privilegeList/OperateManage/MarketToolsManage/index.js';
    import utils from '@/utils/index.js';
    import moment from 'moment';

    export default {
        props: ['name'],
        components: { vBreadcrumb },

        data() {
            return {
                nav: ['运营管理', '营销工具管理', '奖品池管理', '冻结库存活动'],
                // 权限控制
                p: {

                },

                tableData: [{ id: 111 }],
                tableLoading: false,
                page: {
                    currentPage: 1,
                    totalPage: 0,
                    pageSize: 20
                },

                id: ''// 操作id

            };
        },

        activated() {
            this.pControl();
            this.submitForm(1);
        },

        methods: {

            // 权限控制
            pControl() {
                for (const k in this.p) {
                    this.p[k] = utils.pc(pApi[k]);
                }
            },
            //   提交表单
            submitForm(val) {
                const data = {};
                data.page = val;
                this.page.currentPage = val;
                this.tableLoading = true;
                this.$axios
                    .post(api.queryOperActivityPackagePageList, data)
                    .then(res => {
                        this.tableData = [];
                        this.tableData = res.data.data.data;
                        this.page.totalPage = res.data.data.resultCount;
                        this.tableLoading = false;
                    })
                    .catch(err => {
                        console.log(err);
                        this.tableLoading = false;
                    });
            },
            // 分页
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                this.submitForm(val);
            },
            // 查看
            watchItem(row) {
                this.$router.push('/packageList');
            }
        }
    };
</script>
<style lang='less' scoped>
    .prize-poll {
        .tab-content {
            .add-package {
                margin: 0 0 20px 0;
            }
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
            .product-img {
                display: inline-block;
                float: left;
                width: 80px;
                height: 80px;
                border: 1px solid #ddd;
                overflow: hidden;
                img {
                    width: 60px;
                    height: 60px;
                    margin: 10px;
                }
            }
            .product-name {
                float: left;
                width: 75%;
                height: auto;
                margin: 5px 0 0 20px;
            }
            .product-id {
                float: left;
                width: 75%;
                height: auto;
                margin: 20px 0 0 20px;
            }
            .blue {
                color: #33b4ff;
                cursor: pointer;
            }
        }
        .pwd-mask {
            display: flex;
            align-items: center;
            justify-content: center;
            position: fixed;
            top: 0;
            left: 0;
            z-index: 99;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.2);
            .box {
                position: relative;
                width: 530px;
                height: 285px;
                background-color: #fff;
                border-radius: 10px;
                overflow: hidden;
                .mask-title {
                    width: 100%;
                    height: 56px;
                    border-bottom: 1px solid #ccc;
                    padding-left: 45px;
                    box-sizing: border-box;
                    text-align: center;
                    line-height: 56px;
                    color: #ff6868;
                    font-weight: 700;
                    .ico {
                        position: absolute;
                        top: 16px;
                        left: 228px;
                        color: red;
                        font-size: 20px;
                    }
                }
                .mask-content {
                    position: relative;
                    width: 100%;
                    height: 248px;
                    overflow: hidden;
                    padding: 30px 45px 0 45px;
                    box-sizing: border-box;
                    .del-tip {
                        position: absolute;
                        top: 20%;
                        left: 50%;
                        transform: translateX(-50%);
                        font-size: 18px;
                        text-align: center;
                        line-height: 40px;
                    }
                    .del-btn-group {
                        width: 180px;
                        display: flex;
                        justify-content: space-between;
                        position: absolute;
                        left: 50%;
                        transform: translateX(-50%);
                        bottom: 15%;
                        .del-btn {
                            background-color: #ff6868;
                        }
                    }
                }
            }
        }
        /*弹窗样式*/
        /deep/ .el-dialog {
            width: 530px;
            border-radius: 10px;
            .el-dialog__header {
                border-bottom: 1px solid #eee;
                padding: 20px 20px 10px 50px;
            }
            .el-dialog__title {
                color: #ff6868;
            }
            .el-dialog .el-input {
                display: inline;
            }
            .el-input {
                width: 210px;
            }
            .el-form-item {
                margin-left: 40px;
            }
            .el-dialog__footer {
                margin-right: 30px;
            }
            .tip {
                color: #ff6868;
            }
        }
    }

</style>
