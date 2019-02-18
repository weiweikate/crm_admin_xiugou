<template>
    <div class="refund-order-list" v-loading="pageLoading">
        <el-table border :data="tableData">
            <el-table-column prop="refundNo" label="退款单号" align="center"></el-table-column>
            <el-table-column prop="serviceNo" label="售后单号" align="center"></el-table-column>
            <el-table-column prop="warehouseOrderNo" label="仓库订单号" align="center"></el-table-column>
            <el-table-column prop="userPhone" label="用户账号" align="center"></el-table-column>
            <el-table-column prop="" label="退款状态" align="center">
                <template slot-scope="scope">{{statusArr[scope.row.status-1]}}</template>
            </el-table-column>
            <el-table-column prop="message" label="退款失败原因" align="center">
                <template slot-scope="scope">
                    <template v-if="scope.row.message && (scope.row.status==3||scope.row.status==4)">{{scope.row.message}}</template>
                    <template v-else>/</template>
                </template>
            </el-table-column>
            <el-table-column prop="payAmount" label="商品实付金额" align="center">
                <template slot-scope="scope">{{scope.row.payAmount|formatMoney}}</template>
            </el-table-column>
            <el-table-column prop="applyRefundAmount" label="申请退款金额" align="center">
                <template slot-scope="scope">{{scope.row.applyRefundAmount|formatMoney}}</template>
            </el-table-column>
            <el-table-column prop="refundAmount" label="实际退款金额" align="center">
                <template slot-scope="scope">{{scope.row.refundAmount|formatMoney}}</template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" align="center">
                <template slot-scope="scope">{{scope.row.createTime|formatDateAll}}</template>
            </el-table-column>
            <el-table-column prop="remarks" label="退款备注" align="center">
                <template slot-scope="scope">
                    <template v-if="scope.row.remarks">{{scope.row.remarks}}</template>
                    <template v-else>/</template>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" min-width="150px">
                <template slot-scope="scope">
                    <el-button v-auth="'afterSaleOrder.refundOrderList.sgtk'" type="primary" v-if="(scope.row.status==1||scope.row.status==3||scope.row.status==4)&&scope.row.serviceStatus!=6" @click="refund(scope.row,1)">手工退款</el-button>
                    <el-button v-auth="'afterSaleOrder.refundOrderList.tk'" type="success" v-if="(scope.row.status==1||scope.row.status==3||scope.row.status==4)&&scope.row.serviceStatus!=6&&scope.row.refundAmount>0" @click="refund(scope.row,2)">退款</el-button>
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
                <el-input type="textarea" v-model="remarks" placeholder="仅需操作第三方退款金额，余额由系统自动退回，请详细记录手工退款账号等信息。" @input="inputRemark" maxlength="100"></el-input>
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
    export default {
        mixins: [myMixinTable],
        data() {
            return {
                tableData: [],
                pageLoading: false,
                data: {},
                mask: false,
                count: 0,
                remarks: '',
                row: {},
                btnLoading: false,
                statusArr: ['待退款', '退款成功', '三方退款失败', '平台退款失败', '取消退款(关闭)']// 状态: 1.待退款 2.退款成功 3.三方退款失败 4.平台退款失败 5.取消退款(关闭)
            };
        },
        methods: {
            // 提交表单
            getList(val) {
                this.data.page = this.page.currentPage;
                this.data.size = this.page.pageSize;
                this.tableData = [];
                this.pageLoading = true;
                request.queryRefundPage(this.$utils.trimForm(this.data)).then(res => {
                    this.pageLoading = false;
                    this.tableData = res.data ? res.data.data : [];
                    this.page.totalPage = res.data.totalNum;
                }).catch(err => {
                    this.pageLoading = false;
                    console.log(err);
                });
            },
            refund(row, num) {
                this.row = row;
                if (num === 1) {
                    this.mask = true;
                    this.remarks = '';
                    this.count = 0;
                } else {
                    this.refundRequest('refund');
                }
            },
            inputRemark() {
                this.count = this.remarks.length;
            },
            // 手工退款
            refundSure() {
                this.refundRequest('manualRefund');
            },
            refundRequest(url) {
                const data = {
                    refundNo: this.row.refundNo,
                    remarks: this.remarks
                };
                this.btnLoading = true;
                request[url](data).then(res => {
                    this.$message.success(res.msg);
                    this.mask = false;
                    this.getList(this.page.currentPage);
                    this.btnLoading = false;
                }).catch(err => {
                    this.btnLoading = false;
                    console.log(err);
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
