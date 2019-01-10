<!-- 创建利润模板 -->
<template>
    <div class="create-profitemplate">
        <breadcrumb :nav='nav'></breadcrumb>
        <div v-loading="pageLoading">
            <el-card>
                <el-form ref="params" :rules="rules" :model="params" inline label-width="140px">
                    <el-form-item prop="name" label="利润分配模板名称">
                        <el-input v-model.trim="params.name" :maxlength="20"></el-input>
                    </el-form-item>
                </el-form>
            </el-card>
            <el-card class="mt15">
                <div class="box" v-for="(v,k) in details" :key="k">
                    <div class="box-title">{{v.label}}</div>
                    <div class="box-body" v-if="v.type === 0">
                        <div class="box-item h340" v-for="(val,key) in v.detail" :key="key">
                            <div class="item-line" v-for="(item,index) in val" :key="index">
                                <div v-if="!item.select">
                                    <div class="line-lebal">{{item.label}}:
                                        <div v-if="item.otherLabel" class='tac'>{{item.otherLabel}}</div>
                                    </div>
                                    <el-input type="number" @change="validate(item.value)" v-model.trim.number="item.value" :max="100" :min="0" @keyup.native="item.value = Math.abs(item.value)" placeholder="请输入内容" class="w170"></el-input>
                                    <span class="ml5">%</span>
                                </div>
                                <div v-else>
                                    <div class="line-lebal"></div>
                                    <el-select v-model="item.value" placeholder="请选择多余流向" class="w170">
                                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                                        </el-option>
                                    </el-select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="box-body" v-else-if="v.type === 1">
                        <div class="box-item h230" v-for="(val,key) in v.detail" :key="key">
                            <div v-for="(elem,i) in val" :key="i">
                                <div class="item-line" v-for="(item,index) in elem" :key="index">
                                    <div class="line-lebal">{{item.label}}:</div>
                                    <el-input type="number" @change="validate(item.value)" v-model.trim.number="item.value" :max="100" :min="0" @keyup.native="item.value = Math.abs(item.value)" placeholder="请输入内容" class="w170"></el-input>
                                    <span class="ml5">%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <el-row class="time-setting">
                    <el-checkbox v-model="isSetTime" @change="changeStartTime"></el-checkbox>
                    <span>设置开启时间：</span>
                    <el-date-picker :disabled="!isSetTime" type="datetime" v-model="params.startTime" placeholder="请选择开启时间"></el-date-picker>
                    <span style="margin-left: 10px;">设置结束时间：</span>
                    <el-date-picker v-if="params.type == 2" :disabled="!isSetTime" type="datetime" v-model="params.endTime" placeholder="请选择关闭时间"></el-date-picker>
                    <span v-else>无限</span>
                </el-row>
                <el-row>
                    <div class="careful">主项相加需小于等于100%，参数可为空/填写0</div>
                </el-row>
                <el-row style="margin-top:20px">
                    <el-button :loading="btnLoading" @click="beforeSubmit" type="primary">确认保存</el-button>
                    <el-button @click="$router.replace('profitDistrMange')">取消</el-button>
                </el-row>
            </el-card>
        </div>
    </div>
</template>
<script>
import utils from '@/utils/index.js';
import breadcrumb from '@/components/common/Breadcrumb';
import request from '@/http/http';
import { regExpConfig } from '@/utils/regConfig';
import { deepClone, isClass } from '@/assets/js/util/util';
export default {
    data() {
        return {
            nav: ['结算管理', '利润分配设置', '创建模板'],
            btnLoading: false,
            pageLoading: false,
            startTime: '',
            endTime: '',
            id: '', // 模版ID
            rules: {
                name: [{ required: true, message: '请输入模版名称', trigger: 'blur' }]
            },
            options: [
                {
                    label: '请选择多余流向',
                    value: 0
                },
                {
                    label: '无主资金池',
                    value: 1
                },
                {
                    label: '公司利润',
                    value: 2
                },
                {
                    label: '直接综合活跃度',
                    value: 3
                }
            ],
            details: [
                {
                    label: '推广参数设置',
                    type: 0,
                    detail: [
                        [
                            { disable: false, label: '品牌推广奖励金', value: 0, name: 'totalRate', index: 0 },
                            { disable: false, label: '中介代支付费', value: 0, name: 'agencyRate', index: 0 },
                            { disable: false, label: 'v5', value: 0, name: 'v5', index: 0 },
                            { disable: false, label: 'v4', value: 0, name: 'v4', index: 0 },
                            { disable: false, label: 'v3', value: 0, name: 'v3', index: 0 },
                            { disable: false, label: 'v2', value: 0, name: 'v2', index: 0 },
                            { disable: false, label: 'v1', value: 0, name: 'v1', index: 0 },
                            { disable: false, label: 'v0', value: 0, name: 'v0', index: 0 },
                            { disable: false, select: true, value: 0, name: 'surplusType', index: 0 }
                        ],
                        [
                            { disable: false, label: '品牌推广奖励金', otherLabel: '（活跃度）', value: 0, name: 'totalRate', index: 1 },
                            { disable: false, label: '中介代支付费', value: 0, name: 'agencyRate', index: 1 },
                            { disable: false, label: 'v5', value: 0, name: 'v5', index: 1 },
                            { disable: false, label: 'v4', value: 0, name: 'v4', index: 1 },
                            { disable: false, label: 'v3', value: 0, name: 'v3', index: 1 },
                            { disable: false, label: 'v2', value: 0, name: 'v2', index: 1 },
                            { disable: false, label: 'v1', value: 0, name: 'v1', index: 1 },
                            { disable: false, label: 'v0', value: 0, name: 'v0', index: 1 },
                            { disable: false, select: true, value: 0, name: 'surplusType', index: 1 }
                        ]
                    ]
                },
                {
                    label: '拼店参数设置',
                    type: 0,
                    detail: [
                        [
                            { disable: false, label: '品牌分红奖励金', value: 0, name: 'totalRate', index: 2 },
                            { disable: false, label: '中介代支付费', value: 0, name: 'agencyRate', index: 2 },
                            { disable: false, label: 'v5', value: 0, name: 'v5', index: 2 },
                            { disable: false, label: 'v4', value: 0, name: 'v4', index: 2 },
                            { disable: false, label: 'v3', value: 0, name: 'v3', index: 2 },
                            { disable: false, label: 'v2', value: 0, name: 'v2', index: 2 },
                            { disable: false, label: 'v1', value: 0, name: 'v1', index: 2 },
                            { disable: false, label: 'v0', value: 0, name: 'v0', index: 2 },
                            { disable: false, select: true, value: 0, name: 'surplusType', index: 2 }
                        ],
                        [
                            { disable: false, label: '导师管理费', value: 0, name: 'totalRate', index: 3 },
                            { disable: false, label: '中介代支付费', value: 0, name: 'agencyRate', index: 3 },
                            { disable: false, label: '三级', value: 0, name: 'v2', index: 3 },
                            { disable: false, label: '二级', value: 0, name: 'v1', index: 3 },
                            { disable: false, label: '一级', value: 0, name: 'v0', index: 3 },
                            { disable: false, select: true, value: 0, name: 'surplusType', index: 3 }
                        ]
                    ]
                },
                {
                    label: '基础费率设置',
                    type: 1,
                    detail: [
                        [[{ disable: false, label: '任务奖励金', value: 0, name: 'totalRate', index: 4 }, { disable: false, label: '中介代支付费', value: 0, name: 'agencyRate', index: 4 }], [{ disable: false, label: '助业金', value: 0, name: 'totalRate', index: 5 }, { disable: false, label: '中介代支付费', value: 0, name: 'agencyRate', index: 5 }]],
                        [
                            [{ disable: false, label: '其他1', value: 0, name: 'totalRate', index: 6 }, { disable: false, label: '中介代支付费', value: 0, name: 'agencyRate', index: 6 }],
                            [{ disable: false, label: '其他2', value: 0, name: 'totalRate', index: 7 }, { disable: false, label: '中介代支付费', value: 0, name: 'agencyRate', index: 7 }],
                            [{ disable: false, label: '其他3', value: 0, name: 'totalRate', index: 8 }, { disable: false, label: '中介代支付费', value: 0, name: 'agencyRate', index: 8 }]
                        ]
                    ]
                }
            ],
            params: {
                // id: '', // 模版ID
                name: '', // 模版名称
                type: '2', // 模版类型：1.通用模版，2.普通模版
                // createAdmin: '', // 创建人ID
                // createTime: '', // 创建时间
                startTime: '', // 开始时间
                endTime: '', // 结束时间
                // updateTime: '', // 修改时间
                // status: '', // 状态：0.停用，1.待启用 2.启用中
                details: [
                    {
                        agencyRate: 0,
                        surplusType: 0,
                        // templateId: 0,
                        totalRate: 0,
                        type: 'PPTG',
                        v0: 0,
                        v1: 0,
                        v2: 0,
                        v3: 0,
                        v4: 0,
                        v5: 0,
                        v6: 0
                    },
                    {
                        agencyRate: 0,
                        surplusType: 0,
                        // templateId: 0,
                        totalRate: 0,
                        type: 'PPTG_HYD',
                        v0: 0,
                        v1: 0,
                        v2: 0,
                        v3: 0,
                        v4: 0,
                        v5: 0,
                        v6: 0
                    },
                    {
                        agencyRate: 0,
                        surplusType: 0,
                        // templateId: 0,
                        totalRate: 0,
                        type: 'PPFH',
                        v0: 0,
                        v1: 0,
                        v2: 0,
                        v3: 0,
                        v4: 0,
                        v5: 0,
                        v6: 0
                    },
                    {
                        agencyRate: 0,
                        surplusType: 0,
                        // templateId: 0,
                        totalRate: 0,
                        type: 'DSGLF',
                        v0: 0,
                        v1: 0,
                        v2: 0
                    },
                    {
                        agencyRate: 0,
                        // surplusType: 0,
                        // templateId: 0,
                        totalRate: 0,
                        type: 'RW'
                    },
                    {
                        agencyRate: 0,
                        // surplusType: 0,
                        // templateId: 0,
                        totalRate: 0,
                        type: 'ZYJ'
                    },
                    {
                        agencyRate: 0,
                        // surplusType: 0,
                        // templateId: 0,
                        totalRate: 0,
                        type: 'QT1'
                    },
                    {
                        agencyRate: 0,
                        // surplusType: 0,
                        // templateId: 0,
                        totalRate: 0,
                        type: 'QT2'
                    },
                    {
                        agencyRate: 0,
                        // surplusType: 0,
                        // templateId: 0,
                        totalRate: 0,
                        type: 'QT3'
                    }
                ]
            },
            isSetTime: true
        };
    },
    mounted() {
        if (this.$route.query.settleProfitMsg) {
            const msg = JSON.parse(this.$route.query.settleProfitMsg);
            this.id = msg.id;
            this.getData();
        }
    },
    computed: {}, // 计算属性
    methods: {
        validate(val) {
            if (!regExpConfig.Range.test(val)) {
                this.$message.warning('请输入0-100之内的数值');
            }
        },
        // 是否启用开启时间
        changeStartTime(val) {
            if (!val) {
                this.startTime = '';
                this.stopTime = '';
            }
        },
        getData() {
            this.pageLoading = true;
            request
                .querySettleProFitById({ id: this.id })
                .then(res => {
                    this.pageLoading = false;
                    this.params.name = res.data.name; // 模版名称
                    this.params.type = res.data.type; // 模版类型：1.通用模版，2.普通模版
                    // this.params.createAdmin = res.data.createAdmin; // 创建人ID
                    // this.params.createTime = res.data.createTime; // 创建时间
                    this.params.startTime = new Date(res.data.startTime); // 开始时间
                    this.params.endTime = new Date(res.data.endTime); // 结束时间
                    // this.params.updateTime = res.data.updateTime; // 修改时间
                    // this.params.status = res.data.status; // 状态：0.停用，1.待启用 2.启用中
                    const details = res.data.details;
                    this.details.forEach((v, k) => {
                        v.detail.forEach((elem, index) => {
                            if (isClass(elem[0]) === 'Object') {
                                elem.forEach((item, i) => {
                                    item.value = details[item.index][item.name];
                                });
                            } else if (isClass(elem[0]) === 'Array') {
                                elem.forEach(e => {
                                    e.forEach(item => {
                                        item.value = details[item.index][item.name];
                                    });
                                });
                            }
                        });
                    });
                })
                .catch(err => {
                    this.pageLoading = false;
                    console.log(err);
                });
        },
        // 表单提交前进行判断
        beforeSubmit() {
            this.btnLoading = true;
            // 判空
            if (this.params.name === '') {
                this.$message.warning('利润分配模板名称不能为空');
                return;
            }
            // 前段数据转成上传数据
            const data = deepClone(this.params);
            const details = data.details;
            data.startTime = data.startTime === undefined ? '' : utils.formatTime(data.startTime);
            data.endTime = data.endTime === undefined ? '' : utils.formatTime(data.endTime);
            this.details.forEach((v, k) => {
                v.detail.forEach((elem, index) => {
                    if (isClass(elem[0]) === 'Object') {
                        elem.forEach((item, i) => {
                            details[item.index][item.name] = item.value;
                        });
                    } else if (isClass(elem[0]) === 'Array') {
                        elem.forEach(e => {
                            e.forEach(item => {
                                details[item.index][item.name] = item.value;
                            });
                        });
                    }
                });
            });
            let type = false;
            let totaoRateSum = 0;
            details.forEach(item => {
                totaoRateSum += item.totalRate;
                Object.keys(item).some(key => {
                    if (key !== 'type' && !regExpConfig.Range.test(item[key])) {
                        type = true;
                        this.$message.warning('请输入合法参数');
                        return true;
                    }
                });
            });
            // 判断是都有大于100值
            if (type) {
                // this.$message.warning('请输入合法参数');
                return;
            }
            // 主项相加需小于等于100
            if (totaoRateSum > 100) {
                this.$message.warning('主项相加需小于等于100%');
                return;
            }
            // 判断开启时间和关闭时间是否为空
            if (this.params.startTime === '') {
                this.$message.warning('开启时间不能为空');
                return;
            }
            if (this.params.type !== 2) {
                if (this.params.endTime === '') {
                    this.$message.warning('普通模版关闭时间不能为空');
                    return;
                } else if (new Date(this.params.startTime) > new Date(this.params.endTime)) {
                    this.$message.warning('开启时间不能大于关闭时间');
                    return;
                }
            }
            this.submitForm(data);
        },
        //  提交表单
        submitForm(data) {
            request
                .addProfitTpl(data)
                .then(res => {
                    this.$message.success(res.msg);
                    this.$router.replace('profitDistrMange');
                    this.btnLoading = false;
                })
                .catch(err => {
                    console.log(err);
                });
        }
    },
    components: {
        breadcrumb
    }
};
</script>
<style lang='less' scoped>
.create-profitemplate {
    .w170 {
        width: 170px;
    }
    .ml5 {
        margin-left: 5px;
    }
    .h340 {
        height: 340px;
    }
    .h230 {
        height: 230px;
    }
    .box-title {
        width: 100%;
        height: 60px;
        background-color: #dedede;
        line-height: 60px;
        padding: 0 20px;
        box-sizing: border-box;
    }
    .box-body {
        .box-item {
            width: 375px;
            display: inline-block;
            vertical-align: top;
            margin: 5px 0 15px 0;
            background: #f7f7f7;
            padding: 25px 0 35px;
            + .box-item {
                margin-left: 10px;
            }
            .item-line {
                margin: 5px 15px 5px;
                + .item-line {
                    margin-top: 5px;
                }
                .line-lebal {
                    display: inline-block;
                    width: 120px;
                    text-align: right;
                    vertical-align: middle;
                }
            }
        }
    }
    .time-setting {
        background: #f7f7f7;
        width: 750px;
        padding: 15px;
    }
    .careful {
        margin-top: 15px;
        color: #999;
        font-size: 14px;
    }
}
</style>