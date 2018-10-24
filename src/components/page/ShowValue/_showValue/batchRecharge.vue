<template>
    <div class="batch-recharge">
        <el-form :model="form" style="margin: 0 auto" label-width="120px">
            <el-form-item label="充值秀值数">
                <el-input-number :controls="false" :min="0" v-model="form.money" class="inp" placeholder="请输入充值金额"></el-input-number>
            </el-form-item>
            <el-form-item label="截至时间">
                <el-date-picker
                    class="inp"
                    v-model="form.date"
                    type="date"
                    placeholder="请选择日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="继续签到">
                <el-input-number :controls="false" :min="0" v-model="form.signUp" class="inp" placeholder="请输入天数"></el-input-number>天
                <p class="tip inp">截止时间当天是不计入签到时间内的选择签到0天,就是全平台充值</p>
            </el-form-item>
            <el-form-item label="用户层级">
                <el-checkbox v-model="checkedAll" @change="handleCheckAllChange">全选</el-checkbox>
                <el-button style="margin-left: 10px" :disabled="!checkedAll" size="mini" type="primary">查询</el-button>
                <el-checkbox-group v-loading="loading" class="check-group" v-model="form.checkedUsers" @change="handleCheckedUser">
                    <el-checkbox v-for="(v, k) in userLevel" :key="k" :label="v.levelId">{{v.name}}</el-checkbox>
                </el-checkbox-group>
                <div class="total">
                    <p>全部：{{totalNum}}人</p>
                    <span class="item" v-for="(v, k) in userLevel" :key="k">{{v.name}}：{{v.count || 0}}人</span>
                </div>
                <p style="color: red">
                    预计：{{form.money||0}}（秀值）*{{totalNum||0}}（人数）= {{totalMoney}}（元)
                </p>
            </el-form-item>
            <el-form-item label="备注">
                <el-input v-model="form.tip" :maxlength="180" type="textarea" class="inp" placeholder="请输入备注0-180字"></el-input>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import request from '@/http/http';
    export default {
        data() {
            return {
                form: {
                    phone: '',
                    date: '',
                    tip: '',
                    signUp: '',
                    checkedUsers: []
                },
                checkedAll: false,
                loading: false,
                userLevel: []
            };
        },
        computed: {
            totalNum() {
                let total = 0;
                if (this.userLevel.length !== 0) {
                    this.userLevel.forEach(v => {
                        total += v.count;
                    });
                }
                return total;
            },
            totalMoney() {
                return (this.totalNum || 0) * (this.form.money || 0);
            }
        },
        created() {
            this.getUserLevel();
        },
        methods: {
            // 全选
            handleCheckAllChange(val) {
                this.form.checkedUsers = [];
                if (val && this.userLevel.length !== 0) {
                    this.userLevel.forEach(v => {
                        this.form.checkedUsers.push(v.levelId);
                    });
                }
            },
            handleCheckedUser(val) {
                this.checkedAll = val.length === this.userLevel.length;
            },
            // 获取会员层级
            getUserLevel() {
                this.loading = true;
                request.queryLevelGroupUserCount({}).then(res => {
                    this.loading = false;
                    this.userLevel = res.data;
                }).catch(err => {
                    this.loading = false;
                    console.log(err);
                });
            }
        }
    };
</script>

<style lang="less" scoped>
    .batch-recharge{
        margin-top: 10px;
        .inp{
            width: 270px;
        }
        .check-group{
            width: 270px;
        }
        /deep/.el-checkbox{
           margin: 0 30px 0 0;
        }
        .tip{
            color: #ccc;
            font-size: 14px;
            line-height: 18px;
        }
        .total{
            border: 1px solid #ccc;
            border-radius: 5px;
            padding: 0 5px;
            box-sizing: border-box;
            width: 270px;
            .item{
                margin-right: 20px;
            }
        }
    }
</style>
