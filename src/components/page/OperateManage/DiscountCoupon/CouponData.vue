<template>
    <div class="coupon-data">
        <v-breadcrumb :nav='nav'></v-breadcrumb>
        <el-card :body-style="{ padding: '30px 45px',minHeight:'80vh' }">
            <div class="search-pane">、
                <el-form :model="form" ref='form' inline label-width="100px" @submit.native.prevent>
                    <el-form-item prop="getDate" label="领取时间" label-width="120">
                        <el-date-picker v-model="form.getDate" type="datetimerange" format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item prop="date" label="可用时间" label-width="120">
                        <el-date-picker v-model="form.date" type="datetimerange" format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期">
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
                        <el-button type="primary" native-type="submit" @click="getList(1)">搜索</el-button>
                        <el-button @click="resetForm('form')">重置</el-button>
                    </el-form-item>
                    <!--<el-form-item label=" ">-->
                    <!--<el-button type="primary" @click="addInventory">添加券库存</el-button>-->
                    <!--</el-form-item>-->
                </el-form>
            </div>
            <mr-flying parentClass="content-box">
                <el-pagination
                    background
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="page.currentPage"
                    :page-size="page.pageSize"
                    layout="total, prev, pager, next, jumper"
                    :total="page.totalPage">
                </el-pagination>
            </mr-flying>
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
                    <template slot-scope="scope" v-if="scope.row.status == 1">
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
            </el-table>
            <div class="operate-table">
                <el-popover placement="top" width="160" v-model="isShowPop">
                    <p>确定失效吗？</p>
                    <div style="text-align: right; margin: 0">
                        <el-button @click="batchOperate" type="primary" size="mini">确定</el-button>
                        <el-button size="mini" type="text" @click="isShowPop = false">取消</el-button>
                    </div>
                    <el-button slot="reference" @click="isShowPop = true">失效</el-button>
                </el-popover>
                <a ref="exportData" @click="downloadCouponData">
                    <el-button type="primary">导出全部</el-button>
                </a>
            </div>
        </el-card>
    </div>
</template>


<script>
import vBreadcrumb from '@/components/common/Breadcrumb.vue';
import moment from 'moment';
import { myMixinTable } from '@/JS/commom';
import request from '@/http/http.js';
import * as api from '@/api/api.js';
import utils from '@/utils/index.js';

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
            id: {}, // 传参
            downloadCouponList: '' // 导出接口地址
        };
    },

    activated() {
        this.id = this.$route.query.couponDataId || sessionStorage.getItem('couponDataId');
        this.getList(1);
        this.downloadCouponData();
    },

    methods: {
        downloadCouponData() {
            const params = {
                status: this.form.status,
                couponConfigId: this.id,
                receiveStartTime: this.form.getDate ? moment(this.form.getDate[0]).format('YYYY-MM-DD') : '',
                receiveEndTime: this.form.getDate ? moment(this.form.getDate[1]).format('YYYY-MM-DD') : '',
                availableStartTime: this.form.date ? moment(this.form.date[0]).format('YYYY-MM-DD') : '',
                availableEndTime: this.form.date ? moment(this.form.date[1]).format('YYYY-MM-DD') : ''
            };
            this.downloadCouponList = api.downloadCouponList + '?' + utils.setRequestParams(params);
            this.$refs.exportData.href = this.downloadCouponList;
        },
        //   提交表单
        getList(val) {
            const data = {
                page: val,
                pageSize: this.page.pageSize,
                status: this.form.status,
                couponConfigId: this.id,
                receiveStartTime: this.form.getDate ? moment(this.form.getDate[0]).format('YYYY-MM-DD') : '',
                receiveEndTime: this.form.getDate ? moment(this.form.getDate[1]).format('YYYY-MM-DD') : '',
                availableStartTime: this.form.date ? moment(this.form.date[0]).format('YYYY-MM-DD') : '',
                availableEndTime: this.form.date ? moment(this.form.date[1]).format('YYYY-MM-DD') : ''
            };
            this.page.currentPage = val;
            this.tableLoading = true;
            request
                .queryUserCouponList(data)
                .then(res => {
                    if (!res.data) return;
                    this.tableData = [];
                    this.tableData = res.data.data;
                    this.page.totalPage = res.data.totalNum;
                    this.tableLoading = false;
                })
                .catch(error => {
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
        // 批量操作
        batchOperate() {
            const data = {};
            data.ids = this.multipleSelection;
            if (!data.ids.length) {
                this.isShowPop = false;
                return this.$message.warning('请选择要失效的优惠券');
            }
            request
                .bathVaildCoupon(data)
                .then(res => {
                    this.$message.success(res.msg);
                    this.isShowPop = false;
                    this.getList(this.page.currentPage);
                })
                .catch(error => {
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
}
</style>