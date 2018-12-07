<template>
    <div class="baseParam">
        <v-breadcrumb :nav='nav'></v-breadcrumb>
        <el-card>
            <div v-if="cateArr.length !== 0">
                <span style="font-weight: 900">您当前选择的分类是</span>: {{cateArr[0].label}} > {{cateArr[1].label}} > {{cateArr[2].label}}
                <el-button @click="toggleCate" type="primary" style="margin-left: 30px">切换分类</el-button>
            </div>
            <div v-else>请选择分类</div>
        </el-card>
        <el-card>
            <el-steps :space="900" :active="0" finish-status="success">
                <el-step title="基础参数编辑"></el-step>
                <el-step title="销售信息编辑"></el-step>
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
                            <el-select :disabled="status == 4 || status == 3" v-model="form.supplierCode" placeholder="请选择供应商" @change="selectBrand">
                                <el-option v-for="(v, k) in supplierArr" :key="k" :label="v.name" :value="v.code"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item prop="warehouseType" label="发货仓库">
                            <el-select :disabled="status == 4 || status == 3" v-model="form.warehouseType" placeholder="请选择发货仓库">
                                <el-option v-for="(v, k) in deliveryWarehouseArr" :key="k" :label="v.label" :value="v.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-form-item>
                <el-form-item label-width="0px">
                    <el-col :span="11">
                        <el-form-item prop="type" label="商品类型">
                            <el-select :disabled="status == 4 || status == 3" v-model="form.type" placeholder="请选择商品类型">
                                <el-option label="普通商品" value="1"></el-option>
                                <el-option label="内购商品" value="2"></el-option>
                                <!--<el-option label="虚拟商品" value="3"></el-option>-->
                                <el-option label="卡券商品" value="4"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item prop="businessType" label="贸易类型">
                            <el-select :disabled="status == 4 || status == 3" v-model="form.businessType" @change="changeTradeType" placeholder="请选择贸易类型">
                                <el-option label="一般贸易" value="1"></el-option>
                                <!--<el-option label="跨境保税" value="2"></el-option>-->
                                <!--<el-option label="海外直邮" value="3"></el-option>-->
                                <!--<el-option label="海淘" value="4"></el-option>-->
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-form-item>
                <el-form-item prop="brandId" label="品牌">
                    <el-select :disabled="status == 4 || status == 3" class="search-inp" filterable placeholder="请选择品牌" v-model="form.brandId">
                        <el-option v-for="(v, k) in brandArr" :key="k" :label="v.name" :value="v.id"></el-option>
                    </el-select>
                    <!--<el-input :disabled="status == 4" class="search-inp" placeholder="税率" v-model=""></el-input>-->
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
                            <a class="href" :href="link" target="_blank">添加主属性</a>
                            <span>|</span>
                            <span @click="refreshAttr">刷新</span>
                        </div>
                    </el-col>
                </el-form-item>
                <el-form-item label=" ">
                    <el-button :loading="btnLoading" type="primary" @click="submitForm">下 一 步</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script>
    import vBreadcrumb from '@/components/common/Breadcrumb.vue';
    import request from '@/http/http';
    import * as api from '@/api/api.js';
    export default {
        components: { vBreadcrumb },
        data() {
            return {
                nav: ['品牌产品管理', '产品管理', '基础参数设置'],
                prodCode: '',
                status: '', // 0：删除 1：待发布2：待审核3：已通过4:已上架5：未通过6:已下架
                cateArr: [],
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
                tmpParamList: [], // 临时储存属性，刷新使用
                supplierArr: [], // 供应商列表
                brandArr: [], // 品牌列表
                deliveryWarehouseArr: [{ label: '加盟仓', value: '2' }, { label: '供应商', value: '3' }, { label: '虚拟仓库', value: '4' }], // 发货仓库
                naturalAttribute: [], // 自然属性列表
                naturalLoading: false, // 自然属性loading
                btnLoading: false
            };
        },
        computed: {
            link() {
                return `#/thirdClassify?name=${this.cateArr[1].label}&type=1&id=${this.cateArr[1].value}&superiorName=${this.cateArr[0].label}`;
            }
        },
        created() {
            this.prodCode = this.$route.query.prodCode || null;
            this.cateArr = JSON.parse(this.$route.query.cate) || [];
        },
        mounted() {
            this.getProductInfo();
        },
        methods: {
            // 提交表单
            submitForm() {
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        const data = {
                            ...this.form
                        };
                        const attrArr = [];
                        this.naturalAttribute.forEach(v => {
                            if (v.defParam === '') {
                                if (v.value !== '') {
                                    attrArr.push({ paramName: v.name, paramValue: v.value });
                                }
                            } else {
                                if (v.defParam !== '') {
                                    attrArr.push({ paramName: v.name, paramValue: v.defParam });
                                }
                            }
                        });
                        // 判断提交的数据是否含有@
                        if (JSON.stringify(attrArr).indexOf('@') !== -1) return this.$message.warning('请确保提交的数据不含@符号');
                        this.btnLoading = true;
                        data.paramList = attrArr;
                        data.firstCategoryId = this.cateArr[0].value;
                        data.secCategoryId = this.cateArr[1].value;
                        data.thirdCategoryId = this.cateArr[2].value;
                        request.addProducts(data).then(res => {
                            this.btnLoading = false;
                            this.$message.success(res.msg);
                            this.$router.push({ path: '/inventory', query: { prodCode: res.data.prodCode }});
                        }).catch(err => {
                            this.btnLoading = false;
                            console.log(err);
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            // 获取产品信息
            async getProductInfo() {
                if (this.prodCode) {
                    this.form.prodCode = this.prodCode;
                    let resData = {};
                    this.pageLoading = true;
                    await request.findProductDetailsByCode({ code: this.prodCode }).then(res => {
                        resData = res.data || {};
                    }).catch(err => {
                        this.pageLoading = false;
                        console.log(err);
                    });
                    this.status = resData.status;
                    await this.getSupplyList();
                    await this.selectBrand(resData.supplierCode);
                    await this.getNaturalList();
                    this.tmpParamList = resData.paramList;
                    if (this.naturalAttribute.length !== 0) {
                        this.naturalAttribute.forEach((v, k) => {
                            resData.paramList.forEach(v1 => {
                                if (v1.paramName == v.name) {
                                    if (v.options.length !== 0) {
                                        const arr = [];
                                        v.options.forEach(v2 => {
                                            arr.push(v2.value);
                                        });
                                        if (arr.includes(v1.paramValue)) {
                                            v.value = v1.paramValue;
                                        } else {
                                            v.defParam = v1.paramValue;
                                        }
                                        this.$set(this.naturalAttribute, k, v);
                                    }
                                }
                            });
                        });
                    }
                    this.form = {
                        prodCode: this.prodCode,
                        name: resData.name,
                        secondName: resData.secondName,
                        supplierCode: resData.supplierCode,
                        warehouseType: resData.warehouseType ? resData.warehouseType.toString() : '',
                        type: resData.type ? resData.type.toString() : '',
                        businessType: resData.businessType ? resData.businessType.toString() : '',
                        brandId: resData.brandId
                    };
                    // this.pageLoading = false;
                } else {
                    this.form.prodCode = '';
                    await this.getSupplyList();
                    await this.getNaturalList();
                    this.pageLoading = false;
                }
            },
            // 获取供应商列表
            async getSupplyList() {
                await request.findProductSupplierList({}).then(res => {
                    this.supplierArr = [];
                    this.supplierArr.push(...res.data);
                }).catch(err => {
                    this.pageLoading = false;
                    console.log(err);
                });
            },
            // 获取品牌列表
            async selectBrand(val) {
                this.form.brandId = '';
                await request.findProductBrandListBySupplier({ supplierCode: val }).then(res => {
                    this.brandArr = res.data;
                }).catch(err => {
                    this.pageLoading = false;
                    console.log(err);
                });
            },
            // 添加属性值
            addAttrValue(index) {
                this.$prompt('请输入属性值', '', {
                    inputPattern: /\s*\S+?/,
                    inputErrorMessage: '请输入1-20位的名字'
                }).then(({ value }) => {
                    this.naturalAttribute[index].value = '';
                    this.naturalAttribute[index].defParam = value.trim();
                }).catch(err => {
                    console.log(err);
                });
            },
            // 刷新属性
            async refreshAttr() {
                await this.getNaturalList();
                if (this.naturalAttribute.length !== 0) {
                    this.naturalAttribute.forEach((v, k) => {
                        this.tmpParamList.forEach(v1 => {
                            if (v1.paramName == v.name) {
                                if (v.options.length !== 0) {
                                    const arr = [];
                                    v.options.forEach(v2 => {
                                        arr.push(v2.value);
                                    });
                                    if (arr.includes(v1.paramValue)) {
                                        v.value = v1.paramValue;
                                    } else {
                                        v.defParam = v1.paramValue;
                                    }
                                    this.$set(this.naturalAttribute, k, v);
                                }
                            }
                        });
                    });
                }
            },
            // 根据三级类目获取自然属性列表
            async getNaturalList() {
                const thirdCateId = this.cateArr[2].value || '';
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
                    this.pageLoading = false;
                    console.log(err);
                });
            },
            // 切换分类
            toggleCate() {
                this.$confirm('切换后系统不会保留您本次的编辑', '您确定要切换分类吗？', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$router.push({ path: '/releaseProduct', query: { prodCode: this.prodCode || null }});
                }).catch(() => {});
            }
        }
    };
</script>

<style lang="less" scoped>
.baseParam{
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
