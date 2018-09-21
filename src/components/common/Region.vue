<template>
    <div>
        <el-select :disabled="isDisabled" v-model="province" filterable placeholder="请选择省份" @change="getCity(false)" :loading="pLoading">
            <el-option v-for="item in provinceArr" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <el-select :disabled="isDisabled" v-model="city" filterable placeholder="请选择城市" @change="getArea(false)" :loading="cLoading">
            <el-option v-for="item in cityArr" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <el-select :disabled="isDisabled" v-model="area" filterable placeholder="请选择区" @change="getAllRegion" :loading="aLoading">
            <el-option v-for="item in areaArr" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
    </div>
</template>
<script>
import request from '@/http/http.js';

export default {
    props: ['regionMsg', 'isDisabled'],
    data() {
        return {
            pLoading: false,
            cLoading: false,
            aLoading: false,
            province: '',
            city: '',
            area: '',
            provinceArr: [],
            cityArr: [],
            areaArr: [],
            region: []
        };
    },
    watch: {
        regionMsg(params) {
            if (params.length == 0) {
                this.province = '';
                this.city = '';
                this.area = '';
            } else {
                this.province = this.regionMsg[0];
                this.getCity(true);
            }
        }
    },
    created() {
        this.getProvinceList();
        if (this.regionMsg != undefined && this.regionMsg.length != 0) {
            this.province = this.regionMsg[0];
            this.getCity(true);
        }
    },
    methods: {
    //   获取省份列表
        getProvinceList() {
            this.pLoading = true;
            const data = {
                fatherCode: 0
            };
            request.getRegion(data).then(res => {
                this.provinceArr = [];
                this.provinceArr.push({ label: '全部', value: '' });
                res.data.forEach((v, k) => {
                    this.provinceArr.push({ label: v.name, value: v.code });
                    this.pLoading = false;
                });
            }).catch(error => {
                console.log(error);
            });
        },
        // 获取城市列表
        getCity(val) {
            const that = this;
            this.cLoading = true;
            const data = {
                fatherCode: this.province
            };
            request.getRegion(data).then(res => {
                this.cityArr = [];
                this.cityArr.push({ label: '全部', value: '' });
                if (val == false) {
                    this.city = this.cityArr[0].value;
                } else {
                    this.city = this.regionMsg[1];
                }
                res.data.forEach((v, k) => {
                    that.cityArr.push({ label: v.name, value: v.code });
                    that.cLoading = false;
                });
                if (val == true) {
                    this.getArea(true);
                    return;
                }
                this.getArea(false);
            }).catch(error => {
                console.log(error);
            });
        },
        // 获取区
        getArea(val) {
            const that = this;
            const data = {};
            if (this.city.value == '') {
                this.areaArr = [];
                this.areaArr.push({ label: '全部', value: '' });
                this.area = this.areaArr[0];
                if (val == false) {
                    this.$emit('regionMsg', this.region);
                }
                return;
            } else {
                data.fatherCode = this.city;
            }
            request.getRegion(data).then(res => {
                this.areaArr = [];
                this.areaArr.push({ label: '全部', value: '' });
                if (val == false) {
                    this.area = this.areaArr[0].value;
                } else {
                    this.area = this.regionMsg[2];
                }
                if (res.data) {
                    res.data.forEach((v, k) => {
                        that.areaArr.push({ label: v.name, value: v.code });
                    });
                }
                this.region = [];
                this.region.push(this.province);
                this.region.push(this.city);
                this.region.push(this.area);
                if (val == false) {
                    this.$emit('regionMsg', this.region);
                }
            }).catch(error => {
                console.log(error);
            });
        },
        // 获取省市区
        getAllRegion() {
            this.region = [];
            this.region.push(this.province);
            this.region.push(this.city);
            this.region.push(this.area);
            this.$emit('regionMsg', this.region);
        }
    }
};
</script>
<style lang="less" scoped>
</style>


