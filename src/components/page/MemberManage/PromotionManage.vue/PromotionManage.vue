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
                    <el-button type="success" @click="showMask(11)">签到</el-button>
                    <el-button type="success" @click="showMask(12)">分享</el-button>
                    <el-button type="success" @click="showMask(13)">分享被点击</el-button>
                    <!--<el-button type="success">设置个人活跃条件</el-button>-->
                    <!--<el-button type="success">设置团队活跃条件</el-button>-->
                </div>
                <div>
                    <p class="title">交易额维度</p>
                    <el-button type="success" @click="showMask(4)">设置个人交易额条件</el-button>
                    <el-button type="success" @click="showMask(5)">设置直接交易额条件</el-button>
                    <el-button type="success" @click="showMask(6)">设置间接交易额条件</el-button>
                    <el-button type="success" @click="showMask(7)">周交易额</el-button>
                    <el-button type="success" @click="showMask(8)">周交易频率</el-button>
                    <el-button type="success" @click="showMask(9)">设置一次性交易条件</el-button>
                    <el-button type="success" @click="showMask(14)">奖励金获得</el-button>
                </div>
                <!--<div>-->
                    <!--<p class="title">充值</p>-->
                    <!--<el-button type="success" @click="showMask(10)">代币充值</el-button>-->
                <!--</div>-->
            </div>
        </el-card>
        <!--弹窗-->
        <el-dialog :title="title[index]" :visible.sync="mask">
            <!--设置升级经验值-->
            <el-form v-model="form" label-width="120px" v-if="index==0">
                <el-form-item label="所需经验设置">
                    <el-input v-model="form.upgradeExp" placeholder="请输入数值" auto-complete="off"></el-input>
                    <span>点经验值</span>
                </el-form-item>
            </el-form>
            <!--设置必要条件-->
            <el-form v-model="form" label-width="120px" class="special" v-if="index==1">
                <h3>必要条件：</h3>
                <el-form-item>
                    <el-checkbox label="直接邀请人数" value="0" v-model="checked[0]"></el-checkbox>
                    <el-input v-model="form.upgradeCondDirectNum" :disabled="!checked[0]" placeholder="请输入数值" auto-complete="off"></el-input>
                    <span>人</span>
                </el-form-item>
                <el-form-item>
                    <el-checkbox label="团队邀请人数" value="1" v-model="checked[1]"></el-checkbox>
                    <el-input v-model="form.upgradeCondIndirectNum" :disabled="!checked[1]" placeholder="请输入数值" auto-complete="off"></el-input>
                    <span>人</span>
                </el-form-item>
                <el-form-item>
                    <el-checkbox label="交易额" value="2" v-model="checked[2]"></el-checkbox>
                    <el-input v-model="form.upgradeCondPerSales" :disabled="!checked[2]" placeholder="请输入数值" auto-complete="off"></el-input>
                    <span>元</span>
                </el-form-item>
                <el-form-item>
                    <el-checkbox label="团队交易额" value="3" v-model="checked[3]"></el-checkbox>
                    <el-input v-model="form.upgradeCondGroupSales" :disabled="!checked[3]" placeholder="请输入数值" auto-complete="off"></el-input>
                    <span>元</span>
                </el-form-item>
                <el-form-item>
                    <el-checkbox label="购买升级礼包" value="4" v-model="checked[4]"></el-checkbox>
                    <template v-for="(item,k) in form.userLevelPackageList">
                        <el-input :class="k>0?'gift-inp':''" v-model="item.packageCode" :key="k" :disabled="!checked[4]" @change="checkCode(item.packageCode,k)" placeholder="请输入礼包ID" auto-complete="off"></el-input>
                        <i v-if="k>0" @click="deleteGift(k)" class="el-icon-close"></i>
                    </template>
                    <div class="color-blue" @click="addGift">添加</div>
                    <div style="font-size: 12px;color: #aaa;margin: 20px 0 0 20px">注：多个升级礼包时，购买其中一个就可以升级</div>
                </el-form-item>
            </el-form>
            <!--设置直接邀请条件-->
            <el-form v-model="form" label-width="120px" v-if="index==2">
                <div class="tip">直接邀请1人则获得</div>
                <el-form-item label="获得经验值">
                    <el-input v-model="form.upgradeDirectPerExp" placeholder="请输入数值" auto-complete="off"></el-input>
                    <span>点</span>
                </el-form-item>
            </el-form>
            <!--设置间接邀请条件-->
            <el-form v-model="form" label-width="120px" v-if="index==3">
                <div class="tip">间接邀请1人则获得</div>
                <el-form-item label="获得经验值">
                    <el-input v-model="form.upgradeIndirectPerExp" placeholder="请输入数值" auto-complete="off"></el-input>
                    <span>点</span>
                </el-form-item>
            </el-form>
            <!--设置个人交易额条件-->
            <el-form v-model="form" label-width="120px" v-if="index==4">
                <div class="tip">个人交易额增加1元，则获得</div>
                <el-form-item label="获得经验值">
                    <el-input v-model="form.upgradePerSalesOneExp" placeholder="请输入数值" auto-complete="off"></el-input>
                    <span>点</span>
                </el-form-item>
            </el-form>
            <!--设置直接交易额条件-->
            <el-form v-model="form" label-width="120px" v-if="index==5">
                <div class="tip">直接代理交易额增加1元则获得</div>
                <el-form-item label="获得经验值">
                    <el-input v-model="form.upgradeDirectSalesOneExp" placeholder="请输入数值"
                              auto-complete="off"></el-input>
                    <span>点</span>
                </el-form-item>
            </el-form>
            <!--设置间接交易额条件-->
            <el-form v-model="form" label-width="120px" v-if="index==6">
                <div class="tip">间接代理交易额增加1元则获得</div>
                <el-form-item label="获得经验值">
                    <el-input v-model="form.upgradeIndirectSalesOneExp" placeholder="请输入数值"
                              auto-complete="off"></el-input>
                    <span>点</span>
                </el-form-item>
            </el-form>
            <!--周交易额-->
            <el-form v-model="form" label-width="120px" v-if="index==7">
                <h3 class="tip">每周要求：</h3>
                <el-form-item label="交易额">
                    <el-input v-model="form.upgradeWeekSalesNum" placeholder="请输入金额" auto-complete="off"></el-input>
                    <span>元</span>
                </el-form-item>
                <el-form-item label="获得经验值">
                    <el-input v-model="form.upgradeWeekSalesNumExp" placeholder="请输入数值" auto-complete="off"></el-input>
                    <span>点</span>
                </el-form-item>
            </el-form>
            <!--周交易频率-->
            <el-form v-model="form" label-width="120px" v-if="index==8">
                <h3 class="tip">每周要求：</h3>
                <el-form-item label="交易频次">
                    <el-input v-model="form.upgradeWeekSalesFreq" placeholder="请输入频次" auto-complete="off"></el-input>
                    <span>次</span>
                </el-form-item>
                <el-form-item label="获得经验值">
                    <el-input v-model="form.upgradeWeekSalesFreqExp" placeholder="请输入数值" auto-complete="off"></el-input>
                    <span>点</span>
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
                    <span>点</span>
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
            <!--签到-->
            <el-form v-model="form" label-width="120px" v-if="index==11">
                <div class="tip">签到，则获得</div>
                <el-form-item label="经验值">
                    <el-input v-model="form.upSign" placeholder="请输入数值" auto-complete="off"></el-input>
                    <span>点</span>
                </el-form-item>
            </el-form>
            <!--分享-->
            <el-form v-model="form" label-width="120px" v-if="index==12">
                <h3 class="tip">分享，则获得</h3>
                <el-form-item label="经验值">
                    <el-input v-model="form.upShare" placeholder="请输入数值" auto-complete="off"></el-input>
                    <span>点</span>
                </el-form-item>
                <el-form-item label="每日可分享">
                    <el-input v-model="form.upShareCount" placeholder="请输入数值" auto-complete="off"></el-input>
                    <span>次</span>
                </el-form-item>
            </el-form>
            <!--分享被点击-->
            <el-form v-model="form" label-width="120px" v-if="index==13">
                <h3 class="tip">每日分享被点击单次可获得</h3>
                <el-form-item label="经验值">
                    <el-input v-model="form.upShareClick" placeholder="请输入数值" auto-complete="off"></el-input>
                    <span>点</span>
                </el-form-item>
                <el-form-item label="最多可得">
                    <el-input v-model="form.upShareClickCount" placeholder="请输入数值" auto-complete="off"></el-input>
                    <span>点</span>
                </el-form-item>
            </el-form>
            <!--奖励金获得-->
            <el-form v-model="form" label-width="120px" v-if="index==14">
                <div class="tip">个人获得奖励金加1元，则获得</div>
                <el-form-item label="经验值">
                    <el-input v-model="form.upAward" placeholder="请输入数值" auto-complete="off"></el-input>
                    <span>点</span>
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
                nav: ['会员管理', '会员层级管理', '升级设置'],
                mask: false,
                title: ['设置升级经验值', '设置必要条件', '设置直接邀请条件', '设置间接邀请条件', '设置个人交易额条件', '设置直接交易额条件', '设置间接交易额条件', '设置连续交易额条件', '设置连续交易额频次条件', '设置一次性交易条件', '代币充值', '签到', '分享', '分享被点击', '奖励金获得'],
                index: 0,
                checked: [false, false, false, false, false],
                form: {
                    userLevelPackageList: [{ packageCode: '' }]// 礼包ids
                },
                id: '',
                row: '',
                isAjax: false,
                status: ''
            };
        },
        activated() {
            this.id = this.$route.query.levelMangeToUp;
            this.checked = [false, false, false, false, false];
            this.getDetail();
        },
        methods: {
            // 删除礼包Id
            deleteGift(index) {
                this.form.userLevelPackageList.splice(index, 1);
            },
            // 添加礼包id
            addGift() {
                this.form.userLevelPackageList.push({ packageCode: '' });
            },
            // 获取详情
            getDetail() {
                const data = {
                    id: this.id
                };
                request.findUserLevelUpgradeDemotionById(data).then((res) => {
                    this.form = res.data;
                    this.status = res.data.level;
                    if (!res.data.userLevelPackageList || !res.data.userLevelPackageList.length) {
                        this.form.userLevelPackageList = [{ packageCode: '' }];
                    }
                    this.convert(this.form.upgradeCondition);
                }).catch((err) => {
                    console.log(err);
                });
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
                        url = 'updateUserLevelUpExpById';
                        break;
                    case 1:// 设置必要条件
                        url = 'updateUserLevelUpConditionById';
                        break;
                    case 2:// 设置直接邀请条件
                        url = 'updateUserLevelUpgradeDirectById';
                        break;
                    case 3:// 设置间接邀请条件
                        url = 'updateUserLevelUpIndirectById';
                        break;
                    case 4:// 设置个人交易额条件
                        url = 'updateUserLevelUpPerSalesById';
                        break;
                    case 5:// 设置直接交易额条件
                        url = 'updateUserLevelUpDirectSalesById';
                        break;
                    case 6:// 设置间接交易额条件
                        url = 'updateUserLevelUpIndirectSalesById';
                        break;
                    case 7:// 设置连续交易额条件
                        url = 'updateUserLevelUpWeekSalesById';
                        break;
                    case 8:// 设置连续交易额频次条件
                        url = 'updateUserLevelUpWeekSalesFreqById';
                        break;
                    case 9:// 设置一次性交易条件
                        url = 'updateUserLevelUpBuyById';
                        break;
                    case 10:// 代币充值
                        url = 'updateUserLevelUpTokenCoinBuyById';
                        break;
                    case 11:// 签到
                        url = 'updateByLevelId';
                        break;
                    case 12:// 分享
                        url = 'updateByLevelId';
                        break;
                    case 13:// 分享被点击
                        url = 'updateByLevelId';
                        break;
                    case 14:// 奖励金获得
                        url = 'updateByLevelId';
                        break;
                }
                const data = this[formName];
                data.id = this.id;
                let flag1 = true; let flag2 = true; let flag3 = true; let flag4 = true;
                if (index === 0) {
                    flag1 = this.isEmpty(data.upgradeExp, false);
                    this.setIsAjax(flag1);
                } else if (index === 1) {
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
                    this.setIsAjax(flag1 && flag2 && flag3 && flag4);
                    if (this.checked[4]) {
                        data.upgradeCondBuyGift = 1;
                        data.userLevelPackageList.forEach((v, k) => {
                            if (v.packageCode == '') {
                                this.$message.warning('请输入礼包ID');
                                this.isAjax = false;
                            }
                        });
                    } else {
                        data.upgradeCondBuyGift = 0;
                        data.userLevelPackageList = [];
                    }
                } else if (index === 2) {
                    flag1 = this.isEmpty(data.upgradeDirectPerExp, false);
                    this.setIsAjax(flag1);
                } else if (index === 3) {
                    if (!data.upgradeIndirectPerExp) data.upgradeIndirectPerExp = 0;
                    flag1 = this.isEmpty(data.upgradeIndirectPerExp, false);
                    this.setIsAjax(flag1);
                } else if (index === 4) {
                    flag1 = this.isEmpty(data.upgradePerSalesOneExp, false);
                    this.setIsAjax(flag1);
                } else if (index === 5) {
                    if (!data.upgradeDirectSalesOneExp) data.upgradeDirectSalesOneExp = 0;
                    flag1 = this.isEmpty(data.upgradeDirectSalesOneExp, false);
                    this.setIsAjax(flag1);
                } else if (index === 6) {
                    if (!data.upgradeIndirectSalesOneExp) data.upgradeIndirectSalesOneExp = 0;
                    flag1 = this.isEmpty(data.upgradeIndirectSalesOneExp, false);
                    this.setIsAjax(flag1);
                } else if (index === 7) {
                    if (!data.upgradeWeekSalesNum) data.upgradeWeekSalesNum = 0;
                    if (!data.upgradeWeekSalesNumExp) data.upgradeWeekSalesNumExp = 0;
                    flag1 = this.isEmpty(data.upgradeWeekSalesNum, false);
                    flag2 = this.isEmpty(data.upgradeWeekSalesNumExp, false);
                    this.setIsAjax(flag1 && flag2);
                } else if (index === 8) {
                    if (!data.upgradeWeekSalesFreq) data.upgradeWeekSalesFreq = 0;
                    if (!data.upgradeWeekSalesFreqExp) data.upgradeWeekSalesFreqExp = 0;
                    flag1 = this.isEmpty(data.upgradeWeekSalesFreq, true);
                    flag2 = this.isEmpty(data.upgradeWeekSalesFreqExp, false);
                    this.setIsAjax(flag1 && flag2);
                } else if (index === 9) {
                    if (!data.upgradeBuyNum) data.upgradeBuyNum = 0;
                    if (!data.upgradeBuyNumExp) data.upgradeBuyNumExp = 0;
                    flag1 = this.isEmpty(data.upgradeBuyNum, false);
                    flag2 = this.isEmpty(data.upgradeBuyNumExp, false);
                    this.setIsAjax(flag1 && flag2);
                } else if (index === 10) {
                    if (!data.upgradeTokenCoinBuyOneExp) data.upgradeTokenCoinBuyOneExp = 0;
                    flag1 = this.isEmpty(data.upgradeTokenCoinBuyOneExp, false);
                    this.setIsAjax(flag1);
                } else if (index == 11) {
                    if (!data.upSign) data.upSign = 0;
                    flag1 = this.isEmpty(data.upSign, false);
                    this.setIsAjax(flag1);
                } else if (index == 12) {
                    if (!data.upShare) data.upShare = 0;
                    if (!data.upShareCount) data.upShareCount = 0;
                    flag1 = this.isEmpty(data.upShare, false);
                    flag2 = this.isEmpty(data.upShareCount, true);
                    this.setIsAjax(flag1 && flag2);
                } else if (index == 13) {
                    if (!data.upShareClick) data.upShareClick = 0;
                    if (!data.upShareClickCount) data.upShareClickCount = 0;
                    flag1 = this.isEmpty(data.upShareClick, false);
                    flag2 = this.isEmpty(data.upShareClickCount, false);
                    this.setIsAjax(flag1 && flag2);
                } else if (index == 14) {
                    if (!data.upAward) data.upAward = 0;
                    flag1 = this.isEmpty(data.upAward, false);
                    this.setIsAjax(flag1);
                }
                if (this.isAjax) {
                    request[url](data).then(res => {
                        this.$message.success(res.msg);
                        this.mask = false;
                        this.getDetail();
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
                    this.dealData();
                }
            },
            // 值处理为空
            dealData() {
                this.form.upgradeCondDirectNum = this.checked[0] ? this.form.upgradeCondDirectNum : '';
                this.form.upgradeCondIndirectNum = this.checked[1] ? this.form.upgradeCondIndirectNum : '';
                this.form.upgradeCondPerSales = this.checked[2] ? this.form.upgradeCondPerSales : '';
                this.form.upgradeCondGroupSales = this.checked[3] ? this.form.upgradeCondGroupSales : '';
            },
            // 值非空判断
            isEmpty(value, isInt) {
                if (value == null || value === undefined || value === '') {
                    if (isInt) {
                        this.$message.warning('请输入人数!');
                    } else {
                        this.$message.warning('请输入参数!');
                    }
                    return false;
                } else {
                    if (isInt) {
                        const reg = /^(0|[1-9]\d*)$/;
                        return this.setReg(reg, value);
                    } else {
                        const reg = /^(0|[1-9]\d*)([.]{1}[0-9]{1,2})?$/;
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
            },
            checkCode(code, index) {
                const data = {
                    packageCode: code
                };
                request.findByCode(data).then(res => {
                    if (!res.data) {
                        this.$message.warning('礼包不存在，请重新输入');
                        this.form.userLevelPackageList[index] = { packageCode: '' };
                        this.$set(this.form.userLevelPackageList, index, this.form.userLevelPackageList[index]);
                    }
                }).catch(err => {
                    console.log(err);
                });
            }
        }
    };

</script>
<style lang='less'>
    .promotion-manage {
        .color-blue{
            cursor: pointer;
            color: #33b4ff;
            float: right;
            margin-right: 55px;
        }
        .gift-inp{
            margin-left:145px;
            .el-input__inner{
                margin-top: 10px;
            }
        }
        .el-icon-close{
            cursor: pointer;
        }
        .wrap {
            margin: 0 75px;
            overflow: hidden;
            color: #666;
            // background-color: skyblue;
            .title {
                margin: 30px 0 20px 0;
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
