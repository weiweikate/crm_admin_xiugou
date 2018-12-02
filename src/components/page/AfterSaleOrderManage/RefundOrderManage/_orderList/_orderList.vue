<template>
    <div class="refund-order-list" v-loading="pageLoading">
        <el-table border :data="tableData">
            <el-table-column label="退款单号" align="center"></el-table-column>
            <el-table-column label="售后单号" align="center"></el-table-column>
            <el-table-column label="仓库订单号" align="center"></el-table-column>
            <el-table-column label="用户账号" align="center"></el-table-column>
            <el-table-column label="退款状态" align="center"></el-table-column>
            <el-table-column label="退款失败原因" align="center"></el-table-column>
            <el-table-column label="商品实付金额" align="center"></el-table-column>
            <el-table-column label="申请退款金额" align="center"></el-table-column>
            <el-table-column label="实际退款金额" align="center"></el-table-column>
            <el-table-column label="创建时间" align="center"></el-table-column>
            <el-table-column label="退款备注" align="center"></el-table-column>
            <el-table-column label="操作" align="center" min-width="150px">
                <template slot-scope="scope">
                    <el-button type="primary" @click="refund(scope.row,1)">手工退款</el-button>
                    <el-button type="success" @click="refund(scope.row,2)">退款</el-button>
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
        <el-dialog title="手工退款备注" :visible.sync="mask">
            <el-form>
                <el-input type="textarea" v-model="remark" placeholder="仅需操作第三方退款金额，余额由系统自动退回，请详细记录手工退款账号等信息。" @input="inputRemark" maxlength="100"></el-input>
                <span class="count">{{count}}/100</span>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" :loading="btnLoading" @click="refundSure">确 认</el-button>
                <el-button @click="mask=false">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import request from '@/http/http.js';
    import { myMixinTable } from '@/JS/commom';
    import moment from 'moment';
    export default {
        mixins: [myMixinTable],
        data() {
            return {
                tableData: [],
                pageLoading: false,
                data: {},
                mask: false,
                count: 0,
                remark: '',
                row: {},
                btnLoading: false
            };
        },
        methods: {
            // 提交表单
            getList(val) {
                this.data.page = this.page.currentPage;
                this.data.size = this.page.pageSize;
                this.tableData = [];
                this.pageLoading = true;
                request.queryRefundPage(this.data).then(res => {
                    this.pageLoading = false;
                    this.tableData = res.data.data;
                    this.page.totalPage = res.data.totalNum;
                }).catch(err => {
                    this.pageLoading = false;
                    console.log(err);
                });
            },
            refund(row, num) {
                const data = {
                    serviceNo: row.serviceNo
                };
                this.row = row;
                if (num == 1) {
                    this.mask = true;
                } else {
                    request.refundAmounts(data).then(res => {
                        this.$message.success(res.msg);
                    });
                }
            },
            inputRemark() {
                this.count = this.remark.length;
            },
            // 手工退款
            refundSure() {
                const data = {
                    refundNo: this.row.serviceNo,
                    remark: this.remark
                };
                this.btnLoading = true;
                request.manualRefund(data).then(res => {
                    this.$message.success(res.msg);
                    this.mask = false;
                    this.btnLoading = false;
                }).catch(err => {
                    this.btnLoading = false;
                });
            }
        }
    };
</script>

<style lang='less' scoped>
    .refund-order-list {
        .order-list-table {
            font-size:12px;
            width: 100%;
            color:#606266;
            border: 1px solid #ebeef5;
            border-collapse: collapse;
            margin-bottom: 20px;
            line-height: 23px;
            td {
                border: 1px solid #ebeef5;
                padding: 8px;
                text-align: center;
            }
            .head{
                background: #33b4ff;
                color: #fff;
                text-align: left;
                div{
                    display: inline-block;
                    width: 20%;
                }
            }
            .marl20{
                margin-left: 20px;
            }
            .name {
                float: left;
                position: relative;
                display: inline-block;
                height: 100px;
                text-align: left;
                img {
                    position: absolute;
                    width: 100px;
                    height: 100px;
                    border-radius: 5px;
                    border: 1px solid #eee;
                }
                .pro-name {
                    position: absolute;
                    top: 5px;
                    left: 115px;
                    width: 270px;
                }
                .pro-spec {
                    position: absolute;
                    left: 115px;
                    bottom:5px;
                    width: 270px;
                }
            }
            .num {
              margin-left: 20px;
            }
            .order-status{
                margin-bottom: 10px;
            }
            .color-blue{
                color: #33b4ff;
                cursor: pointer;
            }
            .text-left{
                text-align: left;
            }
        }
        .block {
            margin: 20px 0px;
        }
        /deep/.el-dialog{
            .count{
                position: absolute;
                right: 30px;
                top: 155px;
            }
            .el-textarea__inner{
                height: 100px;
                resize: none;
            }
        }
    }
</style>
