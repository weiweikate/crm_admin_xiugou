<template>
    <div class="disabled-phone-list">
        <v-breadcrumb :nav="['会员管理','禁用手机号列表']"></v-breadcrumb>
        <el-card style="margin:10px 0 20px">
            <el-form ref="form" inline :model="form" @submit.native.prevent>
                <el-form-item prop="phone" label="手机号" label-width="120">
                    <el-input style="width:200px" v-model="form.phone"></el-input>
                </el-form-item>
                <el-form-item prop="createTime" label="创建时间">
                    <el-date-picker v-model="form.createTime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" type="datetimerange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                </el-form-item>
                <el-form-item prop="operateUser" label="操作人" label-width="120">
                    <el-input style="width:200px" v-model="form.operateUser"></el-input>
                </el-form-item>
                <el-form-item prop="type" label="类型" label-width="120">
                    <el-select v-model="form.type" placeholder="选择类型">
                        <el-option value="">全部</el-option>
                        <el-option value="1" label="更换手机号"></el-option>
                        <el-option value="2" label="注销账号"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="cancleTime" label="解除时间">
                    <el-date-picker v-model="form.cancleTime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" type="datetimerange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button native-type="submit" @click="handleCurrentChange(1)" type="primary">查询</el-button>
                    <el-button @click="resetForm('form')">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <div class="table-block">
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
            <el-table v-loading="tableLoading" :data="tableData" stripe border style="width: 100%">
                <el-table-column prop="id" label="编号" width="60" align="center"></el-table-column>
                <el-table-column prop="phone" label="手机号" align="center"></el-table-column>
                <el-table-column label="创建时间" align="center">
                    <template slot-scope="scope">
                        <template>{{scope.row.lastLoginTime|formatDateAll}}</template>
                    </template>
                </el-table-column>
                <el-table-column label="解除时间" align="center">
                    <template slot-scope="scope">
                        <template>{{scope.row.lastLoginTime|formatDateAll}}</template>
                    </template>
                </el-table-column>
                <el-table-column label="类型" align="center">
                    <template slot-scope="scope">
                        <template v-if='scope.row.userType == 1'>网信经销商</template>
                        <template v-else-if='scope.row.userType == 2'>供货经销商</template>
                        <template v-else-if='scope.row.userType == 3'>网红经销商</template>
                    </template>
                </el-table-column>
                <el-table-column prop="style" label="操作人"></el-table-column>
                <el-table-column label="操作时间" align="center">
                    <template slot-scope="scope">
                        <template>{{scope.row.lastLoginTime|formatDateAll}}</template>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <span class="primary-text">解除禁用</span>
                        <span class="grey-text">解除禁用</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    import vBreadcrumb from '@/components/common/Breadcrumb.vue';
    import { myMixinTable } from '@/JS/commom';
    import request from '@/http/http';

    export default {
        components: {
            vBreadcrumb
        },
        mixins: [myMixinTable],
        data() {
            return {
                tableData: [],
                tableLoading: false,
                btnLoading: false,
                form: {
                    createTime: [],
                    phone: '',
                    operateUser: '',
                    type: '',
                    cancleTime: []
                }
            };
        },
        mounted() {

        },
        methods: {
            // 获取列表
            getList(val) {
                const data = {
                    ...this.form
                };
                data.page = val;
                data.pageSize = this.page.pageSize;
                data.provinceId = this.address[0] == '0' ? '' : this.address[0];
                data.cityId = this.address[1];
                data.areaId = this.address[2];
                this.tableLoading = true;
                request.queryUserPageList(data).then(res => {
                    this.tableLoading = false;
                    this.tableData = [];
                    this.tableData = res.data.data;
                    this.page.totalPage = res.data.totalNum;
                }).catch(err => {
                    this.tableLoading = false;
                    console.log(err);
                });
            },
            //   重置表单
            resetForm(formName) {
                this.address = [];
                this.$refs[formName].resetFields();
                this.getList(this.page.currentPage);
            }
        }
    };
</script>

<style lang="less">
    .disabled-phone-list {
    }
</style>
