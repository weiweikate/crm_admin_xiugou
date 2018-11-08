<template>
    <div class="card-mange">
        <v-breadcrumb :nav='nav'></v-breadcrumb>
        <el-card>
            <el-form :model="form" :rules="rules" ref="form" label-width="120px">
                <el-form-item prop="name" label="活动名称:">
                    <el-input class="inp" v-model="form.name" placeholder="请输入名称"></el-input>
                </el-form-item>
                <el-form-item prop="prize" label="刮刮卡奖品:">
                    <el-button type="primary" @click="showAddCouList">+ 添加优惠券</el-button>
                    <el-button type="primary" @click="isShowShowBeanList = true">+ 添加秀豆奖品</el-button>
                    <el-table :data="selectedCoupon" border stripe class="mt10">
                        <el-table-column type="index" label="编号" align="center"></el-table-column>
                        <el-table-column prop="awardName" label="奖品名称" align="center"></el-table-column>
                        <el-table-column prop="giftValue" label="赠送值" align="center">
                            <template slot-scope="scope">
                                {{scope.row.type == 1?'/':scope.row.giftValue}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="type" label="类型" align="center">
                            <template slot-scope="scope">
                                {{scope.row.type == 1?'优惠券':'秀豆'}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="totalNum" label="奖品发放数" align="center">
                            <template slot-scope="scope">
                                <el-input-number v-if="status==1" :min="0" :controls="false" v-model="scope.row.totalNum"></el-input-number>
                                <span v-else>{{scope.row.totalNum||0}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column v-if="status == 2" label="剩余数量" align="center">
                            <template slot-scope="scope">{{scope.row.totalSurplusNum||0}}</template>
                        </el-table-column>
                        <el-table-column prop="stockNum" label="库存数量" align="center">
                            <template slot-scope="scope">
                                {{scope.row.stockNum == -1?'不限量':scope.row.stockNum}}
                            </template>
                        </el-table-column>
                        <el-table-column v-if="status == 2" prop="addNum" label="增加发放数" align="center">
                            <template slot-scope="scope">
                                <el-input-number :min="0" :disabled="scope.row.status==2" :controls="false" v-model="scope.row.addNum"></el-input-number>
                            </template>
                        </el-table-column>
                        <el-table-column prop="winRate" label="中奖概率" align="center" min-width="100">
                            <template slot-scope="scope">
                                <el-input-number @blur="computedRatio()" :disabled="scope.row.status==2" :min="0" :controls="false" v-model="scope.row.winRate"></el-input-number>%
                            </template>
                        </el-table-column>
                        <el-table-column prop="id" label="操作" align="center">
                            <template slot-scope="scope">
                                <el-button type="danger" v-if="scope.row.status==1" @click="updateStatus(scope.row,2,scope.$index)">停用</el-button>
                                <el-button type="danger" v-else-if="scope.row.status==2" @click="updateStatus(scope.row,1,scope.$index)">启用</el-button>
                                <el-button type="danger" v-else @click="deleteSelectedCoupon(scope.$index, scope.row.type)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <p>总中奖概率：{{totalRatio}}%</p>
                </el-form-item>
                <el-form-item prop="loseHint" label="未中奖提示语:">
                    <el-input class="inp" v-model="form.loseHint" placeholder="请输入提示语"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" :loading="btnLoading" @click="submitForm('form')">提 交</el-button>
                    <el-button type="success" @click="cancel">取 消</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-dialog title="优惠券列表" :visible.sync="isShowCouponList" width="500px">
            <el-tabs v-model="couponType" v-loading="couponLoading" @tab-click="handleClick">
                <el-tab-pane label="满减券" name="1" style="max-height: 500px;overflow-y: auto">
                    <div v-for="(v,k) in couponList" style="overflow: hidden; margin-bottom: 10px;" :key="k">
                        <span :class="{'selected-coupon':true,'active-selected':v.selected}" @click="selectCoupon(v)">{{v.awardName}} </span>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="折扣券" name="3" style="max-height: 500px;overflow-y: auto">
                    <div v-for="(v,k) in couponList" style="overflow: hidden; margin-bottom: 10px" :key="k">
                        <span :class="{'selected-coupon':true,'active-selected':v.selected}" @click="selectCoupon(v)">{{v.awardName}} </span>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="抵扣券" name="4" style="max-height: 500px;overflow-y: auto">
                    <div v-for="(v,k) in couponList" style="overflow: hidden; margin-bottom: 10px" :key="k">
                        <span :class="{'selected-coupon':true,'active-selected':v.selected}" @click="selectCoupon(v)">{{v.awardName}} </span>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="抵价券" name="2" style="max-height: 500px;overflow-y: auto">
                    <div v-for="(v,k) in couponList" style="overflow: hidden; margin-bottom: 10px" :key="k">
                        <span :class="{'selected-coupon':true,'active-selected':v.selected}" @click="selectCoupon(v)">{{v.awardName}} </span>
                    </div>
                </el-tab-pane>
            </el-tabs>
            <span slot="footer">
                <el-button type="primary" @click="confirmCoupon">确 定</el-button>
                <el-button @click="isShowCouponList = false">取 消</el-button>
            </span>
        </el-dialog>
        <el-dialog title="秀豆奖品" :visible.sync="isShowShowBeanList" :before-close="beforeClose" width="500px">
            <el-form :model="form1" ref="form" label-width="120px">
                <el-form-item prop="name" label="奖品名称:">
                    <el-input class="inp" v-model="form1.awardName" maxlength="16"></el-input>
                </el-form-item>
                <el-form-item prop="giftValue" label="赠送秀豆:">
                    <el-input-number :controls="false" :min="0" maxlength="12" class="inp" v-model="form1.giftValue"></el-input-number>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button type="primary" @click="addBean">确 定</el-button>
                <el-button @click="beforeClose">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import vBreadcrumb from '@/components/common/Breadcrumb.vue';
    import request from '@/http/http';
    export default {
        components: { vBreadcrumb },
        data() {
            return {
                nav: ['运营管理', '营销工具管理', '刮刮卡', '新建刮刮卡'],
                id: '',
                url: '',
                form: {
                    name: '',
                    loseHint: ''
                },
                form1: {
                    awardName: '', // 秀豆名称
                    giftValue: '',
                    stockNum: -1
                },
                status: '', // 1.添加 2.编辑
                rules: {
                    name: [
                        { required: true, message: '请输入活动名称', trigger: 'blur' },
                        { min: 1, max: 16, message: '活动名称长度在1到16个字符', trigger: 'blur' }
                    ],
                    loseHint: [
                        { required: true, message: '请输入未中奖提示语', trigger: 'blur' }
                    ]
                },
                totalRatio: 0,
                // 优惠券
                isShowCouponList: false, // 优惠券列表弹窗
                couponLoading: false, // 优惠券列表loding
                selectedCoupon: [], // 已选中优惠券列表
                couponList: [], // 优惠券列表
                tmpCouponList: [], // 暂时存放优惠券列表
                couponType: '1',
                // 秀豆
                isShowShowBeanList: false,
                btnLoading: false
            };
        },
        activated() {
            this.id = this.$route.query.cardId || sessionStorage.getItem('cardId');
            this.status = this.$route.query.status == 'add' ? 1 : 2;
            this.getInfo();
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (!valid) return;
                    const data = this.form;
                    try {
                        this.totalRatio = 0;
                        this.selectedCoupon.forEach((v, k) => {
                            const isNum = /^0|[1-9]\d*$/;
                            const isInt = /^[1-9]\d*$/;
                            const isDouble = /^(0|[1-9]\d*)([.]{1}[0-9]{1,2})?$/;
                            if (this.status == 1 && (!isInt.test(v.totalNum) || v.totalNum.length > 12)) {
                                throw '发放数为1-12位正整数';
                            } else {
                                if (v.stockNum != -1 && v.totalNum > v.stockNum) {
                                    throw '发放数不能大于库存';
                                }
                            }
                            if (!v.status && !v.addNum) {
                                throw '请为新增的奖品添加发放数';
                            }
                            if (v.addNum === 0 && (!isInt.test(v.addNum) || v.addNum.length > 12)) {
                                throw '增加发放数为1-12位数字';
                            } else {
                                if (v.stockNum != -1 && (v.addNum + v.totalNum) > v.stockNum) {
                                    throw '发放数不能大于库存';
                                }
                            }
                            if (!v.winRate && !isDouble.test(v.winRate)) {
                                if (!v.winRate) {
                                    throw '请输入中奖概率';
                                } else {
                                    throw '中奖概率保留2位小数';
                                }
                            }
                            if (v.status != 2) {
                                this.totalRatio += v.winRate || 0;
                            }
                            if (this.totalRatio > 100) {
                                throw '中奖概率不能大于100';
                            }
                        });
                    } catch (error) {
                        this.$message.warning(error);
                        return;
                    }
                    if (this.status == 2) {
                        this.selectedCoupon.forEach((v, k) => {
                            v.totalNum = v.addNum || 0;
                        });
                        data.id = this.id;
                    }
                    data.scratchCardPrize = this.selectedCoupon;
                    this.btnLoading = true;
                    request[this.url](data).then(res => {
                        this.$message.success(res.msg);
                        this.$router.push('/scratchCardsList');
                        this.btnLoading = false;
                    }).catch(err => {
                        console.log(err);
                        this.btnLoading = false;
                    });
                });
            },
            getInfo() {
                this.resetValue();
                if (this.status == 1) {
                    // this.status = 1;
                    this.nav[3] = '新建刮刮卡';
                    this.url = 'addScratchCard';
                    this.resetValue();
                } else {
                    // this.status = 2;
                    this.nav[3] = '编辑刮刮卡';
                    this.url = 'updateScratchCard';
                    this.getDetail();
                }
                this.totalRatio = 0;
            },
            resetValue() {
                this.form = {
                    name: '',
                    loseHint: ''
                };
                this.totalRatio = 0;
                this.selectedCoupon = [];
                this.tempChooseList = [];
            },
            getDetail() {
                const data = {
                    id: this.id
                };
                request.findScratchCardById(data).then(res => {
                    this.form = res.data;
                    this.totalRatio = res.data.totalProbability;
                    res.data.scratchCardPrize.forEach((v, k) => {
                        v.selected = true;
                        this.selectedCoupon.push(v);
                    });
                }).catch(err => {
                    console.log(err);
                });
            },
            // 计算总概率
            computedRatio() {
                this.totalRatio = 0;
                this.selectedCoupon.forEach((v, k) => {
                    if (v.status != 2) {
                        this.totalRatio += v.winRate || 0;
                    }
                    if (this.totalRatio > 100) {
                        // this.totalRatio -= v.winRate;
                        // v.winRate = 0;
                        this.$message.warning('中奖概率不能大于100');
                    }
                });
            },
            // 显示优惠券列表
            showAddCouList() {
                this.isShowCouponList = true;
                this.couponType = '1';
                this.handleClick({ name: '1' });
                this.tmpCouponList = [];
                this.tmpCouponList.push(...this.selectedCoupon);
            },
            // 选择优惠券类型
            handleClick(tab) {
                this.couponLoading = true;
                request.queryCouponByType({ type: tab.name }).then(res => {
                    this.couponLoading = false;
                    this.couponList = [];
                    const tmp = [];
                    tmp.push(...this.selectedCoupon, ...this.tmpCouponList);
                    if (res.data.length === 0) return;
                    res.data.forEach(v => {
                        const obj = {
                            awardName: v.name,
                            stockNum: v.totalNumber,
                            awardId: v.id,
                            selected: false,
                            type: 1 // 1：优惠券 2：秀豆
                        };
                        for (let i = 0; i < tmp.length; i++) {
                            if (tmp[i].awardId == obj.awardId) {
                                obj.selected = true;
                            }
                        }
                        this.couponList.push(obj);
                    });
                }).catch(err => {
                    this.couponLoading = false;
                    console.log(err);
                });
            },
            // 删除
            deleteSelectedCoupon(index, status) {
                this.selectedCoupon.splice(index, 1);
            },
            //  选择优惠券
            selectCoupon(coupon) {
                coupon.selected = true;
                for (let i = 0; i < this.tmpCouponList.length; i++) {
                    if (this.tmpCouponList[i].awardId == coupon.awardId) {
                        coupon.selected = false;
                        this.tmpCouponList.splice(i, 1);
                        return;
                    }
                }
                this.tmpCouponList.push(coupon);
            },
            // 确定添加优惠券
            confirmCoupon() {
                this.isShowCouponList = false;
                this.selectedCoupon = [];
                this.selectedCoupon.push(...this.tmpCouponList);
            },
            // 添加秀豆
            addBean() {
                const isInt = /^[1-9]*[1-9][0-9]*$/;
                if (!isInt.test(this.form1.giftValue)) {
                    return this.$message.warning('请输入1-12位的正整数');
                }
                if (this.form1.awardName == '' || this.form1.giftValue == '') {
                    return this.$message.warning('输入的数值不能为空');
                }
                if (this.form1.awardName == '' || this.giftValue == '') {
                    return this.$message.warning('输入的数值不能为空');
                }
                const temp = {
                    awardName: this.form1.awardName,
                    giftValue: this.form1.giftValue,
                    type: 2,
                    stockNum: -1
                };
                this.selectedCoupon.push(temp);
                this.beforeClose();
            },
            beforeClose() {
                this.form1 = {
                    awardName: '',
                    giftValue: ''
                };
                this.isShowShowBeanList = false;
            },
            // 取消
            cancel() {
                this.$router.push('/scratchCardsList');
            },
            // 停用启用
            updateStatus(row, num, index) {
                if (row.status == 2) {
                    const temp = this.totalRatio + row.winRate;
                    if (temp > 100) {
                        return this.$message.warning('中奖概率不能大于100');
                    }
                }
                row.status = num;
                this.computedRatio();
                this.$set(this.selectedCoupon, index, row);
            }
        }
    };
</script>

<style lang="less" scoped>
.card-mange{
    /deep/.el-dialog {
        border-radius: 10px;
        overflow: auto;
        .el-dialog__header {
            border-bottom: 1px solid #eee;
            padding: 20px 20px 10px 50px;
            .el-dialog__title {
                color: #ff6868;
            }
        }
    }
    .inp{
        width: 210px;
    }
    .selected-coupon{
        display: block;
        float: left;
        width: 300px;
        height: 30px;
        line-height: 30px;
        border: 1px solid #ccc;
        padding-left: 10px;
        border-radius: 10px;
        margin-right: 10px;
        cursor: pointer;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
    }
    .active-selected{
        background-color: #33b4ff;
        color: #fff;
        border: 1px solid skyblue;
    }
}
</style>
