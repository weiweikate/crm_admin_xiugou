<template>
    <div class="report-set">
        <v-breadcrumb :nav='nav'></v-breadcrumb>
        <el-card>
            <el-form :model="form" :rules="rules" ref="form" label-width="120px">
                <div class="title">基础信息</div>
                <el-form-item prop="type" label="类型">
                    <el-select v-model="form.type" placeholder="请选择仓库类型" class="inp">
                        <el-option value="1" label="采购入库">采购入库</el-option>
                        <el-option value="2" label="盘盈入库">盘盈入库</el-option>
                        <el-option value="3" label="调拨入库">调拨入库</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="deliverWarehouseName" label="出库方">
                    <el-input class="inp" v-model="form.deliverWarehouseName" placeholder="请输入出库方名称"></el-input>
                </el-form-item>
                <el-form-item prop="deliverWarehouseCode" label="出库仓库编码">
                    <el-input class="inp" v-model="form.deliverWarehouseCode" placeholder="请输入出库仓库编码"></el-input>
                </el-form-item>
                <el-form-item prop="receiveWarehouseName" label="入库方">
                    <el-autocomplete class="inp" v-model="form.receiveWarehouseName" :fetch-suggestions="querySearchAsync" @select="handleSelect" placeholder="请输入入库方名称或编码"></el-autocomplete>
                </el-form-item>
                <el-form-item prop="receiveWarehouseCode" label="入库仓库编码">
                    <el-input class="inp" v-model="form.receiveWarehouseCode" disabled=""></el-input>
                </el-form-item>
                <el-form-item prop="receiveWarehouseAddress" label="入库地址">
                    <el-input class="inp" v-model="form.receiveWarehouseAddress" disabled=""></el-input>
                </el-form-item>
                <el-form-item prop="contactUserName" label="入库单填写人">
                    <el-input class="inp" v-model="form.contactUserName" disabled=""></el-input>
                </el-form-item>
                <el-form-item prop="contactPhone" label="联系方式">
                    <el-input class="inp" v-model="form.contactPhone" placeholder="请输入联系方式"></el-input>
                </el-form-item>
                <el-form-item prop="goodsSenderName" label="送货人姓名">
                    <el-input class="inp" v-model="form.goodsSenderName" placeholder="请输入送货人姓名"></el-input>
                </el-form-item>
                <el-form-item prop="goodsSenderPhone" label="送货人联系方式" class="spec">
                    <el-input class="inp" v-model="form.goodsSenderPhone" placeholder="请输入送货人联系方式"></el-input>
                </el-form-item>
                <el-form-item prop="remark" label="备注">
                    <el-input type="textarea" class="inp-textarea" v-model="form.remark" maxlength="180" placeholder="请填写备注"></el-input>
                </el-form-item>
                <div class="title">入库货物信息</div>
                <el-form-item prop="productName" label="产品名称">
                    <el-input class="inp" v-model="form.productName" placeholder="请输入产品名称"></el-input>
                </el-form-item>
                <el-form-item prop="prodCode" label="产品ID">
                    <el-input class="inp" v-model="form.prodCode" placeholder="请输入产品ID"></el-input>
                </el-form-item>
                <el-form-item prop="supplierCode" label="经销商ID">
                    <el-input class="inp" v-model="form.supplierCode" placeholder="请输入经销商ID"></el-input>
                </el-form-item>
                <el-form-item prop="supplierName" label="经销商名称">
                    <el-input class="inp" v-model="form.supplierName" placeholder="请输入经销商名称"></el-input>
                </el-form-item>
                <el-form-item label="">
                    <el-button type="primary" @click="getList(1)">搜索</el-button>
                    <el-button @click="resetForm('form')">重置</el-button>
                </el-form-item>
                <el-table :data="tableData" border>
                    <el-table-column type="index" label="序号" align="center"></el-table-column>
                    <el-table-column prop="name" label="产品名称" align="center"></el-table-column>
                    <el-table-column prop="productCategory" label="产品类目" align="center"></el-table-column>
                    <el-table-column prop="prodCode" label="产品ID" align="center"></el-table-column>
                    <el-table-column prop="supplierCode" label="供应商ID" align="center"></el-table-column>
                    <el-table-column prop="supplierName" label="供应商名称" align="center"></el-table-column>
                    <el-table-column label="操作" align="center">
                        <template slot-scope="scope">
                            <el-button @click="editNumber(scope.row)" type="primary">编辑数量</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="block">
                    <el-pagination
                        background
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="page.currentPage"
                        :page-size="page.pageSize"
                        layout="total, prev, pager, next, jumper"
                        :total="page.totalPage">
                    </el-pagination>
                </div>
                <table class="selected-product" v-for="(item,index) in chooseLists" :key="index">
                    <tr v-for="(v,k) in item.skuList" :key="k">
                        <td v-if="k==0" :rowspan="item.skuList.length" style="width: 50px">{{index+1}}</td>
                        <td>{{(v.name || '')+(v.specifyValues || '')}}</td>
                        <td>产品ID：{{v.prodCode}}</td>
                        <td style="min-width:100px">x{{v.estimateCount}}</td>
                        <td style="min-width:80px;cursor: pointer;color:#33b4ff" @click="delSelectedPro(k,index)">删除
                        </td>
                    </tr>
                </table>
                <div style="margin-top: 40px">
                    <el-button type="primary" @click="submitForm('form')">确认提交</el-button>
                    <el-button @click="$router.push('/repertoryReportList')">取消</el-button>
                </div>
            </el-form>
        </el-card>
        <el-dialog title="入库数量" :visible.sync="mask">
           <el-table border :data="chooseData">
               <el-table-column prop="name" label="产品名称" align="center"></el-table-column>
               <el-table-column prop="skuCode" label="商品唯一码" align="center"></el-table-column>
               <template v-for='(v,k) in headData'>
                   <el-table-column
                       :show-overflow-tooltip="true"
                       :prop="v.value"
                       :label="v.name"
                       :key="k"
                       align="center">
                   </el-table-column>
               </template>
               <!--<el-table-column prop="specifies" label="颜色" align="center"></el-table-column>-->
               <!--<el-table-column prop="name" label="版本" align="center"></el-table-column>-->
               <!--<el-table-column prop="specifyValues" label="规格" align="center"></el-table-column>-->
               <!--<el-table-column prop="name" label="类型" align="center"></el-table-column>-->
               <el-table-column prop="name" label="采购数" align="center">
                   <template slot-scope="scope">
                       <el-input-number :min="0" :controls="false" v-model="scope.row.estimateCount"></el-input-number>件
                   </template>
               </el-table-column>
           </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="save">确认保存</el-button>
                <el-button @click="mask=false">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import vBreadcrumb from '@/components/common/Breadcrumb.vue';
    import request from '@/http/http';
    import region from '@/components/common/Region.vue';
    import { myMixinTable } from '@/JS/commom';

    export default {
        components: { vBreadcrumb, region },
        mixins: [myMixinTable],
        data() {
            var isPhone = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请输入仓库负责人手机号'));
                } else {
                    const reg = /^1[3-8]\d{9}$/;
                    if (!reg.test(value)) {
                        callback(new Error('请输入正确的手机号格式'));
                    } else {
                        callback();
                    }
                }
            };
            var isMobile = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请输入退货仓联系方式'));
                } else {
                    const reg = /^((0\d{2,3}-?\d{7,8})|(1[3-8]\d{9}))$/;
                    if (!reg.test(value)) {
                        callback(new Error('请输入正确的联系方式'));
                    } else {
                        callback();
                    }
                }
            };
            var isMobile2 = (rule, value, callback) => {
                if (value) {
                    const reg = /^((0\d{2,3}-?\d{7,8})|(1[3-8]\d{9}))$/;
                    if (!reg.test(value)) {
                        callback(new Error('请输入正确的联系方式'));
                    } else {
                        callback();
                    }
                } else {
                    callback();
                }
            };
            var isCode = (rule, value, callback) => {
                if (value) {
                    const reg = /^[0-9]*$/;
                    if (!reg.test(value)) {
                        callback(new Error('请输入数字'));
                    } else {
                        callback();
                    }
                } else {
                    callback();
                }
            };
            return {
                nav: ['云仓仓库管理', '入库单', '新建入库单'],
                id: '',
                form: {
                    type: '',
                    deliverWarehouseName: '',
                    deliverWarehouseCode: '',
                    receiveWarehouseName: '',
                    receiveWarehouseCode: '',
                    receiveWarehouseAddress: '',
                    contactUserName: '',
                    contactPhone: '',
                    goodsSenderName: '',
                    goodsSenderPhone: '',
                    remark: '',
                    productName: '',
                    prodCode: '',
                    supplierCode: '',
                    supplierName: '',
                    spuList: []
                },
                tableData: [],
                type: '', // 1.添加 2.编辑
                rules: {
                    type: [
                        { required: true, message: '请选择仓库类型', trigger: 'blur' }
                    ],
                    deliverWarehouseName: [
                        { required: true, message: '请输入出库方名称', trigger: 'blur' }
                    ],
                    // deliverWarehouseCode: [
                    //     { validator: isCode, trigger: 'blur' }
                    // ],
                    receiveWarehouseName: [
                        { required: true, message: '请输入入库方名称或编码', trigger: 'blur' }
                    ],
                    receiveWarehouseCode: [
                        { required: true, message: '请输入入库方名称或编码', trigger: 'blur' }
                    ],
                    receiveWarehouseAddress: [
                        { required: true, message: '请输入入库地址', trigger: 'blur' }
                    ],
                    contactUserName: [
                        { required: true, message: '请输入入库单填写人', trigger: 'blur' }
                    ],
                    contactPhone: [
                        { required: true, message: '请输入联系方式', trigger: 'blur' },
                        { validator: isPhone, trigger: 'blur' }
                    ],
                    goodsSenderPhone: [
                        { validator: isMobile2, trigger: 'blur' }
                    ]
                },
                btnLoading: false,
                receiveWarehouseAddress: '',
                mask: false,
                chooseLists: [{ prodCode: '', productId: '', skuList: [] }], // 产品列表
                prodCode: '', // 编辑数量选中的产品code
                productIds: [], // 添加的产品ids
                productId: '', // 编辑数量选中的产品id
                isIndex: 0, // 编辑过数量的索引值
                chooseData: [], // 当前选中的规格数据
                headData: []// 规格表头
            };
        },
        activated() {
            this.id = this.$route.query.reportId || sessionStorage.getItem('reportId');
            this.type = this.$route.query.type == 'add' ? 1 : 2;
            this.getInfo();
            this.getList(this.page.currentPage);
        },
        methods: {
            getList(val) {
                const data = {
                    supplierName: this.form.supplierName,
                    productName: this.form.productName,
                    supplierCode: this.form.supplierCode,
                    prodCode: this.form.prodCode,
                    page: val,
                    pageSize: this.page.pageSize
                };
                this.page.currentPage = val;
                request.SPUList(data).then(res => {
                    this.tableData = res.data.data;
                    this.page.totalPage = res.data.totalNum;
                }).catch(err => {
                    console.log(err);
                    this.btnLoading = false;
                });
            },
            // 重置表单
            resetForm(formName) {
                this.form.supplierName = '';
                this.form.productName = '';
                this.form.supplierCode = '';
                this.form.prodCode = '';
                this.getList(this.page.currentPage);
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (!valid) return;
                    const data = this.form;
                    if (this.status == 2) {
                        data.id = this.id;
                    }
                    if (this.chooseLists[0].skuList.length===0) {
                        return this.$message.warning('请添加产品');
                    }
                    data.spuList = [];
                    this.chooseLists.forEach((v, k) => {
                        const temp = {
                            productId: v.productId,
                            skuList: []
                        };
                        v.skuList.forEach((v1, k1) => {
                            v1.productId = v.productId;
                            v1.productSpecPriceId = v1.id;
                        });
                        temp.skuList = v.skuList;
                        data.spuList.push(temp);
                    });
                    this.btnLoading = true;
                    request.addOrUpdateReport(data).then(res => {
                        this.$message.success(res.msg);
                        this.$router.push('/repertoryReportList');
                        this.btnLoading = false;
                    }).catch(err => {
                        console.log(err);
                        this.btnLoading = false;
                    });
                });
            },
            getInfo() {
                this.resetValue();
                if (this.type == 1) {
                    this.nav[2] = '新建入库单';
                } else {
                    this.nav[2] = '编辑入库单';
                    this.getDetail();
                }
                this.form.contactUserName = localStorage.getItem('ms_username');
                this.form.contactPhone = localStorage.getItem('ms_userPhone');
                this.form.contactUserId = localStorage.getItem('ms_userID');
            },
            resetValue() {
                this.form = {
                    type: '',
                    deliverWarehouseName: '',
                    deliverWarehouseCode: '',
                    receiveWarehouseName: '',
                    receiveWarehouseCode: '',
                    receiveWarehouseAddress: '',
                    contactUserName: '',
                    contactPhone: '',
                    goodsSenderName: '',
                    goodsSenderPhone: '',
                    remark: '',
                    productName: '',
                    prodCode: '',
                    supplierCode: '',
                    supplierName: '',
                    spuList: []
                };
                this.chooseLists = [{ prodCode: '', productId: '', skuList: [] }];
                this.productIds = [];
                this.productId = '';
                this.prodCode = '';
                this.isIndex = 0;
            },
            getDetail() {
                const data = {
                    id: this.id
                };
                this.chooseLists = [];
                request.getNoteById(data).then(res => {
                    this.form = res.data;
                    if (res.data.spuList.length) {
                        res.data.spuList.forEach((v, k) => {
                            v.skuList.forEach((v1, k1) => {
                                v1.id = v1.productSpecPriceId;
                            });
                            this.productIds.push(v.productId);
                            this.chooseLists.push(v);
                        });
                    } else {
                        this.chooseLists = [{ prodCode: '', productId: '', skuList: [] }];
                    }
                }).catch(err => {
                    console.log(err);
                });
            },

            // 取消
            cancel() {
                this.$router.push('/repertoryReportList');
            },
            querySearchAsync(queryString, cb) {
                if (queryString == '') {
                    return;
                }
                request.findWarehouseLike({ 'keyword': this.form.receiveWarehouseName }).then(res => {
                    const tmpArr = [];
                    res.data.forEach((v, k) => {
                        const o = {};
                        o.value = `${v.name} 仓库编码：${v.code}`;
                        o.code = v.code;
                        o.name = v.name;
                        o.type = v.type;
                        o.receiveWarehouseAddress = v.address;
                        o.id = v.id;
                        tmpArr.push(o);
                    });
                    cb(tmpArr);
                });
            },
            handleSelect(item) {
                this.$set(this.form, 'receiveWarehouseCode', item.code);
                this.$set(this.form, 'receiveWarehouseName', item.name);
                this.$set(this.form, 'receiveWarehouseAddress', item.receiveWarehouseAddress);
                this.$set(this.form, 'receiveWarehouseId', item.id);
            },
            save() {
                this.chooseLists[this.isIndex].skuList = [];
                let flag = true;
                this.chooseData.forEach((v, k) => {
                    if (v.estimateCount) {
                        if (!/^[1-9]*[1-9][0-9]*$/.test(v.estimateCount)) {
                            this.$message.warning('数量请输入正整数');
                            flag = false;
                        } else {
                            this.chooseLists[this.isIndex].skuList.push(v);
                            this.chooseLists[this.isIndex].prodCode = v.prodCode;
                            this.chooseLists[this.isIndex].productId = v.productId;
                        }
                    }
                    this.productIds[this.isIndex] = this.productId;
                });
                if (flag) {
                    this.mask = false;
                }
                this.isIndex = 0;
            },
            // 编辑数量
            editNumber(row) {
                this.mask = true;
                const data = {
                    productId: row.id,
                    page: 1,
                    pageSize: 10000
                };
                let flag = true;
                this.productIds.forEach((v, k) => {
                    if (row.id == v) {
                        this.isIndex = k;
                        flag = false;
                    }
                });

                if (this.productIds.length && flag) {
                    this.isIndex = this.productIds.length;
                    this.chooseLists.push({
                        prodCode: '',
                        productId: '',
                        skuList: []
                    });
                }
                this.prodCode = row.prodCode;
                this.productId = row.id;
                this.chooseData = [];
                request.SKUList(data).then(res => {
                    res.data.data.forEach((v, k) => {
                        v.prodCode = row.prodCode;
                        v.productId = row.id;
                        this.productIds.forEach((v1, k1) => {
                            // if (v1 == row.prodCode) {
                            if (v1 == row.id) {
                                this.chooseLists[k1].skuList.forEach((v2, k2) => {
                                    if (v2.id == v.id) {
                                        v.estimateCount = this.chooseLists[k1].skuList[k2].estimateCount;
                                    }
                                });
                            }
                        });
                        this.chooseData.push(v);
                        this.headData = [];
                        if (!v.specifies || !v.specifyValues) return;
                        const specs = v.specifies.split('-');
                        const specValues = v.specifyValues.split('-');
                        specs.forEach((v1, k1) => {
                            const temp = {
                                value: v1,
                                name: v1
                            };
                            this.headData.push(temp);
                            this.chooseData[k][v1] = specValues[k1];
                        });
                    });
                }).catch(err => {
                    console.log(err);
                });
            },
            // 删除已选择产品 index对应packageList索引值 cIndex对应packageList[index].skuList索引值
            delSelectedPro(cIndex, index) {
                this.chooseLists[index].skuList.splice(cIndex, 1);
                if (!this.chooseLists[index].skuList.length) {
                    this.chooseLists.splice(index, 1);
                }
            }
        }
    };
</script>

<style lang="less" scoped>
.report-set{
    .title{
        width: 100%;
        height: 60px;
        background-color: #f7f7f7;
        line-height: 60px;
        padding: 0 20px;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        margin-bottom: 20px;
    }
    /deep/.el-form-item{
        width: 33%;
        display: inline-block;
    }
    .spec{
        width: 100%;
    }
    /deep/.el-dialog {
        border-radius: 10px;
        overflow: auto;
        .el-dialog__header {
            border-bottom: 1px solid #eee;
            padding: 20px 20px 10px 50px;
            .el-dialog__title {
                color: #ff6868;
            }
        }
        .el-dialog__body{
            max-height: 500px;
            overflow-y: auto;
        }
        .el-input-number--small{
            width: 70px;
            margin-right: 5px;
        }
    }
    .inp{
        width: 300px;
    }
    .inp-textarea,/deep/.el-textarea__inner{
        resize: none;
        width: 300px;
        height: 150px;
    }
    .selected-product {
        border-collapse: collapse;
        text-align: center;
        margin-top: 50px;
        width: 60%;
        border: 1px solid #ebeef5;
        border-radius: 5px;
        font-size: 14px;
        th, td {
            border: 1px solid #ebeef5;
            height: 55px;
        }
    }
}
</style>
