<template>
    <div class="single-recharge">
        <el-form :model="form" style="margin: 0 auto" label-width="120px">
            <el-form-item label="会员ID">
                <el-autocomplete
                    class="inp"
                    v-model="form.phone"
                    :fetch-suggestions="querySearchAsync"
                    @select="selectUser"
                    placeholder="模糊搜索"
                ></el-autocomplete>
                <div class="info-card" v-if="showMsg">
                    <p>会员编号：{{msg.code || ''}}</p>
                    <p>昵称：{{msg.nickname || ''}}</p>
                    <p>手机号：{{msg.phone || ''}}</p>
                    <p>姓名：{{msg.realname || ''}}</p>
                    <p>身份证号：{{msg.idcard || ''}}</p>
                </div>
            </el-form-item>
            <el-form-item label="充值秀值数">
                <el-input-number :controls="false" :min="0" :max="9999999999.99" v-model="form.money" @blur="toFixed" class="inp" placeholder="请输入充值金额"></el-input-number>
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
            showMsg: false,
            form: {
                phone: '',
                tip: '',
                money: 0
            },
            msg: {}
        };
    },
    methods: {
        // 搜索手机号
        querySearchAsync(queryString, cb) {
            if (queryString === '') return;
            request.queryUserByCode({ code: queryString }).then(res => {
                const arr = [];
                arr.push({ name: res.data.code, value: res.data.code });
                this.msg = res.data;
                cb(arr);
            }).catch(err => {
                console.log(err);
            });
        },
        selectUser() {
            this.showMsg = true;
        },
        // 保留两位小数
        toFixed() {
            this.form.money = this.form.money === undefined ? 0 : this.form.money;
            this.form.money = this.form.money.toFixed(2);
        }
    }
};
</script>

<style lang="less" scoped>
.single-recharge{
    margin-top: 10px;
    .info-card{
        width: 270px;
        height: 120px;
        background-color: #33b4ff;
        border-radius: 10px;
        overflow: auto;
        p{
            line-height: 20px;
            color: #fff;
            margin-left: 10px;
            &:first-child{
                margin-top: 10px;
            }
        }
    }
    .inp{
        width: 270px;
    }
}
</style>
