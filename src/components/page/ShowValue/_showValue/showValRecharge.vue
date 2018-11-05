<template>
    <div class="show-val-recharge">
        <el-card>
            <el-form :model="form" ref='form' inline label-width="100px">
                <el-form-item prop="userCode" label="会员ID">
                    <el-input v-model="form.userCode" placeholder="模糊搜索"></el-input>
                </el-form-item>
                <el-form-item prop="nickName" label="会员昵称">
                    <el-input v-model="form.nickName" placeholder="模糊搜索"></el-input>
                </el-form-item>
                <el-form-item prop="level" label="会员层级">
                    <el-select v-model="form.level">
                        <el-option label="全部" value=""></el-option>
                        <el-option v-for="(v, k) in userLevel" :key="k" :label="v.name" :value="v.name"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="payType" label="充值类型">
                    <el-select v-model="form.payType">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="单人" value="1"></el-option>
                        <el-option label="批量" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="createAdminName" label="创建人">
                    <el-input v-model="form.createAdminName" placeholder="模糊搜索"></el-input>
                </el-form-item>
                <el-form-item prop="updateAdminName" label="处理人">
                    <el-input v-model="form.updateAdminName" placeholder="模糊搜索"></el-input>
                </el-form-item>
                <el-form-item prop="time" label="充值时间">
                    <el-date-picker type="datetimerange" v-model="form.time" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
                </el-form-item>
                <el-form-item label=" ">
                    <el-button type="primary" @click="getList(1)">搜 索</el-button>
                    <el-button @click="$refs['form'].resetFields()">重 置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card style="margin-top: 10px">
            <el-button type="primary" style="margin-bottom: 10px" @click="rechargeDia = true">秀值充值</el-button>
            <el-table v-loading="tabLoading" :data="tableData" border stripe>
                <el-table-column type="index" label="编号" align="center"></el-table-column>
                <el-table-column prop="payType" label="充值类型" align="center">
                    <template slot-scope="scope">
                        {{scope.row.payType == 1?'单人':'批量'}}
                    </template>
                </el-table-column>
                <el-table-column prop="accountType" label="账户类型" align="center">
                    <template slot-scope="scope">
                        {{scope.row.accountType == 1?'秀值账户':'/'}}
                    </template>
                </el-table-column>
                <el-table-column label="会员昵称/ID" min-width="100px" align="center">
                    <template slot-scope="scope">
                        <span @click="showUser(scope.row)" class="link">{{scope.row.nickName || '/'}}</span><br>
                        <span @click="showUser(scope.row)" class="link">{{scope.row.userCode || '/'}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="userLevel" label="层级" align="center"></el-table-column>
                <el-table-column prop="payCount" label="充值数" align="center"></el-table-column>
                <el-table-column prop="userNum" label="充值人数" align="center"></el-table-column>
                <el-table-column prop="payAmount" label="充值金额" align="center"></el-table-column>
                <el-table-column prop="createTime" label="充值时间" min-width="100px" align="center">
                    <template slot-scope="scope" v-if="scope.row.createTime">
                        {{scope.row.createTime | formatDateAll}}
                    </template>
                </el-table-column>
                <el-table-column prop="createAdminName" label="创建人" align="center"></el-table-column>
                <el-table-column prop="updateAdminName" label="处理人" align="center"></el-table-column>
                <el-table-column prop="status" label="状态" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status == 1">待审核</span>
                        <span v-else-if="scope.row.status == 2">已通过</span>
                        <span v-else-if="scope.row.status == 3">已驳回</span>
                    </template>
                </el-table-column>
                <el-table-column prop="remark" label="备注" align="center"></el-table-column>
                <el-table-column label="操作" align="center" width="200px">
                    <template v-if="scope.row.status == 1" slot-scope="scope">
                        <el-button :loading="scope.row.loading" @click="auditUser(scope.row, 2)" type="primary">通过</el-button>
                        <el-button :loading="scope.row.loading" @click="auditUser(scope.row, 3)" type="danger">驳回</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="block">
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
        <el-dialog
            title="秀值充值"
            :visible.sync="rechargeDia"
            width="500px"
            :before-close="handleClose">
            <p class="radio-group">
                <el-radio-group v-model="rechargeType" @change="changeRechargeType">
                    <el-radio label="single">单人充值</el-radio>
                    <el-radio label="batch">批量充值</el-radio>
                </el-radio-group>
            </p>
            <single v-show="rechargeType == 'single'" ref="single"></single>
            <batch v-show="rechargeType == 'batch'" ref="batch"></batch>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="confirmTopUp">确 定</el-button>
            <el-button @click="handleClose">取 消</el-button>
          </span>
        </el-dialog>
    </div>
</template>

<script>
import request from '@/http/http';
import { myMixinTable } from '@/JS/commom';
import utils from '@/utils/index';
import single from './singleRecharge';
import batch from './batchRecharge';
export default {
    props: ['status'],
    mixins: [myMixinTable],
    components: { single, batch },
    data() {
        return {
            form: {
                userCode: '',
                nickName: '',
                level: '',
                payType: '',
                createAdminName: '',
                updateAdminName: '',
                time: [],
                beginTime: '',
                endTime: ''
            },
            loading: false,
            tabLoading: false,
            userLevel: [],
            tableData: [],
            rechargeDia: false,
            rechargeType: 'single' // 充值类型 1： 单人 2：批量
        };
    },
    created() {
        this.getUserLevel();
    },
    methods: {
        // 提交表单
        getList(val) {
            if (!this.form.time) this.form.time = [];
            this.form.beginTime = this.form.time.length !== 0 ? utils.formatTime(this.form.time[0]) : '';
            this.form.endTime = this.form.time.length !== 0 ? utils.formatTime(this.form.time[1]) : '';
            const data = {
                ...this.form,
                page: val,
                pageSize: this.page.pageSize,
                status: this.status
            };
            this.tabLoading = true;
            request.queryRecordPageList(data).then(res => {
                this.tabLoading = false;
                if (res.data.data.length !== 0) {
                    res.data.data.forEach(v => {
                        v.loading = false;
                    });
                }
                this.tableData = res.data.data;
                this.page.totalPage = res.data.totalNum;
                this.page.currentPage = res.data.currentPage;
            }).catch(err => {
                this.tabLoading = false;
                console.log(err);
            });
        },
        // 获取会员层级
        getUserLevel() {
            request.getLevelList({}).then(res => {
                this.userLevel = res.data;
            }).catch(err => {
                console.log(err);
            });
        },
        // 确认充值
        confirmTopUp() {
            if (this.rechargeType == 'single') {
                const data = {
                    accountType: '1',
                    payType: '1',
                    userCode: this.$refs['single'].form.phone,
                    payCount: this.$refs['single'].form.money,
                    userNum: 1,
                    remark: this.$refs['single'].form.tip,
                    userLevel: this.$refs['single'].msg.levelName
                };
                if (data.userCode == '' || data.payCount == '') {
                    return this.$message.warning('请输入完整参数！');
                }
                this.loading = true;
                request.addRecord(data).then(res => {
                    this.loading = false;
                    this.$message.success(res.msg);
                    this.handleClose();
                    this.getList(this.page.currentPage)
                }).catch(err => {
                    this.loading = false;
                    this.$message.warning(err);
                });
            } else {
                const data = {
                    accountType: '1',
                    payType: '2',
                    payCount: this.$refs['batch'].form.money,
                    closingTime: utils.formatTime(this.$refs['batch'].form.date, 1),
                    signDays: this.$refs['batch'].form.signUp,
                    remark: this.$refs['batch'].form.tip,
                    payAmount: this.$refs['batch'].totalMoney,
                    userNum: this.$refs['batch'].totalNum,
                    userLevel: this.$refs['batch'].selectedUser
                };
                if (data.payCount == '' || data.closingTime == '' || data.signDays == '' || data.userLevel == '') return this.$message.warning('请输入完整参数！');
                if (data.userLevel === '') return this.$message.warning('请查询用户层级！');
                this.loading = true;
                request.addRecord(data).then(res => {
                    this.loading = false;
                    this.$message.success(res.msg);
                    this.handleClose();
                    this.getList(this.page.currentPage)
                }).catch(err => {
                    this.loading = false;
                    this.$message.warning(err);
                });
            }
        },
        handleClose() {
            this.$refs['batch'].form = {
                phone: '',
                date: new Date(),
                tip: '',
                signUp: '',
                checkedUsers: []
            };
            this.$refs['batch'].isSubmitForm = true;
            this.$refs['batch'].userCount = [];
            this.$refs['batch'].selectedUser = '';
            this.$refs['batch'].checkedAll = false;
            this.checkedAll = false;
            this.$refs['single'].form = {
                phone: '',
                money: '',
                tip: ''
            };
            this.$refs['single'].msg = {};
            this.$refs['single'].showMsg = false;
            this.rechargeType = 'single';
            this.rechargeDia = false;
        },
        // 修改充值状态
        changeRechargeType(val) {
            console.log(val);
        },
        // 查看分享任务人
        showUser(row) {
            if (row.userId) {
                this.$router.push({ name: 'memberDetail', query: { id: row.userId }});
            }
        },
        // 审核
        auditUser(row, status) {
            const data = {
                id: row.id,
                status: status
            };
            row.loading = true;
            request.updateRecordAudit(data).then(res => {
                row.loading = false;
                this.getList(this.page.currentPage);
                this.$message.success(res.msg);
            }).catch(err => {
                row.loading = false;
                console.log(err);
            });
        }
    }
};
</script>

<style lang="less" scoped>
.show-val-recharge{
    /*弹窗样式*/
    /deep/.el-dialog {
        border-radius: 10px;
        .el-dialog__header {
            border-bottom: 1px solid #eee;
            padding: 20px 20px 10px 50px;
            .el-dialog__title {
                color: #ff6868;
            }
        }
    }
    .radio-group{
        box-sizing: border-box;
        padding-left: 120px;
    }
    .link{
        cursor: pointer;
        color: #33b4ff;
    }
}
</style>
