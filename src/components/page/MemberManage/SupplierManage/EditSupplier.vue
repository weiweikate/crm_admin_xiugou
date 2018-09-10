<template>
    <div>
        <v-breadcrumb :nav="['经销商会员管理','供应商管理','编辑供应商']"></v-breadcrumb>
        <div class="container">
            <div class="supplier-box">
                <el-form :model="form" ref="form">
                    <el-form-item prop="name" label="供应商名称">
                        <el-input placeholder="请输入供应商名称" v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item prop="name" label="供应商类型" placeholder="请选择">
                        <el-select v-model="form.itype">
                            <el-option label="产品供应商" value="1">产品供应商</el-option>
                            <el-option label="服务供应商" value="2">服务供应商</el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="name" label="供应商姓名">
                        <el-input placeholder="请输入供应商姓名" v-model="form.username"></el-input>
                    </el-form-item>
                    <el-form-item prop="name" label="联系方式" class="phone-area">
                        <el-input class="small-inp" v-model="first"></el-input>
                        <el-input class="mid-inp" v-model="second"></el-input>
                        <div class="intent">
                            <el-input v-model="form.mobile" @blur="checkPhone"></el-input>
                        </div>
                    </el-form-item>
                    <el-form-item prop="country" class="address-item" label="供应商地址">
                        <el-select v-model="form.country" class="small-inp" @change="supplierArea">
                            <el-option label="中国" value="1">中国</el-option>
                            <el-option label="海外" value="2">海外</el-option>
                        </el-select>
                        <div class="address-area">
                            <region @regionMsg='getRegion' :regionMsg='address' :isDisabled="!areaDisabled"></region>
                        </div>
                        <div class="intent">
                            <el-input placeholder="请输入详细地址" v-model="form.address"></el-input>
                        </div>
                    </el-form-item>
                    <el-form-item class="classify-area" prop="productcIds" label="供应产品品类品牌">
                        <v-choosearea @productcIds="productcIds" v-model="form.list" :detailData="detailData"
                                      :addOrUp="isUp?'update':''" :isSearch='true' :isSupplider='true'></v-choosearea>
                        <div class="clearfix"></div>
                        <div class="intent">
                            <v-choosebrand @brandids="brandids" v-model="form.brandids" :secIds="secIds" :detailBrand="detailBrand"
                                           :addOrUp="'update'"></v-choosebrand>
                        </div>
                    </el-form-item>
                    <el-form-item label="供应商账号">
                        <el-input placeholder="请输入银行名称" v-model="form.bankName"></el-input>
                        <el-input placeholder="请输入开户支行" v-model="form.bankOpening"></el-input>
                    </el-form-item>
                    <el-form-item prop="bankCard" label="卡号">
                        <el-input placeholder="请输入银行卡号" v-model="form.bankCard"></el-input>
                    </el-form-item>
                    <el-form-item prop="bankUsername" label="持卡人">
                        <el-input placeholder="请输入持卡人姓名" v-model="form.bankUsername"></el-input>
                    </el-form-item>

                    <div class="submit-btn">
                        <el-button type="primary" :loading="btnLoading" @click="submitForm('form')">确认保存</el-button>
                        <el-button @click="cancel">取消</el-button>
                    </div>
                </el-form>
            </div>
        </div>
    </div>

</template>
<script>
    import icon from "../../../common/ico";
    import vBreadcrumb from '../../../common/Breadcrumb.vue';
    import vChoosearea from '../../../common/chooseClassify.vue';
    import vChoosebrand from '../../../common/SupplierChooseBrand.vue';
    import region from '../../../common/Region';
    import * as api from '../../../../api/MemberManage/SupplierManage/index'
    import * as pApi from '../../../../privilegeList/MemberManage/SupplierManage/index.js';

    export default {
        components: {
            vBreadcrumb, icon, vChoosearea, region, vChoosebrand
        },
        data() {
            return {
                form: {
                    name: "",
                    username: "",
                    mobile: "",
                    itype: '1',
                    country: '1',
                    list: '',
                    brandids: '',
                    address: '',
                    bankName: '',
                    bankOpening: '',
                    bankCard: '',
                    bankUsername: '',
                },
                first: '',
                second: '',
                detailData: [],
                detailBrand: [],
                btnLoading: false,
                isUp: false,//添加false，修改true
                id: '',
                address: '',
                areaDisabled: true,
                phone: true,
                 // 二级类目ids
                secIds:'',
            }
        },
        activated() {
            let that = this;
            that.id =
                that.$route.query.id || sessionStorage.getItem("supplierDetail");
            this.address = '';
            that.getDetail();
        },
        methods: {
            //获取详情
            getDetail() {
                let that = this;
                let data = {
                    id: that.id
                };
                that.loading = true;
                that.$axios
                    .post(api.findSupplierById, data)
                    .then(res => {
                        if (res.data.code == 200) {
                            that.loading = false;
                            that.form = res.data.data.map;
                            that.form.bankName = that.form.bank_name;
                            that.form.bankOpening = that.form.bank_opening;
                            that.form.bankCard = that.form.bank_card;
                            that.form.bankUsername = that.form.bank_username;
                            that.form.country = that.form.country.toString();
                            that.form.itype = that.form.itype.toString();
                            that.first = that.form.telephone.substring(0, 4);
                            that.second = that.form.telephone.substring(4);
                            that.detailData = res.data.data.product;
                            that.detailBrand = res.data.data.brand;
                            if (that.form.country == 2) {
                                that.areaDisabled = false;
                            } else {
                                that.areaDisabled = true;
                                let reginArr = [];
                                reginArr.push(that.form.province_id, this.form.city_id, this.form.area_id);
                                that.address = reginArr;
                            }
                        } else {
                            that.loading = false;
                            that.$message.warning(res.data.msg);
                        }
                    })
                    .catch(err => {
                        that.loading = false
                    })
            },
            // 获取省市区
            getRegion(msg) {
                this.address = msg;
                this.form.provinceId = this.address[0];
                this.form.cityId = this.address[1];
                this.form.areaId = this.address[2];
                console.log(this.address)
            },
            //供应商地址选择
            supplierArea() {
                this.areaDisabled = this.form.country == 1;
            },
            // 获取一二级类目
            productcIds(productcIds) {
                let tmpId = [];
                productcIds.forEach(function(v){
                    tmpId.push(v.secCategoryId);
                })
                this.secIds = tmpId.join(',')
                this.form.list = JSON.stringify(productcIds);
            },
            brandids(brandids) {
                this.form.brandids = brandids.join(',');
            },
            checkPhone() {
                let that = this;
                let reg = /^1[3-8]\d{9}$/;
                if (!reg.test(that.form.mobile)) {
                    that.$message.warning('请输入正确的手机号格式!');
                    that.phone = false;
                    return false;
                } else {
                    that.phone = true;
                }
            },
            // 提交表单
            submitForm(form) {
                let that = this;
                if (!that[form].name) {
                    that.$message.warning('请输入供货商名称!');
                    return
                }
                if (!that[form].username) {
                    that.$message.warning('请输入供应商姓名!');
                    return
                }
                if (!that[form].mobile) {
                    that.$message.warning('请输入联系方式!');
                    return
                }
                if (that.form.country == 1) {
                    this.form.provinceId = this.address[0];
                    this.form.cityId = this.address[1];
                    this.form.areaId = this.address[2];
                    if (!that.form.provinceId || !that.form.cityId || !that.form.areaId) {
                        that.$message.warning('请输入省市区!');
                        return
                    }
                }
                if (!that[form].address) {
                    that.$message.warning('请输入详细地址!');
                    return
                }
                if (!that.form.list.length == 2) {
                    that.$message.warning('请选择供应产品品类!');
                    return
                }
                if (!that.form.brandids) {
                    that.$message.warning('请选择供应产品品牌!');
                    return
                }
                if (!that.form.bankName) {
                    that.$message.warning('请输入银行名称!');
                    return
                }
                if (!that.form.bankOpening) {
                    that.$message.warning('请输入请输入开户支行!');
                    return
                }
                if (!that.form.bankCard) {
                    that.$message.warning('请输入银行卡号!');
                    return
                }
                // else {
                //     let reg = /^(\d{16}|\d{19})$/;
                //     if (!reg.test(that.form.bankCard)) {
                //         that.$message.warning('请输入合法的银行卡号!');
                //         return
                //     }
                // }
                let reg = /^([1-9]{1})(\d{14}|\d{18})$/;
                if (!reg.test(that.form.bankCard)) {
                    that.$message.warning('请输入合法的银行卡号!');
                    return
                }
                if (!that.form.bankUsername) {
                    that.$message.warning('请输入持卡人姓名!');
                    return
                }
                if (that.phone == false) {
                    return false
                }
                that.btnLoading = true;
                let data = this[form];
                data.telephone = that.first + that.second;
                data.url = pApi.updateSupplier;
                data.id = that.id;
                this.$axios
                    .post(api.updateSupplier, data)
                    .then(res => {
                        if (res.data.code == 200) {
                            that.$message.success(res.data.msg);
                            setTimeout(function () {
                                that.$router.push('/supplierManage');
                                that.btnLoading = false;
                            }, 1000)
                        } else {
                            that.ajax = false;
                            that.$message.warning(res.data.msg);
                            that.btnLoading = false;
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        that.btnLoading = false;
                        that.ajax = false;
                    });
            },
            //取消
            cancel() {
                this.$router.push('/supplierManage');
            },
        }
    }
</script>
<style lang="less">
    .supplier-box {
        .label {
            width: 100px;
            text-align: right;
            display: inline-block;
            margin-right: 10px;
            vertical-align: top;
        }
        .el-input {
            width: 350px
        }
        .el-input__inner {
            width: 350px
        }
        .classify-area {
            .el-input {
                width: 200px
            }
            .el-input__inner {
                width: 200px
            }
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
        .phone-area {
            .small-inp {
                width: 80px;
                margin: 0 5px;
                .el-input__inner {
                    width: 80px
                }
            }
            .mid-inp {
                width: 210px;
                .el-input__inner {
                    width: 120px
                }
            }
        }
        .intent {
            margin-left: 117px;
            margin-top: 10px;
        }
        .mini-inp {
            width: 90px
        }

        .el-form-item__label {
            width: 112px;
        }

        .clearfix {
            clear: both;
            content: ''
        }
        .select-area {
            width: 500px;
            max-height: 150px;
            overflow-x: hidden;
            overflow-y: auto;
            border: 1px solid #eee;
            border-radius: 10px;
        }
        .select-area .el-checkbox {
            margin: 0 10px 0
        }
        .select-area .el-checkbox-group {
            font-size: 12px;
            line-height: 10px
        }
        .submit-btn {
            padding: 0 50px 20px 100px
        }
        .el-form-item__error {
            margin-left: 120px;
        }
        .address-area {
            display: inline-block;
            .el-select, .el-input, .el-input__inner {
                width: 120px
            }
        }
        .address-item .small-inp {
            .el-select, .el-input, .el-input__inner {
                width: 120px
            }
        }

    }
</style>


