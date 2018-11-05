<template>
    <div class="repertory-set">
        <v-breadcrumb :nav='nav'></v-breadcrumb>
        <el-card>
            <el-form :model="form" :rules="rules" ref="form" label-width="120px">
                <el-form-item prop="type" label="仓库类型">
                    <el-select v-model="form.type" placeholder="请选择仓库类型" class="inp">
                        <el-option value="1" label="自建仓">自建仓</el-option>
                        <el-option value="2" label="加盟仓">加盟仓</el-option>
                        <el-option value="3" label="供应商仓">供应商仓</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="supplierCode" label="供应商ID" v-if="form.type==3">
                    <el-autocomplete class="inp" placeholder="请输入供应商ID" v-model="form.supplierCode" :fetch-suggestions="querySearchAsyncById" @select="handleSelect"></el-autocomplete>
                </el-form-item>
                <el-form-item prop="supplierName" label="供应商名称" v-if="form.type==3">
                    <el-autocomplete class="inp" placeholder="请输入供应商名称" v-model="form.supplierName" :fetch-suggestions="querySearchAsyncByName" @select="handleSelect"></el-autocomplete>
                </el-form-item>
                <el-form-item prop="joinWarehouseType" label="加盟仓类型" v-if="form.type==2">
                    <el-select v-model="form.joinWarehouseType" placeholder="请选择加盟仓类型" class="inp">
                        <el-option value="1" label="百世汇通">百世汇通</el-option>
                        <el-option value="2" label="顺丰">顺丰</el-option>
                        <el-option value="3" label="申通">申通</el-option>
                        <el-option value="4" label="韵达">韵达</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="code" label="仓库编码">
                    <el-input class="inp" v-model="form.code" placeholder="请输入仓库编码"></el-input>
                </el-form-item>
                <el-form-item prop="name" label="仓库名称">
                    <el-input class="inp" v-model="form.name" placeholder="请输入仓库名称"></el-input>
                </el-form-item>
                <el-form-item prop="manager" label="仓库负责人">
                    <el-input class="inp" v-model="form.manager" placeholder="请输入仓库负责人"></el-input>
                </el-form-item>
                <el-form-item prop="managerPhone" label="仓库负责人手机号">
                    <el-input class="inp" v-model="form.managerPhone" placeholder="请输入仓库负责人手机号"></el-input>
                </el-form-item>
                <el-form-item prop="address" label="仓库地址">
                    <region @regionMsg='getRepertoryRegion' :regionMsg='address' ref="1"></region>
                    <div style="margin-top: 10px">
                        <el-input type="textarea" class="inp-textarea" placeholder="请输入详细地址" v-model="form.address"></el-input>
                    </div>
                </el-form-item>
                <el-form-item prop="sendGoods" label="是否能发货">
                    <el-radio-group v-model="form.sendGoods">
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="2">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item prop="returnGoods" label="是否为退货仓">
                    <el-radio-group v-model="form.returnGoods">
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="2">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item prop="returnManager" label="退货仓联系人名称" v-if="form.returnGoods==1">
                    <el-input class="inp" v-model="form.returnManager" placeholder="请输入退货仓联系人名称"></el-input>
                </el-form-item>
                <el-form-item prop="returnContact" label="退货仓联系方式" v-if="form.returnGoods==1">
                    <el-input class="inp" v-model="form.returnContact" placeholder="请输入退货仓联系方式"></el-input>
                </el-form-item>
                <el-form-item prop="returnWarehouseAddress" label="退货仓仓库地址" v-if="form.returnGoods==1">
                    <region @regionMsg='getRegion' :regionMsg='returnWarehouseAddress' ref="2"></region>
                    <div style="margin-top: 10px">
                        <el-input type="textarea" class="inp-textarea" placeholder="请输入详细地址" v-model="form.returnWarehouseAddress"></el-input>
                    </div>
                </el-form-item>
                <el-form-item prop="remark" label="备注">
                    <el-input type="textarea" class="inp-textarea" v-model="form.remark" maxlength="180" placeholder="请填写备注"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" :loading="btnLoading" @click="submitForm('form')">提 交</el-button>
                    <el-button type="success" @click="cancel">取 消</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script>
    import vBreadcrumb from '@/components/common/Breadcrumb.vue';
    import request from '@/http/http';
    import region from '@/components/common/Region.vue';

    export default {
        components: { vBreadcrumb, region },
        data() {
            var ismanagerPhone = (rule, value, callback) => {
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
            return {
                nav: ['云仓仓库管理', '仓库管理', '新建仓库'],
                id: '',
                keyword: '',
                form: {
                    type: '',
                    supplierCode: '',
                    supplierName: '',
                    code: '',
                    name: '',
                    manager: '',
                    managerPhone: '',
                    sendGoods: 1,
                    returnGoods: 1,
                    returnManager: '',
                    returnContact: '',
                    address: '',
                    returnWarehouseAddress: '',
                    remark: ''
                },
                tableData: [],
                type: '', // 1.添加 2.编辑
                rules: {
                    type: [
                        { required: true, message: '请选择仓库类型', trigger: 'blur' }
                    ],
                    supplierCode: [
                        { required: true, message: '请输入供应商ID', trigger: 'blur' }
                    ],
                    supplierName: [
                        { required: true, message: '请输入供应商名称', trigger: 'blur' }
                    ],
                    code: [
                        { required: true, message: '请输入仓库编码', trigger: 'blur' }
                    ],
                    name: [
                        { required: true, message: '请输入仓库名称', trigger: 'blur' }
                    ],
                    manager: [
                        { required: true, message: '请输入仓库负责人', trigger: 'blur' }
                    ],
                    managerPhone: [
                        { required: true, message: '请输入仓库负责人手机号', trigger: 'blur' },
                        { validator: ismanagerPhone, trigger: 'blur' }
                    ],
                    address: [
                        { required: true, message: '请输入仓库地址', trigger: 'blur' }
                    ],
                    returnWarehouseAddress: [
                        { required: true, message: '请输入退货仓仓库地址', trigger: 'blur' }
                    ],
                    sendGoods: [
                        { required: true, message: '请选择是否能发货', trigger: 'blur' }
                    ],
                    returnGoods: [
                        { required: true, message: '请选择是否为退货仓', trigger: 'blur' }
                    ],
                    returnManager: [
                        { required: true, message: '请输入联系人名称', trigger: 'blur' }
                    ],
                    returnContact: [
                        { required: true, message: '请输入退货仓联系方式', trigger: 'blur' },
                        { validator: isMobile, trigger: 'blur' }
                    ]
                },
                btnLoading: false,
                address: '',
                returnWarehouseAddress: '',
                num: ''
            };
        },
        activated() {
            this.id = this.$route.query.repertoryId || sessionStorage.getItem('repertoryId');
            this.type = this.$route.query.type == 'add' ? 1 : 2;
            this.getInfo();
        },
        methods: {
            querySearchAsyncById(queryString, cb) {
                if (queryString == '') {
                    return;
                }
                request.findSupplierLike({ 'keyword': this.form.supplierCode }).then(res => {
                    const tmpArr = [];
                    res.data.forEach((v, k) => {
                        const o = {};
                        o.value = `${v.supplierName} 供应商ID：${v.supplierCode}`;
                        o.supplierId = v.supplierId;
                        o.supplierName = v.supplierName;
                        o.supplierCode = v.supplierCode;
                        tmpArr.push(o);
                    });
                    cb(tmpArr);
                });
            },
            querySearchAsyncByName(queryString, cb) {
                if (queryString == '') {
                    return;
                }
                request.findSupplierLike({ 'keyword': this.form.supplierName }).then(res => {
                    const tmpArr = [];
                    res.data.forEach((v, k) => {
                        const o = {};
                        o.value = `${v.supplierName} 供应商ID：${v.supplierCode}`;
                        o.supplierId = v.supplierId;
                        o.supplierName = v.supplierName;
                        o.supplierCode = v.supplierCode;
                        tmpArr.push(o);
                    });
                    cb(tmpArr);
                });
            },
            handleSelect(item) {
                this.$set(this.form, 'supplierId', item.supplierId);
                this.$set(this.form, 'supplierName', item.supplierName);
                this.$set(this.form, 'supplierCode', item.supplierCode);
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (!valid) return;
                    const data = this[formName];
                    if (this.type == 2) {
                        data.id = this.id;
                    }
                    if (!this.address) {
                        return this.$message.warning('请选择仓库省市区');
                    }
                    if (this.form.returnWarehouseAddress && !this.returnWarehouseAddress) {
                        return this.$message.warning('请选择退货仓仓库省市区');
                    }
                    data.sendGoods = data.sendGoods == 1;
                    data.returnGoods = data.returnGoods == 1;
                    if (!data.returnGoods) {
                        data.returnManager = '';
                        data.returnContact = '';
                        data.returnProvinceCode = '';
                        data.returnCityCode = '';
                        data.returnDistrictCode = '';
                        data.returnProvinceName = '';
                        data.returnCityName = '';
                        data.returnDistrictName = '';
                        data.returnWarehouseAddress = '';
                    }
                    this.btnLoading = true;
                    request.addOrUpdateRepertory(data).then(res => {
                        this.$message.success(res.msg);
                        this.$router.push('/repertoryList');
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
                    this.nav[2] = '新建仓库';
                } else {
                    this.nav[2] = '编辑仓库';
                    this.getDetail();
                }
            },
            resetValue() {
                this.form = {
                    type: '',
                    supplierCode: '',
                    supplierName: '',
                    code: '',
                    name: '',
                    manager: '',
                    managerPhone: '',
                    sendGoods: 1,
                    returnGoods: 1,
                    returnManager: '',
                    returnContact: '',
                    address: '',
                    addressProvinceCode: '',
                    addressCityCode: '',
                    addressDistrictCode: '',
                    returnProvinceCode: '',
                    returnCityCode: '',
                    returnDistrictCode: '',
                    returnWarehouseAddress: '',
                    remark: ''
                };
            },
            getDetail() {
                const data = {
                    id: this.id
                };
                request.queryRepertoryById(data).then(res => {
                    this.form = res.data;
                    this.form.type = res.data.type.toString();
                    this.form.sendGoods = res.data.sendGoods ? 1 : 2;
                    this.form.returnGoods = res.data.returnGoods ? 1 : 2;
                    const reginArr = [];
                    reginArr.push(res.data.addressProvinceCode, res.data.addressCityCode, res.data.addressDistrictCode);
                    this.address = reginArr;
                    if (res.data.ruturnGoods) {
                        const reginArr2 = [];
                        reginArr2.push(res.data.returnProvinceCode, res.data.returnCityCode, res.data.returnDistrictCode);
                        this.returnWarehouseAddress = reginArr2;
                    }
                }).catch(err => {
                    console.log(err);
                });
            },
            // 获取省市区
            getRegion(msg) {
                this.returnWarehouseAddress = msg;
                this.form.returnProvinceCode = this.returnWarehouseAddress[0];
                this.form.returnCityCode = this.returnWarehouseAddress[1];
                this.form.returnDistrictCode = this.returnWarehouseAddress[2];
            },
            getRepertoryRegion(msg) {
                this.address = msg;
                this.form.addressProvinceCode = this.address[0];
                this.form.addressCityCode = this.address[1];
                this.form.addressDistrictCode = this.address[2];
            },
            // 取消
            cancel() {
                this.$router.push('/repertoryList');
            }
        }
    };
</script>

<style lang="less" scoped>
.repertory-set{
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
    }
    .inp{
        width: 300px;
    }
    .inp-textarea,/deep/.el-textarea__inner{
        resize: none;
        width: 300px;
        height: 150px;
    }
}
</style>
