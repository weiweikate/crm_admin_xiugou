<template>
    <div class="profit-tpl">
        <v-breadcrumb :nav="['结算管理','利润分配设置','利润分配模板']"></v-breadcrumb>
        <el-card :body-style="{ padding: '30px' }" v-loading="pageLoading">
            <div class="option" style="height:50px;line-height:50px;text-align:center">
                利润分配模板名称：<el-input style='width:200px' v-model="tplName" placeholder="请输入名称"></el-input>
            </div>
            <div class="option">
                <img class="img-title" src="@/assets/images/icon_project01@2x.png" alt="">
                <span class="project-title">品牌店铺奖励金：拼店用户参与</span>
                <div class="my-inp">
                    设置：X= <el-input-number :controls="false" :min="0" :max="100" @input="changePerMoney" v-model="shopMoney" placeholder="请输入数值"></el-input-number> %
                </div>
            </div>
            <div class="option">
                <img class="img-title" src="@/assets/images/icon_project03@2x.png" alt="">
                <span class="project-title">品牌个人奖励金</span>
                <div class="my-inp">
                    设置：Y= <el-input disabled style='width:200px' v-model="personMoney" placeholder="请输入数值"></el-input> %
                </div>
            </div>
            <div style="overflow:hidden">
                <div class="item">
                    <p>X值分配比例设置</p>
                    <el-checkbox style="margin:20px 0" v-model="checkX">仅上级拼店分配</el-checkbox>
                    <div v-for='(v,k) in formX' :key="k+'X'" style="overflow:hidden;line-height:30px">
                        <el-checkbox :disabled="k == 0 && !checkX" :label="k" class="smallItem" v-model="v.disable" @change="checked=>changeStatus(checked,'X',k)" >{{v.label}}</el-checkbox>
                        <el-input-number :controls='false' :min="0" :max="100" v-if='k > 1' :disabled="!v.disable" style="width:140px;float:right" size="mini" v-model="v.value"></el-input-number>
                        <p v-else v-for='(v1,k1) in v.value' style="float: right;margin-bottom: 10px">
                            <span v-if='k == 1' style="font-size: 14px;color: #606266" >{{`v${k1}用户：`}}</span>
                            <span v-if='k == 0' style="font-size: 14px;color: #606266" >{{`${k1+1}星：`}}</span>
                            <el-input-number :controls='false' :min="0" :max="100" :key="k1" :disabled="!v.disable" style="width:140px" v-model="v1.value"></el-input-number>
                        </p>
                    </div>
                    <p>结算时间：周期结算</p>
                </div>
                <div class="item">
                    <p>Y值分配比例设置</p>
                    <el-checkbox style="margin:20px 0" v-model="checkY">仅上级拼店分配</el-checkbox>
                    <div v-for='(v,k) in formY' :key="k+'Y'" style="overflow:hidden;line-height:30px">
                        <el-checkbox :disabled="k == 0 && !checkY" :label="k" class="smallItem" v-model="v.disable" @change="checked=>changeStatus(checked,'Y',k)" >{{v.label}}</el-checkbox>
                        <el-input-number :controls='false' :min="0" :max="100" v-if='k > 1' :disabled="!v.disable" style="width:140px;float:right" size="mini" v-model="v.value"></el-input-number>
                        <p v-else v-for='(v1,k1) in v.value' style="float: right;margin-bottom: 10px">
                            <span v-if='k == 1' style="font-size: 14px;color: #606266" >{{`v${k1}用户：`}}</span>
                            <span v-if='k == 0' style="font-size: 14px;color: #606266" >{{`${k1+1}星：`}}</span>
                            <el-input-number :controls='false' :min="0" :max="100" :key="k1" :disabled="!v.disable" style="width:140px" v-model="v1.value"></el-input-number>
                        </p>
                    </div>
                    <p>结算时间：即时结算</p>
                </div>
                <div class="item">
                    <p>Z值分配比例设置</p>
                    <el-checkbox style="margin:20px 0" v-model="checkZ">仅上级拼店分配</el-checkbox>
                    <div v-for='(v,k) in formZ' :key="k+'Z'" style="overflow:hidden;line-height:30px">
                        <el-checkbox :disabled="k == 0 && !checkZ" :label="k" class="smallItem" v-model="v.disable" @change="checked=>changeStatus(checked,'Z',k)" >{{v.label}}</el-checkbox>
                        <el-input-number :controls='false' :min="0" :max="100" v-if='k > 1' :disabled="!v.disable" style="width:140px;float:right" size="mini" v-model="v.value"></el-input-number>
                        <p v-else v-for='(v1,k1) in v.value' style="float: right;margin-bottom: 10px">
                            <span v-if='k == 1' style="font-size: 14px;color: #606266" >{{`v${k1}用户：`}}</span>
                            <span v-if='k == 0' style="font-size: 14px;color: #606266" >{{`${k1+1}星：`}}</span>
                            <el-input-number :controls='false' :min="0" :max="100" :key="k1" :disabled="!v.disable" style="width:140px" v-model="v1.value"></el-input-number>
                        </p>
                    </div>
                    <p>结算时间：即时结算</p>
                </div>
            </div>
            <el-row>
                <el-checkbox v-model="isSetTime" @change="changeStartTime"></el-checkbox>
                <span>设置开启时间：</span>
                <el-date-picker :disabled="!isSetTime" type="datetime" v-model="startTime" placeholder="请选择开启时间"></el-date-picker>
                <span style="margin-left: 10px;">设置关闭时间：</span>
                <el-date-picker v-if="type == 2" :disabled="!isSetTime" type="datetime" v-model="stopTime" placeholder="请选择关闭时间"></el-date-picker>
                <span v-else>无限</span>
            </el-row>
            <el-row style="margin-top:20px">
                <el-button :loading="btnLoading" @click="beforeSubmit" type="primary">确认保存</el-button>
                <el-button @click="$router.replace('profitDistrMange')">取消</el-button>
            </el-row>
        </el-card>
    </div>
</template>

<script>
import utils from '@/utils/index.js';
import * as api from '@/api/SettlementMange/index.js';
import vBreadcrumb from '../../common/Breadcrumb.vue';
import request from '@/http/http';
export default {
    components: { vBreadcrumb },

    data() {
        return {
            btnLoading: false,
            pageLoading: false,
            type: '2', // 模版类型：1.通用模版，2.普通模版
            val: '', // 1：编辑 2：复制
            tplId: '', // 模版id
            url: '', // 请求接口
            tplName: '', // 模板名称
            shopMoney: '', // 店铺奖励金
            personMoney: '', // 个人奖励金
            checkX: false, // 拼店X
            formX: [
                { disable: false, label: '店主(存入店主账户)', value: [{ value: 0 }, { value: 0 }, { value: 0 }] }, // 店主
                { disable: false, label: '店员（等级分润）', value: [{ value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }] }, // 店员
                { disable: false, label: '助业金', value: 0 }, // 助业金
                { disable: false, label: '其他1', value: 0 }, // 其他
                { disable: false, label: '其他2', value: 0 }, // 其他
                { disable: false, label: '其他3', value: 0 } // 其他
            ],
            checkY: false, // 拼店Y
            formY: [
                { disable: false, label: '店主(存入店主账户)', value: [{ value: 0 }, { value: 0 }, { value: 0 }] }, // 店主
                { disable: false, label: '直接上级（等级分润）', value: [{ value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }] }, // 店员
                { disable: false, label: '助业金', value: 0 }, // 助业金
                { disable: false, label: '其他1', value: 0 }, // 其他
                { disable: false, label: '其他2', value: 0 }, // 其他
                { disable: false, label: '其他3', value: 0 } // 其他
            ],
            checkZ: false, // 拼店Z
            formZ: [
                { disable: false, label: '店主(存入店主账户)', value: [{ value: 0 }, { value: 0 }, { value: 0 }] }, // 店主
                { disable: false, label: '直接上级（等级分润）', value: [{ value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }] }, // 店员
                { disable: false, label: '助业金', value: 0 }, // 助业金
                { disable: false, label: '其他1', value: 0 }, // 其他
                { disable: false, label: '其他2', value: 0 }, // 其他
                { disable: false, label: '其他3', value: 0 } // 其他
            ],
            isSetTime: true,
            startTime: '', // 开启时间
            stopTime: '' // 关闭时间
        };
    },

    activated() {
        if (this.$route.query.settleProfitMsg) {
            const msg = JSON.parse(this.$route.query.settleProfitMsg) || JSON.parse(sessionStorage.getItem('settleProfitMsg'));
            this.tplId = msg.id;
            this.val = msg.value;
            this.getData();
        }
    },
    deactivated() {
        this.cleanData();
    },

    methods: {
        // 表单提交前进行判断
        beforeSubmit() {
            // 判空
            if (this.tplName == '') {
                this.$message.warning('利润分配模板名称不能为空');
                return;
            }
            if (this.shopMoney == '') {
                this.$message.warning('品牌店铺奖励金不能为空');
                return;
            }
            // 判断店主下面的三个值要依次递增
            if (this.formX[0].disable) {
                if (this.formX[0].value[0].value > this.formX[0].value[1].value || this.formX[0].value[1].value > this.formX[0].value[2].value) {
                    this.$message.warning('请输入正确的X值比例分配设置下的店主设置');
                    return;
                }
            }
            if (this.formY[0].disable) {
                if (this.formY[0].value[0].value > this.formY[0].value[1].value || this.formY[0].value[1].value > this.formY[0].value[2].value) {
                    this.$message.warning('请输入正确的Y值比例分配设置下的店主设置');
                    return;
                }
            }
            if (this.formZ[0].disable) {
                if (this.formZ[0].value[0].value > this.formZ[0].value[1].value || this.formZ[0].value[1].value > this.formZ[0].value[2].value) {
                    this.$message.warning('请输入正确的Z值比例分配设置下的店主设置');
                    return;
                }
            }
            // 判断店员下面的三个值要依次递增
            if (this.formX[1].disable) {
                for (let i = 0; i < this.formX[1].value.length; i++) {
                    if (i !== this.formX[1].value.length - 1) {
                        if (this.formX[1].value[i].value > this.formX[1].value[i + 1].value) {
                            this.$message.warning('请输入正确的X值比例分配设置下的店员设置');
                            return;
                        }
                    }
                }
            }
            if (this.formY[1].disable) {
                for (let i = 0; i < this.formY[1].value.length; i++) {
                    if (i !== this.formY[1].value.length - 1) {
                        if (this.formY[1].value[i].value > this.formY[1].value[i + 1].value) {
                            this.$message.warning('请输入正确的Y值比例分配设置下的直接上级设置');
                            return;
                        }
                    }
                }
            }
            if (this.formZ[1].disable) {
                for (let i = 0; i < this.formZ[1].value.length; i++) {
                    if (i !== this.formZ[1].value.length - 1) {
                        if (this.formZ[1].value[i].value > this.formZ[1].value[i + 1].value) {
                            this.$message.warning('请输入正确的Z值比例分配设置下的直接上级设置');
                            return;
                        }
                    }
                }
            }
            // 判断竖向取值相加是否小于等于100
            let totalX = 0;
            let totalY = 0;
            let totalZ = 0;
            this.formX.forEach((v, k) => {
                if (k > 1) {
                    if (v.disable) {
                        totalX += Number(v.value);
                    }
                }
            });
            if (this.formX[0].disable) {
                totalX += Number(this.formX[0].value[this.formX[0].value.length - 1].value);
            }
            if (this.formX[1].disable) {
                totalX += Number(this.formX[1].value[this.formX[1].value.length - 1].value);
            }
            this.formY.forEach((v, k) => {
                if (k > 1) {
                    if (v.disable) {
                        totalY += Number(v.value);
                    }
                }
            });
            if (this.formY[0].disable) {
                totalY += Number(this.formY[0].value[this.formY[0].value.length - 1].value);
            }
            if (this.formY[1].disable) {
                totalY += Number(this.formY[1].value[this.formY[1].value.length - 1].value);
            }
            this.formZ.forEach((v, k) => {
                if (k > 1) {
                    if (v.disable) {
                        totalZ += Number(v.value);
                    }
                }
            });
            if (this.formZ[0].disable) {
                totalZ += Number(this.formZ[0].value[this.formZ[0].value.length - 1].value);
            }
            if (this.formZ[1].disable) {
                totalZ += Number(this.formZ[1].value[this.formZ[1].value.length - 1].value);
            }
            if (totalX > 100 || totalY > 100 || totalZ > 100) {
                this.$message.warning('请输入正确的值');
                return;
            }
            // 判断开启时间和关闭时间是否为空
            if (this.startTime == '' || this.stopTime == '') {
                this.$message.warning('开启时间和关闭时间不能为空');
                return;
            }
            if (new Date(this.startTime) > new Date(this.stopTime)) {
                this.$message.warning('开启时间不能大于关闭时间');
                return;
            }
            this.submitForm();
        },
        //  提交表单
        submitForm() {
            const data = {
                name: this.tplName,
                storeRate: this.shopMoney,
                personalRate: this.personMoney,
                startTime: this.startTime == undefined ? '' : utils.formatTime(this.startTime),
                endTime: this.stopTime == undefined ? '' : utils.formatTime(this.stopTime),
                type: this.type,
                details: []
            };
            const nameArr = ['X', 'Y', 'Z'];
            nameArr.forEach(v => {
                const name = `form${v}`;
                const obj = {
                    storeStartOne: this[name][0].value[0].value,
                    storeStartTwo: this[name][0].value[1].value,
                    storeStartThree: this[name][0].value[2].value,
                    v0: this[name][1].value[0].value,
                    v1: this[name][1].value[1].value,
                    v2: this[name][1].value[2].value,
                    v3: this[name][1].value[3].value,
                    v4: this[name][1].value[4].value,
                    v5: this[name][1].value[5].value,
                    v6: this[name][1].value[6].value,
                    assistance: this[name][2].value,
                    otherOne: this[name][3].value,
                    otherTwo: this[name][4].value,
                    otherThree: this[name][5].value,
                    type: v
                };
                data.details.push(obj);
            });
            request.addProfitTpl(data).then(res => {
                this.$message.success(res.msg);
                this.$router.replace('profitDistrMange');
            }).catch(err => {
                console.log(err);
            });
        },
        //  动态计算品牌个人奖励金
        changePerMoney() {
            if (isNaN(this.shopMoney)) {
                this.$message.warning('请输入正确的数值');
                this.shopMoney = 0;
                this.personMoney = 100 - (this.shopMoney || 0);
                return;
            }
            this.personMoney = 100 - (this.shopMoney || 0);
        },
        // 修改状态
        changeStatus(val, form, index) {
            this[`form${form}`][index].disable = val;
            if (!val) {
                if (index == 0) {
                    this[`form${form}`][index].value = [{ value: '' }, { value: '' }, { value: '' }];
                } else if (index == 1) {
                    this[`form${form}`][index].value = [{ value: '' }, { value: '' }, { value: '' }, { value: '' }, { value: '' }, { value: '' }, { value: 0 }];
                } else {
                    this[`form${form}`][index].value = '';
                }
            }
        },
        // 是否启用开启时间
        changeStartTime(val) {
            if (!val) {
                this.startTime = '';
                this.stopTime = '';
            }
        },
        // 清空数据
        cleanData() {
            this.tplName = '';
            this.shopMoney = '';
            this.personMoney = '';
            this.tplId = '';
            this.val = '';
            this.url = '';
            this.type = '2';
            this.isSetTime = true;
            sessionStorage.removeItem('settleProfitMsg');
            this.checkX = false; // 拼店X
            this.formX = [
                { disable: false, val: 1, label: '店主(存入店主账户)', value: [{ value: 0 }, { value: 0 }, { value: 0 }] }, // 店主
                { disable: false, val: 2, label: '店员（等级分润）', value: [{ value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }] }, // 店员
                { disable: false, val: 16, label: '助业金', value: 0 }, // 助业金
                { disable: false, val: 64, label: '其他1', value: 0 }, // 其他
                { disable: false, val: 128, label: '其他2', value: 0 }, // 其他
                { disable: false, val: 256, label: '其他3', value: 0 } // 其他
            ];
            this.checkY = false; // 拼店Y
            this.formY = [
                { disable: false, val: 1, label: '店主(存入店主账户)', value: [{ value: 0 }, { value: 0 }, { value: 0 }] }, // 店主
                { disable: false, val: 2, label: '直接上级（等级分润）', value: [{ value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }] }, // 店员
                { disable: false, val: 16, label: '助业金', value: 0 }, // 助业金
                { disable: false, val: 64, label: '其他1', value: 0 }, // 其他
                { disable: false, val: 128, label: '其他2', value: 0 }, // 其他
                { disable: false, val: 256, label: '其他3', value: 0 } // 其他
            ];
            this.checkZ = false; // 拼店Z
            this.formZ = [
                { disable: false, val: 1, label: '店主(存入店主账户)', value: [{ value: 0 }, { value: 0 }, { value: 0 }] }, // 店主
                { disable: false, val: 2, label: '直接上级（等级分润）', value: [{ value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }] }, // 店员
                { disable: false, val: 16, label: '助业金', value: 0 }, // 助业金
                { disable: false, val: 64, label: '其他1', value: 0 }, // 其他
                { disable: false, val: 128, label: '其他2', value: 0 }, // 其他
                { disable: false, val: 256, label: '其他3', value: 0 } // 其他
            ];
            this.startTime = ''; // 开启时间
            this.stopTime = ''; // 关闭时间
        },
        // 获取数据
        getData() {
            this.pageLoading = true;
            request.querySettleProFitById({ id: this.tplId }).then(res => {
                this.type = res.data.type;
                this.pageLoading = false;
                this.tplName = res.data.name;
                this.shopMoney = res.data.storeRate;
                this.personMoney = res.data.personalRate;
                this.startTime = res.data.startTime;
                this.stopTime = res.data.endTime;
                res.data.details.forEach(v => {
                    const name = `form${v.type}`;
                    this[name][0].value[0].value = v.storeStartOne;
                    this[name][0].value[1].value = v.storeStartTwo;
                    this[name][0].value[2].value = v.otherThree;
                    this[name][1].value[0].value = v.v0;
                    this[name][1].value[1].value = v.v1;
                    this[name][1].value[2].value = v.v2;
                    this[name][1].value[3].value = v.v3;
                    this[name][1].value[4].value = v.v4;
                    this[name][1].value[5].value = v.v5;
                    this[name][1].value[6].value = v.v6;
                    this[name][2].value = v.assistance;
                    this[name][3].value = v.otherOne;
                    this[name][4].value = v.otherTwo;
                    this[name][5].value = v.otherThree;
                });
            }).catch(err => {
                this.pageLoading = false;
                console.log(err);
            });
        }
    }
};

</script>
<style lang='less' scoped>
.profit-tpl{
    overflow: hidden;
    .option{
        position: relative;
        width: 585px;
        height: 105px;
        background-color: #f7f7f7;
        margin-bottom: 10px;
        .project-title{
            position: absolute;
            top: 20px;
            left: 110px;
        }
        .img-title{
            position: absolute;
            top: 20px;
            left: 20px;
            width: 66px;
            height: 66px;
        }
        .my-inp{
            position: absolute;
            top: 55px;
            left: 110px ;
            width: 350px;
        }
    }
    .item{
        float: left;
        width: 290px;
        background-color: #f7f7f7;
        padding: 20px;
        margin: 0 20px 20px 0;
        box-sizing: border-box;
        .smallItem{
            margin: 0 0 10px 10px;
        }
    }
}
</style>
