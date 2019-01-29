<template>
    <div class="deliver-coupon">
        <v-breadcrumb :nav='nav'></v-breadcrumb>
        <el-card class="mb10">
            <el-form :model="form" ref="form" @submit.native.prevent inline label-width="120px">
                <el-form-item prop="genre" label="发放方式">
                    <el-select v-model="form.genre">
                        <el-option label="全部" value=""></el-option>
                        <!--<el-option label="条件发放" value="1"></el-option>-->
                        <el-option label="定向发放" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="status" label="审核状态">
                    <el-select v-model="form.status">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="审核中" value="1"></el-option>
                        <el-option label="已审核" value="2"></el-option>
                        <el-option label="审核驳回" value="3"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="auditor" label="审核人">
                    <el-input v-model="form.auditor"></el-input>
                </el-form-item>
                <el-form-item prop="auditTime" label="审核时间">
                    <el-date-picker type="datetimerange" format="yyyy-MM-dd" value-format="yyyy-MM-dd" v-model="form.auditTime" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
                </el-form-item>
                <el-form-item prop="operator" label="创建人">
                    <el-input v-model="form.operator"></el-input>
                </el-form-item>
                <el-form-item prop="createTime" label="创建时间">
                    <el-date-picker type="datetimerange" format="yyyy-MM-dd" value-format="yyyy-MM-dd" v-model="form.createTime" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
                </el-form-item>
                <el-form-item label=" ">
                    <el-button native-type="submit" @click="getList(1)" type="primary">查 询</el-button>
                    <el-button @click="resetForm('form')" >重 置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card>
            <el-button type="primary" class="mb10" @click="dialogVisible = true" v-auth="'yunying.marketToolsManage.youhuiquan.fafang'">发放优惠券</el-button>
            <el-table :data="tableData" border stripe v-loading="pageLoading">
                <el-table-column type="index" label="编号" align="center"></el-table-column>
                <el-table-column prop="couponName" label="优惠券名称" min-width="150px" align="center"></el-table-column>
                <el-table-column prop="couponConfigId" label="优惠券ID" align="center"></el-table-column>
                <el-table-column prop="couponType" label="优惠券类型" align="center">
                    <template slot-scope="scope">
                        {{couponType[scope.row.couponType]}}
                    </template>
                </el-table-column>
                <el-table-column prop="genre" label="发放方式" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.genre == 1">条件发放</span>
                        <span v-else-if="scope.row.genre == 2">定向发放</span>
                        <span v-else>-</span>
                    </template>
                </el-table-column>
                <el-table-column prop="personNum" label="发放人数" align="center">
                    <template slot-scope="scope">
                        <span>{{scope.row.personNum || 0}}人</span>
                    </template>
                </el-table-column>
                <el-table-column label="审核状态" align="center">
                    <template slot-scope="scope">
                        <template v-if="scope.row.status==1">审核中</template>
                        <template v-else-if="scope.row.status==2 || scope.row.status==4 || scope.row.status==5">已审核</template>
                        <template v-else-if="scope.row.status==3">审核驳回</template>
                        <template v-else>-</template>
                    </template>
                </el-table-column>
                <el-table-column label="发送状态" align="center">
                    <template slot-scope="scope">
                        <template v-if="scope.row.status==4">发送中</template>
                        <template v-else-if="scope.row.status==2">待发送</template>
                        <template v-else-if="scope.row.status==5">发送结束</template>
                        <template v-else>-</template>
                    </template>
                </el-table-column>
                <el-table-column prop="submitName" label="创建人" align="center"></el-table-column>
                <el-table-column label="创建时间" min-width="150px" align="center">
                    <template slot-scope="scope">{{scope.row.createTime|formatDateAll}}</template>
                </el-table-column>
                <el-table-column prop="remark" label="备注" align="center"></el-table-column>
                <el-table-column prop="reviewName" label="审核人" align="center"></el-table-column>
                <el-table-column label="审核时间" align="center" min-width="150px">
                    <template slot-scope="scope">{{scope.row.auditTime|formatDateAll}}</template>
                </el-table-column>
                <el-table-column prop="reply" label="审核说明" align="center"></el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <div v-auth="'yunying.marketToolsManage.youhuiquan.shenhe'">
                            <span v-if="scope.row.status == 1" @click="auditRow(scope.row)" class="primary-text">审核</span>
                            <span v-else>-</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <div v-auth="'yunying.marketToolsManage.youhuiquan.fasong'">
                            <span v-if="scope.row.status == 2" @click="sendTask(scope.row)" class="primary-text">发送</span>
                            <span v-else-if="scope.row.status == 5" class="grey-text">已发送</span>
                            <span v-else>-</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" min-width="100px" align="center">
                    <template slot-scope="scope">
                        <span v-auth="'yunying.marketToolsManage.youhuiquan.chakan'" @click="toDetail(scope.row.id)" class="primary-text">查看</span>
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
        </el-card>
        <!--发放优惠券-->
        <el-dialog
            title="优惠券发放"
            :visible.sync="dialogVisible"
            width="500px"
            :before-close="handleClose">
            <el-form :model="queryForm" :rules="rules" ref="queryForm" inline label-width="100px">
                <el-form-item prop="couponId" label="优惠券ID">
                    <el-input class="w200" v-model="queryForm.couponId" @input="queryCoupon"></el-input>
                    <el-select style="width: 100px" v-model="queryForm.couponType">
                        <el-option label="普通优惠券" value="1"></el-option>
                        <!--<el-option label="周期券" value="2"></el-option>-->
                        <!--<el-option label="靓号体验券" value="3"></el-option>-->
                        <!--<el-option label="拼店体验券" value="4"></el-option>-->
                    </el-select>
                </el-form-item>
                <el-form-item label=" " v-if="selectedCoupon">
                    <span class="over-more-hidden w305 grey-text">{{selectedCoupon}}</span>
                </el-form-item>
                <el-form-item prop="deliverWays" label="发放方式">
                    <el-radio-group v-model="queryForm.deliverWays" @change="resetQueryForm">
                        <!--<el-radio label="1">条件发放</el-radio>-->
                        <el-radio label="2">定向发放</el-radio>
                    </el-radio-group>
                </el-form-item>
                <!--条件发放-->
                <!--<template v-if="queryForm.deliverWays == 1">-->
                    <!--<el-form-item label="发放层级">-->
                        <!--<el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>-->
                        <!--<el-checkbox-group class="w305" v-model="queryForm.deliverLevels" @change="handleCheckedCitiesChange">-->
                            <!--<el-checkbox v-for="(v,k) in levelList" :label="v.id" :key="k">{{v.name}}</el-checkbox>-->
                        <!--</el-checkbox-group>-->
                    <!--</el-form-item>-->
                    <!--<el-form-item prop="regDate" label="注册时间">-->
                        <!--<el-date-picker class="w305" type="datetimerange" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" v-model="queryForm.regDate" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>-->
                    <!--</el-form-item>-->
                    <!--<el-form-item label=" ">-->
                        <!--<div class="diliver-num">-->
                            <!--<span>发放人数：{{replacementNum}}</span>-->
                            <!--<el-button :loading="queryLoading" @click="queryNum" type="primary">查 询</el-button>-->
                        <!--</div>-->
                    <!--</el-form-item>-->
                <!--</template>-->
                <!--定向发放-->
                <template>
                    <el-form-item prop="deliverNumber" label="发放号码">
                        <el-input class="w305" type="textarea" :rows="10" v-model="queryForm.deliverNumber"></el-input>
                        <div class="grey-text">注：请输入补发手机号，一次最多导入1000条数据</div>
                    </el-form-item>
                </template>
                <el-form-item prop="tip" label="备注">
                    <template style="position: relative">
                        <el-input class="w305" :maxlength="180" type="textarea" :autosize="{ minRows: 6, maxRows: 6 }" v-model="queryForm.tip"></el-input>
                        <span class="tip">{{tipLength}}/180</span>
                    </template>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" :loading="submitLoading" :disabled="!replacementNum && queryForm.deliverWays == 1" @click="confirmDeliver">确 定</el-button>
                <el-button @click="handleClose">取 消</el-button>
            </span>
        </el-dialog>
        <!--审核-->
        <el-dialog
            title="审核"
            :visible.sync="auditVisible"
            width="500px"
            :before-close="handleAuditClose"
        >
            <el-form :model="auditForm" :rules="auditRules" ref="auditForm" inline label-width="100px">
                <el-form-item prop="auditRes" label="审核结果">
                    <el-radio-group v-model="auditForm.auditRes">
                        <el-radio label="2">审核通过</el-radio>
                        <el-radio label="3">审核驳回</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item prop="reason" label="备注">
                    <template style="position: relative">
                        <el-input class="w305" :maxlength="180" type="textarea" :autosize="{ minRows: 6, maxRows: 6 }" v-model="auditForm.reason"></el-input>
                        <span class="tip">{{reasonLength}}/180</span>
                    </template>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button type="primary" :loading="auditLoading" @click="confirmAudit">确 定</el-button>
                <el-button @click="handleAuditClose">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import vBreadcrumb from '@/components/common/Breadcrumb.vue';
    import { myMixinTable } from '@/JS/commom';
    import request from '@/http/http.js';

    export default {
        mixins: [myMixinTable],
        components: { vBreadcrumb },
        data() {
            return {
                nav: ['运营管理', '营销工具管理', '优惠券发放列表'],
                couponType: { 1: '满减券', 2: '抵价券', 3: '折扣券', 4: '抵扣券' },
                dialogVisible: false,
                pageLoading: false,
                queryLoading: false,
                submitLoading: false,
                auditVisible: false,
                auditLoading: false,
                levelList: [],
                form: {
                    genre: '',
                    status: '',
                    auditor: '',
                    auditTime: [],
                    operator: '',
                    createTime: []
                },
                checkAll: false,
                isIndeterminate: false,
                couponTypeSelf: '',
                queryForm: {
                    couponId: '',
                    couponType: '1',
                    deliverWays: '2',
                    deliverLevels: [],
                    deliverNumber: '',
                    regDate: [],
                    tip: ''
                },
                auditId: '',
                auditForm: {
                    auditRes: '2',
                    reason: ''
                },
                auditRules: {
                    auditRes: [
                        { required: true, message: '请选择审核结果', trigger: 'blur' }
                    ]
                },
                replacementNum: 0,
                selectedCoupon: null,
                timer: null,
                rules: {
                    couponId: [
                        { required: true, message: '请输入优惠券ID', trigger: 'blur' }
                    ],
                    deliverWays: [
                        { required: true, message: '请选择补发方式', trigger: 'blur' }
                    ]
                },
                tableData: [{ id: '1' }]
            };
        },
        computed: {
            tipLength() {
                return this.queryForm.tip.length || 0;
            },
            reasonLength() {
                return this.auditForm.reason.length || 0;
            }
        },
        mounted() {
            this.getLevelList();
            this.getList(this.page.currentPage);
        },
        methods: {
            getList(val) {
                this.pageLoading = true;
                this.form.auditTime = this.form.auditTime ? this.form.auditTime : [];
                this.form.createTime = this.form.createTime ? this.form.createTime : [];
                const data = {
                    page: val,
                    pageSize: this.page.pageSize,
                    type: 1,
                    ...this.form,
                    auditBeginTime: this.form.auditTime.length === 0 ? '' : this.form.auditTime[0],
                    auditEndTime: this.form.auditTime.length === 0 ? '' : this.form.auditTime[1],
                    beginCreateTime: this.form.createTime.length === 0 ? '' : this.form.createTime[0],
                    endCreateTime: this.form.createTime.length === 0 ? '' : this.form.createTime[1]
                };
                this.page.currentPage = val;
                this.tableData = [];
                request.queryReissuePageList(data).then(res => {
                    this.pageLoading = false;
                    this.tableData = res.data.data;
                    this.page.totalPage = res.data.totalNum;
                }).catch(err => {
                    this.pageLoading = false;
                    console.log(err);
                });
            },
            // 获取层级列表
            getLevelList() {
                const data = {};
                request.getUserLevelList(data).then(res => {
                    const resData = res.data || {};
                    if (resData && resData.length !== 0) {
                        const tmp = [];
                        resData.forEach(v => {
                            tmp.push({
                                id: v.id,
                                name: `v${v.level}`
                            });
                        });
                        this.levelList = [...tmp];
                    }
                }).catch(err => {
                    console.log(err);
                });
            },
            // 层级全选操作
            handleCheckAllChange(val) {
                const allList = this.levelList.map(v => v.id);
                this.queryForm.deliverLevels = val ? allList : [];
                this.isIndeterminate = false;
            },
            // 层级单选操作
            handleCheckedCitiesChange(value) {
                const checkedCount = value.length;
                this.checkAll = checkedCount === this.levelList.length;
                this.isIndeterminate = checkedCount > 0 && checkedCount < this.levelList.length;
            },
            // 查询优惠券
            queryCoupon() {
                if (!this.queryForm.couponId) return;
                this.selectedCoupon = '正在查询...';
                clearInterval(this.timer);
                this.timer = setTimeout(() => {
                    request.getCouponById({ id: this.queryForm.couponId }).then(res => {
                        const resData = res.data || {};
                        if (resData.status == 2) {
                            this.selectedCoupon = resData.name || 0;
                            this.couponTypeSelf = resData.type || null;
                        } else {
                            this.selectedCoupon = '该优惠券不可用!';
                            this.couponTypeSelf = null;
                        }
                    }).catch(err => {
                        this.selectedCoupon = '查询失败！';
                        this.couponTypeSelf = null;
                        console.log(err);
                    });
                }, 1000);
            },
            // 查询补发人数
            queryNum() {
                if (this.queryForm.deliverLevels.length === 0 && this.queryForm.regDate.length === 0) {
                    return this.$message.warning('查询条件不能为空!');
                }
                this.queryLoading = true;
                const data = {
                    levelIds: this.queryForm.deliverLevels.join(','),
                    startTime: this.queryForm.regDate[0] || '',
                    endTime: this.queryForm.regDate[1] || ''
                };
                request.countReissueNum(data).then(res => {
                    this.queryLoading = false;
                    const resData = res.data || {};
                    this.replacementNum = resData.count || 0;
                }).catch(err => {
                    this.queryLoading = false;
                    console.log(err);
                });
            },
            // 号码导入处理
            getImportListByInput() {
                let imporList = [];
                if (this.queryForm.deliverNumber) {
                    imporList = this.queryForm.deliverNumber.replace(/\r|\n|\s|\./g, ',').split(',').filter(function(item) {
                        return item !== '';
                    });
                }
                return imporList.length === 0 ? [] : imporList;
            },
            // 确定发放
            confirmDeliver() {
                if (!this.couponTypeSelf) {
                    return this.$message.warning('请选择优惠券');
                }
                let data = {};
                if (this.queryForm.deliverWays == 1) {
                    data = {
                        type: 1,
                        couponConfigId: this.queryForm.couponId || '',
                        genre: this.queryForm.deliverWays || '1',
                        levelIds: this.queryForm.deliverLevels.length === 0 ? '' : this.queryForm.deliverLevels.join(','),
                        startTime: this.queryForm.regDate.length === 0 ? '' : this.queryForm.regDate[0],
                        endTime: this.queryForm.regDate.length === 0 ? '' : this.queryForm.regDate[1],
                        remark: this.queryForm.tip || '',
                        couponType: this.couponTypeSelf
                    };
                } else {
                    data = {
                        type: 1,
                        couponConfigId: this.queryForm.couponId || '',
                        phones: this.getImportListByInput(),
                        genre: this.queryForm.deliverWays || '2',
                        couponType: this.couponTypeSelf,
                        remark: this.queryForm.tip || ''
                    };
                    if (data.phone && data.phone.length > 1000) {
                        return this.$message.warning('最多导入1000条数据！');
                    }
                }
                this.submitLoading = true;
                request.submitReissueBeanOrCoupon(data).then(res => {
                    this.submitLoading = false;
                    this.$message.success(res.msg);
                    this.resetForm('queryForm');
                    this.handleClose();
                }).catch(err => {
                    this.submitLoading = false;
                    console.log(err);
                });
            },
            // 审核
            auditRow(row) {
                this.auditId = row.id;
                this.auditVisible = true;
            },
            // 审核提交
            confirmAudit() {
                const data = {
                    reissueId: this.auditId,
                    reason: this.auditForm.reason,
                    status: this.auditForm.auditRes
                };
                this.auditLoading = true;
                request.auditReissueNum(data).then(res => {
                    this.auditLoading = false;
                    this.$message.success(res.msg);
                    this.handleAuditClose();
                }).catch(err => {
                    this.auditLoading = false;
                    console.log(err);
                });
            },
            // 审核关闭弹窗
            handleAuditClose() {
                this.$refs['auditForm'].resetFields();
                this.auditVisible = false;
                this.getList(this.page.currentPage);
            },
            // 发送
            sendTask(row) {
                this.$confirm('是否确认发送，一但发送不可中止！', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    request.sendReissueNum({ reissueId: row.id }).then(res => {
                        this.$message.success(res.msg);
                        this.getList(this.page.currentPage);
                    }).catch(err => {
                        console.log(err);
                    });
                }).catch(() => {

                });
            },
            // 重置查询人数
            resetQueryForm() {
                this.checkAll = false;
                this.handleCheckAllChange(false);
                this.replacementNum = 0;
                this.queryForm.deliverLevels = [];
                this.queryForm.regDate = [];
                this.queryForm.deliverNumber = '';
            },
            // 重置表单
            resetForm(formName) {
                this.$refs[formName].resetFields();
                this.getList(this.page.currentPage);
            },
            // 关闭弹窗
            handleClose() {
                this.$refs['queryForm'].resetFields();
                this.checkAll = false;
                this.handleCheckAllChange(false);
                this.replacementNum = 0;
                this.selectedCoupon = null;
                this.dialogVisible = false;
            },
            // 详情
            toDetail(id) {
                this.$router.push({ name: 'couponReplacementInfo', query: { replacementCouponId: id }});
            }
        }
    };
</script>

<style lang="less" scoped>
    .deliver-coupon{
        .w200 {
            width: 200px;
        }
        .w305 {
            width: 305px;
        }
        /deep/.el-checkbox{
            margin: 0 20px 0 0;
        }
        .tip {
            position: absolute;
            right: 10px;
            bottom: 0px;
        }
        .diliver-num{
            width: 300px;
            display: flex;
            justify-content: space-between;
            span{
                color: red;
            }
        }
    }
</style>
