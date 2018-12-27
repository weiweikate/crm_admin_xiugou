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
                            <input style="display:none" v-model="form.freight">
                            <el-table :data="freightTableData" border>
                                <el-table-column label="配送地区" align="center">
                                    <template slot-scope="scope">
                                        <template>
                                            <div v-for="(item,index) in scope.row.freightTemplateInfoDetailList" :key="index">
                                                <span v-if="item.provinceName=='中国'">中国</span>
                                                <span v-else>{{item.provinceName}}:{{item.citysName}}</span>
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
                                                <span v-if="item.provinceName=='中国'">中国</span>
                                                <span v-else>{{item.provinceName}}:{{item.citysName}}</span>
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
                style: '1',
                freight: '1'
            },
            tableIndex: '0',
            btnLoading: false,
            includeArea: '', // 所有省市区zicode以英文逗号隔开存储
            // 表头根据计费方式变化
            title: [{ unit: '首重(kg)', nextUnit: '续重(kg)' }, { unit: '首件(件)', nextUnit: '续件(件)' }],
            // 设置包邮条件
            freeShippingSetting: [[{ value: 0, label: '重量' }, { value: 1, label: '金额' }, { value: 2, label: '重量+金额' }], [{ value: 0, label: '件数' }, { value: 1, label: '金额' }, { value: 2, label: '件数+金额' }]],
            units: ['kg', '件'],
            // 运费计算表格数据
            freightTableData: [{ freightTemplateInfoDetailList: [{ provinceName: '中国' }], startUnit: '', startPrice: '', nextUnit: '', nextPirce: '' }],
            // 指定条件包邮表格数据
            freeShippingTableData: [{ freightTemplateInfoDetailList: [{ provinceName: '中国' }], style: 0, price: '', quality: '' }],
            rows: [0, 0],
            isMask: [false, false]
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
        // 编辑地区
        // index索引
        // num:0运费计算  1设置包邮条件
        editAddress(index, num) {
            this.tableIndex = index;
            this.isMask[num] = true;
            this.$set(this.isMask, num, this.isMask[num]);
            if (num === 0) {
                this.chooseData = this.freightTableData;
                this.preData = this.freightTableData[index];
            } else {
                this.chooseData = this.freeShippingTableData;
                this.preData = this.freeShippingTableData[index];
            }
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
            console.log(this.tableIndex);
            console.log(getArea);
            this.freightTableData[this.tableIndex].freightTemplateInfoDetailList = [];
            if (getArea) {
                let includeAreaName = '';
                let includeArea = '';
                for (const i in getArea) {
                    const tempItem = {
                        provinceCode: getArea[i].provinceCode,
                        cityCodes: getArea[i].cityCodes,
                        provinceName: getArea[i].provinceName,
                        cityNames: getArea[i].cityNames
                    };
                    this.freightTableData[this.tableIndex].freightTemplateInfoDetailList.push(tempItem);
                }
            }
        },
        // 选择区域
        chooseShippingToast(getArea) {
            this.isMask[1] = false;
            this.$set(this.isMask, 1, this.isMask[1]);
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
            } else {
                this.$message.warning('请输入完整的设置信息');
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
                    style: 0,
                    price: '',
                    quality: ''
                });
            }
        },
        // 判断表格的值是否为空
        isRowEmpty(num) {
            // const reg = /^(0|[1-9]\d*)([.]{1}[0-9]{1,2})?$/;
            let data = {};
            if (num === 0) {
                data = this.freightTableData[this.rows[num]];
            } else {
                data = this.freeShippingTableData[this.rows[num]];
            }
            let count = 0;
            for (const key in data) {
                if (data[key] === '') {
                    count++;
                }
            }
            if (num === 1 && data.style !== 2) {
                // 设置包邮条件时前两种状态各有一个值始终为空
                count--;
            }
            return count === 0;
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
