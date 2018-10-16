<template>
    <div class="choose-area" v-loading="loading">
        <div class="pwd-mask">
            <div class="box">
                <div class="mask-title">
                    选择区域
                </div>
                <div class="mask-content">
                    <div v-for="(item,index) in area" style="margin-bottom: 10px">
                        <el-checkbox v-model="checkAll[index].isChecked"
                                     @change="handleAllProvince(item,index)"
                                     :indeterminate="checkAll[index].isIndeterminate"
                                     :disabled="checkAll[index].isDisabled">
                            {{item.name}}
                        </el-checkbox>
                        <div style="margin-left: 20px">
                            <template v-for="(province,k) in item.value">
                                <el-checkbox :key="k" v-model="checkAll[index].provinceCheck[k].isChecked"
                                             @change="handleCheckAll(province,k,index)"
                                             :disabled="checkAll[index].provinceCheck[k].isDisabled"
                                             :indeterminate="checkAll[index].provinceCheck[k].isIndeterminate"></el-checkbox>
                                <span class="expand-item" @click="expandItem(province,k,index)">
                                    {{province.name}}
                                <template><i style="margin-right: 10px" class="el-icon-caret-bottom"></i></template>
                                 <template>
                                    <el-card v-if="showCities&&expandId==province.code" class="city-area">
                                        <i style="margin-right: 10px;" class="el-icon-close"
                                           @click.stop="showCities=false"></i>
                                            <el-checkbox
                                                v-for="(city,kk) in checkAll[index].provinceCheck[k].checkedCities"
                                                :key="kk" v-model="checkAll[index].provinceCheck[k].cityCheck[kk]"
                                                @change="handleCheckedCities(kk,k,index,city,$event)"
                                                :disabled="checkAll[index].provinceCheck[k].cityDisabled[kk]">
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
        props: ['index', 'chooseData', 'preData'],
        data() {
            return {
                area: [], // 封装所有数据的大容器
                checkAll: [], // 封装数据的选中效果
                showCities: false, // 是否显示点击的省对应的市的小弹窗
                expandId: -1, // 当前点击的省的id
                checkNames: [], // 选中的名称
                checkIds: [], // 选中的id
                btnLoading: false,

                // 回显数据所用参数
                // 将表格中获取到的数据封装成[{provinceId:**,provinceName:**,cityIds:[],cityNames:[]}]的格式，供回显数据使用
                allChooseData: [], // 表格中所有数据
                preChooseData: [], // 当前行所有数据
                // allChooseProvinceIds代表表格中所有选中的省，allCityIds,allCityNames代表所以市
                allChooseProvinceIds: [],
                allCityIds: [],
                allCityNames: [],
                // preChooseProvinceIds代表编辑表格当前行中所有选中的省，preCityIds,preCityNames代表所以市
                preChooseProvinceIds: [],
                preCityIds: [],
                preCityNames: [],

                loading: false
            };
        },
        created() {
            const that = this;
            // 获取所有表格信息
            that.getAllData(that.chooseData);
            // 获取表格当前行信息
            if (that.preData) {
                that.getAllData(that.preData);
            }
            that.getProvinceListGroupByDistrict();// 加载省列表
        },

        methods: {
            // 将表格中获取到的数据封装成[{provinceId:**,provinceName:**,cityIds:[],cityNames:[]}]的格式，供回显数据使用
            // allChooseProvinceIds代表表格中所有选中的省，allCityIds,allCityNames代表所以市
            // preChooseProvinceIds代表编辑表格当前行中所有选中的省，preCityIds,preCityNames代表所以市
            // code：前两位代表省,中间两位代表市,最后两位代表区
            getAllData(data) {
                let arrData = []; let tempData = []; let tempProvinceIds = []; let tempCityIds = []; let tempCityNames = [];
                if (data instanceof Array) {
                    arrData = this.allChooseData;
                    tempData = data;
                    tempProvinceIds = this.allChooseProvinceIds;
                    tempCityIds = this.allCityIds;
                    tempCityNames = this.allCityNames;
                } else {
                    tempData.push(data);
                    arrData = this.preChooseData;
                    tempProvinceIds = this.preChooseProvinceIds;
                    tempCityIds = this.preCityIds;
                    tempCityNames = this.preCityNames;
                }
                for (let i = 0; i < tempData.length; i++) {
                    if (tempData[i].includeArea) {
                        const includeArea = tempData[i].includeArea.replace(/:/g, ',').split(',');
                        const includeAreaName = tempData[i].includeAreaName.replace(/:/g, ',').split(',');
                        for (let j = 0; j < includeArea.length; j++) {
                            if (includeArea[j].slice(2, 6) == '0000') {
                                // includeArea[j]=typeof includeArea[j]=='string'?includeArea[j]:includeArea[j].toString();
                                const param = {
                                    provinceId: includeArea[j],
                                    provinceName: includeAreaName[j],
                                    cityIds: [],
                                    cityNames: []
                                };
                                if (tempProvinceIds.indexOf(includeArea[j]) == -1) {
                                    tempProvinceIds.push(includeArea[j]);
                                    arrData.push(param);
                                }
                            }
                        }
                    }
                }
                for (let i = 0; i < arrData.length; i++) {
                    for (let a = 0; a < tempData.length; a++) {
                        if (tempData[a].includeArea) {
                            const includeArea = tempData[a].includeArea.replace(/:/g, ',').split(',');
                            const includeAreaName = tempData[a].includeAreaName.replace(/:/g, ',').split(',');
                            for (let j = 0; j < includeArea.length; j++) {
                                if (arrData[i].provinceId == includeArea[j]) {
                                    includeArea.splice(j, 1);
                                    includeAreaName.splice(j, 1);
                                }
                                if (arrData[i].provinceId.slice(0, 2) == includeArea[j].slice(0, 2) && arrData[i].cityIds.indexOf(includeArea[j]) == -1) {
                                    arrData[i].cityIds.push(includeArea[j]);
                                    arrData[i].cityNames.push(includeAreaName[j]);
                                    tempCityIds.push(includeArea[j]);
                                    tempCityNames.push(includeAreaName[j]);
                                }
                            }
                        }
                    }
                }
            },
            // 获取省
            getProvinceListGroupByDistrict() {
                const that = this;

                const data = {};
                request.getProvinceListGroupByDistrict(data).then(res => {
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
                            const tempProvinceCheck = {
                                isChecked: false,
                                isDisabled: false,
                                isIndeterminate: false,
                                cityCheck: [],
                                cityDisabled: [],
                                name: res.data[i][j].name,
                                code: res.data[i][j].code,
                                count: 0,
                                ids: [],
                                names: [],
                                checkedCities: []
                            };
                            let tempCode = res.data[i][j].code;
                            if (typeof res.data[i][j].code !== 'string') {
                                tempCode = res.data[i][j].code.toString();
                            }

                            for (const a in that.allChooseData) {
                                if (that.allChooseData[a].provinceId == tempCode) {
                                    tempProvinceCheck.isChecked = true;
                                    tempProvinceCheck.ids = that.allChooseData[a].cityIds;
                                    tempProvinceCheck.names = that.allChooseData[a].cityNames;
                                    if (that.preChooseProvinceIds.indexOf(tempCode) == -1) {
                                        tempProvinceCheck.isDisabled = true;
                                        for (const c in that.allChooseData[a].cityIds) {
                                            tempProvinceCheck.cityDisabled[c] = true;
                                        }
                                    } else {
                                        for (const p in that.preChooseData) {
                                            if (that.preChooseData[p].provinceId == tempCode) {
                                                if (that.preChooseData[p].cityIds.length < that.allChooseData[a].cityIds.length) {
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
                        // console.log(that.checkAll)
                        const tempArea = {
                            name: arr[i],
                            id: i,
                            value: res.data[i]
                        };
                        that.area.push(tempArea);
                        for (const i in that.checkAll) {
                            that.areaCheckedAll(i);
                        }
                    }
                }).catch(error => {
                    console.log(error);
                });
            },
            // 获取省对应的市
            getCityList(id, isChecked, index, k, name) {
                const that = this;

                // 根据当前点击id及上一次点击id来判断市小弹窗的显隐情况
                if (isChecked == 'checked') {
                    that.showCities = false;
                } else {
                    that.showCities = true;
                }
                if (that.expandId == id) {
                    that.showCities = true;
                }

                that.expandId = id;// 重新赋值，供下一次判断使用

                const data = {
                    fatherCode: id
                };
                that.loading = true;
                request.getRegion(data).then(res => {
                    that.checkAll[index].provinceCheck[k].checkedCities = res.data;
                    that.checkAll[index].provinceCheck[k].count = res.data.length;
                    for (const kk in res.data) {
                        const v = res.data[kk];
                        if (!that.checkAll[index].provinceCheck[k].cityCheck[kk]) {
                            that.checkAll[index].provinceCheck[k].cityCheck[kk] = false;
                        }
                        that.checkAll[index].provinceCheck[k].cityDisabled[kk] = false;
                        // 数据回显
                        const tempId = typeof v.code === 'string' ? v.code : v.code.toString();
                        id = typeof id === 'string' ? id : id.toString();
                        if (that.allChooseProvinceIds.indexOf(id) != -1) {
                            if (that.allCityIds.indexOf(tempId) != -1) {
                                that.checkAll[index].provinceCheck[k].cityCheck[kk] = true;
                                if (that.preCityIds.indexOf(tempId) == -1) {
                                    that.checkAll[index].provinceCheck[k].cityDisabled[kk] = true;
                                }
                            }
                        }

                        if (that.checkAll[index].provinceCheck[k].ids.indexOf(tempId) == -1 && isChecked == 'checked') {
                            that.checkAll[index].provinceCheck[k].ids.push(tempId);
                            that.checkAll[index].provinceCheck[k].names.push(v.name);
                        }
                        if (isChecked == 'checked') {
                            if (!that.checkAll[index].provinceCheck[k].isChecked) {
                                that.checkAll[index].provinceCheck[k].ids = [];
                                that.checkAll[index].provinceCheck[k].names = [];
                                that.checkAll[index].provinceCheck[k].cityCheck[kk] = false;
                                that.handelDeleteData(tempId, v.name);
                            } else {
                                const tempProvinceId = that.checkAll[index].provinceCheck[k].code;
                                if (!that.checkAll[index].provinceCheck[k].cityDisabled[kk]) {
                                    that.checkAll[index].provinceCheck[k].cityCheck[kk] = true;
                                    that.handelChooseData('all', tempProvinceId, index, k, tempId, v.name);
                                    that.handelChooseData('pre', tempProvinceId, index, k, tempId, v.name);
                                    if (that.allCityIds.indexOf(tempId) == -1) {
                                        that.allCityIds.push(tempId);
                                        that.preCityIds.push(tempId);
                                        that.preCityNames.push(v.name);
                                    }
                                }
                                that.checkAll[index].provinceCheck[k].isChecked = true;
                                that.checkAll[index].provinceCheck[k].isIndeterminate = false;
                            }
                        }
                        const newNames = that.checkAll[index].provinceCheck[k].names;
                        // console.log(newNames)
                        if (isChecked == 'expand') {
                            for (const k2 in that.checkAll[index].provinceCheck[k].ids) {
                                const v2 = that.checkAll[index].provinceCheck[k].ids[k2];
                                if (v2 == tempId) {
                                    if (newNames.indexOf(v.name) == -1) {
                                        newNames.push(v.name);
                                    }
                                }
                            }
                            that.checkAll[index].provinceCheck[k].names = newNames;
                            // console.log(that.checkAll[index].provinceCheck[k].names)
                        }

                        // 判断是否全选
                        if (that.checkAll[index].provinceCheck[k].ids.length > 0 && that.checkAll[index].provinceCheck[k].ids.length < res.data.length) {
                            that.checkAll[index].provinceCheck[k].isIndeterminate = true;
                        } else {
                            that.checkAll[index].provinceCheck[k].isIndeterminate = false;
                        }
                        that.$set(that.checkAll[index].provinceCheck, k, that.checkAll[index].provinceCheck[k]);
                    }
                    that.loading = false;
                }).catch(error => {
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
                    that.expandId = -1;
                    that.showCities = false;
                    that.checkAll[index].provinceCheck.forEach(function(v, k) {
                        that.checkAll[index].provinceCheck[k].isChecked = false;
                        that.checkAll[index].provinceCheck[k].names = [];
                        that.checkAll[index].provinceCheck[k].ids = [];
                        that.checkAll[index].provinceCheck[k].checkedCities = [];
                        // that.$set(that.checkAll[index].provinceCheck[k].checkedCities, k, that.checkAll[index].provinceCheck[k].checkedCities);
                    });
                }
            },
            // 省对应的全选操作
            handleCheckAll(val, k, index) {
                const that = this;
                that.getCityList(val.code, 'checked', index, k, val.name);
                that.areaCheckedAll(index);
                that.checkAll[index].provinceCheck[k].isIndeterminate = false;
            },
            expandItem(val, k, index) {
                this.expandId = val.code;
                this.getCityList(val.code, 'expand', index, k, val.name);
            },
            // 单独操作市
            handleCheckedCities(kk, k, index, city, e) {
                const that = this;
                const tempId = typeof city.code === 'string' ? city.code : city.code.toString();
                let tempProvinceId = that.checkAll[index].provinceCheck[k].code;
                if (typeof tempProvinceId !== 'string') tempProvinceId = tempProvinceId.toString();
                that.$set(that.checkAll[index].provinceCheck[k].cityCheck, kk, e);
                if (e) { // 选中
                    that.checkAll[index].provinceCheck[k].ids.push(tempId);
                    that.checkAll[index].provinceCheck[k].names.push(city.name);
                    that.handelChooseData('all', tempProvinceId, index, k, tempId, city.name);
                    that.handelChooseData('pre', tempProvinceId, index, k, tempId, city.name);
                    if (that.allCityIds.indexOf(tempId) == -1) {
                        that.allCityIds.push(tempId);
                        that.preCityIds.push(tempId);
                        that.preCityNames.push(city.name);
                    }
                } else { // 取消选中
                    that.deleteData(that.checkAll[index].provinceCheck[k].ids, tempId);
                    that.deleteData(that.checkAll[index].provinceCheck[k].names, city.name);
                    that.handelDeleteData(tempId, city.name);
                }
                const checkedCount = that.checkAll[index].provinceCheck[k].ids.length;
                const temp = that.checkAll[index].provinceCheck[k].checkedCities;
                that.checkAll[index].provinceCheck[k].isChecked = checkedCount === temp.length;
                that.checkAll[index].isIndeterminate = that.checkAll[index].provinceCheck[k].isIndeterminate = checkedCount > 0 && checkedCount < temp.length;
                that.$set(that.checkAll, index, that.checkAll[index]);
                that.$set(that.checkAll[index].provinceCheck, k, that.checkAll[index].provinceCheck[k]);
                that.areaCheckedAll(index);
                // console.log(city.name)
            },
            // 点击市，重构chooseData数据
            handelChooseData(chooseData, tempProvinceId, index, k, tempId, name) {
                let tempChooseData; let tempChooseProvinceIds; const that = this;
                if (chooseData == 'all') {
                    tempChooseData = that.allChooseData;
                    tempChooseProvinceIds = that.allChooseProvinceIds;
                } else {
                    tempChooseData = that.preChooseData;
                    tempChooseProvinceIds = that.preChooseProvinceIds;
                }
                if (tempChooseData.length) {
                    tempChooseData.forEach(function(v, k1) {
                        if (tempChooseProvinceIds.indexOf(tempProvinceId) != -1) {
                            if (v.provinceId == tempProvinceId) {
                                if (v.cityIds.indexOf(tempId) == -1) {
                                    v.cityIds.push(tempId);
                                    v.cityNames.push(name);
                                }
                            }
                        } else {
                            that.addChooseData(chooseData, tempProvinceId, index, k, tempId, name);
                        }
                    });
                } else {
                    that.addChooseData(chooseData, tempProvinceId, index, k, tempId, name);
                }
            },
            addChooseData(chooseData, tempProvinceId, index, k, tempId, name) {
                let tempChooseData; let tempChooseProvinceIds; const that = this;
                if (chooseData == 'all') {
                    tempChooseData = that.allChooseData;
                    tempChooseProvinceIds = that.allChooseProvinceIds;
                } else {
                    tempChooseData = that.preChooseData;
                    tempChooseProvinceIds = that.preChooseProvinceIds;
                }
                if (tempChooseProvinceIds.indexOf(tempProvinceId) == -1) {
                    tempChooseProvinceIds.push(tempProvinceId);
                }
                const temp = {
                    provinceId: tempProvinceId,
                    provinceName: that.checkAll[index].provinceCheck[k].name,
                    cityIds: [],
                    cityNames: []
                };
                temp.cityIds.push(tempId);
                temp.cityNames.push(name);
                tempChooseData.push(temp);
            },
            // 从数组中删除指定数据
            handelDeleteData(tempId, name) {
                const that = this;
                that.allChooseData.forEach(function(v, k) {
                    that.deleteData(v.cityIds, tempId);
                    that.deleteData(v.cityNames, name);
                    if (!v.cityIds.length) {
                        that.allChooseData.splice(k, 1);
                    }
                });
                that.preChooseData.forEach(function(v, k) {
                    that.deleteData(v.cityIds, tempId);
                    that.deleteData(v.cityNames, name);
                    if (!v.cityIds.length) {
                        that.preChooseData.splice(k, 1);
                    }
                });
                that.deleteData(that.allCityIds, tempId);
                that.deleteData(that.preCityIds, tempId);
                that.deleteData(that.preCityNames, name);
            },
            deleteData(arr, id) {
                for (const i in arr) {
                    if (arr[i] == id) {
                        arr.splice(i, 1);
                    }
                }
            },
            // 区域全选
            areaCheckedAll(index) {
                if (index == 8) return;
                const that = this;
                let count = 0; let disCount = 0;
                that.checkAll[index].provinceCheck.forEach(function(v) {
                    if (v.isChecked) { // 选中
                        ++count;
                    }
                    if (v.isDisabled) { // 选中
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
                            provinceCode: this.preChooseData[i].provinceId,
                            provinceName: this.preChooseData[i].provinceName,
                            cityCodes: this.preChooseData[i].cityIds.join(','),
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
            }
            // closeToask(opr) {
            //     const that = this;
            //     that.checkNames = [];
            //     that.checkIds = [];
            //     for (const i in that.preChooseData) {
            //         if (that.preChooseData[i].cityNames.length) {
            //             const tempName = that.preChooseData[i].provinceName + ':' + that.preChooseData[i].cityNames.join(',');
            //             const tempId = that.preChooseData[i].provinceId + ':' + that.preChooseData[i].cityIds.join(',');
            //             if (that.checkNames.indexOf(tempName) == -1) {
            //                 that.checkNames.push(tempName);
            //                 that.checkIds.push(tempId);
            //             }
            //         }
            //     }
            //
            //     if (opr) {
            //         that.$emit('getArea', that.checkNames + 'IDS:' + that.checkIds);
            //     } else {
            //         that.$emit('getArea', false);
            //     }
            // }
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
                width: 870px;
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
                            margin-right: 20px
                        }
                        width: 320px;
                    }
                    .el-checkbox, .el-checkbox__input {
                        white-space: normal;
                    }
                    .el-card__body {
                        padding: 10px
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
