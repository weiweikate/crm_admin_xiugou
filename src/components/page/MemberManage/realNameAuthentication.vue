<template>
    <div class="real-name-auth">
        <v-breadcrumb :nav="['经销商会员管理','会员管理','实名认证记录']"></v-breadcrumb>
        <el-card style="margin:10px 0 20px">
            <el-form ref="form" :inline="true" :model="form" @submit.native.prevent>
                <!-- <el-form-item prop="code" label="授权码" label-width="120">
                    <el-input style="width:200px" placeholder="请输入用户授权码" v-model="form.code"></el-input>
                </el-form-item> -->
                <el-form-item prop="keyword" label="会员搜索" label-width="120">
                    <el-input style="width:200px" placeholder="可用户ID/授权码/昵称" v-model="form.keyword"></el-input>
                </el-form-item>
                <el-form-item prop="idNumber" label="证件号" label-width="120">
                    <el-input style="width:200px" placeholder="请输入用户证件号" v-model="form.idNumber"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button native-type="submit" type="primary" @click="getList(1)">查询</el-button>
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
            <template>
                <el-table :data="tableData" border>
                    <el-table-column  label="编号" type="index" align="center"></el-table-column>
                    <el-table-column  label="用户昵称" prop="nickName" align="center"></el-table-column>
                    <!-- <el-table-column  label="会员编号" prop="" align="center"></el-table-column>
                    <el-table-column  label="证件类型" prop="" align="center"></el-table-column> -->
                    <el-table-column  label="真实姓名" prop="realName" align="center"></el-table-column>
                    <el-table-column  label="证件号" prop="idcardNo" align="center"></el-table-column>
                    <el-table-column  label="状态" align="center">
                        <template slot-scope="scope">
                            <template v-if="scope.row.status==0">待审核</template>
                            <template v-else-if="scope.row.status==1">已通过</template>
                            <template v-else-if="scope.row.status==2">未通过</template>
                            <template v-else-if="scope.row.status==3">已驳回</template>
                        </template>
                    </el-table-column>
                    <el-table-column  label="操作" align="center">
                        <template slot-scope="scope">
                            <a v-if="scope.row.status==1" v-auth="'vip.realNameAuthentication.xq'" :href="`#/realNameInfo?memberInfoRealName=${scope.row.userCode}`" target="_blank" class="el-button el-button--primary el-button--small">详细信息</a>
                            <el-button v-if="scope.row.status==1" @click="refuseAudit(scope.row)" type="danger" v-auth="'vip.realNameAuthentication.bhrz'">驳回认证</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
        </div>
        <!-- 驳回认证 -->
        <el-dialog title="驳回理由" :visible.sync="dialogVisible" width="30%">
            <el-select v-model="freeReason" placeholder="请选择驳回理由" @change="changeReason">
                <el-option v-for="(v,k) in reasonList" :key="k" :label="v.value" :value="v.value"></el-option>
            </el-select>
            <el-input style="margin-top:10px" v-model="reason" placeholder="请输入驳回理由" type="textarea" :rows="10"></el-input>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="confirmRefuse">确 定</el-button>
                <el-button @click="dialogVisible = false">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import vBreadcrumb from '@/components/common/Breadcrumb.vue';
    import { getUserId, myMixinTable, queryDictonary } from '@/JS/commom.js';
    import request from '@/http/http';
    export default {
        components: {
            vBreadcrumb
        },
        mixins: [getUserId, myMixinTable, queryDictonary],
        data() {
            return {
                form: {
                    keyword: '',
                    idNumber: ''
                },
                page: {
                    currentPage: 1,
                    totalPage: 0
                },

                id: '',
                height: '',
                tableData: [],
                dialogVisible: false, // 驳回审核弹窗
                memberId: '', // 人员id
                reason: '', // 驳回理由
                freeReason: '', // 快捷驳回理由
                // 驳回理由列表
                reasonList: []
            };
        },
        activated() {
            this.getList(this.page.currentPage);
        },
        methods: {
            // 获取数据
            getList(val) {
                const data = {
                    page: val,
                    pageSize: this.page.pageSize,
                    keyword: this.form.keyword,
                    idCard: this.form.idNumber
                };
                this.tableLoading = true;
                request.queryUserCertification(data).then(res => {
                    this.tableLoading = false;
                    this.tableData = res.data.data;
                    this.page.totalPage = res.data.totalNum;
                    this.page.currentPage = res.data.currentPage;
                }).catch(err => {
                    this.tableLoading = false;
                    console.log(err);
                });
            },
            // 重置表单
            resetForm(formName) {
                this.$refs[formName].resetFields();
                this.getList(1);
            },
            // 实名认证页面
            realName(row) {
                this.$router.push({ name: 'realNameInfo', query: { memberInfoRealName: row.userCode }});
            },
            // 驳回审核
            async refuseAudit(row) {
                this.memberId = row.id;
                this.freeReason = '';
                this.reason = '';
                this.dialogVisible = true;
                await this.queryDictonary('SMBH');
                this.reasonList = this.tmpAxiosData;
            },
            confirmRefuse() {
                if (this.reason === '') {
                    this.$message.warning('请输入驳回理由');
                    return;
                }
                request.rejectCertificationById({ id: this.memberId, reason: this.reason }).then(res => {
                    this.$message.success(res.msg);
                    this.dialogVisible = false;
                    this.getList(this.page.currentPage);
                }).catch(err => {
                    console.log(err);
                });
            },
            // 切换快捷回复
            changeReason(val) {
                this.reason = val;
            }
        }
    };
</script>

<style lang='less' scoped>
.real-name-auth{
    /deep/.el-dialog{
        border-radius: 10px;
        .el-dialog__header{
            border-bottom: 1px solid #ddd;
            .el-dialog__title{
                color: #ff6868;
            }
        }
    }
}
</style>
