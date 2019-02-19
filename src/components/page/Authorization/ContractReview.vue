<template>
    <div>
        <breadcrumb :nav="nav"></breadcrumb>
        <el-card>
            <el-form ref="form" :model="form" inline label-width="80px">
                <el-form-item prop="date" label="续约申请时间">
                    <el-date-picker v-model="form.date" type="datetimerange" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                </el-form-item>
                <el-form-item prop="levelId" label="用户层级">
                    <el-select v-model="form.levelId" placeholder="请选择">
                        <el-option v-for="(v,k) in level" :label="v.label" :value="v.value" :key="k"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="name" label="姓名">
                    <el-input v-model.trim="form.name"></el-input>
                </el-form-item>
                <el-form-item prop="telephone" label="电话">
                    <el-input v-model.trim="form.telephone"></el-input>
                </el-form-item>
                <el-form-item prop="provinceId" label="地址">
                    <region @regionMsg="getRegion" :regionMsg="oriAddress"></region>
                </el-form-item>
                <el-form-item label=" ">
                    <el-button type="primary" @click="getList(1)">搜索</el-button>
                    <el-button @click="resetForm('form')">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card class="con-card">
            <mr-flying parentClass="content-box">
                <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page.currentPage" layout="total, prev, pager, next, jumper" :total="page.totalPage"></el-pagination>
            </mr-flying>
            <el-table v-loading="tableLoading" class="w-table" stripe :data="tableData" :height="height" border style="width: 100%">
                <el-table-column prop="code" label="申请编号" width="180" align="center"></el-table-column>
                <el-table-column prop="nickname" label="申请人" align="center"></el-table-column>
                <el-table-column prop="phone" label="联系方式" align="center"></el-table-column>
                <el-table-column label="注册时间" align="center">
                    <template slot-scope="scope">{{scope.row.reg_time|formatDate}}</template>
                </el-table-column>
                <el-table-column prop="status" label="交易金额（累计）" align="center"></el-table-column>
                <el-table-column prop="upNum" label="下级代理" align="center"></el-table-column>
                <el-table-column prop="levelName" label="现层级" align="center"></el-table-column>
                <el-table-column prop="address" label="所在区域" align="center"></el-table-column>
                <el-table-column label="续约申请时间" align="center">
                    <template slot-scope="scope">{{scope.row.create_time|formatDate}}</template>
                </el-table-column>
                <el-table-column label="续约到期时间" align="center">
                    <template slot-scope="scope">{{scope.row.end_time|formatDate}}</template>
                </el-table-column>
                <el-table-column prop="istatus" label="状态" align="center">
                    <template slot-scope="scope">
                        <template v-if="scope.row.istatus == 1">已续约</template>
                        <template v-if="scope.row.istatus == 2">删除</template>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>
<script>
import breadcrumb from '../../common/Breadcrumb';
import region from '../../common/Region';
import * as api from '../../../api/api.js';
import moment from 'moment';
export default {
    components: {
        breadcrumb,
        region
    },
    data() {
        return {
            nav: ['授权审核管理', '续约审核'],
            level: [
                {
                    label: '体验VIP',
                    value: '体验VIP'
                },
                {
                    label: '实习省代',
                    value: '实习省代'
                },
                {
                    label: '省代',
                    value: '省代'
                },
                {
                    label: '荣誉总监',
                    value: '荣誉总监'
                },
                {
                    label: '明星CEO',
                    value: '明星CEO'
                },
                {
                    label: '执行总监',
                    value: '执行总监'
                }
            ],
            oriAddress: [],
            address: [],
            form: {
                date: '',
                levelId: '',
                name: '',
                telephone: '',
                provinceId: '',
                cityId: '',
                areaId: ''
            },
            tableLoading: false,
            tableData: [],
            height: '',
            page: {
                currentPage: 1,
                totalPage: 20
            }
        };
    },
    created() {
        const winHeight = window.screen.availHeight - 500;
        this.height = winHeight;
        this.getList(this.page.currentPage);
    },
    methods: {
        //  获取数据
        getList(val) {
            const data = {};
            data.beginTime = this.form.date[0] == undefined ? '' : moment(this.form.date[0]).format('YYYY-MM-DD HH:mm:ss');
            data.endTime = this.form.date[1] == undefined ? '' : moment(this.form.date[1]).format('YYYY-MM-DD HH:mm:ss');
            data.levelId = this.form.levelId;
            data.name = this.form.name;
            data.telephone = this.form.telephone;
            data.provinceId = this.address[0];
            data.cityId = this.address[1];
            data.areaId = this.address[2];
            data.page = val;
            this.tableLoading = true;
            console.log(data);
            this.$axios
                .post(api.queryPermitRecordList, data)
                .then(res => {
                    this.tableLoading = false;
                    if (res.data.code == 200) {
                        this.tableData = [];
                        this.tableData = res.data.data.data;
                        this.page.totalPage = res.data.data.resultCount;
                    } else {
                        this.tableLoading = false;
                        this.$message.warning(res.data.msg);
                    }
                })
                .catch(err => {
                    console.log(err);
                    this.tableLoading = false;
                });
        },
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            this.page.currentPage = val;
            this.getList(val);
        },

        //   重置表单
        resetForm(formName) {
            this.oriAddress = [];
            this.$refs[formName].resetFields();
        },

        // 获取省市区
        getRegion(msg) {
            this.address = msg;
        }
    }
};
</script>
<style lang="less" scoped>
.w-table {
    margin-top: 10px;
}
.con-card {
    margin-top: 20px;
}
.block {
    float: right;
    margin: 10px 0 10px 0;
}
</style>


