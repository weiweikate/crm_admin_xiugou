<template>
    <div class="shipping">
        <v-breadcrumb :nav="['品牌产品管理','运费模板','编辑模板']"></v-breadcrumb>
        <div class="container">
            <div class="shipping-box">
                <el-form :model="form" ref="form" :rules="rules">
                    <el-form-item prop="name" label="模板名称">
                        <el-input class="lar-inp" placeholder="请输入模板名称(模板名称最少必须由1个字组成，最多不能超过25个字)"
                                  v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item prop="country" class="address-item" label="产品发货地">
                        <el-select v-model="form.country" class="small-inp" @change="productArea">
                            <el-option label="中国" value="1">中国</el-option>
                            <!--<el-option label="海外" value="2">海外</el-option>-->
                        </el-select>
                        <div class="address-area">
                            <region @regionMsg='getRegion' :regionMsg='address' :isDisabled="!areaDisabled"></region>
                        </div>
                    </el-form-item>
                    <el-form-item prop="sendDays" label="发货时间">
                        <el-select v-model="form.sendDays" class="mid-inp">
                            <el-option
                                v-for="(item,index) in times"
                                :key="index"
                                :label="item.label"
                                :value="item.id"
                            >
                                {{item.label}}
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="status" label="是否包邮">
                        <el-radio-group v-model="form.freightType" @change="chooseStyle">
                            <el-radio label="1">自定义运费</el-radio>
                            <el-radio label="2">平台承担运费</el-radio>
                            <el-radio label="3">满
                                <el-input class="small-inp" v-model="freightFreePrice"></el-input>
                                元包邮
                            </el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <div v-if="isShowExpress">
                        <el-form-item prop="status" label="计价方式">
                            <el-radio-group v-model="form.calcType" @change="calcType">
                                <el-radio label="1">按重量</el-radio>
                                <!--<el-radio label="2">按体积</el-radio>-->
                                <!--<el-radio label="3">按件数量</el-radio>-->
                            </el-radio-group>
                        </el-form-item>
                        <div class="express">
                            <span>物流快递</span>
                        </div>
                        <el-form-item class="express-area">
                            默认运费
                            <el-input class="small-inp" v-model="startUnit"></el-input>
                            {{unit}}内
                            <el-input class="small-inp" v-model="startPrice"></el-input>
                            元，每增加
                            <el-input class="small-inp" v-model="nextUnit"></el-input>
                            {{unit}}，增加运费
                            <el-input class="small-inp" v-model="nextPirce"></el-input>
                            元
                            <div class="color-red">{{tips}}</div>
                            <el-table :data="tableData" border>
                                <el-table-column label="选择地区" align="center">
                                    <template slot-scope="scope">
                                        <template><span
                                            style="float: left;display: inline-block;text-align: left;width: 70%">{{scope.row.includeAreaName}}</span>
                                        </template>
                                        <span style="float: right;display: inline-block">
                                        <span class="color-blue" @click="editAddress(scope.$index)">编辑</span>
                                        <span class="color-blue" @click="delItem(scope.row,scope.$index)"
                                              style="margin-left: 10px">删除</span>
                                    </span>
                                    </template>
                                </el-table-column>
                                <el-table-column :label="title1" align="center" width="120">
                                    <template slot-scope="scope">
                                        <el-input class="mini-inp" v-model="scope.row.startUnit"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column label="运费(元)" align="center" width="120">
                                    <template slot-scope="scope">
                                        <el-input class="mini-inp" v-model="scope.row.startPrice"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column :label="title2" align="center" width="120">
                                    <template slot-scope="scope">
                                        <el-input class="mini-inp" v-model="scope.row.nextUnit"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column label="续费(元)" align="center" width="120">
                                    <template slot-scope="scope">
                                        <el-input class="mini-inp" v-model="scope.row.nextPirce"></el-input>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <div><span class="color-blue" @click="addSetting">增加制定省市运费设置</span></div>
                        </el-form-item>
                    </div>

                    <!--<el-form-item prop="status" label="是否启用">-->
                    <!--<el-radio-group v-model="form.defaultTrue">-->
                    <!--<el-radio label="1">启用</el-radio>-->
                    <!--<el-radio label="2">停用</el-radio>-->
                    <!--</el-radio-group>-->
                    <!--</el-form-item>-->
                    <div class="submit-btn">
                        <el-button type="primary" :loading="btnLoading" @click="submitForm('form')">确认保存</el-button>
                        <el-button @click="cancel">取消</el-button>
                    </div>
                </el-form>
            </div>
        </div>
        <!--选择区域-->
        <choose-area @getArea='chooseAreaToast' :index="tableIndex" :chooseData="chooseData" :preData="preData"
                     v-if="isShowArea"></choose-area>
        <!--平台承担运费弹窗-->
        <div class="mask" v-if="showTips">
            <div class="box">
                <div class="mask-title">
                    <icon class="ico" ico='icon-jinggao'/>
                    温馨提示
                </div>
                <div class="mask-content">
                    <span class="del-tip">选择"卖家承担运费"后，所有区域的运费将设置为0元，且原运费设置无法恢复，请保存原有运费设置。</span>
                    <div class="del-btn-group">
                        <el-button :loading="btnLoading" @click="showTips=false" class="del-btn" type="primary">确认
                        </el-button>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
    import icon from '@/components/common/ico.vue';
    import vBreadcrumb from '@/components/common/Breadcrumb.vue';
    import region from '@/components/common/Region';
    import chooseArea from '@/components/common/chooseArea';
    import * as pApi from '@/privilegeList/ShippingTemplate/index';
    import request from '@/http/http.js';

    export default {
        components: { vBreadcrumb, icon, region, chooseArea },
        data() {
            var checkName = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('模版名称不能为空'));
                } else {
                    if (value.length > 25) {
                        callback(new Error('模版名称最多不能超过25个字'));
                    } else {
                        callback();
                    }
                }
            };
            return {
                rules: {
                    name: [
                        { validator: checkName, trigger: 'blur' }
                    ]
                },
                times: [{ label: '2小时发货', id: 2 },
                    { label: '4小时发货', id: 4 },
                    { label: '8小时发货', id: 8 },
                    { label: '12小时发货', id: 12 },
                    { label: '当日发货', id: 24 },
                    { label: '2天内', id: 48 },
                    { label: '3天内', id: 72 },
                    { label: '4天内', id: 96 },
                    { label: '7天内', id: 168 }
                ],
                chooseData: [],
                preData: [],
                form: {
                    name: '',
                    sendDays: 24,
                    country: '1',
                    calcType: '1',
                    freightType: '1',
                    provinceId: '',
                    cityId: '',
                    areaId: ''
                },
                freightFreePrice: '',
                startUnit: '',
                startPrice: '',
                nextUnit: '',
                nextPirce: '',
                tableData: [],
                tableIndex: '0',
                btnLoading: false,
                address: '',
                includeArea: '', // 所有省市区zicode以英文逗号隔开存储
                isShowArea: false,
                areaDisabled: true,
                showTips: false,
                isShowExpress: true,
                unit: '公斤',
                title1: '首公斤数(kg)',
                title2: '续公斤数(kg)',
                tips: '应输入0.00至999.99的数字，小数保留两位',
                id: '',
                rows: 0
            };
        },
        activated() {
            const that = this;
            that.id = that.$route.query.templateId || sessionStorage.getItem('templateId');
            that.tableData = [];
            that.rows = 0;
            that.getDetail();
        },
        methods: {
            // 获取详情
            getDetail() {
                const that = this;
                const data = {
                    id: that.id
                    // url:pApi.findFreightTemplateById
                };
                that.loading = true;
                that.$axios
                    .post(api.findFreightTemplateById, data)
                    .then(res => {
                        if (res.data.code == 200) {
                            that.loading = false;
                            const freightTemplate = res.data.data.freightTemplate;
                            that.form.name = freightTemplate.name;
                            that.form.country = freightTemplate.country.toString();
                            that.form.calcType = freightTemplate.calcType ? freightTemplate.calcType.toString() : '1';
                            that.form.freightType = freightTemplate.freightType.toString();
                            that.sendDays = freightTemplate.sendDays;
                            that.freightFreePrice = freightTemplate.freightFreePrice;
                            // that.detailData = res.data.data.userProduct;
                            const reginArr = [];
                            reginArr.push(freightTemplate.provinceId, freightTemplate.cityId, freightTemplate.areaId);
                            that.address = reginArr;
                            that.form.provinceId = freightTemplate.provinceId;
                            that.form.cityId = freightTemplate.cityId;
                            that.form.areaId = freightTemplate.areaId;
                            that.isShowExpress = !(freightTemplate.freightType == 2);
                            const list = res.data.data.list;
                            that.startUnit = list[0].startUnit;
                            that.startPrice = list[0].startPrice;
                            that.nextUnit = list[0].nextUnit;
                            that.nextPirce = list[0].nextPirce;
                            for (let i = 1; i < list.length; i++) {
                                that.tableData.push(list[i]);
                            }
                            that.rows = list.length - 1;
                        } else {
                            that.loading = false;
                            that.$message.warning(res.data.msg);
                        }
                    })
                    .catch(err => {
                        that.loading = false;
                    });
            },
            // 获取省市区
            getRegion(msg) {
                this.address = msg;
                this.form.provinceId = this.address[0];
                this.form.cityId = this.address[1];
                this.form.areaId = this.address[2];
                console.log(this.address);
            },
            // 确认保存
            submitForm(formName) {
                const that = this;
                that.$refs[formName].validate((valid) => {
                    if (!valid) {
                        return;
                    } else {
                        const data = that.form;
                        data.id = that.id;
                        if (!that.form.provinceId || !that.form.cityId || !that.form.areaId) {
                            that.$message.warning('请选择省市区！');
                            return;
                        }
                        if (that.form.freightType == 3) {
                            if (!that.freightFreePrice) {
                                that.$message.warning('请输入满包邮的金额！');
                                return;
                            } else {
                                data.freightFreePrice = that.freightFreePrice;
                            }
                        }
                        const list = [];
                        const temp = {
                            startUnit: that.startUnit,
                            startPrice: that.startPrice,
                            nextUnit: that.nextUnit,
                            nextPirce: that.nextPirce,
                            defaultTrue: 1
                        };
                        list.push(temp);
                        let flag = true;
                        that.tableData.forEach(function(v, k) {
                            const tableTemp = {
                                includeAreaName: v.includeAreaName,
                                includeArea: v.includeArea,
                                startUnit: v.startUnit,
                                startPrice: v.startPrice,
                                nextUnit: v.nextUnit,
                                nextPirce: v.nextPirce,
                                defaultTrue: 2
                            };
                            if (v.includeAreaName === '' || v.includeArea === '' || v.startUnit === '' || v.startPrice === '' || v.nextUnit === '' || v.nextPirce === '' || v.nextUnit <= 0) {
                                flag = false;
                            }
                            list.push(tableTemp);
                        });
                        data.list = JSON.stringify(list);
                        data.url = pApi.updateFreightTemplateById;
                        if (!flag) {
                            this.$message.warning('请填写完整的运费设置!');
                            return;
                        }
                        this.btnLoading = true;
                        request.updateFreightTemplateById(data).then(res => {
                            that.$message.success(res.data.msg);
                            that.$router.push('/shippingTemplate');
                            this.btnLoading = false;
                        }).catch(error => {
                            console.log(err);
                            this.btnLoading = false;
                        });
                    }
                });
            },
            // 产品发货地选择
            productArea() {
                this.areaDisabled = this.form.country === 1;
            },
            // 是否包邮
            chooseStyle() {
                this.showTips = this.form.freightType == 2;
                this.isShowExpress = !(this.form.freightType == 2);
            },
            // 计价方式
            calcType() {
                const that = this;
                const num = that.form.calcType;
                if (num == 1) {
                    that.unit = '公斤';
                    that.title1 = '首公斤数(kg)';
                    that.title2 = '续公斤数(kg)';
                    that.tips = '应输入0.00至999.99的数字，小数保留两位';
                } else if (num == 2) {
                    that.unit = 'm³';
                    that.title1 = '首体积数(m³)';
                    that.title2 = '续体积数(m³)';
                    that.tips = '应输入0.00至999.99的数字，小数保留两位';
                } else if (num == 3) {
                    that.unit = '元';
                    that.title1 = '首件数(元)';
                    that.title2 = '续件数(元)';
                    that.tips = '应输入正整数';
                }
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
                if (getArea) {
                    const index = getArea.indexOf('IDS');
                    this.tableData[this.tableIndex].includeAreaName = getArea.substring(0, index);// 名称
                    this.tableData[this.tableIndex].includeArea = getArea.substring(index + 4);// id
                    // console.log(getArea)
                    // console.log(getArea.substring(0, index))
                    // console.log(getArea.substring(index + 4));//zipcode
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
                        this.$message.warning('请填写完整的运费设置!');
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
                    nextPirce: ''
                });
            },
            // 判断表格的值是否为空
            isRowEmpty() {
                const that = this;
                const data = that.tableData[this.rows - 1];
                if (data.includeAreaName === '' || data.startUnit === '' || data.startPrice === '' || data.nextUnit === '' || data.nextPirce === '' || data.nextUnit <= 0) {
                    return false;
                } else {
                    return true;
                }
            }
        }
    };
</script>

<style lang="less">
    .shipping {
        .shipping-box {
            .el-form-item__error {
                margin-left: 80px;
            }
            padding: 0 30px;
            .el-form-item__label {
                text-align: left;
                width: 70px;
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
            .express-area {
                margin: 20px 0;
            }
            .address-item {
                .el-form-item__label {
                    line-height: 20px
                }
            }
            .el-radio {
                width: 110px
            }
            .lar-inp {
                width: 550px
            }
            .mid-inp {
                width: 210px
            }
            .small-inp {
                width: 120px;
                margin: 0 5px;
            }
            .mini-inp {
                width: 90px
            }
            .address-area {
                display: inline-block;
                .el-select {
                    width: 120px
                }
            }
            .color-blue {
                color: #33b4ff;
                cursor: pointer;
            }
            .color-red {
                color: #ff6868;
                margin-left: 60px
            }
            .el-table {
                margin: 30px 0 0;
            }
            .has-gutter, .el-table th {
                background-color: #eee !important;
            }
            .el-table {
                width: 80%;
                td {
                    border-right: none
                }
            }
        }
        .mask {
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
                width: 530px;
                /*height: 305px;*/
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
                    padding: 10px 45px 20px 45px;
                    box-sizing: border-box;
                    .del-btn-group {
                        text-align: right;
                        margin-top: 50px;
                    }
                }
            }
        }
    }
</style>
