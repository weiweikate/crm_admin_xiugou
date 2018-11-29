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
                    <el-button type="primary" @click="refund(scope.row.id,1)">手工退款</el-button>
                    <el-button type="success" @click="refund(scope.row.id,2)">退款</el-button>
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
                <el-input type="textarea" v-model="remark" placeholder="请输入手工退款账号等信息" @input="inputRemark" maxlength="50"></el-input>
                <span class="count">{{count}}/50</span>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="refundSure">确 认</el-button>
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
                w: {
                    name: '25%',
                    price: '8%',
                    num: '8%',
                    consignee: '12%',
                    status: '8%',
                    collection: '12%',
                    shipper: '8%',
                    operate: '15%',
                    minWidth: '100px'
                },
                starArr: [
                    { label: '红色标记', value: '1' },
                    { label: '蓝色标记', value: '2' },
                    { label: '绿色标记', value: '3' },
                    { label: '黄色标记', value: '4' },
                    { label: '紫色标记', value: '5' }
                ],
                markArr: [
                    { label: 'red', value: '1' },
                    { label: 'skyblue', value: '2' },
                    { label: 'lightgreen', value: '3' },
                    { label: 'orange', value: '4' },
                    { label: 'purple', value: '5' }
                ],
                tableData: [],
                pageLoading: false,
                data: {},
                // returnType状态
                returnTypeArr: ['退款', '退货', '换货'],
                // 售后状态
                afterSaleStatusArr: ['申请中', '已同意', '已拒绝', '发货中', '云仓发货中', '已完成', '已关闭', '超时关闭'],
                ids: [],
                mask: false,
                count: 0,
                remark: ''
            };
        },
        methods: {
            // 提交表单
            getList(val) {
                this.data.page = this.page.currentPage;
                this.data.size = this.page.pageSize;
                this.tableData = [];
                this.pageLoading = true;
                request.queryOrderPageList(this.data).then(res => {
                    this.pageLoading = false;
                    this.tableData = res.data.data;
                    this.page.totalPage = res.data.totalNum;
                }).catch(err => {
                    this.pageLoading = false;
                    console.log(err);
                });
            },
            // 修改星级
            changeColor(v1, v) {
                const data = {};
                data.id = v.id;
                data.adminStars = v1.value;
                data.adminRemark = v.adminRemark;
                request.orderSign(data).then(res => {
                    this.$message.success(res.msg);
                    v.starColor = v1.label;
                    v.isShowPop = false;
                }).catch(err => {
                    console.log(err);
                });
            },
            // 跳到售后详情
            toAfterSale(id) {
                sessionStorage.setItem('afterSaleOprId', id);
                this.$router.push({
                    path: '/afterSaleOpr',
                    query: { afterSaleOprId: id }
                });
            },
            // 推送云仓
            pushCloud(row) {
                const data = {
                    ids: []
                };
                if (row) {
                    data.ids.push(row.id);
                } else {
                    data.ids = this.ids;
                }
                request.orderSendOut(data).then(res => {
                    this.$message.success(res.msg);
                    this.getList(this.page.currentPage);
                }).catch(err => {
                    console.log(err);
                });
            },
            // 订单详情
            orderInfo(row) {
                sessionStorage.setItem('orderInfoId', row.id);
                this.$router.push({ name: 'orderInfo', query: { orderInfoId: row.id }});
            },
            // 订单多选框
            orderCheckBox(row) {
                if (row.checked) {
                    this.ids.push(row.id);
                } else {
                    this.ids.forEach((v, k) => {
                        if (v == row.id) {
                            this.ids.splice(k, 1);
                        }
                    });
                }
            },
            // 更改订单状态（单个）
            changeStatus(row, status) {
                if (status == 3) {
                    request.pickUpOrderProduct({ orderProductId: row.id }).then(res => {
                        this.$message.success(res.data.data);
                        this.getList(1);
                    }).catch(err => {
                        console.log(err);
                    });
                }
            },
            refund(id, num) {
                if (num == 1) {
                    this.mask = true;
                } else {
                    this.refundRequest();
                }
            },
            refundRequest() {

            },
            inputRemark() {
                this.count = this.remark.length;
            },
            // 手工退款
            refundSure() {
                this.refundRequest();
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
