<template>
    <div class="tab-content">
        <el-button @click="addPackage" v-if="p.addOperActivityPackage" style="margin-bottom: 15px" type="primary">新建套餐
        </el-button>
        <div class="search-pane">
            <el-form :model="form" ref='form' inline label-width="100px">
                <el-form-item prop="name" label="套餐名称">
                    <el-input v-model.trim="form.name" placeholder="请输入套餐名称"></el-input>
                </el-form-item>
                <el-form-item prop="packageCode" label="套餐ID">
                    <el-input v-model.trim="form.packageCode" placeholder="请输入套餐ID"></el-input>
                </el-form-item>
                <el-form-item prop="releaseDate" label="发布时间">
                    <el-date-picker
                        v-model="form.releaseDate"
                        type="datetimerange"
                        format="yyyy-MM-dd"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item prop="createAdmin" label="发布人">
                    <el-select v-model="form.createAdmin" placeholder="全部">
                        <el-option value="">全部</el-option>
                        <el-option
                            v-for="item in createUserList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label=" ">
                    <el-button type="primary" @click="submitForm(1)">搜索</el-button>
                    <el-button @click="resetForm('form')">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <v-remark :contents="contents"></v-remark>
        <el-table v-loading="tableLoading" border :data="tableData" @selection-change="handleSelectionChange">
            <el-table-column type="selection" align="center"></el-table-column>
            <el-table-column prop="name" label="套餐产品名称" min-width="300">
                <template slot-scope="scope">
                    <div class="product-img">
                        <img :src="scope.row.imgUrl">
                    </div>
                    <p class="product-name">{{scope.row.name}}</p>
                    <p class="product-id">套餐ID：{{scope.row.packageCode}}</p>
                </template>
            </el-table-column>
            <el-table-column prop="categoryName" label="产品类目" align="center" min-width="120"></el-table-column>
            <el-table-column label="套餐价格" align="center" min-width="50">
                <template slot-scope="scope">
                    {{scope.row.originalPrice == undefined?'0':scope.row.originalPrice | formatPrice}}
                </template>
            </el-table-column>
            <el-table-column prop="productNumber" label="产品数量" align="center" min-width="50">
            </el-table-column>
            <el-table-column prop="stockNum" label="库存数量" align="center" min-width="50"></el-table-column>
            <el-table-column label="销量" align="center" min-width="50">
                <template slot-scope="scope">{{scope.row.specNum?scope.row.specNum:'0'}}</template>
            </el-table-column>
            <el-table-column label="发布时间/发布人" align="center" min-width="120">
                <template slot-scope="scope">
                    {{scope.row.upTime | formatDate}}<br/>{{scope.row.adminName}}
                </template>
            </el-table-column>
            <!--状态:0删除 1待提交 2待审核 3已驳回 4待上架 5已上架 6已下架 7待审核（上架过）8已驳回（上架过）9待上架（上架过）-->
            <el-table-column prop="" label="状态" align="center" min-width="50">
                <template slot-scope="scope">
                    <template v-if='scope.row.status == 1'>待提交</template>
                    <template v-else-if='scope.row.status == 2'>待审核</template>
                    <template v-else-if='scope.row.status == 3'>已驳回</template>
                    <template v-else-if='scope.row.status == 4'>待上架</template>
                    <template v-else-if='scope.row.status == 5'>已上架</template>
                    <template v-else-if='scope.row.status == 6'>已下架</template>
                    <template v-else-if='scope.row.status == 7'>待审核<br>(上架过)</template>
                    <template v-else-if='scope.row.status == 8'>已驳回<br>(上架过)</template>
                    <template v-else-if='scope.row.status == 9'>待上架<br>(上架过)</template>
                </template>
            </el-table-column>
            <el-table-column label="操作" min-width="150" v-if="showOpr">
                <template slot-scope="scope">
                    <div style="float: left;margin-right: 5px;width: 80px">
                        <el-button type="danger"
                                   v-if="scope.row.status==1||scope.row.status==3||scope.row.status==6||scope.row.status==8&&p.updateOperActivityPackageStatusById_1"
                                   @click="packageStatus(scope.row,2)">提交审核
                        </el-button>
                        <el-button type="danger" v-if="scope.row.status==2||scope.row.status==7&&p.updateOperActivityPackageStatusById_2"
                                   @click="packageStatus(scope.row,4)">通过审核
                        </el-button>
                        <el-button type="warning" v-if="scope.row.status==2||scope.row.status==7&&p.updateOperActivityPackageStatusById_2"
                                   @click="packageStatus(scope.row,3)">驳回审核
                        </el-button>
                        <el-button type="warning" v-if="scope.row.status==4||scope.row.status==9&&p.updateOperActivityPackageStatusById_3"
                                   @click="packageStatus(scope.row,5)">套餐上架
                        </el-button>
                        <el-button type="warning" v-if="scope.row.status==5" @click="packageStatus(scope.row,6)&&p.updateOperActivityPackageStatusById_4">套餐下架
                        </el-button>
                    </div>
                    <div style="float: left">
                        <div class="blue" v-if="scope.row.status!=2&&scope.row.status!=5&&scope.row.status!=7&&p.updateOperActivityPackage"
                             @click="editPackage(scope.row)">套餐编辑
                        </div>
                        <div class="blue" v-if="scope.row.status==1||scope.row.status==3||scope.row.status==4&&p.addPackageProduct"
                             @click="productManage(scope.row)">产品管理
                        </div>
                        <div class="blue"
                             v-if="scope.row.status==5||scope.row.status==6||scope.row.status==8||scope.row.status==9&&p.updatePackageSpecValueStock"
                             @click="addInventory(scope.row)">添加库存
                        </div>
                        <div class="blue" v-if="scope.row.status==1||scope.row.status==3||scope.row.status==4&&p.updateOperActivityPackagePriceAndStock"
                             @click="priceInventory(scope.row)">价格库存
                        </div>
                        <div class="blue" v-if="scope.row.status!=2" @click="packageInfo(scope.row)&&p.findOperActivityPackageDetailsById">查看详情</div>
                    </div>
                    <div style="clear: both"></div>
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
        <div class="operate-table">
            <el-popover placement="top" width="160" v-model="isShowPop">
                <p>确定删除吗？</p>
                <div style="text-align: right; margin: 0">
                    <el-button @click="batchOperate('0')" type="primary" size="mini">确定</el-button>
                    <el-button size="mini" type="text" @click="isShowPop = false">取消</el-button>
                </div>
                <el-button slot="reference" @click="isShowPop = true" v-if="p.batchDeleteOperActivityPackage_1">删除</el-button>
            </el-popover>
            <el-popover placement="top" width="160" v-model="isDownPop">
                <p>确定下架吗？</p>
                <div style="text-align: right; margin: 0">
                    <el-button @click="batchOperate('6')" size="mini">确定</el-button>
                    <el-button size="mini" type="text" @click="isDownPop = false">取消</el-button>
                </div>
                <el-button slot="reference" @click="isDownPop = true" v-if="p.batchDeleteOperActivityPackage_2">下架</el-button>
            </el-popover>
        </div>
    </div>
</template>

<script>
    import * as api from "@/api/OperateManage/MarketToolsManage/index.js";
    import * as pApi from "@/privilegeList/OperateManage/MarketToolsManage/index.js";
    import utils from "@/utils/index.js";
    import moment from 'moment'
    import vRemark from '@/components/common/marketTools/remark.vue'

    export default {
        props: ["name"],
        components: {vRemark},

        data() {
            return {
                contents: ['销量=成交订单总数-退款/退货订单数', '库存数量=新建套餐冻结的库存数+新增库存数'],

                // 权限控制
                p: {
                    addOperActivityPackage: false,//添加套餐
                    batchDeleteOperActivityPackage_1:false,//批量删除
                    batchDeleteOperActivityPackage_2:false,//批量下架
                    updateOperActivityPackageStatusById_1:false,//提交审核
                    updateOperActivityPackageStatusById_2:false,//通过驳回审核
                    updateOperActivityPackageStatusById_3:false,//套餐上架
                    updateOperActivityPackageStatusById_4:false,//套餐下架
                    addPackageProduct:false,// 添加产品和规格
                    updatePackageSpecValueStock:false,// 修改产品库存
                    updateOperActivityPackagePriceAndStock:false,// 修改优惠套餐价格和库存
                    findOperActivityPackageDetailsById:false,// 查看套餐详情
                    updateOperActivityPackage:false,// 编辑套餐数据
                },
                showOpr: true,//操作权限总控制

                createUserList: [],//发布人列表
                status: "",
                form: {
                    name: "",
                    packageCode: "",
                    createAdmin: "",
                    releaseDate: ''
                },
                tableData: [],
                tableLoading: false,
                isShowPop: false,//批量删除
                isDownPop: false,//批量下架
                multipleSelection: [],
                page: {
                    currentPage: 1,
                    totalPage: 0,
                    pageSize: 20
                },
            };
        },

        activated() {
            this.pControl();
            this.submitForm(1);
            this.getCreateUserList();//加载发布人列表
        },

        mounted() {
            let n = this.name;
            if (n == "allPackage") {
                this.status = "";
            } else if (n == "upPackage") {
                this.status = "5";
            } else if (n == "downProduct") {
                this.status = "6";
            } else if (n == "auditPackage") {
                this.status = "2";
            } else if (n == "submitPackage") {
                this.status = "1";
            } else if (n == "rejectPackage") {
                this.status = "3";
            }
            this.pControl();
            this.submitForm(1);
        },
        methods: {

            // 权限控制
            pControl() {
                for (const k in this.p) {
                    this.p[k] = utils.pc(pApi[k]);
                }
                if(!this.p.updateOperActivityPackageStatusById_1&&!this.p.updateOperActivityPackageStatusById_2&&!this.p.updateOperActivityPackageStatusById_3&&!this.p.updateOperActivityPackageStatusById_4&&!this.p.addPackageProduct&&!this.p.updatePackageSpecValueStock&&!this.p.updateOperActivityPackagePriceAndStock&&!this.findOperActivityPackageDetailsById&&!this.p.updateOperActivityPackage){
                    this.showOpr=false
                }
            },
            //获取发布人列表
            getCreateUserList() {
                this.$axios
                    .post(api.operatorqueyByStatus, {})
                    .then(res => {
                        this.createUserList = [];
                        this.createUserList = res.data.data;
                    })
                    .catch(err => {
                    });
            },
            //   提交表单
            submitForm(val) {
                let data = {};
                data.page = val;
                data.name = this.form.name;
                data.packageCode = this.form.packageCode;
                data.createAdmin = this.form.createAdmin;
                data.startTime = this.form.releaseDate ? moment(this.form.releaseDate[0]).format('YYYY-MM-DD') : '';
                data.endTime = this.form.releaseDate ? moment(this.form.releaseDate[1]).format('YYYY-MM-DD') : '';
                data.pageSize = this.page.pageSize;
                data.status = this.status;
                this.page.currentPage = val;
                this.tableLoading = true;
                this.$axios
                    .post(api.queryOperActivityPackagePageList, data)
                    .then(res => {
                        this.tableData = [];
                        this.tableData = res.data.data.data;
                        this.page.totalPage = res.data.data.resultCount;
                        this.tableLoading = false;
                    })
                    .catch(err => {
                        console.log(err);
                        this.tableLoading = false;
                    });
            },
            //   重置表单
            resetForm(formName) {
                this.$refs[formName].resetFields();
                this.form.releaseDate = '';
                this.submitForm(1)
            },
            // 全选
            handleSelectionChange(val) {
                let that = this;
                this.multipleSelection = [];
                val.forEach((v, k) => {
                    that.multipleSelection.push(v.id);
                });
            },
            //分页
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                this.submitForm(val);
            },
            // 新建套餐
            addPackage() {
                this.$router.push({name: "addPackage"});
            },
            // 编辑套餐
            editPackage(row) {
                sessionStorage.setItem('packageId', row.id);
                sessionStorage.setItem('packageCode', row.packageCode);
                this.$router.push({
                    name: "editPackage",
                    query: {packageId: row.id, packageCode: row.packageCode}
                });
            },
            // 价格管理
            priceInventory(row) {
                //判断是否有添加过产品，有则跳转页面，没有则给出提示
                this.$axios.post(api.queryPackageProductList, {packageCode: row.packageCode})
                    .then((res) => {
                        if (!res.data.data.length) {
                            this.$message.warning('请先编辑产品管理!');
                            return
                        }
                        sessionStorage.setItem('packageCode', row.packageCode);
                        sessionStorage.setItem('id', row.id);
                        this.$router.push({
                            name: "priceInventory",
                            query: {packageCode: row.packageCode, id: row.id}
                        });
                    }).catch((err) => {
                    console.log(err)
                });

            },
            // 库存管理
            addInventory(row) {
                sessionStorage.setItem('packageCode', row.packageCode);
                sessionStorage.setItem('id', row.id);
                this.$router.push({
                    name: "packageInventory",
                    query: {packageCode: row.packageCode, id: row.id}
                });
            },
            // 产品上架/下架/审核/提交审核
            packageStatus(row, status) {
                let data = {};
                data.id = row.id;
                if (row.status == 6 || row.status == 8) {
                    data.status = 7
                } else if (row.status == 7) {
                    if (status == 4) {
                        data.status = 9
                    } else {
                        data.status = 8
                    }
                } else {
                    data.status = status;
                }
                if(status==2){//提交审核
                    data.url=pApi.updateOperActivityPackageStatusById_1
                }else if(status==3||status==4){//通过驳回审核
                    data.url=pApi.updateOperActivityPackageStatusById_2
                }else if(status==5){//套餐上架
                    data.url=pApi.updateOperActivityPackageStatusById_3
                }else{//套餐下架
                    data.url=pApi.updateOperActivityPackageStatusById_4
                }
                this.$axios
                    .post(api.updateOperActivityPackageStatusById, data)
                    .then(res => {
                        this.$message.success(res.data.msg);
                        this.submitForm(this.page.currentPage)
                    })
                    .catch(err => {
                        console.log(err);
                    });
            },
            // 查看详情
            packageInfo(row) {
                sessionStorage.setItem('packageInfoId', row.id);
                this.$router.push({
                    name: "packageInfo",
                    query: {packageInfoId: row.id}
                });
            },
            batchOperate(status) {
                let arr = [];
                for (let i in this.multipleSelection) {
                    let temp = {
                        id: this.multipleSelection[i],
                        status: status
                    };
                    arr.push(temp)
                }
                this.$axios
                    .post(api.batchDeleteOperActivityPackage, {paramStr: JSON.stringify(arr)})
                    .then(res => {
                        this.$message.success(res.data.msg);
                        this.isShowPop = false;
                        this.isDownPop = false;
                        this.submitForm(this.page.currentPage);
                    })
                    .catch(err => {
                        console.log(err);
                        this.isShowPop = false;
                        this.isDownPop = false;
                    });
            },
            //产品管理
            productManage(row) {
                sessionStorage.setItem('packageId', row.id);
                sessionStorage.setItem('packageCode', row.packageCode);
                this.$router.push({path: '/packageProductManege', query: {packageCode: row.packageCode, id: row.id}})
            }
        },
        filters: {
            formatPrice(val) {
                return `￥${val}`;
            }
        }
    };
</script>
<style lang='less' scoped>
    .tab-content {
        .add-package {
            margin: 0 0 20px 0;
        }
        .search-pane {
            width: 100%;
            padding: 30px 0 0 0;
            margin-bottom: 20px;
            background-color: #f7f7f7;
            box-sizing: border-box;
        }
        .el-input-group__append,
        .el-input-group__prepend {
            padding: 0 4px;
        }
        .operate {
            button {
                margin-right: 10px;
                margin-top: 5px;
            }
            button:nth-child(3) {
                margin-right: 0px;
            }
        }
        .operate-table {
            margin-top: 10px;
        }
        .el-button + .el-button {
            margin-left: 0px;
        }
        .block {
            float: right;
            margin-top: 10px;
        }
        .product-img {
            display: inline-block;
            float: left;
            width: 80px;
            height: 80px;
            border: 1px solid #ddd;
            overflow: hidden;
            img {
                width: 60px;
                height: 60px;
                margin: 10px;
            }
        }
        .product-name {
            float: left;
            width: 75%;
            height: auto;
            margin: 5px 0 0 20px;
        }
        .product-id {
            float: left;
            width: 75%;
            height: auto;
            margin: 20px 0 0 20px;
        }
        .blue {
            color: #33b4ff;
            cursor: pointer;
        }
    }
</style>
