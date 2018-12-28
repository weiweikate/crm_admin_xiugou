<template>
    <div class="shipping">
        <v-breadcrumb :nav="['品牌产品管理','运费模板','添加模板']"></v-breadcrumb>
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
                            <el-radio-group v-model="form.calcType" @change="changeCalcType">
                                <el-radio label="1">按重量</el-radio>
                                <el-radio label="2">按件数</el-radio>
                                <el-radio label="3" disabled>按体积</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item prop="freight" class="express-area" label="运费计算">
                            <input style="display:none" v-model="form.freight">
                            <el-table :data="freightTableData" border>
                                <el-table-column label="配送地区" align="center">
                                    <template slot-scope="scope">
                                        <template>
                                            <div v-for="(item,index) in scope.row.freightTemplateInfoDetailList" :key="index">
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
                            <el-radio-group v-model="form.style">
                                <el-radio label="1">是</el-radio>
                                <el-radio label="2">否</el-radio>
                            </el-radio-group>
                            <el-table :data="freeShippingTableData" border v-if="form.style==1">
                                <el-table-column label="配送地区" align="center">
                                    <template slot-scope="scope">
                                        <template>
                                            <div v-for="(item,index) in scope.row.freightTemplateInfoDetailList" :key="index">
                                                <span>{{item.tableData}}</span>
                                            </div>
                                        </template>
                                    </template>
                                </el-table-column>
                                <el-table-column label="设置包邮条件" align="left" width="450">
                                    <template slot-scope="scope">
                                        <el-select v-model="scope.row.style" placeholder="请选择">
                                            <el-option v-for="(item,index) in freeShippingSetting[form.calcType-1]" :key="index" :label="item.label" :value="item.value">
                                            </el-option>
                                        </el-select>
                                        <template v-if="scope.row.style==1">
                                            <span>满</span>
                                            <el-input class="mini-inp" v-model="scope.row.price"></el-input><span>元包邮</span>
                                        </template>
                                        <template v-else-if="scope.row.style==2">
                                            <span>满</span>
                                            <el-input class="mini-inp" v-model="scope.row.quality"></el-input><span>{{units[form.calcType-1]}}，</span>
                                            <el-input class="mini-inp" v-model="scope.row.price"></el-input><span>元包邮</span>
                                        </template>
                                        <template v-else>
                                            <span>满</span>
                                            <el-input class="mini-inp" v-model="scope.row.quality"></el-input><span>{{units[form.calcType-1]}}包邮</span>
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
                            <div v-if="form.style==1"><span class="color-blue" @click="addSetting(1)">添加地区</span></div>
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

export default {
    components: { vBreadcrumb, icon, region, chooseArea },
    data() {
        return {
            rules: {
                name: [{ trigger: 'blur', required: true, message: '请输入模版名称' }],
                status: [{ trigger: 'blur', required: true, message: '请选择状态' }],
                freightType: [{ trigger: 'blur', required: true, message: '请选择是否包邮' }],
                calcType: [{ trigger: 'blur', required: true, message: '请选择计费方式' }],
                freight: [{ trigger: 'blur', required: true, message: '请编辑运费计算方式' }],
                style: [{ trigger: 'blur', required: true, message: '请编辑指定条件包邮方式' }]
            },
            chooseData: [],
            preData: [],
            form: {
                name: '',
                calcType: '1', // 1重量  2件数  3体积
                freightType: '1', // 1自定义运费 2平台承担运费
                status: '1',
                style: '1',
                freight: '1'
            },
            tableIndex: 0,
            btnLoading: false,
            // 表头根据计费方式变化
            title: [{ unit: '首重(kg)', nextUnit: '续重(kg)' }, { unit: '首件(件)', nextUnit: '续件(件)' }],
            // 设置包邮条件
            freeShippingSetting: [[{ value: 0, label: '重量' }, { value: 1, label: '金额' }, { value: 2, label: '重量+金额' }], [{ value: 0, label: '件数' }, { value: 1, label: '金额' }, { value: 2, label: '件数+金额' }]],
            units: ['kg', '件'],
            // 运费计算表格数据
            freightTableData: [{ freightTemplateInfoDetailList: [{ provinceName: '中国' }], startUnit: '', startPrice: '', nextUnit: '', nextPirce: '' }],
            // 指定条件包邮表格数据
            freeShippingTableData: [],
            rows: [0, -1],
            isMask: [false, false],
            isTwodecimal: regExpConfig.isTwodecimal, // 非负数，保留小数点后两位
            isNozeroTwodecimal: regExpConfig.isNozeroTwodecimal, // 正数，保留小数点后两位
            isNozeroNumber: regExpConfig.isNozeroNumber // 正整数
        };
    },
    mounted() {},
    methods: {
        submitForm(formName) {
            const that = this;
            this.$refs[formName].validate(valid => {
                if (valid) {
                    const data = that.form;
                    // 自定义运费
                    if (this.form.freightType === '1') {
                        for (let i = 0; i < this.freightTableData.length; i++) {
                            if (this.regTableData(this.freightTableData[i], 0) === 2) {
                                return this.$message.warning('请输入完整的设置信息');
                            } else if (this.regTableData(this.freightTableData[i], 0) === 1) {
                                return this.$message.warning('请输入合法数据');
                            }
                        }
                        // 指定条件包邮 1是 2否
                        if (this.form.style === '1') {
                            if (this.freeShippingTableData.length === 0) {
                                return this.$message.warning('请设置指定条件包邮');
                            } else {
                                for (let i = 0; i < this.freeShippingTableData.length; i++) {
                                    if (this.regTableData(this.freeShippingTableData[i], 1) === 2) {
                                        return this.$message.warning('请输入完整的设置信息');
                                    } else if (this.regTableData(this.freeShippingTableData[i], 1) === 1) {
                                        return this.$message.warning('请输入合法数据');
                                    }
                                }
                            }
                        }
                    } else {
                        data.freightTemplateInfoList = [];
                        data.freightFreePrice = '';
                    }
                    this.btnLoading = true;
                    request
                        .addFreightTemplate(data)
                        .then(res => {
                            that.$message.success(res.msg);
                            this.form.freightType = '1';
                            that.$router.push('/shippingTemplate');
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
            this.freeShippingTableData = [];
            this.freightTableData = [{ freightTemplateInfoDetailList: [{ provinceName: '中国' }], startUnit: '', startPrice: '', nextUnit: '', nextPirce: '' }];
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
                this.chooseData = this.resetTableData(this.freightTableData, 0);
                this.preData = this.resetTableData(this.freightTableData[index], 1);
            } else {
                this.chooseData = this.resetTableData(this.freeShippingTableData, 0);
                this.preData = this.resetTableData(this.freeShippingTableData[index], 1);
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
                this.freightTableData.splice(index, 1);
            } else {
                this.freeShippingTableData.splice(index, 1);
            }
            this.rows[num] = this.rows[num] - 1;
        },
        // 选择区域
        chooseFreightToast(getArea) {
            this.isMask[0] = false;
            this.$set(this.isMask, 0, this.isMask[0]);
            if (getArea) {
                this.freightTableData[this.tableIndex].freightTemplateInfoDetailList = [];
                for (const i in getArea) {
                    const tempItem = {
                        provinceCode: getArea[i].provinceCode,
                        cityCodes: getArea[i].cityCodes,
                        provinceName: getArea[i].provinceName,
                        cityNames: getArea[i].cityNames,
                        tableData: getArea[i].provinceName + ':' + getArea[i].cityNames
                    };
                    this.freightTableData[this.tableIndex].freightTemplateInfoDetailList.push(tempItem);
                }
            }
        },
        // 选择区域
        chooseShippingToast(getArea) {
            this.isMask[1] = false;
            this.$set(this.isMask, 1, this.isMask[1]);
            if (getArea) {
                this.freeShippingTableData[this.tableIndex].freightTemplateInfoDetailList = [];
                for (const i in getArea) {
                    const tempItem = {
                        provinceCode: getArea[i].provinceCode,
                        cityCodes: getArea[i].cityCodes,
                        provinceName: getArea[i].provinceName,
                        cityNames: getArea[i].cityNames,
                        tableData: getArea[i].provinceName + ':' + getArea[i].cityNames
                    };

                    this.freeShippingTableData[this.tableIndex].freightTemplateInfoDetailList.push(tempItem);
                }
            }
        },
        // 添加地区
        // num:0运费计算  1设置包邮条件
        addSetting(num) {
            if (num === 1 && this.rows[num] === -1) {
                this.addRow(num);
            } else {
                const data = num === 0 ? this.freightTableData[this.rows[num]] : this.freeShippingTableData[this.rows[num]];
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
                this.freightTableData.push({
                    freightTemplateInfoDetailList: [],
                    startUnit: '',
                    startPrice: '',
                    nextUnit: '',
                    nextPirce: ''
                });
            } else {
                this.freeShippingTableData.push({
                    freightTemplateInfoDetailList: [],
                    style: 0,
                    price: '',
                    quality: ''
                });
            }
        },
        // 判断表格的值是否为空及其数据的合法
        // num:0运费计算  1设置包邮条件
        regTableData(data, num) {
            let count = 0;
            for (const key in data) {
                if (data[key] === '' || !data['freightTemplateInfoDetailList'].length) {
                    count++;
                }
            }
            if (num === 1 && data.style !== 2) {
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
                        } else if (this.form.calcType === '2' && (!this.isNozeroNumber.test(data.startUnit) || !this.isNozeroNumber.test(data.nextUnit))) {
                            // 件数
                            return 1;
                        }
                        if (!this.isTwodecimal.test(data.startPrice) || !this.isTwodecimal.test(data.nextPirce)) {
                            return 1;
                        }
                    } else {
                        if (this.form.calcType === '1') {
                            if (data.style === 0 && !this.isNozeroTwodecimal.test(data.quality)) {
                                // 重量
                                return 1;
                            } else if (data.style === 1 && !this.isNozeroTwodecimal.test(data.price)) {
                                return 1;
                            } else if (data.style === 2 && (!this.isNozeroTwodecimal.test(data.price) || !this.isNozeroTwodecimal.test(data.quality))) {
                                return 1;
                            }
                        } else {
                            if (data.style === 0 && !this.isNozeroNumber.test(data.quality)) {
                                // 件数
                                return 1;
                            } else if (data.style === 1 && !this.isNozeroTwodecimal.test(data.price)) {
                                return 1;
                            } else if (data.style === 2 && (!this.isNozeroTwodecimal.test(data.price) || !this.isNozeroTwodecimal.test(data.quality))) {
                                return 1;
                            }
                        }
                    }
                }
            }
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
    }
}
</style>
