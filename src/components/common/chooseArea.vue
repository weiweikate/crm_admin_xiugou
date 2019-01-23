<template>
    <div class="choose-area" v-loading="loading">
        <div class="pwd-mask">
            <div class="box">
                <div class="mask-title">
                    选择区域
                </div>
                <div class="mask-content">
                    <div v-for="(item,index) in area" style="margin-bottom: 10px" :key="index">
                        <el-checkbox v-model="checkAll[index].isChecked" @change="handleAllProvince(item,index)" :indeterminate="checkAll[index].isIndeterminate" :disabled="checkAll[index].isDisabled">
                            {{item.name}}
                        </el-checkbox>
                        <div style="margin-left: 20px">
                            <template v-for="(province,k) in item.value">
                                <el-checkbox :key="k" v-model="checkAll[index].provinceCheck[k].isChecked" @change="handleCheckAll(province,k,index)" :disabled="checkAll[index].provinceCheck[k].isDisabled" :indeterminate="checkAll[index].provinceCheck[k].isIndeterminate"></el-checkbox>
                                <span class="expand-item" @click="expandItem(province,k,index)" :key="k">
                                    {{province.name}}
                                    <template><i style="margin-right: 10px" class="el-icon-caret-bottom"></i></template>
                                    <template>
                                        <el-card v-if="showCities&&expandCode==province.code" class="city-area">
                                            <i style="margin-right: 10px;" class="el-icon-close" @click.stop="showCities=false"></i>
                                            <el-checkbox v-for="(city,kk) in checkAll[index].provinceCheck[k].checkedCities" :key="kk" v-model="checkAll[index].provinceCheck[k].cityCheck[kk]" @change="handleCheckedCities(kk,k,index,city,$event)" :disabled="checkAll[index].provinceCheck[k].cityDisabled[kk]">
                                                {{city.name}}
                                            </el-checkbox>
                                        </el-card>
                                    </template>
                                </span>
                            </template>
                        </div>
                    </div>

                    <div class="del-btn-group">
                        <el-button :loading="btnLoading" @click="closeToask(true)" class="del-btn" type="primary">确认
                        </el-button>
                        <el-button @click="closeToask(false)">取消</el-button>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
import request from '@/http/http.js';

export default {
    components: {},
    // index:运费模板表格编辑索引值，非必传
    // chooseData：选中的所有数据，必传，若为单行，与preData值相同
    // preData：当前行选中的数据，必传，若为单行，与chooseData值相同
    // isSingleLine：是否是单行（运费模版表格是多行，其他是单行），非必传
    props: ['index', 'chooseData', 'preData', 'isSingleLine'],
    data() {
        return {
            area: [], // 封装所有数据的大容器
            checkAll: [], // 封装数据的选中效果
            showCities: false, // 是否显示点击的省对应的市的小弹窗
            expandCode: -1, // 当前点击的省的code
            checkNames: [], // 选中的名称
            btnLoading: false,

            // 回显数据所用参数
            // 将表格中获取到的数据封装成[{provinceCode:**,provinceName:**,cityCodes:[],cityNames:[]}]的格式，供回显数据使用
            allChooseData: [], // 表格中所有数据
            preChooseData: [], // 当前行所有数据
            // allChooseProvinceCodes代表表格中所有选中的省，allCityCodes,allCityNames代表所以市
            allChooseProvinceCodes: [],
            allCityCodes: [],
            allCityNames: [],
            // preChooseProvinceCodes代表编辑表格当前行中所有选中的省，preCityCodes,preCityNames代表所以市
            preChooseProvinceCodes: [],
            preCityCodes: [],
            preCityNames: [],
            loading: false
        };
    },
    created() {
        // 获取所有表格信息
        this.getAllData(this.chooseData, 0);
        // 获取表格当前行信息
        this.getAllData(this.preData, 1);
        if (this.isSingleLine) {
            this.preChooseData = this.allChooseData;
            this.preChooseProvinceCodes = this.allChooseProvinceCodes;
            this.preCityCodes = this.allCityCodes;
            this.preCityNames = this.allCityNames;
        }
        this.getProvinceListGroupByDistrict(); // 加载省列表
    },

    methods: {
        // 将表格中获取到的数据封装成[{provinceCode:**,provinceName:**,cityCodes:[],cityNames:[]}]的格式，供回显数据使用
        // allChooseProvinceIds代表表格中所有选中的省，allCityCodes,allCityNames代表所以市
        // preChooseProvinceIds代表编辑表格当前行中所有选中的省，preCityCodes,preCityNames代表所以市
        // num 0:全部数据 1:当前数据
        getAllData(data, num) {
            const tempProvinceCodes = [];
            const tempCityCodes = [];
            const tempCityNames = [];
            data.forEach((v, k) => {
                if (v.provinceName !== '中国') {
                    tempProvinceCodes.push(this.numberToString(v.provinceCode));
                    v.cityCodes = this.stringToArray(v.cityCodes);
                    v.cityNames = this.stringToArray(v.cityNames);
                    v.cityCodes.forEach((v1, k1) => {
                        tempCityCodes.push(this.numberToString(v1));
                        tempCityNames.push(v.cityNames[k1]);
                    });
                }
            });
            num === 0 ? (this.allChooseData = data) : (this.preChooseData = data);
            num === 0 ? (this.allChooseProvinceCodes = tempProvinceCodes) : (this.preChooseProvinceCodes = tempProvinceCodes);
            num === 0 ? (this.allCityCodes = tempCityCodes) : (this.preCityCodes = tempCityCodes);
            num === 0 ? (this.allCityNames = tempCityNames) : (this.preCityNames = tempCityNames);
        },
        // 获取省
        getProvinceListGroupByDistrict() {
            const that = this;
            const data = {};
            this.loading = true;
            request
                .getProvinceListGroupByDistrict(data)
                .then(res => {
                    const arr = ['', '华东', '华南', '华中', '华北', '西北', '西南', '东北', '港澳台', '海外'];
                    for (const i in res.data) {
                        const temp = {
                            isChecked: false,
                            isDisabled: false,
                            isIndeterminate: false,
                            count: 0,
                            provinceCheck: []
                        };
                        for (const j in res.data[i]) {
                            // 封装每一个省对应的数据
                            const tempProvinceCheck = {
                                isChecked: false, // 是否选择
                                isDisabled: false, // 是否禁用 其他行选中true，否则false
                                isIndeterminate: false, // 是否全选
                                cityCheck: [], // 省对应市的选择情况
                                cityDisabled: [], // 省对应市的禁用情况
                                name: res.data[i][j].name, // 省name
                                code: res.data[i][j].code, // 省code
                                count: 0, // 省对应市的个数
                                cityCodes: [], // 省对应市code
                                cityNames: [], // 省对应市name
                                checkedCities: [] // 省对应选中的市的列表
                            };
                            const tempCode = this.numberToString(res.data[i][j].code);
                            // 数据回显
                            for (const a in that.allChooseData) {
                                if (this.numberToString(that.allChooseData[a].provinceCode) === tempCode) {
                                    tempProvinceCheck.isChecked = true;
                                    tempProvinceCheck.cityCodes = that.allChooseData[a].cityCodes;
                                    tempProvinceCheck.cityNames = that.allChooseData[a].cityNames;
                                    if (that.preChooseProvinceCodes.indexOf(tempCode) === -1) {
                                        tempProvinceCheck.isDisabled = true;
                                        for (const c in that.allChooseData[a].cityCodes) {
                                            tempProvinceCheck.cityDisabled[c] = true;
                                        }
                                    } else {
                                        for (const p in that.preChooseData) {
                                            if (this.numberToString(that.preChooseData[p].provinceCode) === tempCode) {
                                                if (that.preChooseData[p].cityCodes.length < that.allChooseData[a].cityCodes.length) {
                                                    tempProvinceCheck.isDisabled = true;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            temp.provinceCheck.push(tempProvinceCheck);
                        }
                        that.checkAll.push(temp);
                        const tempArea = {
                            name: arr[i],
                            code: i,
                            value: res.data[i]
                        };
                        that.area.push(tempArea);
                        for (const i in that.checkAll) {
                            that.areaCheckedAll(i);
                        }
                    }
                    this.loading = false;
                })
                .catch(error => {
                    console.log(error);
                    this.loading = false;
                });
        },
        // 获取省对应的市
        getCityList(code, isChecked, index, k, name) {
            const that = this;

            // 根据当前点击id及上一次点击id来判断市小弹窗的显隐情况
            if (isChecked === 'checked') {
                that.showCities = false;
            } else {
                that.showCities = true;
            }
            if (that.expandCode === code) {
                that.showCities = true;
            }

            that.expandCode = code; // 重新赋值，供下一次判断使用

            const data = {
                fatherCode: code
            };
            that.loading = true;
            request
                .getRegion(data)
                .then(res => {
                    that.checkAll[index].provinceCheck[k].checkedCities = res.data;
                    that.checkAll[index].provinceCheck[k].count = res.data.length;
                    for (const kk in res.data) {
                        const v = res.data[kk];
                        if (!that.checkAll[index].provinceCheck[k].cityCheck[kk]) {
                            that.checkAll[index].provinceCheck[k].cityCheck[kk] = false;
                        }
                        that.checkAll[index].provinceCheck[k].cityDisabled[kk] = false;
                        // 数据回显
                        const tempCode = this.numberToString(v.code);
                        code = this.numberToString(code);
                        if (that.allChooseProvinceCodes.indexOf(code) !== -1) {
                            if (that.allCityCodes.indexOf(tempCode) !== -1) {
                                that.checkAll[index].provinceCheck[k].cityCheck[kk] = true;
                                if (that.preCityCodes.indexOf(tempCode) === -1) {
                                    that.checkAll[index].provinceCheck[k].cityDisabled[kk] = true;
                                }
                            }
                        }
                        if (that.checkAll[index].provinceCheck[k].cityCodes.indexOf(tempCode) === -1 && isChecked === 'checked') {
                            that.checkAll[index].provinceCheck[k].cityCodes.push(tempCode);
                            that.checkAll[index].provinceCheck[k].cityNames.push(v.name);
                        }
                        // 选中
                        if (isChecked === 'checked') {
                            if (!that.checkAll[index].provinceCheck[k].isChecked) {
                                that.checkAll[index].provinceCheck[k].cityCodes = [];
                                that.checkAll[index].provinceCheck[k].cityNames = [];
                                that.checkAll[index].provinceCheck[k].cityCheck[kk] = false;
                                that.handelDeleteData(tempCode, v.name);
                            } else {
                                const tempProvinceCode = that.checkAll[index].provinceCheck[k].code;
                                if (!that.checkAll[index].provinceCheck[k].cityDisabled[kk]) {
                                    that.checkAll[index].provinceCheck[k].cityCheck[kk] = true;
                                    that.handelChooseData('all', tempProvinceCode, index, k, tempCode, v.name);
                                    that.handelChooseData('pre', tempProvinceCode, index, k, tempCode, v.name);
                                    if (that.allCityCodes.indexOf(tempCode) === -1) {
                                        that.allCityCodes.push(tempCode);
                                        that.preCityCodes.push(tempCode);
                                        that.preCityNames.push(v.name);
                                    }
                                }
                                that.checkAll[index].provinceCheck[k].isChecked = true;
                                that.checkAll[index].provinceCheck[k].isIndeterminate = false;
                            }
                        }
                        const newNames = that.checkAll[index].provinceCheck[k].cityNames;
                        // 展开
                        if (isChecked === 'expand') {
                            for (const k2 in that.checkAll[index].provinceCheck[k].cityCodes) {
                                const v2 = that.checkAll[index].provinceCheck[k].cityCodes[k2];
                                if (v2 === tempCode) {
                                    if (newNames.indexOf(v.name) === -1) {
                                        newNames.push(v.name);
                                    }
                                }
                            }
                            that.checkAll[index].provinceCheck[k].cityNames = newNames;
                            // console.log(that.checkAll[index].provinceCheck[k].cityNames)
                        }

                        // 判断是否全选
                        if (that.checkAll[index].provinceCheck[k].cityCodes.length > 0 && that.checkAll[index].provinceCheck[k].cityCodes.length < res.data.length) {
                            that.checkAll[index].provinceCheck[k].isIndeterminate = true;
                        } else {
                            that.checkAll[index].provinceCheck[k].isIndeterminate = false;
                        }
                        that.$set(that.checkAll[index].provinceCheck, k, that.checkAll[index].provinceCheck[k]);
                    }
                    that.loading = false;
                })
                .catch(error => {
                    console.log(error);
                });
        },

        // 区域全选
        handleAllProvince(value, index) {
            const that = this;
            if (that.checkAll[index].isChecked) {
                that.checkAll[index].provinceCheck.forEach(function(v, k) {
                    that.checkAll[index].provinceCheck[k].isChecked = true;
                    that.getCityList(v.code, 'checked', index, k, v.name);
                });
            } else {
                that.expandCode = -1;
                that.showCities = false;
                that.checkAll[index].provinceCheck.forEach((v, k) => {
                    v.cityCheck.forEach((v1, k1) => {
                        v.cityCheck[k1] = false;
                    });
                    that.preChooseData.forEach((v1, k1) => {
                        if (that.numberToString(that.checkAll[index].provinceCheck[k].code) === that.numberToString(v1.provinceCode)) {
                            that.preChooseData.splice(k1, 1);
                            that.preChooseProvinceCodes.splice(k1, 1);
                        }
                    });
                    that.allChooseData.forEach((v1, k1) => {
                        if (that.numberToString(that.checkAll[index].provinceCheck[k].code) === that.numberToString(v1.provinceCode)) {
                            that.allChooseData.splice(k1, 1);
                            that.allChooseProvinceCodes.splice(k1, 1);
                        }
                    });
                    that.checkAll[index].provinceCheck[k].isChecked = false;
                    that.checkAll[index].provinceCheck[k].cityNames = [];
                    that.checkAll[index].provinceCheck[k].cityCodes = [];
                    that.checkAll[index].provinceCheck[k].checkedCities = [];
                });
            }
            this.areaCheckedAll(index);
        },
        // 省对应的全选操作
        handleCheckAll(val, k, index) {
            this.getCityList(val.code, 'checked', index, k, val.name);
            this.areaCheckedAll(index);
            this.checkAll[index].provinceCheck[k].isIndeterminate = false;
        },
        expandItem(val, k, index) {
            this.expandCode = val.code;
            this.getCityList(val.code, 'expand', index, k, val.name);
        },
        // 单独操作市
        handleCheckedCities(kk, k, index, city, e) {
            const that = this;
            const tempCode = this.numberToString(city.code);
            const tempProvinceCode = this.numberToString(that.checkAll[index].provinceCheck[k].code);
            that.$set(that.checkAll[index].provinceCheck[k].cityCheck, kk, e);
            if (e) {
                // 选中
                that.checkAll[index].provinceCheck[k].cityCodes.push(tempCode);
                that.checkAll[index].provinceCheck[k].cityNames.push(city.name);
                that.handelChooseData('all', tempProvinceCode, index, k, tempCode, city.name);
                that.handelChooseData('pre', tempProvinceCode, index, k, tempCode, city.name);
                if (that.allCityCodes.indexOf(tempCode) === -1) {
                    that.allCityCodes.push(tempCode);
                    that.preCityCodes.push(tempCode);
                    that.preCityNames.push(city.name);
                }
            } else {
                // 取消选中
                that.deleteData(that.checkAll[index].provinceCheck[k].cityCodes, tempCode);
                that.deleteData(that.checkAll[index].provinceCheck[k].cityNames, city.name);
                that.handelDeleteData(tempCode, city.name);
            }
            const checkedCount = that.checkAll[index].provinceCheck[k].cityCodes.length;
            const temp = that.checkAll[index].provinceCheck[k].checkedCities;
            that.checkAll[index].provinceCheck[k].isChecked = checkedCount === temp.length;
            that.checkAll[index].isIndeterminate = that.checkAll[index].provinceCheck[k].isIndeterminate = checkedCount > 0 && checkedCount < temp.length;
            that.$set(that.checkAll, index, that.checkAll[index]);
            that.$set(that.checkAll[index].provinceCheck, k, that.checkAll[index].provinceCheck[k]);
            that.areaCheckedAll(index);
        },
        // 点击市，重构chooseData数据
        handelChooseData(chooseData, tempProvinceCode, index, k, tempCode, name) {
            let tempChooseData;
            let tempChooseProvinceCodes;
            const that = this;
            if (chooseData === 'all') {
                tempChooseData = that.allChooseData;
                tempChooseProvinceCodes = that.allChooseProvinceCodes;
            } else {
                tempChooseData = that.preChooseData;
                tempChooseProvinceCodes = that.preChooseProvinceCodes;
            }
            tempProvinceCode = typeof tempProvinceCode === 'string' ? tempProvinceCode : tempProvinceCode.toString();
            if (tempChooseData.length) {
                tempChooseData.forEach(function(v, k1) {
                    if (tempChooseProvinceCodes.indexOf(tempProvinceCode) !== -1) {
                        if (v.provinceCode === tempProvinceCode) {
                            if (v.cityCodes.indexOf(tempCode) === -1) {
                                v.cityCodes.push(tempCode);
                                v.cityNames.push(name);
                            }
                        }
                    } else {
                        that.addChooseData(chooseData, tempProvinceCode, index, k, tempCode, name);
                    }
                });
            } else {
                that.addChooseData(chooseData, tempProvinceCode, index, k, tempCode, name);
            }
        },
        addChooseData(chooseData, tempProvinceCode, index, k, tempCode, name) {
            let tempChooseData;
            let tempChooseProvinceCodes;
            const that = this;
            if (chooseData === 'all') {
                tempChooseData = that.allChooseData;
                tempChooseProvinceCodes = that.allChooseProvinceCodes;
            } else {
                tempChooseData = that.preChooseData;
                tempChooseProvinceCodes = that.preChooseProvinceCodes;
            }
            tempProvinceCode = this.numberToString(tempProvinceCode);
            if (tempChooseProvinceCodes.indexOf(tempProvinceCode) === -1) {
                tempChooseProvinceCodes.push(tempProvinceCode);
            }
            const temp = {
                provinceCode: tempProvinceCode,
                provinceName: that.checkAll[index].provinceCheck[k].name,
                cityCodes: [],
                cityNames: []
            };
            temp.cityCodes.push(tempCode);
            temp.cityNames.push(name);
            tempChooseData.push(temp);
        },
        // 从数组中删除指定数据
        handelDeleteData(tempCode, name) {
            const that = this;
            that.allChooseData.forEach(function(v, k) {
                if (v.provinceName !== '中国') {
                    that.deleteData(v.cityCodes, tempCode);
                    that.deleteData(v.cityNames, name);
                    if (!v.cityCodes.length) {
                        that.allChooseData.splice(k, 1);
                    }
                }
            });
            that.preChooseData.forEach(function(v, k) {
                if (v.provinceName !== '中国') {
                    that.deleteData(v.cityCodes, tempCode);
                    that.deleteData(v.cityNames, name);
                    if (!v.cityCodes.length) {
                        that.preChooseData.splice(k, 1);
                    }
                }
            });
            that.deleteData(that.allCityCodes, tempCode);
            that.deleteData(that.preCityCodes, tempCode);
            that.deleteData(that.preCityNames, name);
        },
        deleteData(arr, code) {
            arr = typeof arr === 'string' ? arr.split(',') : arr;
            for (const i in arr) {
                if (arr[i] === code) {
                    arr.splice(i, 1);
                }
            }
        },
        // 区域全选
        areaCheckedAll(index) {
            if (index === 8) {
                return;
            }
            const that = this;
            let count = 0;
            let disCount = 0;
            that.checkAll[index].provinceCheck.forEach(function(v) {
                if (v.isChecked) {
                    // 选中
                    ++count;
                }
                if (v.isDisabled) {
                    // 选中
                    ++disCount;
                }
            });
            that.checkAll[index].isChecked = count === that.checkAll[index].provinceCheck.length;
            that.checkAll[index].isIndeterminate = count > 0 && count < that.checkAll[index].provinceCheck.length;
            that.checkAll[index].isDisabled = disCount > 0;
        },
        // 确认取消操作
        closeToask(opr) {
            const tempList = [];
            for (const i in this.preChooseData) {
                if (this.preChooseData[i].cityNames.length) {
                    const temp = {
                        provinceCode: this.preChooseData[i].provinceCode,
                        provinceName: this.preChooseData[i].provinceName,
                        cityCodes: this.preChooseData[i].cityCodes.join(','),
                        cityNames: this.preChooseData[i].cityNames.join(',')
                    };
                    tempList.push(temp);
                }
            }
            if (opr) {
                this.$emit('getArea', tempList);
            } else {
                this.$emit('getArea', false);
            }
        },
        // 数字转字符串
        numberToString(param) {
            return typeof param === 'number' ? param.toString() : param;
        },
        // 字符串转数组
        stringToArray(param) {
            return typeof param === 'string' ? param.split(',') : param;
        }
    }
};
</script>

<style lang="less">
.choose-area {
    .pwd-mask {
        .el-icon-close {
            position: absolute;
            right: 0;
        }
        display: flex;
        align-items: center;
        justify-content: center;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 99;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.2);
        .box {
            position: relative;
            width: 800px;
            background-color: #fff;
            border-radius: 10px;
            overflow: hidden;
            .mask-title {
                width: 100%;
                height: 56px;
                border-bottom: 1px solid #ccc;
                padding-left: 45px;
                box-sizing: border-box;
                text-align: center;
                line-height: 56px;
                color: #ff6868;
                font-weight: 700;
                .ico {
                    position: absolute;
                    top: 16px;
                    left: 228px;
                    color: red;
                    font-size: 20px;
                }
            }
            .mask-content {
                position: relative;
                width: 100%;
                overflow-x: hidden;
                max-height: 500px;
                overflow-y: auto;
                padding: 10px 45px 0 45px;
                line-height: 30px;
                box-sizing: border-box;
                .el-checkbox + .el-checkbox {
                    margin-left: 0;
                }
                .el-card {
                    z-index: 9999;
                    position: absolute;
                    top: 20px;
                    left: 0;
                    .el-checkbox {
                        margin-right: 20px;
                    }
                    width: 320px;
                }
                .el-checkbox,
                .el-checkbox__input {
                    white-space: normal;
                }
                .el-card__body {
                    padding: 10px;
                }
                .expand-item {
                    position: relative;
                    color: #666;
                    font-size: 14px;
                    cursor: pointer;
                }
                .del-btn-group {
                    margin: 50px 0;
                    text-align: right;
                }
            }
        }
    }
}
</style>
