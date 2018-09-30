<template>
    <div class="coupon-data">
        <v-breadcrumb :nav='nav'></v-breadcrumb>
        <el-card :body-style="{ padding: '30px 45px',minHeight:'80vh' }">
                <!--<el-button @click="addInventory" class="add-product" type="primary">增加券库存</el-button>-->
                <div class="search-pane">、
                    <el-form :model="form" ref='form' inline label-width="100px">
                        <el-form-item prop="getDate" label="领取时间" label-width="120">
                            <el-date-picker
                                v-model="form.getDate"
                                type="datetimerange"
                                format="yyyy-MM-dd"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                            >
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item prop="date" label="可用时间" label-width="120">
                            <el-date-picker
                                v-model="form.date"
                                type="datetimerange"
                                format="yyyy-MM-dd"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                            >
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item prop="status" label="状态" label-width="120">
                            <el-select v-model="form.status" placeholder="请选择">
                                <el-option label="全部" value=""></el-option>
                                <el-option label="已使用" value="1"></el-option>
                                <el-option label="未使用" value="0"></el-option>
                                <el-option label="已失效" value="2"></el-option>
                                <el-option label="未激活" value="3"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label=" ">
                            <el-button type="primary" @click="getList(1)">搜索</el-button>
                            <el-button @click="resetForm('form')">重置</el-button>
                        </el-form-item>
                        <!--<el-form-item label=" ">-->
                            <!--<el-button type="primary" @click="addInventory">添加券库存</el-button>-->
                        <!--</el-form-item>-->
                    </el-form>
                </div>
                <el-table v-loading="tableLoading" border :data="tableData" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" align="center" width="50"></el-table-column>
                    <el-table-column prop="code" label="优惠券编码"></el-table-column>
                    <el-table-column label="面额" align="center">
                        <template slot-scope="scope">
                            ￥{{scope.row.value}}
                        </template>
                    </el-table-column>
                    <el-table-column label="领取时间" align="center">
                        <template slot-scope="scope">
                            {{scope.row.createTime|formatDateAll}}
                        </template>
                    </el-table-column>
                    <el-table-column label="可用时间" align="center">
                        <template slot-scope="scope">
                            {{scope.row.startTime|formatDateAll}}
                        </template>
                    </el-table-column>
                    <el-table-column label="结束时间" align="center">
                        <template slot-scope="scope">
                            {{scope.row.expireTime|formatDateAll}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="nickName" label="领取人" align="center"></el-table-column>
                    <el-table-column label="使用时间" align="center">
                        <template slot-scope="scope">
                            {{scope.row.updateTime|formatDateAll}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="" label="状态" align="center">
                        <template slot-scope="scope">
                            <template v-if='scope.row.status == 0'>未使用</template>
                            <template v-else-if='scope.row.status == 1'>已使用</template>
                            <template v-else-if='scope.row.status == 2'>已失效</template>
                            <template v-else-if='scope.row.status == 3'>未激活</template>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                                <el-button v-if="scope.row.updateTime" @click="productInfo(scope.row)" type="primary">
                                    订单详情
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
                <div class="operate-table">
                    <el-popover placement="top" width="160" v-model="isShowPop">
                        <p>确定删除吗？</p>
                        <div style="text-align: right; margin: 0">
                            <el-button @click="batchOperate" type="primary" size="mini">确定</el-button>
                            <el-button size="mini" type="text" @click="isShowPop = false">取消</el-button>
                        </div>
                        <el-button slot="reference" @click="isShowPop = true">删除</el-button>
                    </el-popover>
                    <el-button type="primary">导出全部</el-button>
                </div>
        </el-card>
        <div class="mask" v-if="addMask">
            <div class="content">
                <div class="item"><span>剩余库存：</span>{{left}}份</div>
                <div class="item"><span>券值：</span>{{value}}</div>
                <div class="item"><span>追加数量：</span><el-input v-model="repertoryNumber"></el-input></div>
                <div style="text-align: center;margin-top: 30px">
                    <el-button type="primary" @click="addRepertory">确定</el-button>
                    <el-button @click="addMask=false">取消</el-button>
                </div>

            </div>
        </div>
    </div>
</template>


<script>
    import vBreadcrumb from '@/components/common/Breadcrumb.vue';
    import utils from '@/utils/index.js';
    import moment from 'moment';
    import { myMixinTable } from '@/JS/commom';
    import request from '@/http/http.js';

    export default {

        components: {
            vBreadcrumb
        },
        mixins: [myMixinTable],
        data() {
            return {
                nav: ['运营管理', '优惠券设置', '优惠券管理', '券数据'],
                // 权限控制

                form: {
                    getDate: '',
                    date: '',
                    status: ''
                },
                tableData: [],
                tableLoading: false,
                isShowPop: false,
                multipleSelection: [],
                page: {
                    currentPage: 1,
                    totalPage: 0
                },
                addMask: false,
                left: '', // 剩余数量
                value: '', // 券值
                repertoryNumber: '', // 库存
                params: {}// 传参
            };
        },

        activated() {
            this.params.id = this.$route.query.id || JSON.parse(sessionStorage.getItem('couponData')).id;
            this.repertoryNumber = '';
            this.getList(1);
        },

        methods: {

            //   提交表单
            getList(val) {
                const data = {
                    page: val,
                    pageSize: this.page.pageSize,
                    status: this.form.status,
                    couponConfigId: this.params.id,
                    receiveStartTime: this.form.getDate ? moment(this.form.getDate[0]).format('YYYY-MM-DD') : '',
                    receiveEndTime: this.form.getDate ? moment(this.form.getDate[1]).format('YYYY-MM-DD') : '',
                    availableStartTime: this.form.date ? moment(this.form.date[0]).format('YYYY-MM-DD') : '',
                    availableEndTime: this.form.date ? moment(this.form.date[1]).format('YYYY-MM-DD') : ''
                };
                this.page.currentPage = val;
                this.tableLoading = true;
                request.queryUserCouponList(data).then(res => {
                    if (!res.data) return;
                    this.tableData = [];
                    this.tableData = res.data.data;
                    this.page.totalPage = res.data.totalNum;
                    this.tableLoading = false;
                }).catch(error => {
                    console.log(error);
                    this.tableLoading = false;
                });
            },
            //   重置表单
            resetForm(formName) {
                this.form.date = '';
                this.form.getDate = '';
                this.$refs[formName].resetFields();
                this.getList(1);
            },
            // 全选
            handleSelectionChange(val) {
                const that = this;
                this.multipleSelection = [];
                val.forEach((v, k) => {
                    that.multipleSelection.push(v.id);
                });
            },

            // 查看详情
            productInfo(row) {
                sessionStorage.setItem('orderInfoId', row.id);
                this.$router.push({
                    name: 'orderInfo',
                    query: { orderInfoId: row.id }
                });
            },
            // 添加券库存
            addInventory() {
                this.addMask = true;
                this.left = this.params.left;
                this.value = this.params.status;
            },
            addRepertory() {
                const data = {
                    id: this.params.id,
                    repertoryNumber: this.repertoryNumber
                };
                if (!this.repertoryNumber) {
                    this.$message.warning('请输入库存!');
                    return;
                }
                request.addRepertory(data).then(res => {
                    this.addMask = false;
                    this.getList(1);
                }).catch(error => {
                    console.log(error);
                    this.tableLoading = false;
                });
            },

            // 批量操作
            batchOperate() {
                const data = {};
                // data.ids = this.multipleSelection.join(',');
                // data.ids = JSON.stringify(this.multipleSelection);
                data.ids = this.multipleSelection;
                request.bathVaildCoupon(data).then(res => {
                    this.$message.success(res.msg);
                    this.isShowPop = false;
                    this.getList(this.page.currentPage);
                }).catch(error => {
                    console.log(error);
                });
            }
        }
    };
</script>
<style lang='less'>
    .coupon-data {
        .add-product {
            margin: 0 0 20px 0;
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
                margin-right: 0;
            }
        }
        .operate-table {
            margin-top: 10px;
        }
        .el-button + .el-button {
            margin-left: 0;
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
        .mask{
            width: 100%;
            height:100%;
            background: rgba(0,0,0,.3);
            position: fixed;
            top:0;
            left: 0;
            z-index: 2;
            .content{
                margin: 300px auto;
                background: #fff;
                padding:30px;
                width: 400px;
                border-radius: 10px;
                .item{
                    line-height: 40px;
                    span{
                        width: 80px;
                        display: inline-block;
                        margin-left: 50px;
                    }
                    .el-input{
                        width: 210px;
                    }
                }
                .el-button:first-child{
                    margin-right: 30px;
                }
            }
        }
    }
</style>
