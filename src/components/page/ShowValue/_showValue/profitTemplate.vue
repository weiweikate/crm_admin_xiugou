<template>
    <div class="profit-tpl">
        <div class="item">
            <el-checkbox v-model="valueX" @change="checked=>changeStatus(checked, 'valueX')">X值{{tplName}}分配比例设置</el-checkbox>
            <p class="small-title">间接分润</p>
            <p class="level" v-for="(v, k) in userLevel" :key='`XJ${k}`'>
                <span>{{v.name}}：用</span>
                <el-input-number :disabled="!valueX" :controls="false" :min="0" placeholder="请输入数值" v-model="v.valueX[0]" class="inp"></el-input-number>
                <span>%</span>
            </p>
            <p class="small-title">直接分润</p>
            <p class="level" v-for="(v, k) in userLevel" :key='`XZ${k}`'>
                <span>{{v.name}}：用</span>
                <el-input-number :disabled="!valueX" :controls="false" :min="0" placeholder="请输入数值" v-model="v.valueX[1]" class="inp"></el-input-number>
                <span>%</span>
            </p>
            <p class="small-title">自己</p>
            <p class="level" v-for="(v, k) in userLevel" :key='`XM${k}`'>
                <span>{{v.name}}：用</span>
                <el-input-number :disabled="!valueX" :controls="false" :min="0" placeholder="请输入数值" v-model="v.valueX[2]" class="inp"></el-input-number>
                <span>%</span>
            </p>
        </div>
        <div class="item">
            <el-checkbox v-model="valueY" @change="checked=>changeStatus(checked, 'valueY')">Y值{{name}}分配比例设置</el-checkbox>
            <p class="small-title">间接分润</p>
            <p class="level" v-for="(v, k) in userLevel" :key='`YJ${k}`'>
                <span>{{v.name}}：用</span>
                <el-input-number :disabled="!valueY" :controls="false" :min="0" placeholder="请输入数值" v-model="v.valueY[0]" class="inp"></el-input-number>
                <span>%</span>
            </p>
            <p class="small-title">直接分润</p>
            <p class="level" v-for="(v, k) in userLevel" :key='`YZ${k}`'>
                <span>{{v.name}}：用</span>
                <el-input-number :disabled="!valueY" :controls="false" :min="0" placeholder="请输入数值" v-model="v.valueY[1]" class="inp"></el-input-number>
                <span>%</span>
            </p>
            <p class="small-title">自己</p>
            <p class="level" v-for="(v, k) in userLevel" :key='`YM${k}`'>
                <span>{{v.name}}：用</span>
                <el-input-number :disabled="!valueY" :controls="false" :min="0" placeholder="请输入数值" v-model="v.valueY[2]" class="inp"></el-input-number>
                <span>%</span>
            </p>
        </div>
        <div class="item">
            <el-checkbox v-model="valueZ" @change="checked=>changeStatus(checked, 'valueZ')">Z值{{name}}分配比例设置</el-checkbox>
            <p class="small-title">间接分润</p>
            <p class="level" v-for="(v, k) in userLevel" :key='`ZJ${k}`'>
                <span>{{v.name}}：用</span>
                <el-input-number :disabled="!valueZ" :controls="false" :min="0" placeholder="请输入数值" v-model="v.valueZ[0]" class="inp"></el-input-number>
                <span>%</span>
            </p>
            <p class="small-title">直接分润</p>
            <p class="level" v-for="(v, k) in userLevel" :key='`ZZ${k}`'>
                <span>{{v.name}}：用</span>
                <el-input-number :disabled="!valueZ" :controls="false" :min="0" placeholder="请输入数值" v-model="v.valueZ[1]" class="inp"></el-input-number>
                <span>%</span>
            </p>
            <p class="small-title">自己</p>
            <p class="level" v-for="(v, k) in userLevel" :key='`ZM${k}`'>
                <span>{{v.name}}：用</span>
                <el-input-number :disabled="!valueZ" :controls="false" :min="0" placeholder="请输入数值" v-model="v.valueZ[2]" class="inp"></el-input-number>
                <span>%</span>
            </p>
        </div>
    </div>
</template>

<script>
export default {
    props: ['name'],
    computed: {
      tplName(){
          return this.name;
      }
    },
    data(){
        return {
            userLevel: [
                {name: 'v0', level: '1', valueX: [0,0,0], valueY: [0,0,0], valueZ: [0,0,0]},
                {name: 'v1', level: '2', valueX: [0,0,0], valueY: [0,0,0], valueZ: [0,0,0]},
                {name: 'v2', level: '3', valueX: [0,0,0], valueY: [0,0,0], valueZ: [0,0,0]},
                {name: 'v3', level: '4', valueX: [0,0,0], valueY: [0,0,0], valueZ: [0,0,0]},
                {name: 'v4', level: '5', valueX: [0,0,0], valueY: [0,0,0], valueZ: [0,0,0]},
                {name: 'v5', level: '6', valueX: [0,0,0], valueY: [0,0,0], valueZ: [0,0,0]},
            ],
            valueX: false,
            valueY: false,
            valueZ: false
        }
    },
    methods: {
        changeStatus(status, val){
            if(!status){
                for (let i = 0; i < this.userLevel.length; i++) {
                    for (let j = 0; j < this.userLevel[i][val].length; j++) {
                        this.userLevel[i][val][j] = 0;
                    }
                }
            }
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
        padding: 25px;
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
