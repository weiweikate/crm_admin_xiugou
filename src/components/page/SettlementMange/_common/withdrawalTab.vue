<template>
    <div class="withdrawal-tab">
        <el-table :data="table" v-loading="pageLoading" border>
            <el-table-column prop='withdrawNum' label="提现编号" align="center"></el-table-column>
            <el-table-column prop='userName' label="申请人" align="center"></el-table-column>
            <el-table-column prop='withdrawBalance' label="申请提现金额" align="center">
                <template slot-scope="scope">
                    <span style="color:red">{{scope.row.withdrawBalance || 0 | handleMoney}}</span>
                </template>
            </el-table-column>
            <el-table-column prop='createTime' label="发起时间" align="center">
                <template slot-scope="scope" v-if='scope.row.createTime'>
                    {{scope.row.createTime | formatDateAll}}
                </template>
            </el-table-column>
            <el-table-column prop='bankName' label="银行" align="center"></el-table-column>
            <el-table-column prop='cardNo' label="提现卡号" align="center"></el-table-column>
            <el-table-column prop='status' label="状态" align="center">
                <template slot-scope="scope">
                    <template v-if='scope.row.status==1'>待确认</template>
                    <template v-else-if='scope.row.status==2'>已确认</template>
                    <template v-else-if='scope.row.status==3'>驳回</template>
                </template>
            </el-table-column>
            <el-table-column prop='applyStatus' label="提现状态" align="center">
                <template slot-scope="scope">
                    <template v-if='scope.row.applyStatus==1'>待确认</template>
                    <template v-else-if='scope.row.applyStatus==2'>交易待受理</template>
                    <template v-else-if='scope.row.applyStatus==3'>交易已受理(成功)</template>
                    <template v-else-if='scope.row.applyStatus==4'>交易受理失败(失败)</template>
                    <template v-else>-</template>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="300px">
                <template slot-scope="scope">
                    <el-button @click="accountMsg(scope.row)" type="primary">账户明细</el-button>
                    <el-button @click="audit(scope.row,1)" v-if='scope.row.status == 1' type="danger">确认</el-button>
                    <el-button @click="audit(scope.row,2)" v-if='scope.row.status == 1' type="warning">驳回</el-button>
                    <el-button :loading="btnloading" @click="record(scope.row)" v-if='scope.row.status == 2' type="warning">打款记录</el-button>
                    <!--<el-button :loading="refReaBtnLoading" @click="showRefuseReason(scope.row)" v-if='scope.row.status == 3' type="danger">查看驳回理由</el-button>-->
                    <el-button :loading="refReaBtnLoading" @click="audit(scope.row,2)" v-if='scope.row.status == 3' type="danger">查看驳回理由</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="block">
            <el-pagination
                background
                :page-size="page.pageSize"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="page.currentPage"
                layout="total, prev, pager, next, jumper"
                :total="page.totalPage">
            </el-pagination>
        </div>
        <!-- 同意/驳回弹窗 -->
        <el-dialog :title="title" :visible.sync="isShowAuditDia" center width="30%">
            <p v-if='status == 1' style="text-align:center;font-size:18px">确认({{name}})的提现申请?</p>
            <el-select style="margin-top:10px" @change="selectFastRep" v-if='status == 2' v-model="fastReplay" placeholder="请选择驳回理由">
                <el-option label="账号异常" value="账号异常"></el-option>
                <el-option label="其他" value="其他"></el-option>
            </el-select>
            <div class="refuse-reason">
                <el-input v-if='status == 2 && fastReplay == "其他"' v-model="reason" :maxlength="180" rows="10" type="textarea" placeholder="请填写驳回理由"></el-input>
                <span v-if='status == 2 && fastReplay == "其他"' class="tip">{{reason.length}}/180</span>
            </div>
            <span slot="footer">
                <el-button type="primary" @click="confirmAudit">确 定</el-button>
                <el-button @click="isShowAuditDia = false">取 消</el-button>
            </span>
        </el-dialog>
        <!-- 打款记录 -->
        <el-dialog title="查看打款记录" :visible.sync="isShowRecord" center width="30%">
            <el-form :model="recordForm" label-width="130px">
                <el-form-item prop="no" label="提现编号:">{{recordForm.withdrawNum}}</el-form-item>
                <el-form-item prop="rePeople" label="申请人:">{{recordForm.userName}}</el-form-item>
                <el-form-item prop="money" label="申请提现金额:"><span style="color:red">{{(recordForm.withdrawBalance || 0) | handleMoney}}</span></el-form-item>
                <el-form-item prop="beginTime" label="发起时间:">{{recordForm.createTime | formatDateAll}}</el-form-item>
                <el-form-item prop="blank" label="银行:">{{recordForm.bankName}}</el-form-item>
                <el-form-item prop="card" label="提现卡号:">{{recordForm.cardNo}}</el-form-item>
                <el-form-item prop="applyStatus" label="提现状态:">
                    <template v-if='recordForm.applyStatus==1'>待确认</template>
                    <template v-else-if='recordForm.applyStatus==2'>交易待受理</template>
                    <template v-else-if='recordForm.applyStatus==3'>交易已受理(成功)</template>
                    <template v-else-if='recordForm.applyStatus==4'>交易受理失败(失败)</template>
                    <template v-else>-</template>
                </el-form-item>
                <el-form-item prop="operatePeople" label="操作人:">{{recordForm.adminName}}</el-form-item>
                <el-form-item prop="confirmTime" label="确认时间:">{{recordForm.updateTime | formatDateAll}}</el-form-item>
            </el-form>
            <span slot="footer">
                <el-button type="primary" @click="isShowRecord = false">确 定</el-button>
                <el-button @click="isShowRecord = false">取 消</el-button>
            </span>
        </el-dialog>
        <!-- 驳回理由弹窗 -->
        <el-dialog title="驳回理由" :visible.sync="isShowRefuseReason" center width="30%">
            <p style="text-align:center;font-size:16px">{{refuseReason}}</p>
            <span slot="footer">
                <el-button type="primary" @click="isShowRefuseReason = false">确 定</el-button>
                <el-button @click="isShowRefuseReason = false">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import utils from '@/utils/index.js';
import moment from 'moment';
import { queryDictonary, myMixinTable } from '@/JS/commom';
import request from '@/http/http';
export default {
    props: ['tableData'],
    mixins: [queryDictonary, myMixinTable],
    components: {},

    watch: {
        tableData: {
            handler(val) {
                this.table = val;
            },
            deep: true
        }
    },

    data() {
        return {
            pageLoading: false,
            form: {},
            table: [],
            // 快捷回复列表
            replayList: [
            // {label:'您的账户存在异常，请确认后再次提交',value:0}
            ],
            // 提现id
            id: '',
            title: '',
            status: '', // status: 1：同意 2：驳回
            auditUrl: '', // 审核接口url
            name: '', // 申请体现人姓名
            reason: '', // 驳回理由
            fastReplay: '', // 快捷回复
            // 同意/驳回弹窗
            isShowAuditDia: false,
            // 查看打款记录弹窗
            isShowRecord: false,
            recordForm: {},
            btnloading: false,
            // 驳回理由弹窗
            isShowRefuseReason: false,
            refuseReason: '', // 驳回理由
            refReaBtnLoading: false
        };
    },

    methods: {
        //  查询
        getList(val) {
            const data = {};
            data.userName = this.form.applyPeople;
            data.status = this.form.status == 'all' ? '' : this.form.status;
            data.applyStatus = this.form.applyStatus;
            data.withdrawNum = this.form.withdraNo;
            data.startTime = this.form.time.length == 0 ? '' : utils.formatTime(this.form.time[0], 1);
            data.endTime = this.form.time.length == 0 ? '' : utils.formatTime(this.form.time[1], 1);
            data.page = val;
            data.pageSize = this.page.pageSize;
            this.pageLoading = true;
            request.queryUserWithdrawList(data).then(res => {
                this.pageLoading = false;
                this.table = res.data.data;
                this.page.totalPage = res.data.totalNum;
            }).catch(err => {
                this.pageLoading = false;
                console.log(err);
            });
        },
        // 账户明细
        accountMsg(row) {
            this.$router.push({ path: '/cashAccountBalance', query: { memberAccMsg: {memberId: row.id, nickname: row.userName || ''} }});
        },
        // 审核
        audit(row, status) {
        // status: 1：同意 2：驳回
            this.id = row.id;
            this.status = status;
            this.name = row.userName;
            this.reason = '';
            this.fastReplay = '';
            if (status == 1) {
                this.title = '提现申请确认';
            } else {
                this.title = `确认驳回${this.name}的提现申请?请填写理由`;
            }
            this.isShowAuditDia = true;
        },
        confirmAudit() {
            const data = {};
            data.id = this.id;
            data.type = this.status;
            if (this.status == 2) {
                data.reason = this.reason;
                if (data.reason == '') {
                    this.$message.warning('请填写拒绝理由!');
                    return;
                }
            }
            request.updateApply(data).then(res => {
                this.$message.success(res.msg);
                this.handleCurrentChange(this.page.currentPage);
                this.isShowAuditDia = false;
            }).catch(err => {
                console.log(err);
            });
        },
        // 选择快捷回复
        selectFastRep(val) {
            this.reason = val === '账号异常' ? '您的账户存在异常，请确认后再次提交' : '';
        },
        // 打款记录
        record(row) {
            this.isShowRecord = true;
            request.findUserWithdrawById({ id: row.id }).then(res => {
                this.recordForm = res.data;
            }).catch(err => {
                console.log(err);
            });
        },
        // 查看驳回理由
        showRefuseReason(row) {
            this.refReaBtnLoading = true;
            request.findUserWithdrawById({ id: row.id }).then(res => {
                this.refuseReason = res.data.refusalReason;
                this.isShowRefuseReason = true;
                this.refReaBtnLoading = false;
            }).catch(err => {
                console.log(err);
            });
        }
    }
};

</script>
<style lang='less' scoped>
.withdrawal-tab{
    /deep/.el-dialog{border-radius: 10px;.el-dialog__header{border-bottom: 1px solid #ccc;.el-dialog__title{color: #ff6868}}}
    .record-p{text-align: center;line-height: 30px}
    .refuse-reason{
        position: relative;
        .tip{
            position: absolute;
            bottom: 0px;
            right: 8px;
        }
    }
}
</style>
