<template>
    <div class="report-set">
        <v-breadcrumb :nav='nav'></v-breadcrumb>
        <el-card>
            <el-form :model="form" :rules="rules" ref="form" label-width="120px">
                <div class="title">基础信息</div>
                <el-form-item prop="type" label="类型">
                    <el-select v-model="form.type" placeholder="请选择仓库类型" class="inp">
                        <el-option value="1">采购入库</el-option>
                        <el-option value="2">调拨入库</el-option>
                        <el-option value="3">盘盈入库</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="supplierId" label="出库方">
                    <el-input class="inp" v-model="form.supplierId" placeholder="请输入出库方名称"></el-input>
                </el-form-item>
                <el-form-item prop="supplierName" label="出库仓库编码">
                    <el-input class="inp" v-model="form.supplierName" placeholder="请输入出库仓库编码"></el-input>
                </el-form-item>
                <el-form-item prop="code" label="入库方">
                    <el-autocomplete class="inp" v-model="form.code" :fetch-suggestions="querySearchAsync" @select="handleSelect" placeholder="请输入入库方名称或编码"></el-autocomplete>
                </el-form-item>
                <el-form-item prop="name" label="入库仓库编码">
                    <el-input class="inp" v-model="form.name" disabled=""></el-input>
                </el-form-item>
                <el-form-item prop="user" label="入库地址">
                    <el-input class="inp" v-model="form.user" disabled=""></el-input>
                </el-form-item>
                <el-form-item prop="phone" label="入库单填写人">
                    <el-input class="inp" v-model="form.phone" disabled=""></el-input>
                </el-form-item>
                <el-form-item prop="linkName" label="联系方式">
                    <el-input class="inp" v-model="form.linkName" placeholder="请输入联系方式"></el-input>
                </el-form-item>
                <el-form-item prop="linkPhone" label="送货人姓名">
                    <el-input class="inp" v-model="form.linkPhone" placeholder="请输入送货人姓名"></el-input>
                </el-form-item>
                <el-form-item prop="linkPhone" label="送货人联系方式" class="spec">
                    <el-input class="inp" v-model="form.linkPhone" placeholder="请输入送货人联系方式"></el-input>
                </el-form-item>
                <el-form-item prop="remark" label="备注">
                    <el-input type="textarea" class="inp-textarea" v-model="form.remark" maxlength="180" placeholder="请填写备注"></el-input>
                </el-form-item>
                <div class="title">入库货物信息</div>
                <el-form-item prop="supplierId" label="产品名称">
                    <el-input class="inp" v-model="form.supplierId" placeholder="请输入产品名称"></el-input>
                </el-form-item>
                <el-form-item prop="supplierName" label="产品ID">
                    <el-input class="inp" v-model="form.supplierName" placeholder="请输入产品ID"></el-input>
                </el-form-item>
                <el-form-item prop="code" label="经销商ID">
                    <el-input class="inp" v-model="form.code" placeholder="请输入经销商ID"></el-input>
                </el-form-item>
                <el-form-item prop="name" label="经销商名称">
                    <el-input class="inp" v-model="form.name" placeholder="请输入经销商名称"></el-input>
                </el-form-item>
                <el-form-item label="">
                    <el-button type="primary" @click="getData">搜索</el-button>
                    <el-button @click="resetForm('form')">重置</el-button>
                </el-form-item>
                <el-table :data="tableData" border>
                    <el-table-column type="index" label="序号" align="center"></el-table-column>
                    <el-table-column prop="id" label="产品名称" align="center"></el-table-column>
                    <el-table-column prop="name" label="产品类目" align="center"></el-table-column>
                    <el-table-column prop="type" label="产品ID" align="center"></el-table-column>
                    <el-table-column prop="type" label="供应商ID" align="center"></el-table-column>
                    <el-table-column prop="supplierId" label="供应商名称" align="center"></el-table-column>
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
                <table class="selected-product" v-for="(item,index) in chooseists" :key="index">
                    <tr v-for="(v,k) in item.productLists" :key="k">
                        <td v-if="k==0" :rowspan="item.productLists.length" style="width: 50px">{{index+1}}</td>
                        <td>{{(v.productName || '')+(v.spec || '')}}</td>
                        <td>产品ID：{{v.productCode}}</td>
                        <td style="min-width:100px">x1</td>
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
           <el-table border :data="tableData">
               <el-table-column prop="name" label="产品名称" align="center"></el-table-column>
               <el-table-column prop="name" label="商品唯一码" align="center"></el-table-column>
               <el-table-column prop="name" label="颜色" align="center"></el-table-column>
               <el-table-column prop="name" label="版本" align="center"></el-table-column>
               <el-table-column prop="name" label="规格" align="center"></el-table-column>
               <el-table-column prop="name" label="类型" align="center"></el-table-column>
               <el-table-column prop="name" label="采购数" align="center">
                   <template slot-scope="scope">
                       <el-input-number :min="0" :controls="false"></el-input-number>件
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
            return {
                nav: ['云仓仓库管理', '入库单', '新建入库单'],
                id: '',
                url: '',
                form: {
                    type: '',
                    supplierId: '',
                    supplierName: '',
                    code: '',
                    name: '',
                    user: '',
                    phone: '',
                    send: 1,
                    back: 1,
                    linkName: '',
                    linkPhone: '',
                    remark: ''
                },
                tableData: [{
                    name: '111'
                }],
                type: '', // 1.添加 2.编辑
                rules: {
                    type: [
                        { required: true, message: '请选择仓库类型', trigger: 'blur' }
                    ],
                    supplierId: [
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
                    user: [
                        { required: true, message: '请输入仓库负责人', trigger: 'blur' }
                    ],
                    phone: [
                        { required: true, message: '请输入仓库负责人手机号', trigger: 'blur' },
                        { validator: isPhone, trigger: 'blur' }
                    ],
                    address: [
                        { required: true, message: '请输入仓库地址', trigger: 'blur' }
                    ],
                    send: [
                        { required: true, message: '请选择是否能发货', trigger: 'blur' }
                    ],
                    back: [
                        { required: true, message: '请选择是否为退货仓', trigger: 'blur' }
                    ],
                    linkName: [
                        { required: true, message: '请输入联系人名称', trigger: 'blur' }
                    ],
                    linkPhone: [
                        { required: true, message: '请输入退货仓联系方式', trigger: 'blur' },
                        { validator: isMobile, trigger: 'blur' }
                    ]
                },
                btnLoading: false,
                address: '',
                mask: false,
                chooseists: []
            };
        },
        activated() {
            this.id = this.$route.query.repertoryId || sessionStorage.getItem('repertoryId');
            this.type = this.$route.query.type == 'add' ? 1 : 2;
            this.getInfo();
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (!valid) return;
                    const data = this.form;
                    if (this.status == 2) {
                        data.id = this.id;
                    }
                    this.btnLoading = true;
                    request[this.url](data).then(res => {
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
                    this.nav[2] = '新建入库单';
                    this.url = 'addScratchCard';
                } else {
                    this.nav[2] = '编辑入库单';
                    this.url = 'updateScratchCard';
                    this.getDetail();
                }
            },
            resetValue() {
                this.form = {
                    type: '',
                    supplierId: '',
                    supplierName: '',
                    code: '',
                    name: '',
                    user: '',
                    phone: '',
                    send: 1,
                    back: 1,
                    linkName: '',
                    linkPhone: '',
                    remark: ''
                };
            },
            getDetail() {
                const data = {
                    id: this.id
                };
                request.findScratchCardById(data).then(res => {
                    this.form = res.data;
                    this.tableData = res.data.scratchCardPrize;
                    this.tableData.forEach((v, k) => {
                        this.totalRatio += v.winRate;
                        this.selectedCoupon.push(v);
                    });
                }).catch(err => {
                    console.log(err);
                });
            },

            // 取消
            cancel() {
                this.$router.push('/repertoryList');
            },
            querySearchAsync(queryString, cb) {
                // if (queryString == '') {
                //     return;
                // }
                // this.checkList = [];
                // this.$axios.post(api.queryProductByNameOrCode, {condition: queryString, activityType: 3}).then(res => {
                //     let tmpArr = [];
                //     res.data.data.forEach((v, k) => {
                //         let o = {};
                //         o.value = `${v.name} 产品ID：${v.prodCode}`;
                //         o.id = v.id;
                //         o.name = v.name;
                //         o.prodCode = v.prodCode;
                //         o.productNum = v.productNum;
                //         tmpArr.push(o);
                //     });
                //     cb(tmpArr)
                // })
            },
            handleSelect(item) {
                console.log(item);
            },
            getData() {

            },
            save() {

            },
            // 编辑数量
            editNumber() {
                this.mask = true;
            },
            // 删除已选择产品 index对应packageList索引值 cIndex对应packageList[index].productLists索引值
            delSelectedPro(cIndex, index) {
                this.packageLists[index].productLists.splice(cIndex, 1);
                if (!this.packageLists[index].productLists.length) {
                    this.packageLists.splice(index, 1);
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
