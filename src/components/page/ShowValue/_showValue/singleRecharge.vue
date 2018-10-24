<template>
    <div class="single-recharge">
        <el-form :model="form" style="margin: 0 auto" label-width="120px">
            <el-form-item label="手机号码">
                <el-autocomplete
                    class="inp"
                    v-model="form.phone"
                    :fetch-suggestions="querySearchAsync"
                    placeholder="模糊搜索"
                ></el-autocomplete>
                <div class="info-card">
                    <p>会员编号：</p>
                    <p>昵称：</p>
                    <p>手机号：</p>
                    <p>姓名：</p>
                    <p>身份证号：</p>
                </div>
            </el-form-item>
            <el-form-item label="手机号码">
                <el-input v-model="money" placeholder="请输入充值金额"></el-input>
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
                money: ''
            }
        }
    },
    methods: {
        // 搜索手机号
        querySearchAsync(queryString, cb) {}
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
