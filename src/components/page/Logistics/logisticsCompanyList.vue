<template>
    <div>
        <v-breadcrumb :nav="['物流管理','物流公司列表']"></v-breadcrumb>
        <el-card :body-style="{ padding: '20px 40px' }">
            <div class="search">
                <el-form :inline="true" :model="searchFields" class="demo-form-inline" ref="searchForm" @submit.native.prevent>
                    <el-form-item label="最近登录时间" prop="time">
                        <el-date-picker
                            v-model="searchFields.time"
                            type="daterange"
                            value-format="yyyy-MM-dd"
                            format="yyyy/MM/dd"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="物流公司编号" prop="expressNum">
                        <el-input v-model="searchFields.expressNum"></el-input>
                    </el-form-item>
                    <el-form-item label="物流公司编码" prop="code">
                        <el-input v-model="searchFields.code"></el-input>
                    </el-form-item>
                    <el-form-item label="状态" prop="status">
                        <el-select v-model="searchFields.status">
                            <el-option label="全部" value=""></el-option>
                            <el-option label="启用" :value="1"></el-option>
                            <el-option label="停用" :value="2"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" native-type="submit" @click="search">查询</el-button>
                        <el-button @click="searchReset">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
        <el-card :body-style="{ padding: '20px 40px'}" style="margin-top: 20px;">
            <el-button type="danger" size="big" class="mb20" @click="showDialog('add')" v-auth="'logistics.logisticsCompanyList.tj'">添加物流公司</el-button>
            <template>
                <el-table
                    :data="tableData"
                    border
                    style="width: 100%">
                    <el-table-column prop="expressNum" label="物流公司编号" align="center"></el-table-column>
                    <el-table-column prop="name" label="物流公司名称" align="center"></el-table-column>
                    <el-table-column prop="code" label="物流公司编码" align="center"></el-table-column>
                    <el-table-column prop="expressType" label="物流公司类型" align="center"></el-table-column>
                    <el-table-column prop="linkName" label="联系人" align="center"></el-table-column>
                    <el-table-column prop="linkNamePhone" label="联系人电话" width="120" align="center"></el-table-column>
                    <el-table-column prop="userAccount" label="最近更新者" width="120" align="center"></el-table-column>
                    <el-table-column prop="status" label="状态" align="center">
                        <template slot-scope="scope">
                            <template>{{scope.row.status === 1 ? '启用' : '停用'}}</template>
                        </template>
                    </el-table-column>
                    <el-table-column prop="sortRank" label="排序" align="center"></el-table-column>
                    <el-table-column prop="updateTime" label="更新时间" width="160" align="center">
                        <template slot-scope="scope">
                            <span v-if="scope.row.updateTime">{{scope.row.updateTime  | dateformat('YYYY-MM-DD HH:mm:ss')}}</span>
                            <span v-else>/</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="" align="center">
                        <template slot-scope="scope">
                            <el-button type="success" size="small" @click="editCompany(scope.$index, scope.row)" v-auth="'logistics.logisticsCompanyList.bj'">编辑</el-button>
                            <el-button v-auth="'logistics.logisticsCompanyList.tyqy'" v-if="scope.row.status == 1" type="danger" size="small" @click="disabledCompanytStatus(scope.$index, scope.row)">停用</el-button>
                            <el-button v-auth="'logistics.logisticsCompanyList.tyqy'" v-else type="primary" size="small" @click="enableCompanytStatus(scope.$index, scope.row)">启用</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
            <div class="pagination">
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
        </el-card>
        <el-dialog :title="dialogTitle" :visible.sync="dialog">
            <el-form :model="singleCompany" :rules="rules" label-width="120px" label-position="left" ref="ruleCompany">
                <el-form-item label="物流公司名称" prop="name">
                    <el-input v-model="singleCompany.name"></el-input>
                </el-form-item>
                <el-form-item label="物流公司编码" prop="code">
                    <el-input v-model="singleCompany.code"></el-input>
                </el-form-item>
                <el-form-item label="物流公司类型" prop="expressType">
                    <el-select v-model="singleCompany.expressType" placeholder="请选择">
                        <el-option label="快递企业" value="快递企业"></el-option>
                        <el-option label="货运企业" value="货运企业"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="联系人" prop="linkName">
                    <el-input v-model="singleCompany.linkName"></el-input>
                </el-form-item>
                <el-form-item label="联系人电话" prop="linkNamePhone">
                    <el-input v-model="singleCompany.linkNamePhone"></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-radio-group v-model="singleCompany.status">
                        <el-radio :label="1">启用</el-radio>
                        <el-radio :label="0">停用</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="序号">
                    <el-input v-model="singleCompany.sortRank"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialog = false">取 消</el-button>
                <el-button type="primary" @click="confirm">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import vBreadcrumb from '@/components/common/Breadcrumb.vue';
    import Vue from 'vue';
    import moment from 'moment';
    import request from '@/http/http';
    import { myMixinTable } from '@/JS/commom';
    import { regExpConfig } from '@/utils/regConfig';
    Vue.filter('dateformat', function(dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
        return moment(dataStr).format(pattern)

    });
    export default {
        name: 'logisticCompanyList',
        components: {
            vBreadcrumb
        },
        mixins: [myMixinTable],
        data() {
            return {
                tableData: [],
                dialog: false,
                dialogTitle: '添加物流公司',
                dialogType: 'add',
                singleCompany: {
                    id: null,
                    name: '',
                    status: 1,
                    expressNum: '',
                    expressType: '快递企业',
                    linkName: '',
                    linkNamePhone: '',
                    sortRank: '',
                    code: ''
                },
                rules: {
                    name: [
                        { required: true, message: '请输入物流公司名称', trigger: 'blur' },
                        { min: 2, max: 20, message: '请输入2-20位的名称', trigger: 'blur' }
                    ],
                    code: [
                        { required: true, message: '请输入物流公司编码', trigger: 'blur' },
                        { min: 2, max: 20, message: '请输入2-20位的编码', trigger: 'blur' }
                    ],
                    expressType: [
                        { required: true, message: '请输入物流公司类型', trigger: 'blur' }
                    ]
                },
                searchFields: {
                    time: [],
                    name: '',
                    code: '',
                    status: ''
                }
            };
        },
        methods: {
            disabledCompanytStatus(index, company) {
                const data = {
                    ids: company.id
                };
                request.disableExpress(data).then(res => {
                    this.getList(this.page.currentPage);
                }).catch(res => {

                });
            },
            enableCompanytStatus(index, company) {
                const data = {
                    ids: company.id
                };
                request.enableExpress(data).then(res => {
                    this.getList(this.page.currentPage);
                }).catch(res => {

                });
            },
            editCompany(index, company) {
                console.log(company);
                const { id, name, code, expressNum, expressType, linkName, linkNamePhone, sortRank, status } = company;
                this.singleCompany = {
                    id: id,
                    name: name,
                    code: code,
                    status: status,
                    expressNum: expressNum,
                    expressType: expressType,
                    linkName: linkName,
                    linkNamePhone: linkNamePhone,
                    sortRank: sortRank
                };
                this.showDialog('edit');
            },
            showDialog(type) {
                this.$refs['ruleCompany'] && this.$refs['ruleCompany'].resetFields();
                if (type === 'add') {
                    this.initCompany();
                } else {
                    this.dialogTitle = '编辑物流公司';
                }
                this.dialog = true;
                this.dialogType = type;
            },
            initCompany() {
                this.singleCompany = {
                    id: null,
                    name: '',
                    status: 1,
                    expressNum: '',
                    expressType: '快递企业',
                    linkName: '',
                    linkNamePhone: '',
                    sortRank: ''
                };
                this.dialogTitle = '添加物流公司';
            },
            confirm() {
                const _ = this;
                this.$refs['ruleCompany'].validate((valid) => {
                    if (valid) {
                        const phone = this.singleCompany.linkNamePhone;
                        if (phone && !regExpConfig.mobile.test(phone)) {
                            this.$message.error('请输入正确的手机号');
                            return;
                        }
                        if (this.dialogType === 'add') {
                            request.addExpress(this.singleCompany).then(res => {
                                _.dialog = false;
                                _.getList(1);
                            });
                        } else {
                            request.updateExpress(this.singleCompany).then(res => {
                                _.dialog = false;
                                _.getList(this.page.currentPage);
                            });
                        }
                    } else {
                        this.$message.error('something went wrong!!');
                        return false;
                    }
                });
            },
            searchReset() {
                this.searchFields = {
                    time: [],
                    name: '',
                    code: '',
                    status: ''
                };
                this.getList(1);
            },
            search() {
                this.getList(1);
            },
            getList(page) {
                const f = this.searchFields;
                const data = {
                    page: page,
                    code: f.code || '',
                    expressNum: f.expressNum || '',
                    status: f.status || '',
                    start: '',
                    end: ''
                };
                if (f.time && f.time.length) {
                    data.start = f.time[0];
                    data.end = f.time[1];
                }
                request.sysExpressQuery(data).then(res => {
                    const data = res.data;
                    this.tableData = data.data;
                    this.page.totalPage = res.data.totalNum;
                });
            }
        },
        mounted() {
            this.getList(1);
        }
    };
</script>
<style lang='less' scoped>
    .mb20 {
        margin-bottom: 20px;
    }
    .pagination .el-pagination{
        text-align: center;
    }
</style>
