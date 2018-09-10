<template>
    <div class="code-params">
        <breadcrumb :nav='nav'></breadcrumb>
        <el-card>
            <el-button type='primary' @click="addCodeParams" v-if="p.addCategoryBrandCode">添加防伪码参数</el-button>
            <el-table v-loading="tableLoading" class="w-table" stripe :data="tableData" :height="height" border
                      style="width: 100%">
                <el-table-column prop="id" label="编号" width="180" align="center"></el-table-column>
                <el-table-column prop="productName" label="产品分类" align="center"></el-table-column>
                <el-table-column prop="brandName" label="产品品牌" align="center"></el-table-column>
                <el-table-column prop="code" label="设置参数" align="center"></el-table-column>
                <el-table-column v-if="isShowOperate" label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button type="primary" v-if="p.productAllCode&&scope.row.code&&scope.row.status==1"
                                   @click='createCode(scope.row)'>生成备码
                        </el-button>
                        <el-button type="danger"
                                   v-if="p.loseCategoryBrandCode&&scope.row.code&&scope.row.status==1||scope.row.status==3"
                                   @click='lostFunc(scope.row)'>失效
                        </el-button>
                        <span v-if="scope.row.status==2">生成中</span>
                    </template>
                </el-table-column>
            </el-table>
            <!--<div class="block">-->
            <!--<el-pagination-->
            <!--background-->
            <!--@size-change="handleSizeChange"-->
            <!--@current-change="handleCurrentChange"-->
            <!--:current-page="page.currentPage"-->
            <!--layout="total, prev, pager, next, jumper"-->
            <!--:total="page.totalPage">-->
            <!--</el-pagination>-->
            <!--</div>-->
        </el-card>
        <el-dialog title="选择分类和品牌" :visible.sync="isShowDialog" width="40%">
            <div style="overflow:hidden">
                <div class="check-area">
                    <div class="title">选择一级类目</div>
                    <div>
                        <ul v-loading="loading">
                            <li v-for="(v,k) in firstList" :key="k" :class="firstIndex == k?'selected':''"
                                @click="getSecond(k,v.id)">{{v.name}}
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="check-area">
                    <div class="title">选择二级类目</div>
                    <div>
                        <ul v-loading="loading">
                            <li v-for="(v,k) in secondList" :key="k" :class="secondIndex == k?'selected':''"
                                @click="getBrand(k,v.id)">{{v.name}}
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="check-area">
                    <div class="title">选择品牌</div>
                    <div>
                        <ul v-loading="loading">
                            <li v-for="(v,k) in brandList" :key="k" :class="thirdIndex == k?'selected':''"
                                @click="chooseItem(k,v.id)">{{v.name}}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div style="margin-top:20px">
                设置参数
                <el-input style="width:300px;margin-left:20px" @blur="paramsReg" v-model="setParams"></el-input>
                <br/>
                <span style="color:red;font-size:12px;margin-left:80px">仅限4位前置防伪码，不可与之前设置的防伪码相同</span>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="confirmAdd()">确 定</el-button>
                <el-button @click="isShowDialog = false">取 消</el-button>
            </div>
        </el-dialog>
        <el-dialog title="生成备码" :visible.sync="isShowCreateCode" width="30%">
            <div style="width:100%;text-align:center;font-size:16px"><span v-if="sended">已</span>向{{showPhone}}发送验证码，请输入验证码才可以进行生成操作
            </div>
            <div style="width:100%;">
                <el-input style="width:210px;margin:5% 0 0 12%" v-model="telephoneCode" placeholder="请输入验证码"></el-input>
                <el-button @click="getCode('create')" class="code-btn" type="primary" v-if="code">获取验证码</el-button>
                <el-button class="code-btn" type="primary" v-else>{{codeTime}}s</el-button>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="confirmCreateCode">确 定</el-button>
                <el-button @click="isShowCreateCode = false">取 消</el-button>
            </div>
        </el-dialog>
        <el-dialog title="失效操作" :visible.sync="isShowlostFunc" width="30%">
            <div style="width:100%;text-align:center;font-size:16px"><span v-if="sended1">已</span>向{{showPhone}}发送验证码，请输入验证码才可以进行生成操作
            </div>
            <div style="width:100%;">
                <el-input style="width:210px;margin:5% 0 0 12%" v-model="telephoneCode1"
                          placeholder="请输入验证码"></el-input>
                <el-button @click="getCode('lost')" class="code-btn" type="primary" v-if="code1">获取验证码</el-button>
                <el-button class="code-btn" type="primary" v-else>{{codeTime1}}s</el-button>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="confirmlostFunc">确 定</el-button>
                <el-button @click="isShowlostFunc = false">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import breadcrumb from "../../common/Breadcrumb";
    import * as api from "../../../api/api.js";
    import * as pApi from '../../../privilegeList/index.js';
    import utils from '../../../utils/index.js'

    export default {
        components: {
            breadcrumb
        },
        data() {
            return {
                // 权限控制
                p: {
                    addCategoryBrandCode: false,
                    productAllCode: false,
                    loseCategoryBrandCode: false,
                },
                isShowOperate: true,

                nav: ["溯源管理", "防伪码参数设置"],
                loading: false,
                tableLoading: false,
                btnLoading: false,
                isShowDialog: false,
                isShowCreateCode: false,
                isShowlostFunc: false,
                phone: '',
                showPhone: '',
                codeTime: 0,
                code: true,
                codeTime1: 0,
                code1: true,
                telephoneCode: '',
                telephoneCode1: '',
                sended: false,
                sended1: false,
                productCode: '',
                firstIndex: -1,
                secondIndex: -1,
                thirdIndex: -1,
                setParams: '',//参数
                firstList: [],
                secondList: [],
                brandList: [],
                tableData: [],
                page: {
                    currentPage: 1,
                    totalPage: 0
                },
                id: '',
                cId: '',//产品id
                bId: ''//品牌id
            };
        },
        created() {
            let winHeight = window.screen.availHeight - 360;
            this.height = winHeight;
            this.getList();
            this.pControl();
            this.showPhone = localStorage.getItem('ms_userPhone').substring(0, 3) + '****' + localStorage.getItem('ms_userPhone').substring(7);
        },
        methods: {
            // 权限控制
            pControl() {
                for (const k in this.p) {
                    this.p[k] = utils.pc(pApi[k]);
                }
                if (!this.p.productAllCode && !this.p.loseCategoryBrandCode) {
                    this.isShowOperate = false;
                }
            },
            //获取列表
            getList() {
                let that = this;
                let data = {
                    url: pApi.getAllCategoryBrand
                };
                this.tableLoading = true;
                this.$axios
                    .post(api.getAllCategoryBrand, data)
                    .then(res => {
                        that.tableLoading = false;
                        if (res.data.code == 200) {
                            this.tableData = [];
                            this.tableData = res.data.data;
                            // this.page.totalPage = res.data.resultCount;
                        } else {
                            this.$message.error(res.data.msg);
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        that.tableLoading = false;
                    });
            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
                this.page.currentPage = val;
                this.getList(val);
            },

            // 添加防伪码参数
            addCodeParams() {
                this.isShowDialog = true;
                this.getFirst();
                this.secondList = [];
                this.brandList = [];
                this.firstIndex = -1;
                this.secondIndex = -1;
                this.thirdIndex = -1;
                this.setParams = '';
            },
            confirmAdd() {
                let that = this;
                if (!that.cId) {
                    that.$message.warning('请选择品类!');
                    return
                }
                if (!that.bId) {
                    that.$message.warning('请选择品牌!');
                    return
                }
                if (!that.setParams) {
                    that.$message.warning('请设置参数!');
                    return
                }else{
                    let reg = /^\d{4}$/;
                    if (!reg.test(that.setParams)) {
                        that.$message.warning('请输入正确的参数!');
                        return
                    }
                }
                let params = {};
                params.cId = that.cId;
                params.bId = that.bId;
                params.code = that.setParams;
                params.url = pApi.addCategoryBrandCode;
                that.$axios
                    .post(api.addCategoryBrandCode, params)
                    .then(res => {
                        if (res.data.code == 200) {
                            that.$message.success('添加成功!');
                            that.getList();
                        } else {
                            that.$message.warning(res.data.msg);
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
                that.isShowDialog = false;
            },
            paramsReg() {
                let that = this;
                let reg = /^\d{4}$/;
                if (!reg.test(that.setParams)) {
                    that.$message.warning('请输入正确的参数!');
                    return
                }
            },
            // 选择品牌
            chooseItem(index, id) {
                this.thirdIndex = index;
                this.bId = id;
            },

            // 生成备码
            createCode(row) {
                this.isShowCreateCode = true;
                this.productCode = row.code;
                this.sended = false;
                this.codeTime = 0;
                this.telephoneCode = '';
                this.phone = localStorage.getItem('ms_userPhone')
            },
            confirmCreateCode() {
                let that = this;
                if (!that.telephoneCode) {
                    that.$message.warning('手机验证码为空!');
                    return
                }
                let param = {};
                param.telephoneCode = that.telephoneCode;
                param.url = pApi.productAllCode;
                param.productCode = that.productCode;
                that.$axios.post(api.productAllCode, param)
                    .then(res => {
                        if (res.data.code == 200) {
                            that.$message.success('操作成功');
                            that.getList();
                            that.isShowCreateCode = false;
                        } else {
                            that.$message.warning(res.data.msg);
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            },

            // 失效
            lostFunc(row) {
                this.isShowlostFunc = true;
                this.id = row.id;
                this.sended1 = false;
                this.codeTime1 = 0;
                this.telephoneCode1 = '';
                this.phone = localStorage.getItem('ms_userPhone')
            },
            confirmlostFunc() {
                let that = this;
                if (!that.telephoneCode1) {
                    that.$message.warning('手机验证码为空!');
                    return
                }
                let param = {};
                param.telephoneCode = that.telephoneCode1;
                param.url = pApi.loseCategoryBrandCode;
                param.id = that.id;
                that.$axios.post(api.loseCategoryBrandCode, param)
                    .then(res => {
                        if (res.data.code == 200) {
                            that.$message.success('修改成功!');
                            that.getList();
                        } else {
                            that.$message.warning(res.data.msg);
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
                that.isShowlostFunc = false;
            },

            // 获取验证码
            getCode(type) {
                let that = this;
                if (type == 'create') {
                    that.code = false;
                    that.codeTime = 60;
                    let timer = setInterval(function () {
                        that.codeTime--;
                        if (that.codeTime <= 0) {
                            that.code = true;
                            clearInterval(timer);
                        }
                    }, 1000);
                } else {
                    this.code1 = false;
                    that.codeTime1 = 60;
                    let timer1 = setInterval(function () {
                        that.codeTime1--;
                        if (that.codeTime1 <= 0) {
                            that.code1 = true;
                            clearInterval(timer1);
                        }
                    }, 1000);
                }
                let data = {};
                data.phone = that.phone;
                data.code = 'ADMIN_SOURCE_CODE';
                this.$axios.post(api.sendSecurityCodeCode, data)
                    .then(res => {
                        if (res.data.code == 200) {
                            this.$message.success('已发送验证码');
                            if (type == 'create') {
                                that.sended = true;
                            } else {
                                that.sended1 = true;
                            }
                        } else {
                            this.$message.warning(res.data.msg);
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    })
            },
            //一级类目
            getFirst() {
                let that = this;
                let data = {};
                that.$axios
                    .post(api.getFirstList, data)
                    .then(res => {
                        if (res.data.code == 200) {
                            that.firstList = res.data.data;
                        } else {
                            that.$message.warning(res.data.msg);
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    })
            },
            //二级类目
            getSecond(index, id) {
                let that = this;
                that.firstIndex = index;
                that.secondIndex = -1;
                that.thirdIndex = -1;
                that.brandList = [];
                let data = {
                    fatherid: id,
                };
                that.loading = true;
                that.$axios
                    .post(api.getSecondList, data)
                    .then(res => {
                        that.loading = false;
                        if (res.data.code == 200) {
                            that.secondList = res.data.data;
                        } else {
                            that.$message.warning(res.data.msg);
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        that.loading = false;
                    });

            },
            //品牌
            getBrand(index, id) {
                let that = this;
                that.secondIndex = index;
                that.cId = id;
                that.bId = '';
                let data = {
                    cId: id,
                };
                that.loading = true;
                that.$axios
                    .post(api.queryCategoryBrandCid, data)
                    .then(res => {
                        that.loading = false;
                        if (res.data.code == 200) {
                            that.brandList = res.data.data;
                        } else {
                            that.$message.warning(res.data.msg);
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        that.loading = false;
                    });

            }
        }
    };
</script>
<style lang="less">
    .code-params {
        .w-table {
            margin-top: 10px;
        }
        .block {
            float: right;
            margin: 10px 0 10px 0;
        }
        .el-dialog__title {
            color: #ff6868;
        }
        .rootscode-inp {
            width: 215px;
        }
        .el-dialog__header {
            border-bottom: 1px solid #eee;
            padding: 20px 20px 10px 50px;
        }
        .el-dialog__body {
            overflow: hidden;
        }
        .check-area {
            float: left;
            width: 191px;
            font-size: 12px;
            color: #999;
            border: 1px solid #dfdfdf;
            margin-right: 10px;
            border-radius: 5px;
            .title {
                background: #eee;
                height: 28px;
                line-height: 28px;
                text-align: center;
                border-bottom: 1px solid #dfdfdf;
            }

            ul {
                line-height: 25px;
                height: 120px;
                overflow-y: auto;
                overflow-x: hidden;
            }

            ul li {
                list-style: none;
                padding-left: 10px;
                cursor: pointer;
            }
        }
        .code-btn {
            width: 92px;
            margin-left: 5%;
        }
        .selected {
            background: #409eff;
            color: #fff;
        }
    }
</style>


