<template>
    <div class="promotion-manage">
        <v-breadcrumb :nav="nav"></v-breadcrumb>
        <el-card style="minHeight:60vh">
            <div class="wrap">
                <div>
                    <p class="title">基础设置</p>
                    <!--<div class="small-wrap">-->
                    <!--<p class="small-title">设置升级经验值</p>-->
                    <!--<div class="small-content">升级经验值<el-input class="inp"></el-input></div>-->
                    <!--<div class="small-content">升级经验值<el-input class="inp"></el-input></div>-->
                    <!--</div>-->
                    <!--<div class="small-wrap">-->
                    <!--<p class="small-title">设置升级经验值</p>-->
                    <!--<div class="small-content">升级经验值<el-input class="inp"></el-input></div>-->
                    <!--<div class="small-content">升级经验值<el-input class="inp"></el-input></div>-->
                    <!--</div>-->
                    <el-button type="success" @click="showMask(0)">设置升级经验值</el-button>
                    <el-button type="success" @click="showMask(1)">设置必要条件</el-button>
                </div>
                <div>
                    <p class="title">邀请推荐维度</p>
                    <el-button type="success" @click="showMask(2)">设置直接邀请条件</el-button>
                    <el-button type="success" @click="showMask(3)">设置间接邀请条件</el-button>
                    <!--<el-button type="success">设置个人活跃条件</el-button>-->
                    <!--<el-button type="success">设置团队活跃条件</el-button>-->
                </div>
                <div>
                    <p class="title">交易额维度</p>
                    <el-button type="success" @click="showMask(4)">设置个人交易额条件</el-button>
                    <el-button type="success" @click="showMask(5)">设置直接交易额条件</el-button>
                    <el-button type="success" @click="showMask(6)">设置间接交易额条件</el-button>
                    <el-button type="success" @click="showMask(7)">设置连续交易额条件</el-button>
                    <el-button type="success" @click="showMask(8)">设置连续交易额频次条件</el-button>
                    <el-button type="success" @click="showMask(9)">设置一次性交易条件</el-button>
                </div>
                <div>
                    <p class="title">充值</p>
                    <el-button type="success" @click="showMask(10)">代币充值</el-button>
                </div>
            </div>
        </el-card>
        <!--弹窗-->
        <el-dialog :title="title[index]" :visible.sync="mask">
            <!--设置升级经验值-->
            <el-form v-model="form" label-width="120px" v-if="index==0">
                <el-form-item label="所需经验设置">
                    <el-input v-model="form.upgradeExp" placeholder="请输入数值" auto-complete="off"></el-input>
                    <span>分</span>
                </el-form-item>
            </el-form>
            <!--设置必要条件-->
            <el-form v-model="form" label-width="120px" class="special" v-if="index==1">
                <h3>必要条件：</h3>
                <el-form-item>
                    <el-checkbox label="直接邀请人数" value="0" v-model="checked[0]"></el-checkbox>
                    <el-input v-model="form.upgradeCondDirectNum" placeholder="请输入数值" auto-complete="off"></el-input>
                    <span>人</span>
                </el-form-item>
                <el-form-item>
                    <el-checkbox label="团队邀请人数" value="1" v-model="checked[1]"></el-checkbox>
                    <el-input v-model="form.upgradeCondIndirectNum" placeholder="请输入数值" auto-complete="off"></el-input>
                    <span>人</span>
                </el-form-item>
                <el-form-item>
                    <el-checkbox label="交易额" value="2" v-model="checked[2]"></el-checkbox>
                    <el-input v-model="form.upgradeCondPerSales" placeholder="请输入数值" auto-complete="off"></el-input>
                    <span>元</span>
                </el-form-item>
                <el-form-item>
                    <el-checkbox label="团队交易额" value="3" v-model="checked[3]"></el-checkbox>
                    <el-input v-model="form.upgradeCondGroupSales" placeholder="请输入数值" auto-complete="off"></el-input>
                    <span>元</span>
                </el-form-item>
                <el-form-item>
                    <el-checkbox label="购买升级礼包" value="4" v-model="checked[4]"></el-checkbox>
                </el-form-item>
            </el-form>
            <!--设置直接邀请条件-->
            <el-form v-model="form" label-width="120px" v-if="index==2">
                <!--<el-form-item label="直接邀请">-->
                    <!--<el-input v-model="form.upgradeDirectNum" placeholder="请输入人数" auto-complete="off"></el-input>-->
                    <!--<span>人</span>-->
                <!--</el-form-item>-->
                <div class="tip">直接邀请1人则获得</div>
                <el-form-item label="获得经验值">
                    <el-input v-model="form.upgradeDirectPerExp" placeholder="请输入数值" auto-complete="off"></el-input>
                    <span>分</span>
                </el-form-item>
            </el-form>
            <!--设置间接邀请条件-->
            <el-form v-model="form" label-width="120px" v-if="index==3">
                <!--<el-form-item label="间接邀请">-->
                    <!--<el-input v-model="form.upgradeIndirectNum" placeholder="请输入人数" auto-complete="off"></el-input>-->
                    <!--<span>人</span>-->
                <!--</el-form-item>-->
                <div class="tip">间接邀请1人则获得</div>
                <el-form-item label="获得经验值">
                    <el-input v-model="form.upgradeIndirectPerExp" placeholder="请输入数值" auto-complete="off"></el-input>
                    <span>分</span>
                </el-form-item>
            </el-form>
            <!--设置个人交易额条件-->
            <el-form v-model="form" label-width="120px" v-if="index==4">
                <!--<el-form-item label="个人交易额">-->
                    <!--<el-input v-model="form.upgradePerSalesNum" placeholder="请输入金额" auto-complete="off"></el-input>-->
                    <!--<span>元</span>-->
                <!--</el-form-item>-->
                <div class="tip">个人交易额增加1元，则获得</div>
                <el-form-item label="获得经验值">
                    <el-input v-model="form.upgradePerSalesOneExp" placeholder="请输入数值" auto-complete="off"></el-input>
                    <span>分</span>
                </el-form-item>
            </el-form>
            <!--设置直接交易额条件-->
            <el-form v-model="form" label-width="120px" v-if="index==5">
                <!--<el-form-item label="直接代理交易额">-->
                    <!--<el-input v-model="form.upgradeDirectSalesNum" placeholder="请输入金额" auto-complete="off"></el-input>-->
                    <!--<span>元</span>-->
                <!--</el-form-item>-->
                <div class="tip">直接代理交易额增加1元则获得</div>
                <el-form-item label="获得经验值">
                    <el-input v-model="form.upgradeDirectSalesOneExp" placeholder="请输入数值"
                              auto-complete="off"></el-input>
                    <span>分</span>
                </el-form-item>
            </el-form>
            <!--设置间接交易额条件-->
            <el-form v-model="form" label-width="120px" v-if="index==6">
                <!--<el-form-item label="间接代理交易额">-->
                    <!--<el-input v-model="form.upgradeIndirectSalesNum" placeholder="请输入金额" auto-complete="off"></el-input>-->
                    <!--<span>元</span>-->
                <!--</el-form-item>-->
                <div class="tip">间接代理交易额增加1元则获得</div>
                <el-form-item label="获得经验值">
                    <el-input v-model="form.upgradeIndirectSalesOneExp" placeholder="请输入数值"
                              auto-complete="off"></el-input>
                    <span>分</span>
                </el-form-item>
            </el-form>
            <!--设置连续交易额条件-->
            <el-form v-model="form" label-width="120px" v-if="index==7">
                <h3 class="tip">每周要求：</h3>
                <el-form-item label="交易额">
                    <el-input v-model="form.upgradeWeekSalesNum" placeholder="请输入金额" auto-complete="off"></el-input>
                    <span>元</span>
                </el-form-item>
                <el-form-item label="获得经验值">
                    <el-input v-model="form.upgradeWeekSalesNumExp" placeholder="请输入数值" auto-complete="off"></el-input>
                    <span>分</span>
                </el-form-item>
            </el-form>
            <!--设置连续交易额频次条件-->
            <el-form v-model="form" label-width="120px" v-if="index==8">
                <h3 class="tip">每周要求：</h3>
                <el-form-item label="交易频次">
                    <el-input v-model="form.upgradeWeekSalesFreq" placeholder="请输入频次" auto-complete="off"></el-input>
                    <span>次</span>
                </el-form-item>
                <el-form-item label="获得经验值">
                    <el-input v-model="form.upgradeWeekSalesFreqExp" placeholder="请输入数值" auto-complete="off"></el-input>
                    <span>分</span>
                </el-form-item>
            </el-form>
            <!--设置一次性交易条件-->
            <el-form v-model="form" label-width="120px" v-if="index==9">
                <el-form-item label="一次性交易额">
                    <el-input v-model="form.upgradeBuyNum" placeholder="请输入金额" auto-complete="off"></el-input>
                    <span>元</span>
                </el-form-item>
                <el-form-item label="获得经验值">
                    <el-input v-model="form.upgradeBuyNumExp" placeholder="请输入数值" auto-complete="off"></el-input>
                    <span>分</span>
                </el-form-item>
            </el-form>
            <!--代币充值-->
            <el-form v-model="form" label-width="120px" v-if="index==10">
                <!--<el-form-item label="充值代币">-->
                    <!--<el-input v-model="form.upgradeTokenCoinBuyNum" placeholder="请输入代币数" auto-complete="off"></el-input>-->
                    <!--<span>枚</span>-->
                <!--</el-form-item>-->
                <div class="tip">充值1枚代币，则获得</div>
                <el-form-item label="获得经验值">
                    <el-input v-model="form.upgradeTokenCoinBuyOneExp" placeholder="请输入数值" auto-complete="off"></el-input>
                    <span>分</span>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submit('form',index)">确认保存</el-button>
                <el-button @click="mask=false">取 消</el-button>
            </div>

        </el-dialog>
    </div>
</template>

<script>
    import vBreadcrumb from '@/components/common/Breadcrumb.vue';
    import request from '@/http/http.js';

    export default {
        components: { vBreadcrumb },

        data() {
            return {
                nav: ['经销商会员管理', '经销商层级管理', '升级设置'],
                mask: false,
                title: ['设置升级经验值', '设置必要条件', '设置直接邀请条件', '设置间接邀请条件', '设置个人交易额条件', '设置直接交易额条件', '设置间接交易额条件', '设置连续交易额条件', '设置连续交易额频次条件', '设置一次性交易条件', '代币充值'],
                index: 0,
                checked: [false, false, false, false, false],
                form: {},
                id: '',
                row: '',
                isAjax: false
            };
        },
        activated() {
            this.row = this.$route.query.MemberRow ? JSON.parse(this.$route.query.MemberRow) : JSON.parse(sessionStorage.getItem('MemberRow'));
            this.id = this.row.id;
            this.checked = [false, false, false, false, false];
        },
        methods: {
            // 获取详情
            getDetail() {
                for (const i in this.row) {
                    if (this.row[i] == 0 || this.row[i] == null || this.row[i] == undefined) {
                        this.row[i] = '';
                    }
                }
                this.form = this.row;
                this.convert(this.form.upgradeCondition);
            },
            // 显示弹窗
            showMask(num) {
                this.index = num;
                this.mask = true;
                this.getDetail();// 加载详情
            },
            // 保存
            submit(formName, index) {
                let url;
                switch (index) {
                    case 0:// 设置升级经验值
                        url = 'updateDealerLevelUpgradeExpById';
                        break;
                    case 1:// 设置必要条件
                        url = 'updateDealerLevelUpgradeConditionById';
                        break;
                    case 2:// 设置直接邀请条件
                        url = 'updateDealerLevelUpgradeExpById';
                        break;
                    case 3:// 设置间接邀请条件
                        url = 'updateDealerLevelUpgradeDirectById';
                        break;
                    case 4:// 设置个人交易额条件
                        url = 'updateDealerLevelUpgradePerSalesById';
                        break;
                    case 5:// 设置直接交易额条件
                        url = 'updateDealerLevelUpgradeDirectSalesById';
                        break;
                    case 6:// 设置间接交易额条件
                        url = 'updateDealerLevelUpgradeIndirectSalesById';
                        break;
                    case 7:// 设置连续交易额条件
                        url = 'updateDealerLevelUpgradeWeekSalesById';
                        break;
                    case 8:// 设置连续交易额频次条件
                        url = 'updateDealerLevelUpgradeWeekSalesFreqById';
                        break;
                    case 9:// 设置一次性交易条件
                        url = 'updateDealerLevelUpgradeBuyById';
                        break;
                    case 10:// 代币充值
                        url = 'updateDealerLevelUpgradeTokenCoinBuyById';
                        break;
                }
                const data = this[formName];
                data.id = this.id;
                let flag1 = true; let flag2 = true; let flag3 = true; let flag4 = true;
                if (index == 0) {
                    flag1 = this.isEmpty(data.upgradeExp, false);
                    this.setIsAjax(flag1);
                } else if (index == 1) {
                    this.isChecked();
                    if (this.checked[0]) {
                        flag1 = this.isEmpty(data.upgradeCondDirectNum, true);
                    }
                    if (this.checked[1]) {
                        flag2 = this.isEmpty(data.upgradeCondIndirectNum, true);
                    }
                    if (this.checked[2]) {
                        flag3 = this.isEmpty(data.upgradeCondPerSales, false);
                    }
                    if (this.checked[3]) {
                        flag4 = this.isEmpty(data.upgradeCondGroupSales, false);
                    }
                    if (this.checked[4]) {
                        data.upgradeCondBuyGift = 1;
                    } else {
                        data.upgradeCondBuyGift = 0;
                    }
                    this.setIsAjax(flag1 && flag2 && flag3 && flag4);
                } else if (index == 2) {
                    // flag1=this.isEmpty(data.upgradeDirectNum,true);
                    flag2 = this.isEmpty(data.upgradeDirectPerExp, false);
                    this.setIsAjax(flag2);
                } else if (index == 3) {
                    // flag1=this.isEmpty(data.upgradeIndirectNum,true);
                    flag2 = this.isEmpty(data.upgradeIndirectPerExp, false);
                    this.setIsAjax(flag2);
                } else if (index == 4) {
                    // flag1=this.isEmpty(data.upgradePerSalesNum,false);
                    flag2 = this.isEmpty(data.upgradePerSalesOneExp, false);
                    this.setIsAjax(flag2);
                } else if (index == 5) {
                    // flag1=this.isEmpty(data.upgradeDirectSalesNum,false);
                    flag2 = this.isEmpty(data.upgradeDirectSalesOneExp, false);
                    this.setIsAjax(flag2);
                } else if (index == 6) {
                    // flag1=this.isEmpty(data.upgradeIndirectSalesNum,false);
                    flag2 = this.isEmpty(data.upgradeIndirectSalesOneExp, false);
                    this.setIsAjax(flag2);
                } else if (index == 7) {
                    flag1 = this.isEmpty(data.upgradeWeekSalesNum, false);
                    flag2 = this.isEmpty(data.upgradeWeekSalesNumExp, false);
                    this.setIsAjax(flag1 && flag2);
                } else if (index == 8) {
                    flag1 = this.isEmpty(data.upgradeWeekSalesFreq, true);
                    flag2 = this.isEmpty(data.upgradeWeekSalesFreqExp, false);
                    this.setIsAjax(flag1 && flag2);
                } else if (index == 9) {
                    flag1 = this.isEmpty(data.upgradeBuyNum, false);
                    flag2 = this.isEmpty(data.upgradeBuyNumExp, false);
                    this.setIsAjax(flag1 && flag2);
                } else if (index == 10) {
                    // flag1=this.isEmpty(data.upgradeTokenCoinBuyNum,true);
                    flag2 = this.isEmpty(data.upgradeTokenCoinBuyOneExp, false);
                    this.setIsAjax(flag2);
                }
                if (this.isAjax) {
                    request[url](data).then(res => {
                        this.$message.success(res.data.msg);
                        this.mask = false;
                    }).catch(err => {
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
                }
            },
            // 值非空判断
            isEmpty(value, isInt) {
                if (value == null || value == undefined || value == '') {
                    if (isInt) {
                        this.$message.warning('请输入人数!');
                    } else {
                        this.$message.warning('请输入参数!');
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
    .promotion-manage {
        .wrap {
            margin: 0 75px;
            overflow: hidden;
            color: #666;
            // background-color: skyblue;
            .title {
                margin: 30px 0 20px 0;
            }
            button {
                background-color: #11a95d;
                border-color: #11a95d;
            }
            .small-wrap {
                // background-color: skyblue;
                margin: 0 0 20px 10px;
                .small-title {
                    font-size: 14px;
                    margin: 0 0 20px 0;
                }
                .inp {
                    width: 180px;
                    margin: 0 5px 0 5px;
                }
                .small-content {
                    display: inline-block;
                    margin: 0 10px 0 10px;
                }
            }
        }
        /*弹窗样式*/
        .el-dialog {
            width: 530px;
            border-radius: 10px;
        }
        .el-dialog__header {
            border-bottom: 1px solid #eee;
            padding: 20px 20px 10px 50px;
        }
        .el-dialog__title {
            color: #ff6868;
        }
        .el-dialog .el-input {
            display: inline;
        }
        .el-dialog .el-input__inner {
            width: 180px;
        }
        .el-select .el-input__inner {
            width: 180px;
        }

        .el-dialog__footer {
            margin-right: 30px;
        }
        .el-dialog span {
            margin-left: 10px
        }
        .special {
            h3 {
                margin: -10px 40px 10px
            }
            .el-form-item__content {
                margin-left: 20px !important;
                .el-checkbox {
                    width: 140px;
                }
                .el-checkbox__label {
                    margin-left: 0;
                }
                .el-input__inner {
                    width: 270px;
                }
            }
        }
        .tip{
            margin: -10px 0 10px 40px;
        }
    }
</style>
