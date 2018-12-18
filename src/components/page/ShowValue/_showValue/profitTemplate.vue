<template>
    <div class="profit-tpl">
        <div class="item">
            <p class="small-title">间接分润</p>
            <p class="level" v-for="(value, key) in form.indirect">
                <span>{{key}}：</span>
                <el-input @blur="dealNum(form.indirect[key], 'indirect', key)" placeholder="请输入数值" v-model="form.indirect[key]" class="inp"></el-input>
                <span>%</span>
            </p>
            <el-select v-model="flow" placeholder="请选择多余流向" class="flow">
                <el-option label="无主资金池" value="1"></el-option>
                <el-option label="公司利润" value="2"></el-option>
            </el-select>
        </div>
        <div class="item">
            <p class="small-title">直接分润</p>
            <p class="level" v-for="(value, key) in form.direct">
                <span>{{key}}：</span>
                <el-input @blur="dealNum(form.direct[key], 'direct', key)" placeholder="请输入数值" v-model="form.direct[key]" class="inp"></el-input>
                <span>%</span>
            </p>
            <el-select disabled v-model="flow" placeholder="请选择多余流向" class="flow">
                <el-option label="无主资金池" value="1"></el-option>
                <el-option label="公司利润" value="2"></el-option>
            </el-select>
        </div>
        <div class="item">
            <p class="small-title">自己</p>
            <p class="level" v-for="(value, key) in form.oneself">
                <span>{{key}}：</span>
                <el-input @blur="dealNum(form.oneself[key], 'oneself', key)" placeholder="请输入数值" v-model="form.oneself[key]" class="inp"></el-input>
                <span>%</span>
            </p>
            <el-select disabled v-model="flow" placeholder="请选择多余流向" class="flow">
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
                direct: {
                    v0: '',
                    v1: '',
                    v2: '',
                    v3: '',
                    v4: '',
                    v5: ''
                },
                indirect: {
                    v0: '',
                    v1: '',
                    v2: '',
                    v3: '',
                    v4: '',
                    v5: ''
                },
                oneself: {
                    v0: '',
                    v1: '',
                    v2: '',
                    v3: '',
                    v4: '',
                    v5: ''
                }
            },
            flow: ''
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
                    if (this.form[key][level] === '') return {status: false, msg: '输入不能为空!'}; // 判空
                    tmp[key].push(this.form[key][level]);
                }
            }
            const directMax = Number(this.form.direct.v5);
            const indirectMax = Number(this.form.indirect.v5);
            const oneselfMax = Number(this.form.oneself.v5);
            // 判断最高等级项相加是否小于等于100%
            if (!(directMax + indirectMax + oneselfMax <= 100)) return {status: false, msg: '请确保最高等级项相加小于等于100%!'};
            // 判断竖向是否是递增
            for (const key in tmp) {
                for (let i = 0; i < tmp[key].length - 2; i++) {
                    const arr = tmp[key];
                    if (arr[i] > arr[i + 1]) return {status: false, msg: '请确保v0-v5为递增！'};
                }
            }
            return {status: true, msg: this.form};
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
