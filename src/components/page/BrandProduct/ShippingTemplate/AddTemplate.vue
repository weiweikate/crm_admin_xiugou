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
                        <el-form-item prop="status" label="计费方式">
                            <el-radio-group v-model="form.calcType">
                                <el-radio label="1">按重量</el-radio>
                                <el-radio label="2">按件数</el-radio>
                                <el-radio label="3" disabled>按体积</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item class="express-area" label="运费计算">
                            <el-table :data="tableData" border>
                                <el-table-column label="配送地区" align="center">
                                    <template slot-scope="scope">
                                        <template><span style="float: left;display: inline-block;text-align: left;width: 70%">{{scope.row.includeAreaName}}</span>
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
                                <el-table-column label="操作" align="center">
                                    <template slot-scope="scope">
                                        <el-button type="primary" @click="editAddress(scope.$index)">编辑</el-button>
                                        <el-button type="success" @click="delItem(scope.row,scope.$index)">删除</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <div><span class="color-blue" @click="addSetting">添加地区</span></div>
                        </el-form-item>
                        <el-form-item class="condition-area" prop="style" label="指定条件包邮">
                            <el-radio-group v-model="form.style">
                                <el-radio label="1">是</el-radio>
                                <el-radio label="2">否</el-radio>
                            </el-radio-group>
                            <el-table :data="tableData" border v-if="form.style==1">
                                <el-table-column label="配送地区" align="center">
                                    <template slot-scope="scope">
                                        <template><span style="float: left;display: inline-block;text-align: left;width: 70%">{{scope.row.includeAreaName}}</span>
                                        </template>
                                    </template>
                                </el-table-column>
                                <el-table-column label="设置包邮条件" align="center">
                                    <template slot-scope="scope">
                                        <el-select v-model="value" placeholder="请选择">
                                            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                                            </el-option>
                                        </el-select>
                                        <el-input class="mini-inp" v-model="scope.row.startUnit"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column label="操作" align="center">
                                    <template slot-scope="scope">
                                        <el-button type="primary" @click="editAddress(scope.$index)">编辑</el-button>
                                        <el-button type="success" @click="delItem(scope.row,scope.$index)">删除</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <div v-if="form.style==1"><span class="color-blue" @click="addSetting">添加地区</span></div>
                        </el-form-item>
                    </div>
                    <div class="submit-btn">
                        <el-button type="primary" :loading="btnLoading" @click="submitForm('form')">确认保存</el-button>
                        <el-button @click="cancel">取消</el-button>
                    </div>
                </el-form>
            </div>
        </div>
        <!--选择区域-->
        <choose-area @getArea='chooseAreaToast' :index="tableIndex" :chooseData="chooseData" :preData="preData" v-if="isShowArea"></choose-area>
    </div>

</template>

<script>
import icon from '@/components/common/ico.vue';
import vBreadcrumb from '@/components/common/Breadcrumb.vue';
import region from '@/components/common/Region';
import chooseArea from '@/components/common/chooseArea';
import request from '@/http/http.js';

export default {
    components: { vBreadcrumb, icon, region, chooseArea },
    data() {
        var checkName = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('模版名称不能为空'));
            } else {
                callback();
            }
        };
        return {
            rules: {
                name: [{ validator: checkName, trigger: 'blur', require: true }]
            },
            chooseData: [],
            preData: [],
            form: {
                name: '',
                sendDays: 24,
                country: '1',
                calcType: '1',
                freightType: '1',
                provinceCode: '',
                cityCode: '',
                areaCode: '',
                status: '1',
                style: '1'
            },
            checked: false,
            tableData: [],
            tableIndex: '0',
            btnLoading: false,
            address: '',
            includeArea: '', // 所有省市区zicode以英文逗号隔开存储
            isShowArea: false,
            areaDisabled: true,
            showTips: false,
            isShowExpress: true,
            rows: 0,
            // 表头根据计费方式变化
            title: [{ unit: '首重(kg)', nextUnit: '续重(kg)' }, { unit: '首件(件)', nextUnit: '续件(件)' }]
            // 设置包邮条件
        };
    },
    mounted() {},
    methods: {
        // 获取省市区
        getRegion(msg) {
            this.address = msg;
            this.form.provinceCode = this.address[0];
            this.form.cityCode = this.address[1];
            this.form.areaCode = this.address[2];
        },
        submitForm(formName) {
            const that = this;
            that.$refs[formName].validate(valid => {
                if (!valid) {
                    return;
                } else {
                    const data = that.form;
                    if (!that.form.provinceCode || !that.form.cityCode || !that.form.areaCode) {
                        that.$message.warning('请选择省市区！');
                        return;
                    }
                    const reg = /^(0|[1-9]\d*)([.]{1}[0-9]{1,2})?$/;
                    let flag = true;
                    const list = [];
                    const temp = {
                        startUnit: that.startUnit,
                        startPrice: that.startPrice,
                        nextUnit: that.nextUnit,
                        nextPirce: that.nextPirce,
                        freightTemplateInfoDetailList: [
                            {
                                provinceCode: '',
                                cityCodes: '',
                                provinceName: '',
                                cityNames: ''
                            }
                        ]
                    };
                    let flag1 = true;
                    if (this.form.freightType != 2) {
                        if (temp.startUnit === '' || temp.startPrice === '' || temp.nextUnit === '' || temp.nextPirce === '') {
                            this.$message.warning('请填写完整的运费设置!');
                            flag1 = false;
                        } else {
                            if (reg.test(temp.startUnit) && reg.test(temp.startPrice) && reg.test(temp.nextUnit) && reg.test(temp.nextPirce)) {
                                flag1 = true;
                            } else {
                                that.$message.warning('请输入合法数据');
                                flag1 = false;
                            }
                        }
                        list.push(temp);
                        that.tableData.forEach((v, k) => {
                            const tableTemp = {
                                freightTemplateInfoDetailList: v.freightTemplateInfoDetailList,
                                startUnit: v.startUnit,
                                startPrice: v.startPrice,
                                nextUnit: v.nextUnit,
                                nextPirce: v.nextPirce
                            };
                            if (!v.freightTemplateInfoDetailList.length || v.startUnit === '' || v.startPrice === '' || v.nextUnit === '' || v.nextPirce === '') {
                                this.$message.warning('请填写完整的运费设置!');
                                flag = false;
                            } else {
                                if (reg.test(v.startUnit) && reg.test(v.startPrice) && reg.test(v.nextUnit) && reg.test(v.nextPirce)) {
                                    flag = true;
                                } else {
                                    that.$message.warning('请输入合法数据');
                                    flag = false;
                                }
                            }
                            list.push(tableTemp);
                        });
                        data.freightTemplateInfoList = list;
                    } else {
                        data.freightTemplateInfoList = [];
                        data.freightFreePrice = '';
                    }
                    if (!flag || !flag1) return;
                    if (that.checked) {
                        if (!that.freightFreePrice) {
                            that.$message.warning('请输入满包邮金额！');
                            return;
                        }
                        data.freightFreePrice = that.freightFreePrice;
                        data.freightType = 3;
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
        // 取消
        cancel() {
            this.$router.push('/shippingTemplate');
        },
        // 编辑区域
        editAddress(index) {
            const that = this;
            that.isShowArea = true;
            that.tableIndex = index;
            that.chooseData = that.tableData;
            that.preData = that.tableData[index];
        },
        // 删除制定省市运费设置
        delItem(row, index) {
            this.tableData.splice(index, 1);
            this.rows = this.rows - 1;
        },
        // 选择区域
        chooseAreaToast(getArea) {
            this.isShowArea = false;
            this.tableData[this.tableIndex].freightTemplateInfoDetailList = [];
            if (getArea) {
                // const index = getArea.indexOf('IDS');
                // this.tableData[this.tableIndex].includeAreaName = getArea.substring(0, index);// 名称
                // this.tableData[this.tableIndex].includeArea = getArea.substring(index + 4);// id
                // console.log(getArea.substring(0, index))
                // console.log(getArea.substring(index + 4));//zipcode
                let includeAreaName = '';
                let includeArea = '';
                for (const i in getArea) {
                    includeAreaName += getArea[i].provinceName + ':' + getArea[i].cityNames + ',';
                    includeArea += getArea[i].provinceCode + ':' + getArea[i].cityCodes + ',';
                    const tempItem = {
                        provinceCode: getArea[i].provinceCode,
                        cityCodes: getArea[i].cityCodes,
                        provinceName: getArea[i].provinceName,
                        cityNames: getArea[i].cityNames
                    };
                    this.tableData[this.tableIndex].freightTemplateInfoDetailList.push(tempItem);
                }
                this.tableData[this.tableIndex].includeAreaName = includeAreaName.slice(0, -1);
                this.tableData[this.tableIndex].includeArea = includeArea.slice(0, -1);
            }
        },
        // 增加制定省市运费设置
        addSetting() {
            if (this.rows == 0) {
                this.addRow();
            } else {
                if (this.isRowEmpty()) {
                    this.addRow();
                } else {
                    this.$message.warning('请输入合法数据!');
                }
            }
        },
        addRow() {
            this.rows = this.rows + 1;
            this.tableData.push({
                includeAreaName: '',
                startUnit: '',
                startPrice: '',
                nextUnit: '',
                nextPirce: '',
                freightTemplateInfoDetailList: []
            });
        },
        // 判断表格的值是否为空
        isRowEmpty() {
            const that = this;
            const data = that.tableData[this.rows - 1];
            const reg = /^(0|[1-9]\d*)([.]{1}[0-9]{1,2})?$/;
            if (data.includeAreaName === '' || data.startUnit === '' || data.startPrice === '' || data.nextUnit === '' || data.nextPirce === '') {
                return false;
            } else {
                if (reg.test(data.startUnit) && reg.test(data.startPrice) && reg.test(data.nextUnit) && reg.test(data.nextPirce)) {
                    return true;
                } else {
                    return false;
                }
            }
        },
        // 选择区域
        chooseArea() {
            this.unSupportMask = true;
            this.chooseData = this.form.unSupportAreas;
        },
        // 选择区域
        chooseUnSupportArea(getArea) {
            this.unSupportMask = false;
            if (getArea) {
                this.form.unSupportAreas = [];
                let includeAreaName = '';
                let includeArea = '';
                for (const i in getArea) {
                    includeAreaName += getArea[i].provinceName + ':' + getArea[i].cityNames + ',';
                    includeArea += getArea[i].provinceCode + ':' + getArea[i].cityCodes + ',';
                    const tempItem = {
                        provinceCode: getArea[i].provinceCode,
                        cityCodes: getArea[i].cityCodes,
                        provinceName: getArea[i].provinceName,
                        cityNames: getArea[i].cityNames,
                        includeAreaName: includeAreaName.slice(0, -1),
                        includeArea: includeArea.slice(0, -1)
                    };
                    this.form.unSupportAreas.push(tempItem);
                }
            }
        }
    }
};
</script>

<style lang="less">
.shipping {
    .shipping-box {
        padding: 0 30px;
        .el-form-item__label {
            text-align: left;
            width: 100px;
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
            margin-left: 100px;
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
                margin-left: 100px;
            }
        }
    }
}
</style>
