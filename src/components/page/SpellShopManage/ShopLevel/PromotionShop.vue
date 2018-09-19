<template>
    <div class="promotion-shop">
        <v-breadcrumb :nav='nav'></v-breadcrumb>
        <el-card :body-style="{ padding: '20px 80px',minHeight:'60vh' }">
            <p class="small-title">基础设置</p>
            <el-button @click="showupgradeExp = true" type="success">设置升级经验值（默认值）</el-button>
            <el-button @click="showNecessaryConf = true" type="success">设置必要条件</el-button>
            <p class="small-title">交易纬度</p>
            <el-button @click="showShareBonus = true" type="success">分红奖励</el-button>
            <el-button @click="showTotalTrans = true" type="success">交易额达标奖励</el-button>
            <el-button @click="showContinTrad = true" type="success">连续交易额达标</el-button>
            <el-button @click="showContinFrequ = true" type="success">连续交易频率达标</el-button>
            <el-button @click="showSingleOrder = true" type="success">单笔订单交易额</el-button>
            <p class="small-title">成员纬度</p>
            <el-button @click="showMemberUpStand = true" type="success">人数达标奖励</el-button>
        </el-card>
        <!-- 设置升级经验值 -->
        <el-dialog title="所需经验值设置" :visible.sync="showupgradeExp" width="30%"open="cleanData">
            <p class="dialog-item">
                <span class="dialog-title">所需经验值设置</span>
                <el-input class="dialog-inp" v-model="form.upgradeExp" placeholder="请输入数值"></el-input>
            </p>
            <span slot="footer">
            <el-button type="primary" @click="sure(0)">确 定</el-button>
            <el-button @click="showupgradeExp = false">取 消</el-button>
        </span>
        </el-dialog>
        <!-- 设置必要条件 -->
        <el-dialog title="设置必要条件" :visible.sync="showNecessaryConf" width="30%"open="cleanData">
            <div class="necessary-box">
                <p class="necessary-title">必要条件:</p>
                <div class="dialog-nec-item">
                    <el-checkbox v-model="checked[0]"><span class="dialog-nec-title">人员数</span></el-checkbox>
                    <el-input class="dialog-nec-inp" v-model="form.upgradeCondUserNum" placeholder="请输入数值"></el-input>
                </div>
                <div class="dialog-nec-item">
                    <el-checkbox v-model="checked[1]"><span class="dialog-nec-title">交易总额达到</span></el-checkbox>
                    <el-input class="dialog-nec-inp" v-model="form.upgradeCondTotleSales"
                              placeholder="请输入数值"></el-input>
                </div>
                <div class="dialog-nec-item">
                    <el-checkbox v-model="checked[2]"><span class="dialog-nec-title">利润贡献值</span></el-checkbox>
                    <el-input class="dialog-nec-inp" v-model="form.upgradeCondProfitCtrb"
                              placeholder="请输入数值"></el-input>
                </div>
                <div class="dialog-nec-item">
                    <el-checkbox v-model="checked[3]"><span class="dialog-nec-title">平均活跃度达到</span></el-checkbox>
                    <el-input class="dialog-nec-inp" v-model="form.upgradeCondAvgActivity"
                              placeholder="请输入数值"></el-input>
                </div>
                <div class="dialog-nec-item">
                    <el-checkbox v-model="checked[4]"><span class="dialog-nec-title">完成分红次数</span></el-checkbox>
                    <el-input class="dialog-nec-inp" v-model="form.upgradeCondBonusNum" placeholder="请输入数值"></el-input>
                </div>
            </div>
            <span slot="footer">
            <el-button type="primary" @click="sure(1)">确 定</el-button>
            <el-button @click="showNecessaryConf = false">取 消</el-button>
        </span>
        </el-dialog>
        <!-- 分红奖励 -->
        <el-dialog title="经验值设置" :visible.sync="showShareBonus" width="30%"open="cleanData">
            <p class="dialog-item">
                <span style="margin-left:30px">达成分红次数1次，则获得</span>
            </p>
            <p class="dialog-item">
                <span class="dialog-title">获得经验值</span>
                <el-input class="dialog-inp" v-model="form.upgradeBonusNumPerExp" placeholder="请输入数值"></el-input>
                分
            </p>
            <span slot="footer">
            <el-button type="primary" @click="sure(2)">确 定</el-button>
            <el-button @click="showShareBonus = false">取 消</el-button>
        </span>
        </el-dialog>
        <!-- 交易额达标奖励 -->
        <el-dialog title="经验值设置" :visible.sync="showTotalTrans" width="30%"open="cleanData">
            <p class="dialog-item">
                <span style="margin-left:30px">总交易额增加1元，则增加</span>
            </p>
            <p class="dialog-item">
                <span class="dialog-title">获得经验值</span>
                <el-input class="dialog-inp" v-model="form.upgradeTotleSalesAddPerExp" placeholder="请输入数值"></el-input>
                分
            </p>
            <span slot="footer">
            <el-button type="primary" @click="sure(3)">确 定</el-button>
            <el-button @click="showTotalTrans = false">取 消</el-button>
        </span>
        </el-dialog>
        <!-- 连续交易额达标 -->
        <el-dialog title="经验值设置" :visible.sync="showContinTrad" width="30%"open="cleanData">
            <p style="font-size:16px;font-weight:700;margin-left:30px">每周交易额达到：</p>
            <p class="dialog-item">
                <span class="dialog-title">交易额</span>
                <el-input class="dialog-inp" v-model="form.upgradeWeekSalesNum" placeholder="请输入数值"></el-input>
                元
            </p>
            <p class="dialog-item">
                <span class="dialog-title">获得经验值</span>
                <el-input class="dialog-inp" v-model="form.upgradeWeekSalesNumExp" placeholder="请输入数值"></el-input>
                分
            </p>
            <span slot="footer">
            <el-button type="primary" @click="sure(4)">确 定</el-button>
            <el-button @click="showContinTrad = false">取 消</el-button>
        </span>
        </el-dialog>
        <!-- 连续交易频率达标 -->
        <el-dialog title="经验值设置" :visible.sync="showContinFrequ" width="30%"open="cleanData">
            <p style="font-size:16px;font-weight:700;margin-left:30px">每周交易频次达到：</p>
            <p class="dialog-item">
                <span class="dialog-title">交易频次</span>
                <el-input class="dialog-inp" v-model="form.upgradeWeekSalesFreq" placeholder="请输入数值"></el-input>
                次
            </p>
            <p class="dialog-item">
                <span class="dialog-title">获得经验值</span>
                <el-input class="dialog-inp" v-model="form.upgradeWeekSalesFreqExp" placeholder="请输入数值"></el-input>
                分
            </p>
            <span slot="footer">
            <el-button type="primary" @click="sure(5)">确 定</el-button>
            <el-button @click="showContinFrequ = false">取 消</el-button>
        </span>
        </el-dialog>
        <!-- 单笔订单交易额 -->
        <el-dialog title="经验值设置" :visible.sync="showSingleOrder" width="30%"open="cleanData">
            <p class="dialog-item">
                <span class="dialog-title">单笔订单交易额</span>
                <el-input class="dialog-inp" v-model="form.upgradeOrderPrice" placeholder="请输入数值"></el-input>
                元
            </p>
            <p class="dialog-item">
                <span class="dialog-title">获得经验值</span>
                <el-input class="dialog-inp" v-model="form.upgradeOrderPriceExp" placeholder="请输入数值"></el-input>
                分
            </p>
            <span slot="footer">
            <el-button type="primary" @click="sure(6)">确 定</el-button>
            <el-button @click="showSingleOrder = false">取 消</el-button>
        </span>
        </el-dialog>
        <!-- 人数达标奖励 -->
        <el-dialog title="经验值设置" :visible.sync="showMemberUpStand" width="30%"open="cleanData">
            <p class="dialog-item">
                <span style="margin-left:30px">每增加1人则获得</span>
            </p>
            <p class="dialog-item">
                <span class="dialog-title">获得经验值</span>
                <el-input class="dialog-inp" v-model="form.upgradeUserAddOneExp" placeholder="请输入数值"></el-input>
                分
            </p>
            <span slot="footer">
            <el-button type="primary" @click="sure(7)">确 定</el-button>
            <el-button @click="showMemberUpStand = false">取 消</el-button>
        </span>
        </el-dialog>
    </div>
</template>

<script>
    import vBreadcrumb from '@/components/common/Breadcrumb.vue';
    import utils from '@/utils/index.js';
    import request from '@/http/http.js';

    export default {
        components: { vBreadcrumb },

        data() {
            return {
                nav: ['拼店店铺管理', '店铺等级设置', '店铺晋升设置'],
                showupgradeExp: false,
                showNecessaryConf: false,
                showShareBonus: false,
                showTotalTrans: false,
                showContinTrad: false,
                showContinFrequ: false,
                showSingleOrder: false,
                showMemberUpStand: false,
                checked: [false, false, false, false, false],
                form: {
                    // 设置升级经验值
                    upgradeExp: '',
                    // 设置必要条件
                    upgradeCondUserNum: '',
                    upgradeCondTotleSales: '',
                    upgradeCondProfitCtrb: '',
                    upgradeCondAvgActivity: '',
                    upgradeCondBonusNum: '',
                    // 分红奖励
                    upgradeBonusNumPerExp: '',
                    // 交易额达标奖励
                    upgradeTotleSalesAddPerExp: '',
                    // 连续交易额达标
                    upgradeWeekSalesNum: '',
                    upgradeWeekSalesNumExp: '',
                    // 连续交易频率达标
                    upgradeWeekSalesFreq: '',
                    upgradeWeekSalesFreqExp: '',
                    // 单笔订单交易额
                    upgradeOrderPrice: '',
                    upgradeOrderPriceExp: '',
                    // 人数达标奖励
                    upgradeUserAddOneExp: ''
                },
                shopId: '',
                isAjax: false
            };
        },

        activated() {
            this.shopId =
                this.$route.query.promotionShopId ||
                sessionStorage.getItem('promotionShopId');
            console.log(this.shopId);
            this.getStoreStarById();
        },

        methods: {
            // 根据ID获取等级
            getStoreStarById() {
                const data = {
                    id: this.shopId
                };
                request.getStoreStarById(data).then((res) => {
                    this.form = res.data;
                    this.convert(this.form.upgradeCondition);
                }).catch((err) => {
                    console.log(err);
                });
            },
            //  弹窗开启之前清除数据
            cleanData() {
                utils.cleanFormData(this.form);
            },
            // 保存
            sure(index) {
                let type;
                switch (index) {
                    case 0:// 设置升级经验值
                        // url = 'updateStoreStarUpgradeExpById';
                        type = 1;
                        break;
                    case 1:// 设置必要条件
                        // url = 'updateStoreStarUpgradeConditionById';
                        type = 8;
                        break;
                    case 2:// 分红奖励
                        // url = 'updateStoreStarUpgradeBonusById';
                        type = 2;
                        break;
                    case 3:// 交易额达标奖励
                        // url = 'updateStoreStarUpgradeTotleSalesById';
                        type = 3;
                        break;
                    case 4:// 连续交易额达标
                        // url = 'updateStoreStarUpgradeWeekSalesById';
                        type = 4;
                        break;
                    case 5:// 连续交易频率达标
                        // url = 'updateStoreStarUpgradeWeekSalesFreqById';
                        type = 5;
                        break;
                    case 6:// 单笔订单交易额
                        // url = 'updateStoreStarUpgradeOrderById';
                        type = 6;
                        break;
                    case 7:// 人数达标奖励
                        // url = 'updateStoreStarDemotionDealerById';
                        type = 7;
                        break;
                }
                const data = this.form;
                data.id = this.shopId;
                data.type = type;
                let flag1 = true; let flag2 = true; let flag3 = true; let flag4 = true;
                if (index == 0) {
                    flag1 = this.isEmpty(data.upgradeExp, false);
                    this.setIsAjax(flag1);
                } else if (index == 1) {
                    this.isChecked();
                    if (this.checked[0]) {
                        flag1 = this.isEmpty(data.upgradeCondUserNum, true);
                    }
                    if (this.checked[1]) {
                        flag2 = this.isEmpty(data.upgradeCondTotleSales, false);
                    }
                    if (this.checked[2]) {
                        flag3 = this.isEmpty(data.upgradeCondProfitCtrb, false);
                    }
                    if (this.checked[3]) {
                        flag4 = this.isEmpty(data.upgradeCondAvgActivity, false);
                    }
                    if (this.checked[4]) {
                        flag4 = this.isEmpty(data.upgradeCondBonusNum, true);
                    }
                    this.setIsAjax(flag1 && flag2 && flag3 && flag4);
                } else if (index == 2) {
                    // flag1=this.isEmpty(data.upgradeDirectNum,true);
                    data.upgradeTotleSalesAdd = 1;
                    flag2 = this.isEmpty(data.upgradeBonusNumPerExp, false);
                    this.setIsAjax(flag2);
                } else if (index == 3) {
                    // flag1=this.isEmpty(data.upgradeIndirectNum,true);
                    flag2 = this.isEmpty(data.upgradeTotleSalesAddPerExp, false);
                    this.setIsAjax(flag2);
                } else if (index == 4) {
                    flag1 = this.isEmpty(data.upgradeWeekSalesNum, false);
                    flag2 = this.isEmpty(data.upgradeWeekSalesNumExp, false);
                    this.setIsAjax(flag1 && flag2);
                } else if (index == 5) {
                    flag1 = this.isEmpty(data.upgradeWeekSalesFreq, true);
                    flag2 = this.isEmpty(data.upgradeWeekSalesFreqExp, false);
                    this.setIsAjax(flag1 && flag2);
                } else if (index == 6) {
                    flag1 = this.isEmpty(data.upgradeOrderPrice, false);
                    flag2 = this.isEmpty(data.upgradeOrderPriceExp, false);
                    this.setIsAjax(flag1 && flag2);
                } else if (index == 7) {
                    // flag1=this.isEmpty(data.upgradeWeekSalesNum,false);
                    flag2 = this.isEmpty(data.upgradeUserAddOneExp, false);
                    this.setIsAjax(flag2);
                }
                if (this.isAjax) {
                    request.updateStoreStar(data).then((res) => {
                        this.$message.success('设置成功');
                        this.showupgradeExp = false;
                        this.showNecessaryConf = false;
                        this.showShareBonus = false;
                        this.showTotalTrans = false;
                        this.showContinTrad = false;
                        this.showContinFrequ = false;
                        this.showSingleOrder = false;
                        this.showMemberUpStand = false;
                        this.getStoreStarById();
                    }).catch((err) => {
                        console.log(err);
                    });
                }
            },
            // 遍历设置必要条件里的选中项,并进行值的换算
            isChecked() {
                let result = 0;
                for (const i in this.checked) {
                    if (this.checked[i]) {
                        result += Math.pow(2, i);
                    }
                }
                this.form.upgradeCondition = result;
            },
            // 将十进制数值转换成二进制
            convert(num) {
                const arr = [];
                if (num) {
                    for (let i = 0; 1; i++) {
                        if (num / 2 >= 1) {
                            arr[i] = num % 2;
                            num = parseInt(num / 2);
                        } else {
                            arr[i] = 1;
                            break;
                        }
                    }
                    for (const i in arr) {
                        if (arr[i] == 1) {
                            this.checked[i] = true;
                        } else {
                            this.checked[i] = false;
                        }
                    }
                    this.dealData();
                }
            },
            // 值处理为空
            dealData() {
                this.form.upgradeCondUserNum = this.checked[0] ? this.form.upgradeCondUserNum : '';
                this.form.upgradeCondTotleSales = this.checked[1] ? this.form.upgradeCondTotleSales : '';
                this.form.upgradeCondProfitCtrb = this.checked[2] ? this.form.upgradeCondProfitCtrb : '';
                this.form.upgradeCondAvgActivity = this.checked[3] ? this.form.upgradeCondAvgActivity : '';
                this.form.upgradeCondBonusNum = this.checked[3] ? this.form.upgradeCondBonusNum : '';
            },
            // 值非空判断
            isEmpty(value, isInt) {
                if (value === null || value === undefined || value === '') {
                    if (isInt) {
                        this.$message.warning('请输入整数!');
                    } else {
                        this.$message.warning('请输入数值!');
                    }
                    return false;
                } else {
                    if (isInt) {
                        const reg = /^[1-9]*[1-9][0-9]*$/;
                        return this.setReg(reg, value);
                    } else {
                        const reg = /^[0-9]+([.]{1}[0-9]{1,2})?$/;
                        return this.setReg(reg, value);
                    }
                }
            },
            setReg(reg, value) {
                if (!reg.test(value)) {
                    this.$message.warning('请输入合法数据!');
                    return false;
                } else {
                    return true;
                }
            },
            setIsAjax(bool) {
                const that = this;
                if (bool) {
                    that.isAjax = true;
                } else {
                    that.isAjax = false;
                }
            }
        }
    };
</script>
<style lang='less'>
    .promotion-shop {
        .el-dialog {
            border-radius: 10px;
            .el-dialog__header {
                padding-left: 50px;
                box-sizing: border-box;
                border-bottom: 1px solid #ddd;
                .el-dialog__title {
                    color: #ff6868;
                    font-weight: 700;
                }
            }
        }
        .el-checkbox + .el-checkbox {
            margin-left: 0px;
        }
        .small-title {
            margin: 20px 0px;
        }
        .dialog-item {
            margin: 10px 0;
            .dialog-title {
                display: inline-block;
                width: 100px;
                margin: 0 10px 0 30px;
            }
            .dialog-inp {
                margin-right: 10px;
                width: 55%;
            }
        }
        .dialog-nec-item {
            width: 90%;
            margin: 10px 0px;
            .el-checkbox {
                width: 40%;
            }
            .dialog-nec-title {
                margin: 0 10px 0 0px;
            }
            .dialog-nec-inp {
                margin-right: 10px;
                width: 50%;
            }
        }
        .necessary-box {
            padding-left: 30px;
            box-sizing: border-box;
            .necessary-title {
                font-size: 16px;
                font-weight: 700;
            }
        }
    }
</style>
