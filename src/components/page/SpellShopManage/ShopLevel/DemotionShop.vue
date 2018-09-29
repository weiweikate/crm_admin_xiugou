<template>
    <div class="demotion-shop">
        <v-breadcrumb :nav='nav'></v-breadcrumb>
        <el-card :body-style="{ padding: '20px 80px',minHeight:'60vh' }">
            <p class="small-title">基础设置</p>
            <el-button @click="showWeekTradNo = true" type="success">无交易额条件</el-button>
            <el-button @click="showMemberNoEnough = true" type="success">人数不足条件</el-button>
            <el-button @click="showdemotionWeekUserReduceOneExp = true" type="success">周期交易频率</el-button>
            <el-button @click="showDemotionTotleSales = true" type="success">周期交易额</el-button>
            <!--<el-button @click="showNecessaryConf = true" type="success">平均活跃度</el-button>-->
        </el-card>
        <!-- 无交易额条件 -->
        <el-dialog title="每周交易额无成长" :visible.sync="showWeekTradNo" width="30%"open="cleanData">
            <p class="dialog-item">
                <span class="dialog-title">扣除经验值</span>
                <el-input class="dialog-inp" v-model="form.demotionWeekNoSaleExp" placeholder="请输入数值"></el-input>
                分
            </p>
            <span slot="footer">
            <el-button type="primary" @click="sure(0)">确 定</el-button>
            <el-button @click="showWeekTradNo = false">取 消</el-button>
        </span>
        </el-dialog>
        <!-- 人数不足条件 -->
        <el-dialog title="人数不足条件" :visible.sync="showMemberNoEnough" width="30%"open="cleanData">
            <p class="dialog-item">
                <span style="margin-left:30px">人数每减少1人，则扣除</span>
            </p>
            <p class="dialog-item">
                <el-input class="dialog-inp" style="margin-left:30px" v-model="form.demotionWeekUserReduceOneExp"
                          placeholder="请输入数值"></el-input>
                分
            </p>
            <span slot="footer">
            <el-button type="primary" @click="sure(1)">确 定</el-button>
            <el-button @click="showMemberNoEnough = false">取 消</el-button>
        </span>
        </el-dialog>
        <!-- 周期交易频率 -->
        <el-dialog title="每周交易频率" :visible.sync="showdemotionWeekUserReduceOneExp" width="30%"open="cleanData">
            <p class="dialog-item">
                <span class="dialog-title">交易频率低于</span>
                <el-input class="dialog-inp" v-model="form.demotionWeekSalesFreq" placeholder="请输入数值"></el-input>
                次
            </p>
            <p class="dialog-item">
                <span class="dialog-title">扣除经验值</span>
                <el-input class="dialog-inp" v-model="form.demotionWeekSalesFreqExp" placeholder="请输入数值"></el-input>
                分
            </p>
            <span slot="footer">
            <el-button type="primary" @click="sure(2)">确 定</el-button>
            <el-button @click="showdemotionWeekUserReduceOneExp = false">取 消</el-button>
        </span>
        </el-dialog>
        <!-- 周期交易额 -->
        <el-dialog title="每周交易额" :visible.sync="showDemotionTotleSales" width="30%"open="cleanData">
            <p class="dialog-item">
                <span class="dialog-title">交易额低于</span>
                <el-input class="dialog-inp" v-model="form.demotionTotleSales" placeholder="请输入数值"></el-input>
                元
            </p>
            <p class="dialog-item">
                <span class="dialog-title">扣除经验值</span>
                <el-input class="dialog-inp" v-model="form.demotionTotleSalesExp" placeholder="请输入数值"></el-input>
                分
            </p>
            <span slot="footer">
            <el-button type="primary" @click="sure(3)">确 定</el-button>
            <el-button @click="showDemotionTotleSales = false">取 消</el-button>
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
                nav: ['拼店管理', '店铺等级设置', '店铺降级设置'],
                showWeekTradNo: false,
                showMemberNoEnough: false,
                showdemotionWeekUserReduceOneExp: false,
                showDemotionTotleSales: false,
                form: {
                    //  无交易额条件
                    demotionWeekNoSaleExp: '',
                    // 人数不足条件
                    demotionWeekUserReduceOneExp: '',
                    // 周期交易频率
                    demotionWeekSalesFreq: '',
                    demotionWeekSalesFreqExp: '',
                    // 周期交易额
                    demotionTotleSales: '',
                    demotionTotleSalesExp: ''
                },
                shopId: '',
                isAjax: false
            };
        },

        activated() {
            this.shopId =
                this.$route.query.demotionShopId ||
                sessionStorage.getItem('demotionShopId');
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
                    case 0:// 无交易额条件
                        // url = 'updateStoreStarDemotionWeekNoSaleById';
                        type = 9;
                        break;
                    case 1:// 人数不足条件
                        // url = 'updateStoreStarDemotionWeekDealerById';
                        type = 10;
                        break;
                    case 2:// 周期交易频率
                        // url = 'updateStoreStarDemotionWeekSalesById';
                        type = 11;
                        break;
                    case 3:// 周期交易额
                        // url = 'updateStoreStarDemotionTotleSalesById';
                        type = 12;
                        break;
                }
                const data = this.form;
                data.id = this.shopId;
                data.type = type;
                let flag1 = true; let flag2 = true;
                if (index == 0) {
                    if (!data.demotionWeekNoSaleExp) data.demotionWeekNoSaleExp = 0;
                    flag1 = this.isEmpty(data.demotionWeekNoSaleExp, false);
                    this.setIsAjax(flag1);
                } else if (index == 1) {
                    if (!data.demotionWeekUserReduceOneExp) data.demotionWeekUserReduceOneExp = 0;
                    flag1 = this.isEmpty(data.demotionWeekUserReduceOneExp, false);
                    this.setIsAjax(flag1);
                } else if (index == 2) {
                    if (!data.demotionWeekSalesFreq) data.demotionWeekSalesFreq = 0;
                    if (!data.demotionWeekSalesFreqExp) data.demotionWeekSalesFreqExp = 0;
                    flag1 = this.isEmpty(data.demotionWeekSalesFreq, true);
                    flag2 = this.isEmpty(data.demotionWeekSalesFreqExp, false);
                    this.setIsAjax(flag1 && flag2);
                } else if (index == 3) {
                    if (!data.demotionTotleSales) data.demotionTotleSales = 0;
                    if (!data.demotionTotleSalesExp) data.demotionTotleSalesExp = 0;
                    flag1 = this.isEmpty(data.demotionTotleSales, true);
                    flag2 = this.isEmpty(data.demotionTotleSalesExp, false);
                    this.setIsAjax(flag1 && flag2);
                }
                if (this.isAjax) {
                    request.updateStoreStar(data).then((res) => {
                        this.$message.success('设置成功');
                        this.showWeekTradNo = false;
                        this.showMemberNoEnough = false;
                        this.showdemotionWeekUserReduceOneExp = false;
                        this.showDemotionTotleSales = false;
                        this.getStoreStarById();
                    }).catch((err) => {
                        console.log(err);
                    });
                }
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
                        const reg = /^(0|[1-9]\d*)$/;
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
    .demotion-shop {
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
    }
</style>
