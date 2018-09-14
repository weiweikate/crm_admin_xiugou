<template>
    <div class="degrade-manage">
        <v-breadcrumb :nav="nav"></v-breadcrumb>
        <el-card style="minHeight:60vh">
            <div class="wrap">
                <div>
                    <p class="title">基础设置</p>
                    <el-button type="success" @click="showMask(0)">每周登录要求</el-button>
                    <el-button type="success" @click="showMask(1)">每周交易额要求</el-button>
                </div>
            </div>
        </el-card>
        <!--弹窗-->
        <el-dialog :title="title[index]" :visible.sync="mask">
            <!--设置降级经验值-->
            <el-form v-model="form" label-width="120px" v-if="index==0">
                <el-form-item label="扣除经验值">
                    <el-input v-model="form.demotionWeekNologinExp" placeholder="请输入数值" auto-complete="off"></el-input>
                    <span>分</span>
                </el-form-item>
            </el-form>
            <!--设置必要条件-->
            <el-form v-model="form" label-width="120px" class="special" v-if="index==1">
                <el-form-item label="交易额">
                    <el-input v-model="form.demotionWeekSalesNum" placeholder="请输入金额" auto-complete="off"></el-input>
                    <span>元</span>
                </el-form-item>
                <el-form-item label="扣除经验值">
                    <el-input v-model="form.demotionWeekSalesNumExp" placeholder="请输入数值" auto-complete="off"></el-input>
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
                nav: ['会员管理', '会员层级管理', '降级设置'],
                mask: false,
                title: ['每周未登录则', '每周交易额是否达标'],
                index: 0,
                form: {},
                id: '',
                row: '',
                isAjax: false
            };
        },
        activated() {
            this.id = this.$route.query.memberId || sessionStorage.getItem('memberId');
            this.checked = [false, false, false, false, false];
        },
        methods: {
            // 获取详情
            getDetail() {
                const data = {
                    id: this.id
                };
                request.findUserLevelUpgradeDemotionById(data).then((res) => {
                    this.form = res.data;
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
                    case 0:// 设置降级经验值
                        url = 'updateUserLevelDemotionWeekNologinScoreById';
                        break;
                    case 1:// 设置必要条件
                        url = 'updateUserLevelDeWeekSalesById';
                        break;
                }
                const data = this[formName];
                data.id = this.id;
                let flag1 = true; let flag2 = true;
                if (index == 0) {
                    flag1 = this.isEmpty(data.demotionWeekNologinExp, false);
                    this.setIsAjax(flag1);
                } else if (index == 1) {
                    flag1 = this.isEmpty(data.demotionWeekSalesNum, true);
                    flag2 = this.isEmpty(data.demotionWeekSalesNumExp, false);
                    this.setIsAjax(flag1 && flag2);
                }
                if (this.isAjax) {
                    request[url](data).then(res => {
                        // this.$message.success(res.data.msg);
                        this.mask = false;
                    }).catch(err => {
                        console.log(err);
                    });
                }
            },
            // 值非空判断
            isEmpty(value, isInt) {
                if (value == null || value == undefined || value == '') {
                    if (isInt) {
                        this.$message.warning('请输入人数!');
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
    .degrade-manage {
        .wrap {
            margin: 0px 75px;
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
        .icon-btn{
            cursor: pointer;
            i{
                margin-right: 5px;
            }
            .el-icon-error{
                color:#ff1e30
            }
            .el-icon-success{
                color:#11a95d
            }
        }

    }
</style>
