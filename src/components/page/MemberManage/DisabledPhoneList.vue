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
                        <el-option value="2" label="更换手机号"></el-option>
                        <el-option value="1" label="注销账号"></el-option>
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
                    <template slot-scope="scope" v-if="scope.row.createTime">
                        <template>{{scope.row.createTime|formatDateAll}}</template>
                    </template>
                </el-table-column>
                <el-table-column label="解除时间" align="center">
                    <template slot-scope="scope" v-if="scope.row.relieveTime">
                        <template>{{scope.row.relieveTime|formatDateAll}}</template>
                    </template>
                </el-table-column>
                <el-table-column label="类型" align="center">
                    <template slot-scope="scope">
                        <template v-if='scope.row.type == 1'>注销账号</template>
                        <template v-else-if='scope.row.type == 2'>更换手机号</template>
                        <template v-else>-</template>
                    </template>
                </el-table-column>
                <el-table-column prop="operator" label="操作人" align="center"></el-table-column>
                <el-table-column label="操作时间" align="center">
                    <template slot-scope="scope" v-if="scope.row.operationTime">
                        <template>{{scope.row.operationTime|formatDateAll}}</template>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <span @click="cancleBind(scope.row)" v-if="!scope.row.operator" class="primary-text">解除禁用</span>
                        <span v-else class="grey-text">解除禁用</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <a v-auth="'vip.memberManage.xq'" :href="`#/memberDetail?memberToInfo=${scope.row.userCode}`" target="_blank" class="primary-text">查看详情</a>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!--解除禁用-->
        <el-dialog
            title="提示"
            :visible.sync="isCancle"
            width="500px"
        >
            <p class="tac">是否要解除该手机号禁用!</p>
            <span slot="footer" class="dialog-footer">
                <el-button :loading="btnLoading" type="primary" @click="submitCancle">确 定</el-button>
                <el-button @click="isCancle = false">取 消</el-button>
            </span>
        </el-dialog>
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
                isCancle: false,
                id: '',
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
            this.getList(this.page.currentPage);
        },
        methods: {
            // 解除绑定
            cancleBind(row) {
                this.id = row.id;
                this.isCancle = true;
            },
            submitCancle() {
                this.btnLoading = true;
                request.canclePhoneDisabled({ id: this.id }).then(res => {
                    this.btnLoading = false;
                    this.isCancle = false;
                    this.getList(this.page.currentPage);
                }).catch(err => {
                    console.log(err);
                    this.btnLoading = false;
                });
            },
            // 获取列表
            getList(val) {
                this.form.createTime = this.form.createTime ? this.form.createTime : [];
                this.form.cancleTime = this.form.cancleTime ? this.form.cancleTime : [];
                const data = {
                    createBeginTime: this.form.createTime.length === 0 ? '' : this.form.createTime[0],
                    createEndTime: this.form.createTime.length === 0 ? '' : this.form.createTime[1],
                    relieveBeginTime: this.form.cancleTime.length === 0 ? '' : this.form.cancleTime[0],
                    relieveEndTime: this.form.cancleTime.length === 0 ? '' : this.form.cancleTime[1],
                    operator: this.form.operateUser,
                    type: this.form.type,
                    phone: this.form.phone,
                    page: val,
                    pageSize: this.page.pageSize
                };
                this.tableLoading = true;
                request.queryDisabledPhonePageList(data).then(res => {
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
