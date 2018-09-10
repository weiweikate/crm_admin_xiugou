<template>
    <div class="delivery-address">
        <v-breadcrumb :nav="['运营管理','寄回地址管理']"></v-breadcrumb>
        <div class="table-block">
            <el-button type="primary" style="margin-bottom: 20px" @click="addAddress" v-if="p.addReturnAddress">添加寄回点</el-button>
            <template>
                <el-table :data="tableData" :height="height" border style="width: 100%">
                    <el-table-column type="index" label="编号" width="60" align="center"></el-table-column>
                    <el-table-column label="详细地址" align="center">
                        <template slot-scope="scope">
                            <template>{{scope.row.provinceCode}}{{scope.row.address}}</template>
                        </template>
                    </el-table-column>
                    <el-table-column prop="receiver" label="联系人" align="center"></el-table-column>
                    <el-table-column prop="recevice_phone" label="联系方式" align="center"></el-table-column>
                    <el-table-column v-if="isShowOperate" label="操作" align="center">
                        <template slot-scope="scope">
                            <el-button type="primary" size="small" v-if="scope.row.status==2&&p.updateReturnAddress_1"
                                       @click="openOrCloseItem(scope.row,1)">开启
                            </el-button>
                            <el-button type="danger" size="small" v-if="scope.row.status==1&&p.updateReturnAddress_1" @click="openOrCloseItem(scope.row,2)">关闭
                            </el-button>
                            <el-button type="warning" size="small" v-if="p.updateReturnAddress" @click="editItem(scope.row)">编辑</el-button>
                            <el-button type="danger" size="small" v-if="p.deleteReturnAddress" @click="delItem(scope.row.id)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
        </div>
        <!--添加/编辑类目弹窗-->
        <el-dialog title="添加寄回点" :visible.sync="addMask">
            <el-form v-model="addForm" label-width="100px">
                <el-form-item label="详细地址" class=" address-area">
                    <el-select v-model="addForm.country" class="small-inp" @change="changeArea">
                        <el-option label="中国" value="1">中国</el-option>
                        <!--<el-option label="海外" value="2">海外</el-option>-->
                    </el-select>
                    <div class="address">
                        <region @regionMsg='getRegion' :regionMsg='address' :isDisabled="!areaDisabled"></region>
                    </div>
                    <el-input class="lar-inp" v-model="addForm.address" placeholder="请输入详细地址" size="medium"></el-input>
                </el-form-item>
                <el-form-item label="联系人">
                    <el-input v-model="addForm.receiver" auto-complete="off" placeholder="请输入联系人"></el-input>
                </el-form-item>
                <el-form-item label="联系方式">
                    <el-input v-model="addForm.recevicePhone" auto-complete="off" placeholder="请输入联系方式"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addOrEdit('addForm')">确 认</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>
        <el-dialog title="编辑寄回点" :visible.sync="editMask">
            <el-form v-model="form" label-width="100px">
                <el-form-item label="详细地址" class=" address-area">
                    <el-select v-model="form.country" class="small-inp" @change="changeArea">
                        <el-option label="中国" value="1">中国</el-option>
                        <!--<el-option label="海外" value="2">海外</el-option>-->
                    </el-select>
                    <div class="address">
                        <region @regionMsg='getRegion' :regionMsg='address' :isDisabled="!areaDisabled"></region>
                    </div>
                    <el-input class="lar-inp" v-model="form.address" placeholder="请输入详细地址" size="medium"></el-input>
                </el-form-item>
                <el-form-item label="联系人">
                    <el-input v-model="form.receiver" auto-complete="off" placeholder="请输入联系人"></el-input>
                </el-form-item>
                <el-form-item label="联系方式">
                    <el-input v-model="form.recevicePhone" auto-complete="off" placeholder="请输入联系方式"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addOrEdit('form')">确 认</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>
        <!--删除弹窗-->
        <delete-toast :id='delId' :url='delUrl' :uri='delUri' @msg='deleteToast' v-if="isShowDelToast"></delete-toast>
    </div>
</template>

<script>
    import vBreadcrumb from '../../common/Breadcrumb.vue';
    import icon from '../../common/ico.vue';
    import region from '../../common/Region';
    import deleteToast from "../../common/DeleteToast";
    import * as api from '../../../api/OperateManage/BackAddress';
    import utils from '../../../utils/index.js'
    import * as pApi from '../../../privilegeList/OperateManage/BackAddress';

    export default {
        components: {
            vBreadcrumb, icon, region, deleteToast
        },
        data() {
            return {
                // 权限控制
                p: {
                    addReturnAddress:false,
                    updateReturnAddress:false,
                    updateReturnAddress_1:false,
                    deleteReturnAddress:false,
                },
                isShowOperate: false,

                address: '',
                form: {
                    receiver: "",
                    recevicePhone: "",
                    country:'1'
                },
                addForm: {
                    receiver: "",
                    recevicePhone: "",
                },
                addMask: false,
                editMask: false,
                id: "",
                itemId: "",
                tableData: [],
                page: {
                    currentPage: 1,
                    totalPage: 0
                },
                height: '',
                isShowDelToast: false,
                btnLoading: false,
                areaDisabled: true,
                itype: '',
                provinceCode: '',
                cityCode: '',
                areaCode: ''
            }
        },
        created() {
            let winHeight = window.screen.availHeight - 520;
            this.height = winHeight;
            this.pControl();
        },
        activated() {
            this.getList();
            this.pControl();
        },
        methods: {
            // 权限控制
            pControl() {
                for (const k in this.p) {
                    this.p[k] = utils.pc(pApi[k]);
                }
                if(this.p.addReturnAddress&&this.p.updateReturnAddress&&this.p.updateReturnAddress_1&&this.p.deleteReturnAddress){
                    this.isShowOperate=true
                }
            },
            // 获取省市区
            getRegion(msg) {
                this.address = msg;
                console.log(this.address)
            },
            //获取列表
            getList() {
                let that = this;
                let data = {
                    url: pApi.queryReturnAddressList
                };
                that.tableLoading = true;
                that.$axios
                    .post(api.queryReturnAddressList, data)
                    .then(res => {
                        if (res.data.code == 200) {
                            that.tableLoading = false;
                            that.tableData = res.data.data;
                        } else {
                            that.$message.warning(res.data.msg);
                            that.tableLoading = false;
                        }
                    })
                    .catch(err => {
                        that.tableLoading = false;
                        console.log(err)
                    })
            },
            // 添加
            addAddress() {
                this.addMask = true;
                this.addForm.receiver = '';
                this.addForm.recevicePhone = '';
                this.addForm.country = '1';
                this.addForm.address = '';
                this.itype = "add";
                this.areaDisabled = true
            },
            //详细地址选择
            changeArea() {
                if (this.itype == 'add') {
                    this.areaDisabled = this.addForm.country == 1;
                } else {
                    this.areaDisabled = this.form.country == 1;
                }
            },
            //编辑
            editItem(row) {
                this.editMask = true;
                row.country = '1';
                this.form = row;
                this.form.recevicePhone = row.recevice_phone;
                this.itemId = row.id;
                this.itype = "edit";
                // if(row.country==1){
                //     this.areaDisabled=true;
                //     let reginArr=[];
                //     reginArr.push(Number(this.form.province_code),Number(this.form.city_code),Number(this.form.area_code));
                //     this.address=reginArr;
                //     console.log(this.address)
                // }else{
                //     this.areaDisabled=false;
                //     this.address=''
                // }
                let reginArr = [];
                reginArr.push(Number(this.form.province_code), Number(this.form.city_code), Number(this.form.area_code));
                this.address = reginArr;
            },

            //添加修改确定
            addOrEdit(formName) {
                let url = "";
                let data = {};
                data.receiver = this[formName].receiver;
                data.recevicePhone = this[formName].recevicePhone;
                // data.country = this[formName].country;
                data.provinceCode = this.address[0];
                data.cityCode = this.address[1];
                data.areaCode = this.address[2];
                data.address = this[formName].address;
                if (data.country == 1) {
                    if (!this.address[0] || !this.address[1] || !this.address[2]) {
                        this.$message.warning('请选择省市区!');
                        return
                    }
                }
                if (!data.address) {
                    this.$message.warning('请输入详细地址!');
                    return
                }
                if (!data.receiver) {
                    this.$message.warning('请输入联系人!');
                    return
                }
                if (!data.recevicePhone) {
                    this.$message.warning('请输入联系方式!');
                    return
                } else {
                    let reg = /^(1[3-8]\d{9}|^\d{3}-?\d{8}|^\d{4}-?\d{7})$/;
                    if (!reg.test(data.recevicePhone)) {
                        this.$message.warning('请输入正确的联系方式!');
                        return false
                    }
                }
                if (this.itype == "add") {
                    url = api.addReturnAddress;
                    data.url = pApi.addReturnAddress;
                } else {
                    url = api.updateReturnAddress;
                    data.id = this.itemId;
                    data.url = pApi.updateReturnAddress;
                }
                this.btnLoading = true;
                this.$axios
                    .post(url, data)
                    .then(res => {
                        if (res.data.code == 200) {
                            this.$message.success(res.data.msg);
                            this.btnLoading = false;
                            this.addMask = false;
                            this.editMask = false;
                            this.getList(this.page.currentPage);
                        } else {
                            this.btnLoading = false;
                            this.$message.warning(res.data.msg);
                            this.getList(this.page.currentPage);
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            },
            //删除
            delItem(id) {
                this.delId = id;
                this.delUrl = api.deleteReturnAddress;
                this.delUri = pApi.deleteReturnAddress;
                this.isShowDelToast = true;
            },
            // 删除弹窗
            deleteToast(msg) {
                this.isShowDelToast = msg;
                this.getList();
            },
            //取消
            cancel() {
                this.addMask = false;
                this.editMask = false;
                this.getList();
            },
            //开启关闭
            openOrCloseItem(row, num) {
                let data = {
                    status: num,
                    id: row.id,
                    url: pApi.updateReturnAddress
                };
                this.$axios
                    .post(api.updateReturnAddress, data)
                    .then(res => {
                        if (res.data.code == 200) {
                            this.$message.success(res.data.msg);
                            this.getList(this.page.currentPage);
                        } else {
                            this.btnLoading = false;
                            this.$message.warning(res.data.msg);
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            }
        }
    }
</script>

<style lang="less">
    .delivery-address {
        .breadcrumb {
            position: absolute;
            width: 100%;
            top: 0;
            left: 0;
            height: 30px;
            overflow: hidden;
            background: white;
            padding-left: 40px;
            box-sizing: border-box;
        }
        .bread-item {
            line-height: 30px;
        }
        .ico {
            margin-right: 5px;
            color: #33b4ff;
            font-size: 18px;
        }
        .tab-item {
            width: 116px;
            height: 50px;
            line-height: 50px;
            border-radius: 0 0 5px 5px;
            text-align: center;
            color: #fff;
            background: #dddddd;
            display: inline-block;
            cursor: pointer;
        }
        .checked {
            background: #ff6868;
        }
        /*表格样式*/
        .table-block {
            padding: 20px 20px 60px;
            background: #fff
        }
        .block {
            float: right;
            margin-top: 10px
        }
        .content {
            padding: 40px 40px 0
        }
        .table-block .el-form-item {
            margin-bottom: 0 !important;
        }
        .search-area {
            margin-bottom: 20px
        }
        .search-area .el-input__inner {
            width: 160px
        }

        .pwd-mask {
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
                height: 305px;
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
                    height: 248px;
                    overflow: hidden;
                    padding: 30px 45px 0 45px;
                    box-sizing: border-box;
                    .del-tip {
                        position: absolute;
                        top: 30%;
                        left: 50%;
                        transform: translateX(-50%);
                        font-size: 22px;
                    }
                    .del-btn-group {
                        width: 180px;
                        display: flex;
                        justify-content: space-between;
                        position: absolute;
                        left: 50%;
                        transform: translateX(-50%);
                        bottom: 15%;
                        .del-btn {
                            background-color: #ff6868;
                        }
                    }
                }
            }
        }
        /*弹窗样式*/
        .el-dialog {
            width: 675px;
            border-radius: 10px;
        }
        .el-dialog__header {
            border-bottom: 1px solid #eee;
            padding: 20px 20px 10px 50px;
        }
        .el-dialog__title {
            color: #ff6868;
        }
        .el-dialog .el-input {
            display: inline;
        }
        .el-dialog .el-input__inner {
            width: 180px;
        }
        .el-select .el-input__inner {
            width: 200px;
        }

        .icon-area .el-input__inner {
            width: 240px;
        }
        .el-input__suffix {
            line-height: 24px;
        }

        .el-dialog__footer {
            margin-right: 30px;
        }
        .address-area {
            .address {
                margin-bottom: 10px;
                display: inline-block;
            }
            width: 100%;
            .el-input__inner {
                width: 120px
            }
            .lar-inp {
                margin-top: 20px;
                .el-input__inner {
                    width: 492px
                }
            }
        }
    }


</style>
