<template>
    <div class="tab-content">
        <el-table v-loading="tableLoading" :height="height" border :data="tableData">
            <el-table-column prop="activityCode" align="center" label="编号" min-width="100"></el-table-column>
            <el-table-column prop="name" label="套餐名称" align="center"></el-table-column>
            <el-table-column prop="spec" label="推广人" align="center"></el-table-column>
            <el-table-column label="开始时间" align="center">
                <template slot-scope="scope">
                    <template v-if="scope.row.startTime">{{scope.row.startTime | formatDateAll}}</template>
                </template>
            </el-table-column>
            <el-table-column label="结束时间" align="center">
                <template slot-scope="scope">
                    <template v-if="scope.row.endTime">{{scope.row.endTime | formatDateAll}}</template>
                </template>
            </el-table-column>
            <el-table-column label="红包总数/金额" align="center">
                <template slot-scope="scope">
                   {{scope.row.endTime}}/{{scope.row.endTime}}
                </template>
            </el-table-column>
            <el-table-column label="已分发数/金额" align="center">
                <template slot-scope="scope">
                   {{scope.row.endTime}}/{{scope.row.endTime}}
                </template>
            </el-table-column>
            <el-table-column label="剩余数/金额" align="center">
                <template slot-scope="scope">
                   {{scope.row.endTime}}/{{scope.row.endTime}}
                </template>
            </el-table-column>
            <el-table-column prop="" label="状态" align="center">
                <template slot-scope="scope">
                    <template v-if='scope.row.status == 1'>进行中</template>
                    <template v-if='scope.row.status == 2'>已取消</template>
                    <template v-if='scope.row.status == 3'>已结束</template>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" min-width="100">
                <template slot-scope="scope">
                    <el-button style="margin-bottom:10px" type="primary"
                               @click="toDetail(scope.row)">详情
                    </el-button>
                    <el-button style="margin-bottom:10px" type="danger" @click="endOrDelete(1,scope.row)"
                               v-if="scope.row.status == 1||scope.row.status == 2">
                        取消
                    </el-button>
                    <el-button style="margin-bottom:10px" type="danger" @click="endOrDelete(0,scope.row)"
                               v-if="scope.row.status != 1&&scope.row.status != 2">
                        删除
                    </el-button>
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
        <!--取消弹窗-->
        <div class="pwd-mask" v-if="showMask">
            <div class="box">
                <div class="mask-title">
                    <icon class="ico" ico='icon-jinggao'/>
                    取消确认
                </div>
                <div class="mask-content">
                    <div class="del-tip">
                        <div>确认取消{{names}}推广吗？</div>
                    </div>
                    <div class="del-btn-group">
                        <el-button :loading="btnLoading" @click="closeMask(true)" type="primary">确认</el-button>
                        <el-button @click="closeMask(false)">取消</el-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import moment from 'moment';
    import { myMixinTable } from '@/JS/commom';
    import request from '@/http/http.js';

    export default {
        props: ['name'],
        mixins: [myMixinTable],
        components: {
        },

        data() {
            return {
                data: {},
                // 表格数据
                tableData: [],
                tableLoading: false,
                showMask: false, // 是否显示弹窗
                names: '',
                btnLoading: false, // 弹窗操作按钮样式
                index: '', // 删除0结束1
                id: '', // 操作id
                height: ''
            };
        },

        computed: {
            // 降价拍状态
            depStaName() {
                switch (this.name) {
                    case 'all':
                        return '';
                        break;
                    case 'notStart':
                        return '1';
                        break;
                    case 'cancel':
                        return '2';
                        break;
                    case 'ended':
                        return '3';
                        break;
                }
            }
        },
        created() {
            this.getList(1);
            const winHeight = window.screen.availHeight - 520;
            this.height = winHeight;
        },
        activated() {
            this.getList(1);
        },

        methods: {
            //   提交表单
            getList(val) {
                this.data.page = val;
                this.data.pageSize = this.page.pageSize;
                this.tableLoading = true;
                request.operatorDepreciatelist(this.data).then(res => {
                    this.tableData = [];
                    this.tableData = res.data.data;
                    this.page.totalPage = res.data.totalNum;
                    this.tableLoading = false;
                })
                    .catch(err => {
                        this.tableLoading = false;
                    });
            },
            // 结束或删除操作
            endOrDelete(num, row) {
                this.index = num;
                this.showMask = true;
                this.id = row.id;
            },
            // 结束或删除操作确认取消
            closeMask(status) {
                if (status) {
                    const data = {};
                    let url = '';
                    if (this.index == 0) {
                        // data.status = this.index;
                        url = 'deleteActivityDepreciate';
                    } else if (this.index == 1) {
                        url = 'modifyActivityDepreciate';
                        // data.status = 5;
                    } else {
                        url = 'reduceStockById';
                        // data.status = 6;
                    }
                    this.changeStatus(data, url);
                } else {
                    this.showMask = false;
                }
            },
            // 结束、删除、减少数量
            changeStatus(data, url) {
                data.list = this.id;
                this.btnLoading = true;
                request[url](data).then(res => {
                    this.$message.success(res.msg);
                    this.getList(this.page.currentPage);
                    this.showMask = false;
                    this.inventoryMask = false;
                    this.btnLoading = false;
                })
                    .catch(err => {
                        this.btnLoading = false;
                    });
            },
            // 查看详情
            toDetail(row) {
                sessionStorage.setItem('promotionOrderId', row.id);
                this.$router.push({ path: '/promotionOrderInfo', query: { promotionOrderId: row.id }});
            }
        }
    };
</script>
<style lang='less' scoped>
    .tab-content {
        .add-product {
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
            width: 90px;
            height: 90px;
            border: 1px solid #ddd;
            overflow: hidden;
            img {
                width: 70px;
                height: 70px;
                margin: 10px;
            }
        }
        .product-inf {
            float: left;
            width: 68%;
            height: auto;
            margin-left: 10px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .mange-sty {
            cursor: pointer;
            color: #33b4ff;
        }
        .color-red {
            color: #ff1e30;
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
