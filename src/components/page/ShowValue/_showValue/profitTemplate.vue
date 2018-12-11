<template>
    <div class="profit-tpl">
        <div class="item">
            <p class="small-title">间接分润</p>
            <p class="level" v-for="(value, key) in form.jj">
                <span>{{key}}：</span>
                <el-input placeholder="请输入数值" v-model="form.jj[key]" class="inp"></el-input>
                <span>%</span>
            </p>
        </div>
        <div class="item">
            <p class="small-title">直接分润</p>
            <p class="level" v-for="(value, key) in form.zj">
                <span>{{key}}：</span>
                <el-input placeholder="请输入数值" v-model="form.zj[key]" class="inp"></el-input>
                <span>%</span>
            </p>
        </div>
        <div class="item">
            <p class="small-title">自己</p>
            <p class="level" v-for="(value, key) in form.my">
                <span>{{key}}：</span>
                <el-input placeholder="请输入数值" v-model="form.my[key]" class="inp"></el-input>
                <span>%</span>
            </p>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            userLevel: [
                { name: 'v0', level: '1', valueX: [0, 0, 0], valueY: [0, 0, 0], valueZ: [0, 0, 0] },
                { name: 'v1', level: '2', valueX: [0, 0, 0], valueY: [0, 0, 0], valueZ: [0, 0, 0] },
                { name: 'v2', level: '3', valueX: [0, 0, 0], valueY: [0, 0, 0], valueZ: [0, 0, 0] },
                { name: 'v3', level: '4', valueX: [0, 0, 0], valueY: [0, 0, 0], valueZ: [0, 0, 0] },
                { name: 'v4', level: '5', valueX: [0, 0, 0], valueY: [0, 0, 0], valueZ: [0, 0, 0] },
                { name: 'v5', level: '6', valueX: [0, 0, 0], valueY: [0, 0, 0], valueZ: [0, 0, 0] },
                { name: 'v6', level: '7', valueX: [0, 0, 0], valueY: [0, 0, 0], valueZ: [0, 0, 0] }
            ],
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
            }
        };
    },
    methods: {

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
    }
}
</style>
