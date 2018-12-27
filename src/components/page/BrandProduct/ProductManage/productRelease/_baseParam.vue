<template>
    <div class="prod-base-param">
        <el-steps :space="900" :active="0" finish-status="success">
            <el-step title="基础参数编辑"></el-step>
            <el-step title="库存编辑"></el-step>
            <el-step title="商品详情编辑"></el-step>
        </el-steps>
        <el-form :model="form" ref="form" :rules="rules" label-position="left" label-width="100px">
            <div class="pro-title">基础信息</div>
            <el-form-item prop="name" label="商品标题">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item prop="secondName" label="商品副标题">
                <el-input v-model="form.secondName"></el-input>
            </el-form-item>
            <el-form-item label-width="0px">
                <el-col :span="11">
                    <el-form-item prop="supplierCode" label="选择供应商">
                        <el-select v-model="form.supplierCode" placeholder="请选择供应商" @change="selectBrand">
                            <el-option v-for="(v, k) in supplierArr" :key="k" :label="v.name" :value="v.code"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item prop="warehouseType" label="发货仓库">
                        <el-select v-model="form.warehouseType" placeholder="请选择发货仓库">
                            <el-option v-for="(v, k) in deliveryWarehouseArr" :key="k" :label="v.label" :value="v.value"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-form-item>
            <el-form-item label-width="0px">
                <el-col :span="11">
                    <el-form-item prop="type" label="商品类型">
                        <el-select v-model="form.type" placeholder="请选择商品类型">
                            <el-option label="普通商品" value="1"></el-option>
                            <el-option label="内购商品" value="2"></el-option>
                            <!--<el-option label="虚拟商品" value="3"></el-option>-->
                            <el-option label="卡券商品" value="4"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item prop="businessType" label="贸易类型">
                        <el-select v-model="form.businessType" @change="changeTradeType" placeholder="请选择贸易类型">
                            <el-option label="一般贸易" value="1"></el-option>
                            <!--<el-option label="跨境保税" value="2"></el-option>-->
                            <!--<el-option label="海外直邮" value="3"></el-option>-->
                            <!--<el-option label="海淘" value="4"></el-option>-->
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-form-item>
            <el-form-item prop="brandId" label="品牌">
                <el-select class="search-inp" filterable placeholder="请选择品牌" v-model="form.brandId">
                    <el-option v-for="(v, k) in brandArr" :key="k" :label="v.name" :value="v.id"></el-option>
                </el-select>
            </el-form-item>
            <div class="pro-title">自然属性</div>
            <el-form-item v-loading="naturalLoading">
                <el-col :span="11" v-for="(v, k) in naturalAttribute" :key="k" class="mb10">
                    <el-form-item :label="v.name" style="position: relative">
                        <el-select :disabled="v.defParam != ''" class="search-inp" filterable placeholder="请选择" v-model="v.value">
                            <el-option v-for="(v1, k1) in v.options" :key="`${k}-${k1}`" :label="v1.value" :value="v1.value"></el-option>
                        </el-select>
                        <span class="primary-text" @click="addAttrValue(k)">添加属性值</span>
                        <p v-if="v.defParam != ''" class="extra-attr pram-inp primary-text">
                            <span class="over-hidden">{{v.defParam}}</span>
                            <span @click="v.defParam = ''">删除</span>
                        </p>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <div class="operate-natural-attr">
                        <span @click="addPrimaryAttr">添加主属性</span>
                        <span>|</span>
                        <span @click="refreshAttr">刷新</span>
                    </div>
                </el-col>
            </el-form-item>
            <el-form-item label=" ">
                <el-button :loading="btnLoading" type="primary" @click="nextTip">下 一 步</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import request from '@/http/http';
    import * as api from '@/api/api.js';
    export default {
        data() {
            return {
                naturalLoading: false, // 自然属性loading
                btnLoading: false,
                form: {
                    prodCode: '',
                    name: '',
                    secondName: '',
                    supplierCode: '',
                    warehouseType: '',
                    type: '',
                    businessType: '',
                    brandId: ''
                },
                rules: {
                    name: [{ required: true, message: '请输入商品标题', trigger: 'blur' }, { min: 2, max: 46, message: '长度在 2 到 46 个字符', trigger: 'blur' }],
                    secondName: [{ min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }],
                    supplierCode: [{ required: true, message: '请选择供应商', trigger: 'blur' }],
                    warehouseType: [{ required: true, message: '请选择发货仓库', trigger: 'blur' }],
                    type: [{ required: true, message: '请选择商品类型', trigger: 'blur' }],
                    businessType: [{ required: true, message: '请选择贸易类型', trigger: 'blur' }],
                    brandId: [{ required: true, message: '请输入品牌', trigger: 'blur' }]
                },
                supplierArr: [], // 供应商列表
                brandArr: [], // 品牌列表
                deliveryWarehouseArr: [{ label: '加盟仓', value: '1' }, { label: '虚拟仓库', value: '3' }], // 发货仓库
                naturalAttribute: [],
                naturalTmpAttribute: []
            };
        },
        props: ['productInfo'],
        computed: {
            imgUpload() {
                return api.uploadImg;
            }
        },
        created() {
            this.form = this.productInfo;
        },
        mounted() {
            this.getSupplyList();
            this.getNaturalList();
        },
        methods: {
            // 添加主属性
            addPrimaryAttr() {
                this.$router.push({ path: '/thirdClassify', query: { name: this.form.secCategoryName, type: 1, id: this.form.secCategoryId, superiorName: this.form.firstCategoryName }});
            },
            // 获取供应商列表
            async getSupplyList() {
                await request.findProductSupplierList({}).then(res => {
                    this.supplierArr = [];
                    this.supplierArr.push(...res.data);
                }).catch(err => {
                    console.log(err);
                });
            },
            // 获取品牌列表
            async selectBrand(val) {
                this.form.brandId = '';
                await request.findProductBrandListBySupplier({ supplierCode: val }).then(res => {
                    this.brandArr = res.data;
                }).catch(err => {
                    console.log(err);
                });
            },
            // 添加属性值
            addAttrValue(index) {
                this.$prompt('请输入属性值', '', {
                    inputPattern: /^.{1,20}$/,
                    inputErrorMessage: '请输入1-20位的名字'
                }).then(({ value }) => {
                    this.naturalAttribute[index].value = '';
                    this.naturalAttribute[index].defParam = value;
                }).catch(err => {
                    console.log(err);
                });
            },
            // 刷新属性
            async refreshAttr() {
                this.naturalTmpAttribute = this.naturalAttribute;
                await this.getNaturalList();
                this.naturalAttribute = this.naturalTmpAttribute;
            },
            // 根据三级类目获取自然属性列表
            async getNaturalList() {
                const thirdCateId = this.form.thirdCategoryId || '';
                const data = {
                    categoryId: thirdCateId,
                    type: 1,
                    page: 1,
                    pageSize: 10000
                };
                this.naturalLoading = true;
                await request.queryPropertyPageListByCate(data).then(res => {
                    this.naturalLoading = false;
                    const tmpData = res.data || [];
                    this.naturalAttribute = [];
                    tmpData.data.forEach(v => {
                        this.naturalAttribute.push({
                            name: v.name,
                            value: '',
                            defParam: '',
                            options: v.values || []
                        });
                    });
                }).catch(err => {
                    this.naturalLoading = false;
                    console.log(err);
                });
            },
            // 下一步
            nextTip() {
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        const data = {
                            ...this.form
                        };
                        const attrArr = [];
                        this.naturalAttribute.forEach(v => {
                            if (v.defParam === '') {
                                attrArr.push({paramName: v.name, paramValue: v.value});
                            } else {
                                attrArr.push({paramName: v.name, paramValue: v.defParam});
                            }
                        });
                        this.btnLoading = true;
                        data.paramList = attrArr;
                        request.addProducts(data).then(res => {
                            this.btnLoading = false;
                            this.$emit('productInfo', res.data)
                            this.$message.success(res.msg);
                            this.$emit('nextName', 'inventory');
                        }).catch(err => {
                            this.btnLoading = false;
                            console.log(err);
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            }
        }
    };
</script>

<style scoped lang="less">
    .prod-base-param{
        .pro-title {
            width: 100%;
            height: 60px;
            background-color: #f7f7f7;
            line-height: 60px;
            padding: 0 25px;
            box-sizing: border-box;
            margin-bottom: 20px;
        }
        .extra-attr {
            position: absolute;
            top: 80%;
            left: 0px;
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            & :first-child{
                display: inline-block;
                max-width: 170px;
            }
            & :last-child{
                display: inline-block;
                width: 30px;
                color: red;
                margin-left: 10px;
            }
        }
        .pram-inp{
            max-width: 215px;
        }
        .operate-natural-attr{
            cursor: pointer;
            color: #33b4ff;
            font-size: 12px;
        }
    }
</style>
