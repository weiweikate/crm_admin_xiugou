<template>
    <div class="withdrawal-tab">
        <el-table :data="table" border>
            <el-table-column prop='withdraw_num' label="提现编号" align="center"></el-table-column>
            <el-table-column prop='realname' label="申请人" align="center"></el-table-column>
            <el-table-column prop='withdraw_balance' label="申请提现金额" align="center">
                <template slot-scope="scope">
                    <span style="color:red">{{scope.row.withdraw_balance | handleMoney}}</span>
                </template>
            </el-table-column>
            <el-table-column prop='create_time' label="发起时间" align="center">
                <template slot-scope="scope" v-if='scope.row.create_time'>
                    {{scope.row.create_time | formatDate}}
                </template>
            </el-table-column>
            <el-table-column prop='bank_name' label="银行" align="center"></el-table-column>
            <el-table-column prop='card_no' label="提现卡号" align="center"></el-table-column>
            <el-table-column prop='status' label="状态" align="center">
                <template slot-scope="scope">
                    <template v-if='scope.row.status==0'>待确认</template>
                    <template v-else-if='scope.row.status==1'>已确认</template>
                    <template v-else-if='scope.row.status==2'>驳回</template>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="300px">
                <template slot-scope="scope">
                    <el-button @click="accountMsg(scope.row)" type="primary">账户明细</el-button>
                    <el-button @click="audit(scope.row,1)" v-if='scope.row.status == 0 && p.auditWithdrawMoney' type="danger">确认</el-button>
                    <el-button @click="audit(scope.row,2)" v-if='scope.row.status == 0 && p.auditWithdrawMoney' type="warning">驳回</el-button>
                    <el-button :loading="btnloading" @click="record(scope.row)" v-if='scope.row.status == 1 && p.queryWithdrawMoneyById' type="warning">打款记录</el-button>
                    <el-button :loading="refReaBtnLoading" @click="showRefuseReason(scope.row)" v-if='scope.row.status == 2 && p.queryRefusalReason' type="danger">查看驳回理由</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 同意/驳回弹窗 -->
        <el-dialog :title="title" :visible.sync="isShowAuditDia" center width="30%">
            <p v-if='status == 1' style="text-align:center;font-size:18px">确认({{name}})的提现申请?</p>
            <el-input v-if='status == 2' v-model="reason" rows="10" type="textarea" placeholder="请填写驳回理由"></el-input>
            <el-select style="margin-top:10px" @change="selectFastRep" v-if='status == 2' v-model="fastReplay" placeholder="请选择快捷回复">
                <el-option v-for="(v,k) in replayList" :key="k" :label="v.dValue" :value="v.dValue"></el-option>
            </el-select>
            <span slot="footer">
                <el-button type="primary" @click="confirmAudit">确 定</el-button>
                <el-button @click="isShowAuditDia = false">取 消</el-button>
            </span>
        </el-dialog>
        <!-- 打款记录 -->
        <el-dialog title="查看打款记录" :visible.sync="isShowRecord" center width="30%">
            <el-form :model="recordForm" label-width="130px" >
                <el-form-item prop="no" label="提现编号:">{{recordForm.no}}</el-form-item>
                <el-form-item prop="rePeople" label="申请人:">{{recordForm.rePeople}}</el-form-item>
                <el-form-item prop="money" label="申请提现金额:"><span style="color:red">{{recordForm.money | handleMoney}}</span></el-form-item>
                <el-form-item prop="beginTime" label="发起时间:">{{recordForm.beginTime}}</el-form-item>
                <el-form-item prop="blank" label="银行:">{{recordForm.blank}}</el-form-item>
                <el-form-item prop="card" label="提现卡号:">{{recordForm.card}}</el-form-item>
                <el-form-item prop="operatePeople" label="操作人:">{{recordForm.operatePeople}}</el-form-item>
                <el-form-item prop="confirmTime" label="确认时间:">{{recordForm.confirmTime}}</el-form-item>
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
import * as api from '@/api/SettlementMange/index.js';
import * as pApi from '@/privilegeList/SettlementMange/index.js';
import moment from 'moment';
import { queryDictonary } from '@/JS/commom';
export default {
    props: ['tableData'],
    mixins: [queryDictonary],
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
        // 权限控制
            p: {
                auditWithdrawMoney: false, // 同意/驳回提现
                queryWithdrawMoneyById: false, // 查看打款记录
                queryRefusalReason: false // 查看驳回理由
            },
            // 表格数据
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
            recordForm: {
                no: '', // 提现编号
                rePeople: '', // 申请人
                money: '', // 申请提现金额
                beginTime: '', // 发起时间
                blank: '', // 银行
                card: '', // 提现卡号
                operatePeople: '', // 操作人
                confirmTime: '' // 确认时间
            },
            btnloading: false,
            // 驳回理由弹窗
            isShowRefuseReason: false,
            refuseReason: '', // 驳回理由
            refReaBtnLoading: false
        };
    },

    created() {
        this.table = this.tableData;
        this.pControl();
    },

    methods: {
    // 权限控制
        pControl() {
            for (const k in this.p) {
                this.p[k] = utils.pc(pApi[k]);
            }
        },
        // 账户明细
        accountMsg() {
            this.$router.push('tradeInfo');
        },
        // 审核
        async audit(row, status) {
        // status: 1：同意 2：驳回
            this.id = row.id;
            this.status = status;
            this.name = row.realname;
            this.reason = '';
            this.fastReplay = '';
            if (status == 1) {
                this.title = '提现申请确认';
                this.auditUrl = api.agreeToWithdrawMoney;
            } else {
                this.title = `确认驳回${this.name}的提现申请?请填写理由`;
                this.auditUrl = api.rejectWithdrawMoney;
                await this.queryDictonary(10);
                this.replayList = this.tmpAxiosData;
            }
            this.isShowAuditDia = true;
        },
        confirmAudit() {
            const data = {};
            data.id = this.id;
            data.status = this.status;
            data.url = pApi.auditWithdrawMoney;
            if (this.status == 2) {
                data.reason = this.reason;
                if (data.reason == '') {
                    this.$message.warning('请填写拒绝理由!');
                    return;
                }
            }
            this.$axios.post(this.auditUrl, data).then(res => {
                this.$message.success(res.data.data.msg);
                this.$emit('updataData', true);
                this.isShowAuditDia = false;
            });
        },
        // 选择快捷回复
        selectFastRep(val) {
            this.reason = val;
        },
        // 打款记录
        record(row) {
            this.btnloading = true;
            this.$axios.post(api.queryWithdrawMoneyById, { id: row.id, url: pApi.queryWithdrawMoneyById }).then(res => {
                this.btnloading = false;
                this.recordForm.no = res.data.data.data.withdraw_num;
                this.recordForm.rePeople = res.data.data.data.realname;
                this.recordForm.money = res.data.data.data.withdraw_balance;
                this.recordForm.beginTime = res.data.data.data.create_time == null || undefined ? '' : moment(res.data.data.data.create_time).format('YYYY/MM/DD HH:mm');
                this.recordForm.blank = res.data.data.data.bank_name;
                this.recordForm.card = res.data.data.data.card_no;
                this.recordForm.operatePeople = res.data.data.data.adminName;
                this.recordForm.confirmTime = res.data.data.data.update_time == null || undefined ? '' : moment(res.data.data.data.update_time).format('YYYY/MM/DD HH:mm');
                this.isShowRecord = true;
            });
        },
        // 查看驳回理由
        showRefuseReason(row) {
            this.refReaBtnLoading = true;
            this.$axios.post(api.queryRefusalReason, { id: row.id, url: pApi.queryRefusalReason }).then(res => {
                this.refuseReason = res.data.data;
                this.isShowRefuseReason = true;
                this.refReaBtnLoading = false;
            });
        }
    }
};

</script>
<style lang='less' scoped>
.withdrawal-tab{
    /deep/.el-dialog{border-radius: 10px;.el-dialog__header{border-bottom: 1px solid #ccc;.el-dialog__title{color: #ff6868}}}
    .record-p{text-align: center;line-height: 30px}
}
</style>
