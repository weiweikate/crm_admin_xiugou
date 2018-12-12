<template>
    <div class="profit-tpl">
        <div class="item">
            <p class="small-title">间接分润</p>
            <p class="level" v-for="(value, key) in form.jj">
                <span>{{key}}：</span>
                <el-input @blur="dealNum(form.jj[key], 'jj', key)" placeholder="请输入数值" v-model="form.jj[key]" class="inp"></el-input>
                <span>%</span>
            </p>
            <el-select v-model="moneyFlow" placeholder="请选择多余流向" class="flow">
                <el-option label="无主资金池" value="1"></el-option>
                <el-option label="公司利润" value="2"></el-option>
            </el-select>
        </div>
        <div class="item">
            <p class="small-title">直接分润</p>
            <p class="level" v-for="(value, key) in form.zj">
                <span>{{key}}：</span>
                <el-input @blur="dealNum(form.zj[key], 'zj', key)" placeholder="请输入数值" v-model="form.zj[key]" class="inp"></el-input>
                <span>%</span>
            </p>
            <el-select disabled v-model="moneyFlow" placeholder="请选择多余流向" class="flow">
                <el-option label="无主资金池" value="1"></el-option>
                <el-option label="公司利润" value="2"></el-option>
            </el-select>
        </div>
        <div class="item">
            <p class="small-title">自己</p>
            <p class="level" v-for="(value, key) in form.my">
                <span>{{key}}：</span>
                <el-input @blur="dealNum(form.my[key], 'my', key)" placeholder="请输入数值" v-model="form.my[key]" class="inp"></el-input>
                <span>%</span>
            </p>
            <el-select disabled v-model="moneyFlow" placeholder="请选择多余流向" class="flow">
                <el-option label="无主资金池" value="1"></el-option>
                <el-option label="公司利润" value="2"></el-option>
            </el-select>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            form: {
                jj: {
                    v0: '',
                    v1: '',
                    v2: '',
                    v3: '',
                    v4: '',
                    v5: '',
                    v6: ''
                },
                zj: {
                    v0: '',
                    v1: '',
                    v2: '',
                    v3: '',
                    v4: '',
                    v5: '',
                    v6: ''
                },
                my: {
                    v0: '',
                    v1: '',
                    v2: '',
                    v3: '',
                    v4: '',
                    v5: '',
                    v6: ''
                }
            },
            moneyFlow: ''
        };
    },
    methods: {
        // 处理输入的数字
        dealNum(val, origin, key) {
            const reg = /^[0-9]+([.]\d{1,3})?$/;
            if (!reg.test(val)) {
                this.form[origin][key] = '';
                this.$message.warning('请输入正确的数字!');
            } else {
                this.form[origin][key] = Number(val).toFixed(2);
            }
        },
        // 表单校验
        validForm() {
            const tmp = {};
            for (const key in this.form) {
                tmp[key] = [];
                for (const level in this.form[key]) {
                    tmp[key].push(this.form[key][level]);
                }
            }
            const arr = [1, 2, 3, 4, 5, 6, 7, 8];
            const res = arr.every((v, k, arr) => {
                return v > 0;
            });
            console.log(res);
        }
    }
};
</script>

<style lang="less" scoped>
.profit-tpl{
    display: flex;
    margin-top: 10px;
    .item{
        width: 290px;
        padding: 10px 25px;
        margin-right: 10px;
        background-color: #f7f7f7;
        .small-title{
            font-size: 16px;
            margin: 30px 0;
        }
        .level{
            span:first-child {
                margin-right: 10px;
            }
            span:last-child {
                margin-left: 10px;
            }
            .inp{
                width: 150px;
            }
            &:not(:first-child){
                margin-top: 20px;
            }
        }
        .flow{
            width: 150px;
            margin: 20px 0 0 47px;
        }
    }
}
</style>
