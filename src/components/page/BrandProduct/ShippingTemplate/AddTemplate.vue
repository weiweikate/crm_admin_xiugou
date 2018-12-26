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
                            <el-radio-group v-model="form.calcType">
                                <el-radio label="1">按重量</el-radio>
                                <el-radio label="2">按件数</el-radio>
                                <el-radio label="3" disabled>按体积</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item prop="freight" class="express-area" label="运费计算">
                            <el-table :data="freightTableData" border>
                                <el-table-column label="配送地区" align="center">
                                    <template slot-scope="scope">
                                        <template>{{scope.row.includeAreaName}}</template>
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
                                        <el-button type="primary" @click="editAddress(scope.$index)">编辑</el-button>
                                        <el-button type="success" @click="delItem(scope.row,scope.$index)">删除</el-button>
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
                                        <template>{{scope.row.includeAreaName}}</template>
                                    </template>
                                </el-table-column>
                                <el-table-column label="设置包邮条件" align="left" width="450">
                                    <template slot-scope="scope">
                                        <el-select v-model="scope.row.style" placeholder="请选择">
                                            <el-option v-for="(item,index) in freeShippingSetting" :key="index" :label="item.label" :value="item.value">
                                            </el-option>
                                        </el-select>
                                        <template v-if="scope.row.style==1">
                                            <span>满</span>
                                            <el-input class="mini-inp" v-model="scope.row.price"></el-input><span>元包邮</span>
                                        </template>
                                        <template v-else-if="scope.row.style==2">
                                            <span>满</span>
                                            <el-input class="mini-inp" v-model="scope.row.quality"></el-input><span>件，</span>
                                            <el-input class="mini-inp" v-model="scope.row.price"></el-input><span>元包邮</span>
                                        </template>
                                        <template v-else>
                                            <span>满</span>
                                            <el-input class="mini-inp" v-model="scope.row.quality"></el-input><span>件包邮</span>
                                        </template>
                                    </template>
                                </el-table-column>
                                <el-table-column label="操作" align="center" width="200">
                                    <template slot-scope="scope">
                                        <el-button type="primary" @click="editAddress(scope.$index)">编辑</el-button>
                                        <el-button type="success" v-if="scope.$index!=0" @click="delItem(scope.row,scope.$index)">删除</el-button>
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
                name: [{ validator: checkName, trigger: 'blur', required: true, message: '请选择仓库类型' }],
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
                calcType: '1',
                freightType: '1',
                status: '1',
                style: '1'
            },
            checked: false,
            tableData: [],
            tableIndex: '0',
            btnLoading: false,
            address: '',
            includeArea: '', // 所有省市区zicode以英文逗号隔开存储
            // 表头根据计费方式变化
            title: [{ unit: '首重(kg)', nextUnit: '续重(kg)' }, { unit: '首件(件)', nextUnit: '续件(件)' }],
            // 设置包邮条件
            freeShippingSetting: [{ value: 0, label: '件数' }, { value: 1, label: '金额' }, { value: 2, label: '件数+金额' }],
            // 运费计算表格数据
            freightTableData: [{ includeAreaName: '中国', startUnit: '', startPrice: '', nextUnit: '', nextPirce: '' }],
            // 指定条件包邮表格数据
            freeShippingTableData: [{ includeAreaName: '中国', style: 1, price: '', quality: '' }],
            rows: [0, 0]
        };
    },
    mounted() {},
    methods: {
        submitForm(formName) {
            const that = this;
            that.$refs[formName].validate(valid => {
                if (!valid) {
                    return;
                } else {
                    const data = that.form;
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
                    if (this.form.freightType !== 2) {
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
        // 添加地区
        // num:0运费计算  1设置包邮条件
        addSetting(num) {
            if (this.isRowEmpty(num)) {
                this.addRow(num);
            }
        },
        addRow(num) {
            this.rows[num] = this.rows[num] + 1;
            if (num === 0) {
                this.freightTableData.push({
                    includeAreaName: '',
                    startUnit: '',
                    startPrice: '',
                    nextUnit: '',
                    nextPirce: ''
                });
            } else {
                this.freeShippingTableData.push({
                    includeAreaName: '',
                    style: 1,
                    price: '',
                    quality: ''
                });
            }
        },
        // 判断表格的值是否为空
        isRowEmpty(num) {
            const reg = /^(0|[1-9]\d*)([.]{1}[0-9]{1,2})?$/;
            console.log(this.rows[num]);
            let data = {};
            if (num === 0) {
                data = this.freightTableData[this.rows[num]];
            } else {
                data = this.freeShippingTableData[this.rows[num]];
            }
            console.log(data);
            for (let key in data) {
                console.log(data[key]);
                if (!data[key]) {
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
