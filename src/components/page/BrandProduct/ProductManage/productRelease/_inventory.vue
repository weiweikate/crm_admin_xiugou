<template>
    <div class="prod-inventory">
        <el-form v-loading="salesLoading" :model="form" ref="form" :rules="rules" label-position="right" label-width="100px">
            <div class="pro-title">销售属性</div>
            <!--未同步仓库-->
            <el-form-item v-if="!productInfo.checkStatus" v-for="(v, k) in salesAttrArr" :key="k" :label="v.name+' : '">
                <div v-if="v.type == 2">
                    <div class="img-type" v-for="(v1, k1) in v.options" :key="`${k}-${k1}`">
                        <el-checkbox v-if="v1.defType == 1" v-model="v1.value"><span class="over-hidden def-param">{{v1.label}}</span></el-checkbox>
                        <div class="mt10" v-else>
                            <el-input v-model="v1.value" style="width: 215px"></el-input>
                            <span class="primary-text" @click="deleteProps(k,k1)">删除</span>
                        </div>
                        <template v-if="v1.imgUrl == ''">
                            <el-upload
                                :action="imgUpload"
                                :show-file-list="false"
                                :before-upload="beforeAvatarUpload"
                                :on-success="uploadSuccess"
                            >
                                <span class="primary-text" @click="beforeUpload(k, k1)">上传图片</span>
                            </el-upload>
                        </template>
                        <template v-else>
                            <img :src="v1.imgUrl" alt="">
                            <span class="primary-text" @click="deleteImg(k, k1)">删除</span>
                        </template>
                    </div>
                </div>
                <div v-else-if="v.type == 1" class="sales-type">
                    <el-checkbox v-if="v1.defType == 1" v-for="(v1, k1) in v.options" :key="`${k}--${k1}`" v-model="v1.value"><span class="over-hidden def-param">{{v1.label}}</span></el-checkbox>
                    <div class="mt10" v-else>
                        <el-input v-model="v1.value" style="width: 215px"></el-input>
                        <span class="primary-text" @click="deleteProps(k,k1)">删除</span>
                    </div>
                </div>
                <div class="primary-text">
                    <span @click="addAttrValue(k)">新建子属性</span>
                </div>
            </el-form-item>
            <!--同步了仓库-->
            <el-form-item v-else v-for="(v, k) in salesAttrArr" :key="k" :label="v.name+' : '">
                <div class="img-type" v-for="(v1, k1) in v.options" :key="`${k}-${k1}`">
                    <el-input v-if="v1.defType == 1" style="width: 215px" v-model="v1.value"></el-input>
                    <div class="mt10" v-else>
                        <el-input v-model="v1.label" style="width: 215px"></el-input>
                        <span class="primary-text" @click="deleteProps(k,k1)">删除</span>
                    </div>
                    <template v-if="v1.imgUrl == ''">
                        <el-upload
                            :action="imgUpload"
                            :show-file-list="false"
                            :before-upload="beforeAvatarUpload"
                            :on-success="uploadSuccess"
                        >
                            <span class="primary-text" @click="beforeUpload(k, k1)">上传图片</span>
                        </el-upload>
                    </template>
                    <template v-else>
                        <img :src="v1.imgUrl" alt="">
                        <span class="primary-text" @click="deleteImg(k, k1)">删除</span>
                    </template>
                </div>
                <div class="primary-text">
                    <span @click="addAttrValue(k)">新建子属性</span>
                </div>
            </el-form-item>
            <el-form-item label=" ">
                <div class="primary-text">
                    <span @click="addPrimaryAttr" v-if="!productInfo.checkStatus">新建主属性</span>
                    <span v-if="!productInfo.checkStatus">|</span>
                    <span @click="refreshAttr">刷新</span>
                </div>
            </el-form-item>
            <el-form-item label=" ">
                <el-button :loading="createListLoading" type="primary" @click="addprodSku">生成列表</el-button>
            </el-form-item>
            <div class="pro-title">价格信息</div>
            <el-form-item label="销售价格">
                <el-button type="primary" class="mb10" @click="batchPrice = true">批量输入</el-button>
                <el-table :data="priceTable" border stripe>
                    <el-table-column v-if="!flag" prop="propertyValues" label="属性" width="225" align="center">
                        <template slot-scope="scope">
                            {{scope.row.propertyValues.split('@').join('-')}}
                        </template>
                    </el-table-column>
                    <el-table-column label="原价" align="center" width="225">
                        <template slot-scope="scope">
                            <el-input-number :controls="false" :min="0" v-model.number="scope.row.originalPrice"></el-input-number>
                        </template>
                    </el-table-column>
                    <el-table-column label="v0" align="center" width="225">
                        <template slot-scope="scope">
                            <el-input-number :controls="false" :min="0" v-model.number="scope.row.v0"></el-input-number>
                        </template>
                    </el-table-column>
                    <el-table-column label="v1" align="center" width="225">
                        <template slot-scope="scope">
                            <el-input-number :controls="false" :min="0" v-model.number="scope.row.v1"></el-input-number>
                        </template>
                    </el-table-column>
                    <el-table-column label="v2" align="center" width="225">
                        <template slot-scope="scope">
                            <el-input-number :controls="false" :min="0" v-model.number="scope.row.v2"></el-input-number>
                        </template>
                    </el-table-column>
                    <el-table-column label="v3" align="center" width="225">
                        <template slot-scope="scope">
                            <el-input-number :controls="false" :min="0" v-model.number="scope.row.v3"></el-input-number>
                        </template>
                    </el-table-column>
                    <el-table-column label="v4" align="center" width="225">
                        <template slot-scope="scope">
                            <el-input-number :controls="false" :min="0" v-model.number="scope.row.v4"></el-input-number>
                        </template>
                    </el-table-column>
                    <el-table-column label="v5" align="center" width="225">
                        <template slot-scope="scope">
                            <el-input-number :controls="false" :min="0" v-model.number="scope.row.v5"></el-input-number>
                        </template>
                    </el-table-column>
                    <el-table-column label="v6" align="center" width="225">
                        <template slot-scope="scope">
                            <el-input-number :controls="false" :min="0" v-model.number="scope.row.v6"></el-input-number>
                        </template>
                    </el-table-column>
                    <el-table-column label="拼店价" align="center" width="225">
                        <template slot-scope="scope">
                            <el-input-number :controls="false" :min="0" v-model.number="scope.row.groupPrice"></el-input-number>
                        </template>
                    </el-table-column>
                    <el-table-column label="结算价" align="center" width="225">
                        <template slot-scope="scope">
                            <el-input-number :controls="false" :min="0" v-model.number="scope.row.settlementPrice"></el-input-number>
                        </template>
                    </el-table-column>
                    <el-table-column label="最低支付价" align="center" width="225">
                        <template slot-scope="scope">
                            <el-input-number :controls="false" :min="0" v-model.number="scope.row.minPrice"></el-input-number>
                        </template>
                    </el-table-column>
                    <el-table-column label="重量（kg）" align="center" width="225">
                        <template slot-scope="scope">
                            <el-input-number :controls="false" :min="0" v-model.number="scope.row.weight"></el-input-number>
                        </template>
                    </el-table-column>
                    <el-table-column prop="skuCode" label="SKU编码" align="center" width="225"></el-table-column>
                    <el-table-column label="SKU条形码" align="center" width="225">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.barCode"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column label="供应商SKU编码" align="center" width="225">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.supplierSkuCode"></el-input>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>
            <div class="pro-title">库存信息 <span class="grey-text">注：可售库存不编辑默认全部可售</span></div>
            <el-form-item label="库存信息">
                <el-table v-if="!flag" :data="priceTable" border stripe>
                    <el-table-column prop="propertyValues" label="属性" align="center">
                        <template slot-scope="scope">
                            {{scope.row.propertyValues.split('@').join('-')}}
                        </template>
                    </el-table-column>
                    <el-table-column :render-header="renderTitle" label="单位" align="center">
                        <template slot-scope="scope" v-if="priceTable.length !==0">
                            {{unit || '-'}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="warehouseStock" label="仓库同步库存" align="center">
                        <template slot-scope="scope">
                            {{scope.row.warehouseStock || '-'}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="sellStock" label="可售库存" align="center">
                        <template slot-scope="scope">
                            <el-input v-if="productInfo.checkStatus" v-model="scope.row.sellStock"></el-input>
                            <span v-else>-</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center">
                        <template slot-scope="scope">
                            <span class="primary-text" @click="showWareaMsg(scope.row)">查看</span>
                        </template>
                    </el-table-column>
                </el-table>
                <el-table v-else :data="priceTable" border stripe>
                    <el-table-column prop="propertyValues" label="默认" align="center">
                        <template slot-scope="scope">
                            {{scope.row.propertyValues.split('@').join('-')}}
                        </template>
                    </el-table-column>
                    <el-table-column :render-header="renderTitle" prop="stockUnit" label="单位" align="center">
                        <template slot-scope="scope">
                            {{scope.row.stockUnit || '-'}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="warehouseStock" label="仓库同步库存" align="center">
                        <template slot-scope="scope">
                            {{scope.row.warehouseStock || '-'}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="sellStock" label="可售库存" align="center">
                        <template slot-scope="scope">
                            <el-input v-if="productInfo.checkStatus" v-model="scope.row.sellStock"></el-input>
                            <span v-else>-</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center">
                        <template slot-scope="scope">
                            <span class="primary-text" @click="showWareaMsg(scope.row)">查看</span>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>
            <el-form-item label=" ">
                <el-button :loading="subformBtn" type="primary" @click="nextTip">下 一 步</el-button>
            </el-form-item>
        </el-form>
        <!--批量添加产品价格-->
        <el-dialog title="批量操作" :visible.sync="batchPrice" width="30%" :before-close="cancleBatchAdd" style="min-width: 500px">
            <el-table :data="batchPriceArr" border stripe>
                <el-table-column label="原价" align="center">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.originalPrice"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="v0" align="center">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.v0"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="v1" align="center">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.v1"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="v2" align="center">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.v2"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="v3" align="center">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.v3"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="v4" align="center">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.v4"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="v5" align="center">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.v5"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="v6" align="center">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.v6"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="拼店价" align="center">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.groupPrice"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="结算价" align="center">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.settlementPrice"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="重量（kg）" align="center">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.weight"></el-input>
                    </template>
                </el-table-column>
            </el-table>
            <span slot="footer">
                <el-button type="primary" @click="batchAddPrice">确 定</el-button>
                <el-button @click="cancleBatchAdd">取 消</el-button>
            </span>
        </el-dialog>
        <!--查看仓库信息-->
        <el-dialog title="仓库信息" :visible.sync="showWareaMsgToask" width="30%" style="min-width: 500px">
            <!--TODO 暂无字段-->
            <el-table :data="batchPriceArr" border stripe>
                <el-table-column prop="wareaCode" label="仓库编码" align="center"></el-table-column>
                <el-table-column prop="wareaCode" label="仓库名称" align="center"></el-table-column>
                <el-table-column prop="wareaCode" label="仓库类型" align="center"></el-table-column>
                <el-table-column prop="warehouseStock" label="仓库库存" align="center"></el-table-column>
            </el-table>
            <span slot="footer">
                <el-button type="primary" @click="showWareaMsgToask = false">确 定</el-button>
                <el-button @click="showWareaMsgToask = false">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import request from '@/http/http';
    import * as api from '@/api/api.js';
    import { beforeAvatarUpload } from '@/JS/commom.js';
    export default {
        mixins: [beforeAvatarUpload],
        props: ['productInfo'],
        data() {
            return {
                flag: false, // true: 无销售属性
                checkStatus: true, // 审核状态
                createListLoading: false,
                showWareaMsgToask: false,
                subformBtn: false,
                selectedCateArr: [],
                form: {},
                rules: {},
                unit: '包',
                unitArr: [
                    { label: '包', value: '包' },
                    { label: '箱', value: '箱' },
                    { label: '件', value: '件' },
                    { label: '条', value: '条' },
                    { label: '盒', value: '盒' },
                    { label: 'KG', value: 'KG' },
                    { label: '吨', value: '吨' },
                    { label: '平米', value: '平米' },
                    { label: '立方', value: '立方' }
                ],
                rowIndex: { bIndex: '', mIndex: '' },
                salesLoading: false,
                salesAttrArr: [],
                tmpSalesAttrArr: [],
                priceTable: [],
                wareTable: [],
                wareMsgTable: [],
                batchPrice: false,
                batchPriceArr: [{ originalPrice: '', v0: '', v1: '', v2: '', v3: '', v4: '', v5: '', v6: '', groupPrice: '', settlementPrice: '', weight: '' }]
            };
        },
        computed: {
            imgUpload() {
                return api.uploadImg;
            }
        },
        mounted() {
            console.log('inventory', this.productInfo);
            this.getSalesList();
        },
        methods: {
            // 添加主属性
            addPrimaryAttr() {
                this.$router.push({ path: '/thirdClassify', query: { name: this.selectedCateArr[2].label, id: this.selectedCateArr[2].value, superiorName: this.selectedCateArr[1].label }});
            },
            // 刷新属性
            async refreshAttr() {
                this.tmpSalesAttrArr = this.salesAttrArr;
                await this.getSalesList();
                this.salesAttrArr = this.tmpSalesAttrArr;
            },
            // 查看库存信息
            showWareaMsg(row) {
                this.wareMsgTable = [];
                this.wareMsgTable.push(row);
                this.showWareaMsgToask = true;
            },
            // 取消批量添加
            cancleBatchAdd() {
                this.batchPrice = false;
                this.batchPriceArr = [{ originalPrice: '', v0: '', v1: '', v2: '', v3: '', v4: '', v5: '', v6: '', groupPrice: '', settlementPrice: '', weight: '' }];
            },
            // 批量添加价格
            batchAddPrice() {
                if (this.priceTable.length === 0) return this.$message.warning('添加失败');
                this.priceTable.forEach((v, k) => {
                    v.originalPrice = this.batchPriceArr[0].originalPrice;
                    v.v0 = this.batchPriceArr[0].v0;
                    v.v1 = this.batchPriceArr[0].v1;
                    v.v2 = this.batchPriceArr[0].v2;
                    v.v3 = this.batchPriceArr[0].v3;
                    v.v4 = this.batchPriceArr[0].v4;
                    v.v5 = this.batchPriceArr[0].v5;
                    v.v6 = this.batchPriceArr[0].v6;
                    v.groupPrice = this.batchPriceArr[0].groupPrice;
                    v.settlementPrice = this.batchPriceArr[0].settlementPrice;
                    v.weight = this.batchPriceArr[0].weight;
                    this.$set(this.priceTable, k, v);
                });
                this.batchPrice = false;
            },
            // 生成列表
            addprodSku() {
                const data = {
                    prodCode: this.productInfo.prodCode
                };
                const arr = [];
                this.salesAttrArr.forEach((v, k) => {
                    const obj = {
                        specName: v.name,
                        specValues: []
                    };
                    v.options.forEach(v1 => {
                        if (v1.value) {
                            obj.specValues.push({
                                specImg: v1.imgUrl,
                                specName: v.name,
                                specValue: v1.value === true ? v1.label : v1.value
                            });
                        }
                    });
                    arr.push(obj);
                });
                if (arr.length === 0) return this.$message.warning('请选择销售属性');
                this.flag = arr.every(v => {
                    return v.specValues.length === 0;
                });
                if (this.flag) {
                    data.specifies = [];
                } else {
                    data.specifies = arr;
                }
                this.createListLoading = true;
                request.addProductSku(data).then(res => {
                    this.createListLoading = false;
                    this.$message.success(res.msg);
                    this.priceTable = [];
                    if (res.data.length !== 0) {
                        this.priceTable = res.data;
                    }
                }).catch(err => {
                    this.createListLoading = false;
                    console.log(err);
                });
            },
            // 根据三级类目获取销售属性列表
            async getSalesList() {
                const thirdCateId = this.selectedCateArr[2].value || '';
                const data = {
                    categoryId: thirdCateId,
                    type: 2,
                    page: 1,
                    pageSize: 10000
                };
                this.salesLoading = true;
                await request.queryPropertyPageListByCate(data).then(res => {
                    this.salesLoading = false;
                    const tplData = res.data;
                    this.salesAttrArr = [];
                    tplData.data.forEach((v, k) => {
                        this.salesAttrArr.push({
                            name: v.name,
                            // TODO valueType
                            type: 2,
                            options: []
                        });
                        if (v.values.length !== 0) {
                            v.values.forEach(v1 => {
                                this.salesAttrArr[k].options.push({
                                    label: v1.value,
                                    value: false,
                                    defType: 1,
                                    imgUrl: v1.imgUrl || ''
                                });
                            });
                        }
                    });
                }).catch(err => {
                    this.salesLoading = false;
                    console.log(err);
                });
            },
            // 添加属性值
            addAttrValue(index) {
                this.$prompt('请输入属性名', null, {
                    showCancelButton: true
                }).then(({ value }) => {
                    const item = this.salesAttrArr[index];
                    item.options.push({ label: value, value: value, defType: 2, imgUrl: '' });
                }).catch(err => {
                    console.log(err);
                });
            },
            // 删除自定义属性值
            deleteProps(bIndex, sIndex) {
                this.salesAttrArr[bIndex].options.splice(sIndex, 1);
            },
            // 上传之前
            beforeUpload(bIndex, mIndex) {
                this.rowIndex.bIndex = bIndex;
                this.rowIndex.mIndex = mIndex;
            },
            // 上传成功的钩子
            uploadSuccess(res) {
                const bInd = this.rowIndex.bIndex || 0;
                const mInd = this.rowIndex.mIndex || 0;
                this.salesAttrArr[bInd].options[mInd].imgUrl = res.data;
            },
            // 删除图片
            deleteImg(bIndex, mIndex) {
                this.salesAttrArr[bIndex].options[mIndex].imgUrl = '';
            },
            // 改变表头单位
            tableHeadChange(val) {
                this.unit = val;
            },
            // 表头
            renderTitle(h, { column, $index }) {
                return [
                    h(
                        'el-select',
                        {
                            style: {
                                display: 'block',
                                width: '100%'
                            },
                            attrs: {
                                value: this.unit,
                                placeholder: ''
                            },
                            on: {
                                change: this.tableHeadChange
                            }
                        },
                        this.unitArr.map((v, k) => {
                            return h('el-option', {
                                attrs: {
                                    label: v.label,
                                    value: v.value
                                }
                            });
                        })
                    )
                ];
            },
            // 下一步
            nextTip() {
                for (let i = 0; i < this.priceTable.length; i++) {
                    const price = this.priceTable[i];
                    if (price.v0 < price.v1 || price.v1 < price.v2 || price.v2 < price.v3 || price.v3 < price.v4 || price.v4 < price.v5 || price.v5 < price.v6 || price.v6 < price.groupPrice || price.groupPrice < price.settlementPrice) {
                        return this.$message.warning('请输入正确的价格');
                    }
                    if (!price.weight) return this.$message.warning('请输入正确重量');
                    if (!price.barCode) return this.$message.warning('请输入SKU条形码');
                    if (!price.supplierSkuCode) return this.$message.warning('请输入正确供应商SKU编码');
                }
                this.priceTable.forEach(v => {
                    v.stockUnit = this.unit;
                });
                const data = {
                    prodCode: this.productInfo.prodCode,
                    paramList: this.productInfo.paramList,
                    id: this.productInfo.id,
                    skuList: this.priceTable
                };
                this.subformBtn = true;
                request.addProducts(data).then(res => {
                    this.subformBtn = false;
                    this.$message.success(res.msg);
                    this.$emit('productInfo', this.productInfo);
                    this.$emit('nextName', 'info');
                }).catch(err => {
                    this.subformBtn = false;
                    console.log(err);
                });
            }
        }
    };
</script>

<style scoped lang="less">
    .prod-inventory{
        /deep/.el-upload--text {
            width: 80px;
            height: 1.6em;
            margin-left: 50px;
            overflow: hidden;
            border: none;
        }
        .pro-title {
            width: 100%;
            height: 60px;
            background-color: #f7f7f7;
            line-height: 60px;
            padding: 0 25px;
            box-sizing: border-box;
            margin-bottom: 20px;
        }
        .def-param{
            display: inline-block;
            max-width: 215px;
            vertical-align: middle;
        }
        .img-type{
            width: 600px;
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            img {
                width: 50px;
                height: 50px;
                border-radius: 5px;
                border: 1px solid #ccc;
                margin: 0 10px 0 50px;
            }
        }
    }
</style>
