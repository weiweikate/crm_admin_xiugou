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
                        <el-checkbox :label="k" class="smallItem" v-model="v.disable" @change="checked=>changeStatus(checked,'X',k)" >{{v.label}}</el-checkbox>
                        <el-input-number :controls='false' :min="0" :max="100" v-if='k > 1' :disabled="!v.disable" style="width:140px;float:right" size="mini" v-model="v.value"></el-input-number>
                        <p v-else v-for='(v1,k1) in v.value' style="float: right;margin-bottom: 10px">
                            <span v-if='k == 1' style="font-size: 14px;color: #606266" >{{`v${k1}用户：`}}</span>
                            <el-input-number :controls='false' :min="0" :max="100" :key="k1" :disabled="!v.disable" style="width:140px" v-model="v1.value"></el-input-number>
                        </p>
                    </div>
                </div>
                <div class="item">
                    <p>Y值分配比例设置</p>
                    <el-checkbox style="margin:20px 0" v-model="checkY">仅上级拼店分配</el-checkbox>
                    <div v-for='(v,k) in formY' :key="k+'Y'" style="overflow:hidden;line-height:30px">
                        <el-checkbox :label="k" class="smallItem" v-model="v.disable" @change="checked=>changeStatus(checked,'Y',k)" >{{v.label}}</el-checkbox>
                        <el-input-number :controls='false' :min="0" :max="100" v-if='k > 1' :disabled="!v.disable" style="width:140px;float:right" size="mini" v-model="v.value"></el-input-number>
                        <p v-else v-for='(v1,k1) in v.value' style="float: right;margin-bottom: 10px">
                            <span v-if='k == 1' style="font-size: 14px;color: #606266" >{{`v${k1}用户：`}}</span>
                            <el-input-number :controls='false' :min="0" :max="100" :key="k1" :disabled="!v.disable" style="width:140px" v-model="v1.value"></el-input-number>
                        </p>
                    </div>
                </div>
                <div class="item">
                    <p>Z值分配比例设置</p>
                    <el-checkbox style="margin:20px 0" v-model="checkZ">仅上级拼店分配</el-checkbox>
                    <div v-for='(v,k) in formZ' :key="k+'Z'" style="overflow:hidden;line-height:30px">
                        <el-checkbox :label="k" class="smallItem" v-model="v.disable" @change="checked=>changeStatus(checked,'Z',k)" >{{v.label}}</el-checkbox>
                        <el-input-number :controls='false' :min="0" :max="100" v-if='k > 1' :disabled="!v.disable" style="width:140px;float:right" size="mini" v-model="v.value"></el-input-number>
                        <p v-else v-for='(v1,k1) in v.value' style="float: right;margin-bottom: 10px">
                            <span v-if='k == 1' style="font-size: 14px;color: #606266" >{{`v${k1}用户：`}}</span>
                            <el-input-number :controls='false' :min="0" :max="100" :key="k1" :disabled="!v.disable" style="width:140px" v-model="v1.value"></el-input-number>
                        </p>
                    </div>
                </div>
            </div>
            <el-row>
                <span>设置开启时间</span>
                <el-date-picker v-model="startTime" placeholder="请选择开启时间"></el-date-picker>
                <span>设置关闭时间</span>
                <el-date-picker v-model="stopTime" placeholder="请选择关闭时间"></el-date-picker>
            </el-row>
            <el-row style="margin-top:20px">
                <el-button :loading="btnLoading" @click="beforeSubmit" type="primary">确认保存</el-button>
                <el-button>取消</el-button>
            </el-row>
        </el-card>
    </div>
</template>

<script>
import utils from '@/utils/index.js';
import * as api from '@/api/SettlementMange/index.js';
import vBreadcrumb from '../../common/Breadcrumb.vue';
export default {
    components: { vBreadcrumb },

    data() {
        return {
            btnLoading: false,
            pageLoading: false,
            tplId: '', // 模版id
            url: '', // 请求接口
            tplName: '', // 模板名称
            shopMoney: '', // 店铺奖励金
            personMoney: '', // 个人奖励金
            checkX: false, // 拼店X
            formX: [
                { disable: false, label: '店主', value: [{ value: 0 }, { value: 0 }, { value: 0 }] }, // 店主
                { disable: false, label: '店员（等级分润）', value: [{ value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }] }, // 店员
                { disable: false, label: '直接上级', value: 0 }, // 直接上级
                { disable: false, label: '间接上级', value: 0 }, // 间接上级
                { disable: false, label: '助业金', value: 0 }, // 助业金
                { disable: false, label: '自己', value: 0 }, // 自己
                { disable: false, label: '其他1', value: 0 }, // 其他
                { disable: false, label: '其他2', value: 0 }, // 其他
                { disable: false, label: '其他3', value: 0 } // 其他
            ],
            checkY: false, // 拼店Y
            formY: [
                { disable: false, label: '店主', value: [{ value: 0 }, { value: 0 }, { value: 0 }] }, // 店主
                { disable: false, label: '店员（等级分润）', value: [{ value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }] }, // 店员
                { disable: false, label: '直接上级', value: 0 }, // 直接上级
                { disable: false, label: '间接上级', value: 0 }, // 间接上级
                { disable: false, label: '助业金', value: 0 }, // 助业金
                { disable: false, label: '自己', value: 0 }, // 自己
                { disable: false, label: '其他1', value: 0 }, // 其他
                { disable: false, label: '其他2', value: 0 }, // 其他
                { disable: false, label: '其他3', value: 0 } // 其他
            ],
            checkZ: false, // 拼店Z
            formZ: [
                { disable: false, label: '店主', value: [{ value: 0 }, { value: 0 }, { value: 0 }] }, // 店主
                { disable: false, label: '店员（等级分润）', value: [{ value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }] }, // 店员
                { disable: false, label: '直接上级', value: 0 }, // 直接上级
                { disable: false, label: '间接上级', value: 0 }, // 间接上级
                { disable: false, label: '助业金', value: 0 }, // 助业金
                { disable: false, label: '自己', value: 0 }, // 自己
                { disable: false, label: '其他1', value: 0 }, // 其他
                { disable: false, label: '其他2', value: 0 }, // 其他
                { disable: false, label: '其他3', value: 0 } // 其他
            ],
            startTime: '', // 开启时间
            stopTime: '' // 关闭时间
        };
    },

    activated() {
        this.tplId = this.$route.query.profitTplId || sessionStorage.getItem('profitTplId');
        if (this.tplId) {
            this.getData();
            this.url = api.updateSettlementConfig;
        } else {
            this.url = 'addProfitTpl';
        }
        this.cleanData();
    },
    deactivated() {
        this.tplId = '';
        this.url = '';
        sessionStorage.removeItem('profitTplId');
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
                            this.$message.warning('请输入正确的Y值比例分配设置下的店员设置');
                            return;
                        }
                    }
                }
            }
            if (this.formZ[1].disable) {
                for (let i = 0; i < this.formZ[1].value.length; i++) {
                    if (i !== this.formZ[1].value.length - 1) {
                        if (this.formZ[1].value[i].value > this.formZ[1].value[i + 1].value) {
                            this.$message.warning('请输入正确的Z值比例分配设置下的店员设置');
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
            const data = {};
            // 模板名称
            data.name = this.tplName;
            // 品牌店铺奖励金：拼店用户参与
            data.xRatio = this.shopMoney / 100;
            // 品牌个人奖励金
            data.yRatio = this.personMoney / 100;
            // 开启时间
            data.enableTime = this.startTime == undefined ? '' : utils.formatTime(this.startTime);
            // 关闭时间
            data.stopTime = this.stopTime == undefined ? '' : utils.formatTime(this.stopTime);
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
                    this[`form${form}`][index].value = [{ value: '' }, { value: '' }, { value: '' }, { value: '' }, { value: '' }, { value: '' }];
                } else {
                    this[`form${form}`][index].value = '';
                }
            }
        },
        // 是否启用开启时间
        changeStartTime(val) {
            if (!val) {
                this.startTime = '';
            }
        },
        // 清空数据
        cleanData() {
            this.tplName = '';
            this.shopMoney = '';
            this.personMoney = '';
            this.checkX = false; // 拼店X
            this.formX = [
                { disable: false, val: 1, label: '店主', value: [{ value: 0 }, { value: 0 }, { value: 0 }] }, // 店主
                { disable: false, val: 2, label: '店员（等级分润）', value: [{ value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }] }, // 店员
                { disable: false, val: 4, label: '直接上级', value: 0 }, // 直接上级
                { disable: false, val: 8, label: '间接上级', value: 0 }, // 间接上级
                { disable: false, val: 16, label: '助业金', value: 0 }, // 助业金
                { disable: false, val: 32, label: '自己', value: 0 }, // 自己
                { disable: false, val: 64, label: '其他1', value: 0 }, // 其他
                { disable: false, val: 128, label: '其他2', value: 0 }, // 其他
                { disable: false, val: 256, label: '其他3', value: 0 } // 其他
            ];
            this.checkY = false; // 拼店Y
            this.formY = [
                { disable: false, val: 1, label: '店主', value: [{ value: 0 }, { value: 0 }, { value: 0 }] }, // 店主
                { disable: false, val: 2, label: '店员（等级分润）', value: [{ value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }] }, // 店员
                { disable: false, val: 4, label: '直接上级', value: 0 }, // 直接上级
                { disable: false, val: 8, label: '间接上级', value: 0 }, // 间接上级
                { disable: false, val: 16, label: '助业金', value: 0 }, // 助业金
                { disable: false, val: 32, label: '自己', value: 0 }, // 自己
                { disable: false, val: 64, label: '其他1', value: 0 }, // 其他
                { disable: false, val: 128, label: '其他2', value: 0 }, // 其他
                { disable: false, val: 256, label: '其他3', value: 0 } // 其他
            ];
            this.checkZ = false; // 拼店Z
            this.formZ = [
                { disable: false, val: 1, label: '店主', value: [{ value: 0 }, { value: 0 }, { value: 0 }] }, // 店主
                { disable: false, val: 2, label: '店员（等级分润）', value: [{ value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }] }, // 店员
                { disable: false, val: 4, label: '直接上级', value: 0 }, // 直接上级
                { disable: false, val: 8, label: '间接上级', value: 0 }, // 间接上级
                { disable: false, val: 16, label: '助业金', value: 0 }, // 助业金
                { disable: false, val: 32, label: '自己', value: 0 }, // 自己
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
            this.$axios.post(api.findSettlementConfigById, { id: this.tplId }).then(res => {
                this.tplName = res.data.data.name; // 模板名称
                this.shopMoney = res.data.data.xratio * 100; // 品牌店铺奖励金
                this.personMoney = res.data.data.yratio * 100; // 品牌个人奖励金
                this.startTime = res.data.data.enableTime; // 开启时间
                this.stopTime = res.data.data.stopTime; // 停止时间
                // hadJoin判断
                switch (Number(res.data.data.hadJoin)) {
                    case 1:
                        this.checkX = true;
                        break;
                    case 2:
                        this.checkY = true;
                        break;
                    case 4:
                        this.checkZ = true;
                        break;
                    case 3:
                        this.checkX = true;
                        this.checkY = true;
                        break;
                    case 5:
                        this.checkX = true;
                        this.checkZ = true;
                        break;
                    case 6:
                        this.checkY = true;
                        this.checkZ = true;
                        break;
                    case 7:
                        this.checkX = true;
                        this.checkY = true;
                        this.checkZ = true;
                        break;
                }
                if (res.data.data.hadJoin == 1) {
                    this.checkX = true;
                }
                // X值
                this.formX[0].value[0].value = Math.round(res.data.data.xshopownerOne * 100);
                this.formX[0].value[1].value = Math.round(res.data.data.xshopownerTwo * 100);
                this.formX[0].value[2].value = Math.round(res.data.data.xshopownerThree * 100);
                this.formX[1].value = Math.round(res.data.data.xclerk * 100);
                this.formX[2].value = Math.round(res.data.data.xup * 100);
                this.formX[3].value = Math.round(res.data.data.xsuper * 100);
                this.formX[4].value = Math.round(res.data.data.xhelpWork * 100);
                this.formX[5].value = Math.round(res.data.data.xself * 100);
                this.formX[6].value = Math.round(res.data.data.xotherOne * 100);
                this.formX[7].value = Math.round(res.data.data.xotherTwo * 100);
                this.formX[8].value = Math.round(res.data.data.xotherThree * 100);
                // Y值
                this.formY[0].value[0].value = Math.round(res.data.data.yshopownerOne * 100);
                this.formY[0].value[1].value = Math.round(res.data.data.yshopownerTwo * 100);
                this.formY[0].value[2].value = Math.round(res.data.data.yshopownerThree * 100);
                this.formY[1].value = Math.round(res.data.data.yclerk * 100);
                this.formY[2].value = Math.round(res.data.data.yup * 100);
                this.formY[3].value = Math.round(res.data.data.ysuper * 100);
                this.formY[4].value = Math.round(res.data.data.yhelpWork * 100);
                this.formY[5].value = Math.round(res.data.data.yself * 100);
                this.formY[6].value = Math.round(res.data.data.yotherOne * 100);
                this.formY[7].value = Math.round(res.data.data.yotherTwo * 100);
                this.formY[8].value = Math.round(res.data.data.yotherThree * 100);
                // Z值
                this.formZ[0].value[0].value = Math.round(res.data.data.zshopownerOne * 100);
                this.formZ[0].value[1].value = Math.round(res.data.data.zshopownerTwo * 100);
                this.formZ[0].value[2].value = Math.round(res.data.data.zshopownerThree * 100);
                this.formZ[1].value = Math.round(res.data.data.zclerk * 100);
                this.formZ[2].value = Math.round(res.data.data.zup * 100);
                this.formZ[3].value = Math.round(res.data.data.zsuper * 100);
                this.formZ[4].value = Math.round(res.data.data.zhelpWork * 100);
                this.formZ[5].value = Math.round(res.data.data.zself * 100);
                this.formZ[6].value = Math.round(res.data.data.zotherOne * 100);
                this.formZ[7].value = Math.round(res.data.data.zotherTwo * 100);
                this.formZ[8].value = Math.round(res.data.data.zotherThree * 100);
                // 复选框判断
                this.formX.forEach((v, k) => {
                    if (k == 0) {
                        let flag = 0;
                        v.value.forEach((v1, k1) => {
                            if (v1.value != 0) {
                                flag++;
                            }
                        });
                        if (flag == 0) {
                            v.disable = false;
                        } else {
                            v.disable = true;
                        }
                    } else {
                        if (v.value != 0) {
                            v.disable = true;
                        } else {
                            v.disable = false;
                        }
                    }
                });
                this.formY.forEach((v, k) => {
                    if (k == 0) {
                        let flag = 0;
                        v.value.forEach((v1, k1) => {
                            if (v1.value != 0) {
                                flag++;
                            }
                        });
                        if (flag == 0) {
                            v.disable = false;
                        } else {
                            v.disable = true;
                        }
                    } else {
                        if (v.value != 0) {
                            v.disable = true;
                        } else {
                            v.disable = false;
                        }
                    }
                });
                this.formZ.forEach((v, k) => {
                    if (k == 0) {
                        let flag = 0;
                        v.value.forEach((v1, k1) => {
                            if (v1.value != 0) {
                                flag++;
                            }
                        });
                        if (flag == 0) {
                            v.disable = false;
                        } else {
                            v.disable = true;
                        }
                    } else {
                        if (v.value != 0) {
                            v.disable = true;
                        } else {
                            v.disable = false;
                        }
                    }
                });
                this.pageLoading = false;
            }).catch(err => {
                this.pageLoading = false;
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
