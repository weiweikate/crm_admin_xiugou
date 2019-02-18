<template>
    <div>
        <v-breadcrumb :nav="['运营管理','经验值专区管理']"></v-breadcrumb>
        <transition name="move" appear>
            <el-card style="margin:10px 0 20px">
                <el-form ref="form" :inline="true" :model="form" @submit.native.prevent>
                    <el-form-item prop="name" label="活动名称" label-width="120">
                        <el-input style="width:200px" placeholder="模糊搜索" v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item prop="status" label="活动状态">
                        <el-select v-model="form.status" placeholder="全部">
                            <el-option label="全部" value="">全部</el-option>
                            <el-option :label="value" :value="key" v-for="(value, key) in activeStatus" :key="key">{{value}}</el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="activeTime" label="活动时间" label-width="120">
                        <el-date-picker
                            v-model="form.activeTime"
                            type="datetimerange"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            :default-time="['00:00:00', '23:59:59']"
                        >
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item prop="adminName" label="更新者" label-width="120">
                        <el-input style="width:200px" placeholder="模糊搜索" v-model="form.adminName"></el-input>
                    </el-form-item>
                    <el-form-item prop="updateTime" label="更新时间" label-width="120">
                        <el-date-picker
                            v-model="form.updateTime"
                            type="datetimerange"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            :default-time="['00:00:00', '23:59:59']"
                        >
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-button native-type="submit" @click="getList(1)" type="primary">查询</el-button>
                        <el-button @click="resetForm('form')">重置</el-button>
                    </el-form-item>
                </el-form>
            </el-card>
        </transition>

        <el-card style="margin-top: 20px;">
            <el-button type="primary" @click="activeRegularDialog = true">活动规则</el-button>
            <!--<router-link to="/expAddOrEdit?type=add" class="el-button el-button&#45;&#45;primary el-button&#45;&#45;small" v-auth="'yunying.expManage.tj'">添加活动</router-link>-->
            <a href="#/expAddOrEdit?type=add" target="_blank" v-auth="'yunying.expManage.tj'" class="el-button el-button--primary el-button--small">添加活动</a>
            <el-table v-loading="tableLoading" :data="tableData" :height="height" border style="width: 100%;margin-top:20px;">
                <el-table-column prop="activityCode" label="活动ID" align="center" width="150"></el-table-column>
                <el-table-column prop="name" label="活动名称" width="100" align="center"></el-table-column>
                <el-table-column prop="couponId" label="券ID" width="150" align="center"></el-table-column>
                <el-table-column prop="startTime" label="开始时间" width="150" align="center">
                    <template slot-scope="scope">
                        {{scope.row.startTime | formatDateAll}}
                    </template>
                </el-table-column>
                <el-table-column prop="endTime" label="结束时间" width="150" align="center">
                    <template slot-scope="scope">
                        {{scope.row.endTime | formatDateAll}}
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="活动状态" width="100" align="center">
                    <template slot-scope="scope">
                        {{activeStatus[scope.row.status]}}
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间" width="150" align="center">
                    <template slot-scope="scope">
                        {{scope.row.createTime | formatDateAll}}
                    </template>
                </el-table-column>
                <el-table-column prop="adminName" label="最近更新者" width="100" align="center"></el-table-column>
                <el-table-column prop="updateTime" label="最近更新时间" width="150" align="center">
                    <template slot-scope="scope">
                        {{scope.row.updateTime | formatDateAll}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" min-width="300">
                    <template slot-scope="scope">
                        <!-- todo 0：删除1：未开始  2：进行中3：已结束 -->
                        <a :href="`#/expDetail?id=${scope.row.activityCode}`" target="_blank" v-auth="'yunying.expManage.ck'" class="el-button el-button--warning el-button--small">查看</a>
                        <!--  活动未开始|进行中才能编辑 -->
                        <a v-if="[1,2].includes(scope.row.status)" :href="`#/expAddOrEdit?id=${scope.row.activityCode}&type=edit`" target="_blank" v-auth="'yunying.expManage.bj'" class="el-button el-button--primary el-button--small">编辑</a>
                        <!--  活动未开始才能删除 -->
                        <el-button type="danger"  size="small" @click="delExpActive(scope.$index,scope.row)" v-if="scope.row.status === 1" v-auth="'yunying.expManage.sc'">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="paginate">
                <el-pagination
                    background
                    @size-change="handleSizeChange"
                    :page-size="page.pageSize"
                    @current-change="handleCurrentChange"
                    :current-page="page.currentPage"
                    layout="total, prev, pager, next, jumper"
                    :total="page.totalPage">
                </el-pagination>
            </div>
        </el-card>
        <el-dialog title="活动规则说明" :visible.sync="activeRegularDialog" center>
            <div class="dialog-body">
                <el-input type="textarea" :maxlength="300" :rows="10" v-model="regular"></el-input>
                <div style="text-align: right">{{regular.length}}/300</div>
            </div>
            <div class="dialog-footer" style="text-align: left" slot="footer">
                <el-button type="primary" @click="activeRemark" size="big">确 定</el-button>
                <el-button @click="activeRegularDialog = false" size="big">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import vBreadcrumb from '../../../common/Breadcrumb.vue';
    import request from '@/http/http';
    import { myMixinTable } from '@/JS/commom';

    export default {
        name: 'ExpActivity',
        components: {
            vBreadcrumb
        },
        mixins: [myMixinTable],
        data() {
            return {
                activeStatus: {
                    1: '未开始',
                    2: '进行中',
                    3: '已结束'
                },
                tableLoading: false,
                tableData: [],
                form: {
                    name: '',
                    status: '',
                    adminName: '',
                    activeTime: [],
                    updateTime: [],
                    actStartTime: '',
                    actEndTime: '',
                    updateStartTime: '',
                    updateEndTime: ''
                },
                regular: '',
                activeRegularDialog: false
            };
        },
        methods: {
            delExpActive(index, data) {
                const params = {
                    activityCode: data.activityCode
                };
                const _ = this;
                _.$confirm('删除后该活动不可查看及生效', '您确定要删除吗？', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    request.delExpActive(params).then(res => {
                        _.tableData.splice(index, 1);
                        _.$message({
                            type: 'success',
                            message: res.msg
                        });
                    }).catch(res => {
                        _.$message.warning(res.msg);
                    });
                }).catch(() => {
                    _.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            },
            showActive(data) {
                this.$router.push({ path: '/expDetail', query: { id: data.activityCode }});
            },
            editActive(data) {
                this.$router.push({ path: '/expAddOrEdit', query: { id: data.activityCode, type: 'edit' }});
            },
            // 获取活动列表
            getList(val) {
                const data = this.initRequestParams();
                data.page = val;
                data.pageSize = this.page.pageSize;
                this.tableLoading = true;
                request.queryExpPageList(this.$utils.trimForm(data)).then(res => {
                    this.tableLoading = false;
                    this.tableData = res.data.data;
                    this.page.totalPage = res.data.totalNum;
                    this.page.currentPage = res.data.currentPage;
                }).catch(res => {
                    this.tableLoading = false;
                    this.$message.warning(res.msg);
                });
            },
            initRequestParams() {
                const data = {
                    ...this.form
                };
                if (this.form.activeTime && this.form.activeTime.length) {
                    data.actStartTime = this.form.activeTime[0];
                    data.actEndTime = this.form.activeTime[1];
                }
                if (this.form.updateTime && this.form.updateTime.length) {
                    data.updateStartTime = this.form.updateTime[0];
                    data.updateEndTime = this.form.updateTime[1];
                }
                return data;
            },
            // 更新活动规则说明
            activeRemark() {
                const data = {
                    remark: this.regular
                };
                request.updateExpRemark(data).then(res => {
                    this.$message.warning('已更新活动规则');
                }).catch(res => {
                    this.activeRegularDialog = false;
                    this.$message.warning(res.msg);
                });
            },
            // 获取活动规则说明
            getRemark() {
                request.queryExpRemark().then(res => {
                    this.regular = res.data || '';
                }).catch(res => {
                    this.$message.warning(res.msg);
                });
            },
            //   重置表单
            resetForm(formName) {
                this.$refs[formName].resetFields();
                this.getList(1);
            }
        },
        mounted() {
            this.getList(1);
            this.getRemark();
        }
    };
</script>
<style lang='less' scoped>
    @import "styles/exp";
</style>
