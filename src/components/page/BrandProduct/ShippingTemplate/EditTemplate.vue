<template>
    <div class="shipping">
        <v-breadcrumb :nav="['物流管理','运费模板','编辑模板']"></v-breadcrumb>
        <div class="container">
            <div class="shipping-box">
                <el-form :model="form" ref="form" :rules="rules">
                    <el-form-item prop="name" label="模板名称">
                        <el-input class="lar-inp" v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item prop="status" label="状态">
                        <el-radio-group v-model="form.status">
                            <el-radio label="1">启用</el-radio>
                            <el-radio label="2">关闭</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item prop="freightType" label="是否包邮">
                        <el-radio-group v-model="form.freightType">
                            <el-radio label="1">自定义运费</el-radio>
                            <el-radio label="2">平台承担运费</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <div v-if="form.freightType==1">
                        <el-form-item prop="calcType" label="计费方式">
                            <el-radio-group v-model="form.calcType" :disabled="freightType==1" @change="changeCalcType">
                                <el-radio label="1">按重量</el-radio>
                                <el-radio label="3">按件数</el-radio>
                                <el-radio label="2" disabled="">按体积</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item prop="freight" class="express-area" label="运费计算">
                            <input style="display:none" v-model="form.freight">
                            <el-table :data="freightTemplateInfoList" border>
                                <el-table-column label="配送地区" align="center">
                                    <template slot-scope="scope">
                                        <template>
                                            <div class="city" v-for="(item,index) in scope.row.freightTemplateInfoDetailList" :key="index" :title="item.tableData">
                                                <span v-if="item.provinceName=='中国'">中国</span>
                                                <span v-else>{{item.tableData}}</span>
                                            </div>
                                        </template>
                                    </template>
                                </el-table-column>
                                <el-table-column :label="title[form.calcType-1].unit" align="center" width="120">
                                    <template slot-scope="scope">
                                        <el-input class="mini-inp" v-model="scope.row.startUnit"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column label="首费(元)" align="center" width="120">
                                    <template slot-scope="scope">
                                        <el-input class="mini-inp" v-model="scope.row.startPrice"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column :label="title[form.calcType-1].nextUnit" align="center" width="120">
                                    <template slot-scope="scope">
                                        <el-input class="mini-inp" v-model="scope.row.nextUnit"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column label="续费(元)" align="center" width="120">
                                    <template slot-scope="scope">
                                        <el-input class="mini-inp" v-model="scope.row.nextPirce"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column label="操作" align="center" width="200">
                                    <template slot-scope="scope" v-if="scope.$index!=0">
                                        <el-button type="primary" @click="editAddress(scope.$index,0)">编辑</el-button>
                                        <el-button type="success" @click="delItem(scope.$index,0)">删除</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <div><span class="color-blue" @click="addSetting(0)">添加地区</span></div>
                        </el-form-item>
                        <el-form-item class="condition-area" prop="style" label="指定条件包邮">
                            <el-radio-group v-model="form.hasExemption">
                                <el-radio label="1">是</el-radio>
                                <el-radio label="0">否</el-radio>
                            </el-radio-group>
                            <el-table :data="conditionInfos" border v-if="form.hasExemption==1">
                                <el-table-column label="配送地区" align="center">
                                    <template slot-scope="scope">
                                        <template>
                                            <div class="city" v-for="(item,index) in scope.row.freightTemplateInfoDetailList" :key="index" :title="item.tableData">
                                                <span>{{item.tableData}}</span>
                                            </div>
                                        </template>
                                    </template>
                                </el-table-column>
                                <el-table-column label="设置包邮条件" align="left" width="450">
                                    <template slot-scope="scope">
                                        <el-select v-model="scope.row.type" placeholder="请选择">
                                            <el-option v-for="(item,index) in conditionSetting[form.calcType-1]" :key="index" :label="item.label" :value="item.value">
                                            </el-option>
                                        </el-select>
                                        <template v-if="scope.row.type==2">
                                            <span>满</span>
                                            <el-input class="mini-inp" v-model="scope.row.price"></el-input><span>元包邮</span>
                                        </template>
                                        <template v-else-if="scope.row.type==3">
                                            <span>满</span>
                                            <el-input class="mini-inp" v-model="scope.row.unit"></el-input><span>{{units[form.calcType-1]}}，</span>
                                            <el-input class="mini-inp" v-model="scope.row.price"></el-input><span>元包邮</span>
                                        </template>
                                        <template v-else>
                                            <span>满</span>
                                            <el-input class="mini-inp" v-model="scope.row.unit"></el-input><span>{{units[form.calcType-1]}}包邮</span>
                                        </template>
                                    </template>
                                </el-table-column>
                                <el-table-column label="操作" align="center" width="200">
                                    <template slot-scope="scope">
                                        <el-button type="primary" @click="editAddress(scope.$index,1)">编辑</el-button>
                                        <el-button type="success" v-if="scope.$index!=0" @click="delItem(scope.$index,1)">删除</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <div v-if="form.hasExemption==1"><span class="color-blue" @click="addSetting(1)">添加地区</span></div>
                        </el-form-item>
                    </div>
                    <div class="submit-btn">
                        <el-button type="primary" :loading="btnLoading" @click="submitForm('form')">确认保存</el-button>
                        <el-button @click="$router.push('/shippingTemplate')">取消</el-button>
                    </div>
                </el-form>
            </div>
        </div>
        <!--选择区域-->
        <!-- 运费计算 -->
        <choose-area @getArea='chooseFreightToast' :index="tableIndex" :chooseData="chooseData" :preData="preData" v-if="isMask[0]"></choose-area>
        <!-- 设置包邮条件 -->
        <choose-area @getArea='chooseShippingToast' :index="tableIndex" :chooseData="chooseData" :preData="preData" v-if="isMask[1]"></choose-area>
    </div>

</template>

<script>
import icon from '@/components/common/ico.vue';
import vBreadcrumb from '@/components/common/Breadcrumb.vue';
import region from '@/components/common/Region';
import chooseArea from '@/components/common/chooseArea';
import request from '@/http/http.js';
import { regExpConfig } from '@/utils/regConfig.js';
import { validateTemplateName } from '@/utils/validate.js';

export default {
    components: { vBreadcrumb, icon, region, chooseArea },
    data() {
        return {
            rules: {
                name: [{ trigger: 'blur', required: true, validator: validateTemplateName }],
                status: [{ trigger: 'blur', required: true, message: '请选择状态' }],
                freightType: [{ trigger: 'blur', required: true, message: '请选择是否包邮' }],
                calcType: [{ trigger: 'blur', required: true, message: '请选择计费方式' }],
                freight: [{ trigger: 'blur', required: true, message: '请编辑运费计算方式' }],
                hasExemption: [{ trigger: 'blur', required: true, message: '请编辑指定条件包邮方式' }]
            },
            chooseData: [],
            preData: [],
            form: {
                name: '',
                calcType: '1', // 1重量  2件数  3体积
                freightType: '1', // 是否包邮 1自定义运费 2平台承担运费
                status: '1',
                hasExemption: '1',
                freight: '1'
            },
            freightType: '0', // 初始是否包邮
            tableIndex: 0,
            btnLoading: false,
            // 表头根据计费方式变化
            title: [{ unit: '首重(kg)', nextUnit: '续重(kg)' }, { unit: '首体积(m³)', nextUnit: '续体积(m³)' }, { unit: '首件(件)', nextUnit: '续件(件)' }],
            // 设置包邮条件
            conditionSetting: [[{ value: 1, label: '重量' }, { value: 2, label: '金额' }, { value: 3, label: '重量+金额' }], [{ value: 1, label: 'm³' }, { value: 2, label: '金额' }, { value: 3, label: 'm³+金额' }], [{ value: 1, label: '件数' }, { value: 2, label: '金额' }, { value: 3, label: '件数+金额' }]],
            units: ['kg', 'm³', '件'],
            // 运费计算表格数据
            freightTemplateInfoList: [{ freightTemplateInfoDetailList: [{ provinceName: '中国', provinceCode: -1, type: 0 }], startUnit: '', startPrice: '', nextUnit: '', nextPirce: '' }],
            // 指定条件包邮表格数据
            conditionInfos: [],
            rows: [0, -1],
            isMask: [false, false],
            isTwodecimal: regExpConfig.isTwodecimal, // 非负数，保留小数点后两位
            isNozeroTwodecimal: regExpConfig.isNozeroTwodecimal, // 正数，保留小数点后两位
            isNozeroNumber: regExpConfig.isNozeroNumber // 正整数
        };
    },
    created() {
        this.id = this.$route.query.templateId || sessionStorage.getItem('templateId');
        this.getDetail();
    },
    methods: {
        // 获取详情
        getDetail() {
            const data = {
                id: this.id
            };
            this.loading = true;
            request
                .findFreightTemplateById(data)
                .then(res => {
                    this.loading = false;
                    this.form = res.data;
                    this.form.calcType = this.numberToString(this.form.calcType);
                    this.form.freightType = this.numberToString(this.form.freightType);
                    this.form.status = this.numberToString(this.form.status);
                    this.form.hasExemption = this.numberToString(this.form.hasExemption);
                    this.form.freight = this.numberToString(this.form.freight);

                    this.form.freight = 1;
                    if (this.form.freightType === '1') {
                        this.freightType = 1;
                        res.data.freightTemplateInfoList.forEach((v, k) => {
                            v.freightTemplateInfoDetailList.forEach((v1, k1) => {
                                if (v1.provinceCode !== '-1') {
                                    v1.tableData = v1.provinceName + ':' + v1.cityNames;
                                }
                            });
                        });
                        this.freightTemplateInfoList = res.data.freightTemplateInfoList;
                    }
                    if (this.form.hasExemption === '1') {
                        res.data.conditionInfos.forEach((v, k) => {
                            v.freightTemplateInfoDetailList.forEach((v1, k1) => {
                                v1.tableData = v1.provinceName + ':' + v1.cityNames;
                            });
                        });
                        this.conditionInfos = res.data.conditionInfos;
                    }
                })
                .catch(err => {
                    console.log(err);
                    this.loading = false;
                });
        },
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    const data = this.form;
                    // 自定义运费
                    if (this.form.freightType === '1') {
                        for (let i = 0; i < this.freightTemplateInfoList.length; i++) {
                            if (this.regTableData(this.freightTemplateInfoList[i], 0) === 2) {
                                return this.$message.warning('请输入完整的设置信息');
                            } else if (this.regTableData(this.freightTemplateInfoList[i], 0) === 1) {
                                return this.$message.warning('请输入合法数据');
                            }
                            for (let j = 0; j < this.freightTemplateInfoList[i].freightTemplateInfoDetailList.length; j++) {
                                if (this.freightTemplateInfoList[i].freightTemplateInfoDetailList[j].cityCodes) {
                                    this.freightTemplateInfoList[i].freightTemplateInfoDetailList[j].cityCodes = this.ArrayToString(this.freightTemplateInfoList[i].freightTemplateInfoDetailList[j].cityCodes);
                                    this.freightTemplateInfoList[i].freightTemplateInfoDetailList[j].cityNames = this.ArrayToString(this.freightTemplateInfoList[i].freightTemplateInfoDetailList[j].cityNames);
                                }
                            }
                        }
                        data.freightTemplateInfoList = this.freightTemplateInfoList;
                        // 指定条件包邮 1是 0否
                        if (this.form.hasExemption === '1') {
                            if (this.conditionInfos.length === 0) {
                                return this.$message.warning('请设置指定条件包邮');
                            } else {
                                for (let i = 0; i < this.conditionInfos.length; i++) {
                                    if (this.regTableData(this.conditionInfos[i], 1) === 2) {
                                        return this.$message.warning('请输入完整的设置信息');
                                    } else if (this.regTableData(this.conditionInfos[i], 1) === 1) {
                                        return this.$message.warning('请输入合法数据');
                                    }
                                    for (let j = 0; j < this.conditionInfos[i].freightTemplateInfoDetailList.length; j++) {
                                        if (this.conditionInfos[i].freightTemplateInfoDetailList[j].cityCodes) {
                                            this.conditionInfos[i].freightTemplateInfoDetailList[j].cityCodes = this.ArrayToString(this.conditionInfos[i].freightTemplateInfoDetailList[j].cityCodes);
                                            this.conditionInfos[i].freightTemplateInfoDetailList[j].cityNames = this.ArrayToString(this.conditionInfos[i].freightTemplateInfoDetailList[j].cityNames);
                                        }
                                    }
                                }
                                data.conditionInfos = this.conditionInfos;
                            }
                        } else {
                            data.conditionInfos = [];
                        }
                    } else {
                        data.freightTemplateInfoList = [];
                        data.hasExemption = 0;
                    }
                    this.btnLoading = true;
                    request
                        .addFreightTemplate(data)
                        .then(res => {
                            this.$message.success(res.msg);
                            this.$router.push('/shippingTemplate');
                            this.btnLoading = false;
                        })
                        .catch(error => {
                            console.log(error);
                            this.btnLoading = false;
                        });
                }
            });
        },
        // 切换计费方式,表格数据清空
        changeCalcType() {
            this.conditionInfos = [];
            this.freightTemplateInfoList = [{ freightTemplateInfoDetailList: [{ provinceName: '中国', provinceCode: -1, type: 0 }], startUnit: '', startPrice: '', nextUnit: '', nextPirce: '' }];
            this.tableIndex = 0;
            this.rows = [0, -1];
        },
        // 编辑地区
        // index索引
        // num:0运费计算  1设置包邮条件
        editAddress(index, num) {
            this.tableIndex = index;
            this.isMask[num] = true;
            this.$set(this.isMask, num, this.isMask[num]);
            if (num === 0) {
                this.chooseData = this.resetTableData(this.freightTemplateInfoList, 0);
                this.preData = this.resetTableData(this.freightTemplateInfoList[index], 1);
            } else {
                this.chooseData = this.resetTableData(this.conditionInfos, 0);
                this.preData = this.resetTableData(this.conditionInfos[index], 1);
            }
        },
        // 重构表格数据，供区域选择数据回显
        resetTableData(arr, num) {
            const tempArr = [];
            if (num === 0) {
                arr.forEach((v, k) => {
                    v.freightTemplateInfoDetailList.forEach((v1, k1) => {
                        tempArr.push(v1);
                    });
                });
            } else {
                arr.freightTemplateInfoDetailList.forEach((v1, k1) => {
                    tempArr.push(v1);
                });
            }
            return tempArr;
        },
        // 删除地区
        // index索引
        // num:0运费计算  1设置包邮条件
        delItem(index, num) {
            if (num === 0) {
                this.freightTemplateInfoList.splice(index, 1);
            } else {
                this.conditionInfos.splice(index, 1);
            }
            this.rows[num] = this.rows[num] - 1;
        },
        // 选择区域
        chooseFreightToast(getArea) {
            this.isMask[0] = false;
            this.$set(this.isMask, 0, this.isMask[0]);
            if (getArea) {
                this.freightTemplateInfoList[this.tableIndex].freightTemplateInfoDetailList = [];
                for (const i in getArea) {
                    const tempItem = {
                        provinceCode: getArea[i].provinceCode,
                        cityCodes: getArea[i].cityCodes,
                        provinceName: getArea[i].provinceName,
                        cityNames: getArea[i].cityNames,
                        tableData: getArea[i].provinceName + ':' + getArea[i].cityNames,
                        type: 1
                    };
                    this.freightTemplateInfoList[this.tableIndex].freightTemplateInfoDetailList.push(tempItem);
                }
            }
        },
        // 选择区域
        chooseShippingToast(getArea) {
            this.isMask[1] = false;
            this.$set(this.isMask, 1, this.isMask[1]);
            if (getArea) {
                this.conditionInfos[this.tableIndex].freightTemplateInfoDetailList = [];
                for (const i in getArea) {
                    const tempItem = {
                        provinceCode: getArea[i].provinceCode,
                        cityCodes: getArea[i].cityCodes,
                        provinceName: getArea[i].provinceName,
                        cityNames: getArea[i].cityNames,
                        tableData: getArea[i].provinceName + ':' + getArea[i].cityNames,
                        type: 2
                    };

                    this.conditionInfos[this.tableIndex].freightTemplateInfoDetailList.push(tempItem);
                }
            }
        },
        // 添加地区
        // num:0运费计算  1设置包邮条件
        addSetting(num) {
            if (num === 1 && this.rows[num] === -1) {
                this.addRow(num);
            } else {
                const data = num === 0 ? this.freightTemplateInfoList[this.rows[num]] : this.conditionInfos[this.rows[num]];
                if (this.regTableData(data, num) === 1) {
                    this.$message.warning('请输入合法数据');
                } else if (this.regTableData(data, num) === 2) {
                    this.$message.warning('请输入完整的设置信息');
                } else {
                    this.addRow(num);
                }
            }
        },
        addRow(num) {
            this.rows[num] = this.rows[num] + 1;
            if (num === 0) {
                this.freightTemplateInfoList.push({
                    freightTemplateInfoDetailList: [],
                    startUnit: '',
                    startPrice: '',
                    nextUnit: '',
                    nextPirce: ''
                });
            } else {
                this.conditionInfos.push({
                    freightTemplateInfoDetailList: [],
                    type: 1,
                    price: '',
                    unit: ''
                });
            }
        },
        // 判断表格的值是否为空及其数据的合法
        // num:0运费计算  1设置包邮条件
        regTableData(data, num) {
            let count = 0;
            for (const key in data) {
                if (data[key] === '' || data[key] === 'null' || !data['freightTemplateInfoDetailList'].length) {
                    count++;
                }
            }
            if (num === 1 && data.type !== 3 && !data.id) {
                // 设置包邮条件时前两种状态各有一个值始终为空
                count--;
            }
            if (count !== 0) {
                return 2;
            }
            for (const key in data) {
                if (data[key] === '' || !data['freightTemplateInfoDetailList'].length) {
                    count++;
                } else {
                    if (num === 0) {
                        // 首件续件：正整数；首重续重：正数，保留小数点后两位;首费续费:非负数，保留小数点后两位；
                        if (this.form.calcType === '1' && (!this.isNozeroTwodecimal.test(data.startUnit) || !this.isNozeroTwodecimal.test(data.nextUnit))) {
                            // 重量
                            return 1;
                        } else if (this.form.calcType === '3' && (!this.isNozeroNumber.test(data.startUnit) || !this.isNozeroNumber.test(data.nextUnit))) {
                            // 件数
                            return 1;
                        }
                        if (!this.isTwodecimal.test(data.startPrice) || !this.isTwodecimal.test(data.nextPirce)) {
                            return 1;
                        }
                    } else {
                        if (data.type === 1) {
                            if (this.form.calcType === '1' && !this.isNozeroTwodecimal.test(data.unit)) {
                                // 重量
                                return 1;
                            }
                            if (this.form.calcType === '3' && !this.isNozeroNumber.test(data.unit)) {
                                // 件数
                                return 1;
                            }
                        } else {
                            if (data.type === 2 && !this.isNozeroTwodecimal.test(data.price)) {
                                return 1;
                            }
                            if (data.type === 3 && (!this.isNozeroTwodecimal.test(data.price) || !this.isNozeroTwodecimal.test(data.unit))) {
                                return 1;
                            }
                        }
                    }
                }
            }
        },
        // 数组转字符串
        ArrayToString(param) {
            console.log(param);
            return typeof param === 'object' ? param.join(',') : param;
        },
        // 数字转字符串
        numberToString(param) {
            return typeof param === 'number' ? param.toString() : param;
        }
    }
};
</script>

<style lang="less">
.shipping {
    .shipping-box {
        .el-form-item__error {
            margin-left: 110px;
        }
        padding: 0 30px;
        .el-form-item__label {
            text-align: left;
            width: 110px;
            height: 40px;
            line-height: 40px;
        }
        .el-form-item__content {
            line-height: 40px;
        }
        .el-input__inner {
            height: 40px;
            line-height: 40px;
        }
        .express {
            width: 100%;
            height: 50px;
            line-height: 50px;
            background: #eee;
            padding: 0 10px;
            margin-left: -15px;
        }
        .el-radio {
            width: 110px;
        }
        .lar-inp {
            width: 550px;
        }
        .mini-inp {
            width: 90px;
        }
        .color-blue {
            color: #33b4ff;
            cursor: pointer;
            margin-left: 110px;
        }
        .has-gutter,
        .el-table th {
            background-color: #f7f7f7 !important;
        }
        .el-table {
            width: 80%;
        }
        .express-area {
            .el-table {
                margin-top: 15px;
            }
        }
        .condition-area {
            .el-table {
                margin-left: 110px;
                .el-select {
                    width: 110px;
                }
                span {
                    margin: 0 5px;
                }
            }
        }
        .city {
            width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }
}
</style>
