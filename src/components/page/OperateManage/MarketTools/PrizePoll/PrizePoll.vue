<template>
    <div class="prize-poll">
        <v-breadcrumb :nav='nav'></v-breadcrumb>
        <el-card :body-style="{ padding: '30px 45px',minHeight:'80vh' }">
            <div class="tab-content">
                <div class="search-pane">
                    <el-form :model="form" ref='form' inline label-width="100px">
                        <el-form-item prop="name" label="奖品名称">
                            <el-input v-model.trim="form.name" placeholder="请输入奖品名称"></el-input>
                        </el-form-item>
                        <el-form-item prop="style" label="奖品类型">
                            <el-select v-model="form.style" placeholder="全部">
                                <el-option
                                    v-for="item in prizeStyleList"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item prop="createUser" label="发布人">
                            <el-input v-model.trim="form.createUser" placeholder="请输入发布人"></el-input>
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
                        <el-form-item prop="status" label="奖品状态">
                            <el-select v-model="form.status" placeholder="全部">
                                <el-option
                                    v-for="item in prizeStatusList"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item prop="updateUser" label="修改人">
                            <el-input v-model.trim="form.updateUser" placeholder="请输入修改人"></el-input>
                        </el-form-item>
                        <el-form-item prop="updateDate" label="修改时间">
                            <el-date-picker
                                v-model="form.updateDate"
                                type="datetimerange"
                                format="yyyy-MM-dd"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                            >
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label=" ">
                            <el-button type="primary" @click="submitForm(1)">搜索</el-button>
                            <el-button @click="resetForm('form')">重置</el-button>
                        </el-form-item>
                    </el-form>
                </div>
                <div style="margin-bottom: 15px">
                    <el-button @click="addPrize(0)" v-if="p.addOperActivityPackage" type="primary">添加代币奖品</el-button>
                    <el-button @click="addPrize(1)" v-if="p.addOperActivityPackage" type="primary">添加积分奖品</el-button>
                    <el-button @click="addPrize(2)" v-if="p.addOperActivityPackage" type="primary">添加经验奖品</el-button>
                    <el-button @click="addPrize(3)" v-if="p.addOperActivityPackage" type="primary">添加优惠券奖品</el-button>
                    <el-button @click="addPrize(4)" v-if="p.addOperActivityPackage" type="primary">添加商品奖品</el-button>
                    <el-button @click="addPrize(5)" v-if="p.addOperActivityPackage" type="primary">添加服务商品奖品</el-button>
                </div>

                <el-table v-loading="tableLoading" border :data="tableData" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" align="center"></el-table-column>
                    <el-table-column prop="id" label="编号" min-width="50" align="center"></el-table-column>
                    <el-table-column prop="name" label="名称" align="center"></el-table-column>
                    <el-table-column prop="productCode" label="产品ID" align="center" min-width="120"></el-table-column>
                    <el-table-column prop="stockNum" label="赠送值" align="center" min-width="120"></el-table-column>
                    <el-table-column prop="categoryName" label="类型" align="center" min-width="120"></el-table-column>
                    <el-table-column prop="stockNum" label="总发放数量" align="center" min-width="120"></el-table-column>
                    <el-table-column prop="stockNum" label="剩余数量" align="center" min-width="120"></el-table-column>
                    <el-table-column label="冻结数量" align="center" min-width="120">
                        <template slot-scope="scope">
                            <span class="blue" @click="toBlockStockActivity">{{scope.row.stockNum}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="stockNum" label="已使用数量" align="center" min-width="120"></el-table-column>
                    <el-table-column label="状态" align="center">
                        <template slot-scope="scope">
                            <template v-if='scope.row.status == 1'>正常</template>
                            <template v-else-if='scope.row.status == 2'>已下架</template>
                            <template v-else-if='scope.row.status == 3'>已停用</template>
                        </template>
                    </el-table-column>
                    <el-table-column label="发布时间/发布人" align="center" min-width="120">
                        <template slot-scope="scope">
                            {{scope.row.createTime | formatDate}}<br/>{{scope.row.adminName}}
                        </template>
                    </el-table-column>
                    <el-table-column label="修改时间/修改人" align="center" min-width="120">
                        <template slot-scope="scope">
                            {{scope.row.createTime | formatDate}}<br/>{{scope.row.adminName}}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" min-width="150">
                        <template slot-scope="scope">
                            <!--不限库存/库存为0的奖品无法在增加库存-->
                            <el-button type="primary" v-if="scope.row.totalNumber==-1||scope.row.totalNumber==0" @click="addInventory(scope.row)">增加库存</el-button>
                            <el-button type="warning" v-if="scope.row.status==1" @click="endOrDelete(1,scope.row)">停用</el-button>
                            <el-button type="warning" v-if="scope.row.status==3" @click="endOrDelete(1,scope.row)">开启</el-button>
                            <!--冻结数量不为0时，无法删除-->
                            <el-button type="danger" v-if="scope.row.stockNum==0" @click="endOrDelete(0,scope.row)">删除</el-button>
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
                        <el-button slot="reference" @click="isShowPop = true" v-if="p.batchDeleteOperActivityPackage_1">
                            删除
                        </el-button>
                    </el-popover>
                </div>
            </div>
            <!--删除、停用、启用弹窗-->
            <div class="pwd-mask" v-if="showMask">
                <div class="box">
                    <div class="mask-title">
                        <icon class="ico" ico='icon-jinggao'/>
                        {{showInf[index].title}}
                    </div>
                    <div class="mask-content">
                        <div class="del-tip">
                            <div>{{showInf[index].tip}}</div>
                            <div>{{showInf[index].result}}</div>
                        </div>
                        <div class="del-btn-group">
                            <el-button :loading="btnLoading" @click="closeMask(true)" type="primary">确认</el-button>
                            <el-button @click="closeMask(false)">取消</el-button>
                        </div>
                    </div>
                </div>
            </div>
            <!--增加库存弹窗-->
            <el-dialog title="增加库存" :visible.sync="inventoryMask">
                <div style="text-align: center;line-height: 50px">现有库存{{inventory}}</div>
                <el-form>
                    <el-form-item prop="name" label="增加">
                        <el-input v-model="number" @blur="calInventory" auto-complete="off"></el-input>
                        <span>发放数量</span>
                        <div class="tip" v-if="notEnough" style="margin-left: 50px">增加数量不能大于现有库存</div>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button :loading="btnLoading" type="primary" @click="sure">提交</el-button>
                    <el-button @click="inventoryMask=false">取 消</el-button>
                </div>
            </el-dialog>
            <!--添加奖品弹窗-->
            <el-dialog :title="maskContent[index].title" :visible.sync="mask">
                <!--添加代币奖品/添加积分奖品/添加经验奖品-->
                <el-form v-model="form" label-width="120px" v-if="index==0||index==1||index==2">
                    <el-form-item label="奖品名称">
                        <el-input v-model="form.name" placeholder="请输入奖品名称" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item :label="maskContent[index].label">
                        <el-input v-model="form.upgradeExp" placeholder="请输入数值" auto-complete="off"></el-input>
                        <span>{{maskContent[index].unit}}</span>
                    </el-form-item>
                    <el-form-item label="发放数量">
                        <el-radio-group v-model="form.sendNumber">
                            <el-radio label="1" value="1">填写数量</el-radio>
                            <el-radio label="2" value="2">不限</el-radio>
                        </el-radio-group>
                        <div>
                            <el-input v-model="form.upgradeExp" :disabled="form.sendNumber=='2'" placeholder="请输入数值"
                                      auto-complete="off"></el-input>
                            <span>件</span>
                        </div>
                    </el-form-item>
                </el-form>
                <!--添加优惠卷奖品/添加商品奖品/添加服务商品奖品-->
                <el-form v-model="form" label-width="120px" v-if="index==3||index==4||index==5">
                    <el-form-item :label="maskContent[index].label">
                        <el-select v-if="index==3" v-model="form.coupon" @change="showCouponInfo(form.coupon)">
                            <el-option :value="item.name" v-for="(item,index) in couponList" :key="index">{{item.name}}</el-option>
                        </el-select>
                        <el-autocomplete v-else style='width:230px' v-model="keyWords" :fetch-suggestions="querySearchAsync"
                                         placeholder="请输入商品名称" @select="handleSelect"></el-autocomplete>
                    </el-form-item>
                    <el-form-item label="现有库存">
                        <span>{{inventory}}</span>
                        <!--<span>/{{maskContent[index].unit}}</span>-->
                    </el-form-item>
                    <el-form-item label="发放数量">
                        <el-input v-model="form.upgradeExp" placeholder="请输入数值"
                                  auto-complete="off" @blur="calInventory"></el-input>
                        <span>件</span>
                        <div class="tip">(数值必须小于现有库存)</div>
                    </el-form-item>
                </el-form>

                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="submit('form',index)">确认保存</el-button>
                    <el-button @click="mask=false">取 消</el-button>
                </div>

            </el-dialog>
        </el-card>

    </div>

</template>

<script>
    import vBreadcrumb from "@/components/common/Breadcrumb.vue";
    import * as api from "@/api/OperateManage/MarketToolsManage/index.js";
    import * as pApi from "@/privilegeList/OperateManage/MarketToolsManage/index.js";
    import utils from "@/utils/index.js";
    import moment from 'moment'

    export default {
        props: ["name"],
        components: {vBreadcrumb},

        data() {
            return {
                nav: ["运营管理",'营销工具管理', "奖品池管理"],
                // 权限控制
                p: {
                    addOperActivityPackage: false,//添加套餐
                    batchDeleteOperActivityPackage_1: false,//批量删除
                    batchDeleteOperActivityPackage_2: false,//批量下架
                    updateOperActivityPackageStatusById_1: false,//提交审核
                    updateOperActivityPackageStatusById_2: false,//通过驳回审核
                    updateOperActivityPackageStatusById_3: false,//套餐上架
                    updateOperActivityPackageStatusById_4: false,//套餐下架
                    addPackageProduct: false,// 添加产品和规格
                    updatePackageSpecValueStock: false,// 修改产品库存
                    updateOperActivityPackagePriceAndStock: false,// 修改优惠套餐价格和库存
                    findOperActivityPackageDetailsById: false,// 查看套餐详情
                    updateOperActivityPackage: false,// 编辑套餐数据
                },
                showOpr: true,//操作权限总控制

                createUserList: [],//发布人列表
                status: "",
                form: {
                    name: "",
                    style: "",
                    createUser: "",
                    releaseDate: '',
                    status: '',
                    updateUser: '',
                    updateDate: '',
                },
                //奖品类型
                prizeStyleList: [{
                    name: '全部',
                    id: ''
                }, {
                    name: '优惠券',
                    id: '1'
                }, {
                    name: '商品',
                    id: '2'
                }, {
                    name: '服务商品',
                    id: '3'
                }, {
                    name: '经验',
                    id: '4'
                }, {
                    name: '积分',
                    id: '5'
                }, {
                    name: '优惠码',
                    id: '6'
                }, {
                    name: '代币',
                    id: '7'
                }],
                //奖品状态
                prizeStatusList: [{
                    name: '全部',
                    id: ''
                }, {
                    name: '正常',
                    id: '1'
                }, {
                    name: '已下架',
                    id: '2'
                }, {
                    name: '已停用',
                    id: '3'
                }],
                tableData: [],
                tableLoading: false,
                btnLoading: false,
                isShowPop: false,//批量删除
                multipleSelection: [],
                page: {
                    currentPage: 1,
                    totalPage: 0,
                    pageSize: 20
                },
                showMask: false,//删除弹窗
                showInf: [{//弹窗文案
                    title: '删除确认',
                    tip: '是否删除该奖品？',
                    // result: '一旦删除，不能撤回',
                }, {
                    title: '停用确认',
                    tip: '是否停用该奖品？',
                    // result: '一旦结束，不能再开启',
                }, {
                    title: '启用确认',
                    tip: '是否启用该奖品？',
                    // result: '一旦下架，不能再开启',
                }],
                // index: '',//删除0结束1
                id: '',//操作id
                inventoryMask: false,//增加库存弹窗
                inventory: '',//现有库存数量
                number: '',//增加数量
                notEnough: false,//库存不足提示信息
                //添加弹窗
                mask: false,
                maskContent: [{
                    title: '代币奖品添加',
                    label: '赠送代币数',
                    unit: '枚'
                }, {
                    title: '积分奖品添加',
                    label: '赠送积分数',
                    unit: '分'
                }, {
                    title: '经验奖品添加',
                    label: '赠送经验数',
                    unit: '点'
                }, {
                    title: '优惠卷奖品添加',
                    label: '优惠卷',
                    unit: '张'
                }, {
                    title: '商品奖品添加',
                    label: '商品名称搜索',
                    unit: '件'
                }, {
                    title: '服务商品奖品添加',
                    label: '商品名称搜索',
                    unit: '件'
                }],
                index: 0,
                keyWords: "", // 关键字搜索
                keyWordsID: '',    // 关键字id
                couponList:[]//优惠券
            };
        },

        activated() {
            this.pControl();
            this.submitForm(1);
            this.getCreateUserList();//加载发布人列表
        },

        methods: {

            // 权限控制
            pControl() {
                for (const k in this.p) {
                    this.p[k] = utils.pc(pApi[k]);
                }
                if (!this.p.updateOperActivityPackageStatusById_1 && !this.p.updateOperActivityPackageStatusById_2 && !this.p.updateOperActivityPackageStatusById_3 && !this.p.updateOperActivityPackageStatusById_4 && !this.p.addPackageProduct && !this.p.updatePackageSpecValueStock && !this.p.updateOperActivityPackagePriceAndStock && !this.findOperActivityPackageDetailsById && !this.p.updateOperActivityPackage) {
                    this.showOpr = false
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
                this.form.updateDate = '';
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
                if (status == 2) {//提交审核
                    data.url = pApi.updateOperActivityPackageStatusById_1
                } else if (status == 3 || status == 4) {//通过驳回审核
                    data.url = pApi.updateOperActivityPackageStatusById_2
                } else if (status == 5) {//套餐上架
                    data.url = pApi.updateOperActivityPackageStatusById_3
                } else {//套餐下架
                    data.url = pApi.updateOperActivityPackageStatusById_4
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
            // 添加库存
            addInventory(row) {
                this.inventoryMask = true;
                this.notEnough = false;
                this.number = '';
                this.id = row.id;
                this.inventory = row.totalNumber - row.freezeNumber
            },
            //计算库存是否不足
            calInventory() {
                if (this.inventory < this.number) {
                    this.notEnough = true;
                    return false
                }
                let reg = /^[1-9]*[1-9][0-9]*$/;
                if (!reg.test(this.number)) {
                    this.$message.warning('请输入正整数!');
                    this.number == '';
                    return false
                }
                return true
            },
            sure() {
                if (this.calInventory()) {
                    let data = {
                        id: this.id,
                        freezeNumber: this.number,
                        url: pApi.operatorUpdateDepreciatelist_3
                    };
                    this.changeStatus(data)
                }
            },
            //添加奖品
            addPrize(num) {
                this.index = num;
                this.mask = true;
                this.inventory='';
                this.number='';
                if(num==3){
                    this.getAllCoupon()
                }
            },
            //保存
            submit(formName, index) {
                let url;
                switch (index) {
                    //     case 0://设置升级经验值
                    //         url = api.updateDealerLevelUpgradeExpById;
                    //         break;
                    //     case 1://设置必要条件
                    //         url = api.updateDealerLevelUpgradeConditionById;
                    //         break;
                    //     case 2://设置直接邀请条件
                    //         url = api.updateDealerLevelUpgradeExpById;
                    //         break;
                    //     case 3://设置间接邀请条件
                    //         url = api.updateDealerLevelUpgradeDirectById;
                    //         break;
                    //     case 4://设置个人交易额条件
                    //         url = api.updateDealerLevelUpgradePerSalesById;
                    //         break;
                    //     case 5://设置直接交易额条件
                    //         url = api.updateDealerLevelUpgradeDirectSalesById;
                    //         break;
                    //     case 6://设置间接交易额条件
                    //         url = api.updateDealerLevelUpgradeIndirectSalesById;
                    //         break;
                    //     case 7://设置连续交易额条件
                    //         url = api.updateDealerLevelUpgradeWeekSalesById;
                    //         break;
                    //     case 8://设置连续交易额频次条件
                    //         url = api.updateDealerLevelUpgradeWeekSalesFreqById;
                    //         break;
                    //     case 9://设置一次性交易条件
                    //         url = api.updateDealerLevelUpgradeBuyById;
                    //         break;
                    //     case 10://代币充值
                    //         url = api.updateDealerLevelUpgradeTokenCoinBuyById;
                    //         break;
                }
                let data = this[formName];
                data.id = this.id;
                let flag1 = true, flag2 = true, flag3 = true, flag4 = true;
                if (index == 0) {
                    flag1 = this.isEmpty(data.upgradeExp, false);
                    this.setIsAjax(flag1)
                } else if (index == 1) {
                    this.isChecked();
                    if (this.checked[0]) {
                        flag1 = this.isEmpty(data.upgradeCondDirectNum, true)
                    }
                    if (this.checked[1]) {
                        flag2 = this.isEmpty(data.upgradeCondIndirectNum, true)
                    }
                    if (this.checked[2]) {
                        flag3 = this.isEmpty(data.upgradeCondPerSales, false)
                    }
                    if (this.checked[3]) {
                        flag4 = this.isEmpty(data.upgradeCondGroupSales, false)
                    }
                    if (this.checked[4]) {
                        data.upgradeCondBuyGift = 1
                    } else {
                        data.upgradeCondBuyGift = 0
                    }
                    this.setIsAjax(flag1 && flag2 && flag3 && flag4);
                } else if (index == 2) {
                    // flag1=this.isEmpty(data.upgradeDirectNum,true);
                    flag2 = this.isEmpty(data.upgradeDirectPerExp, false);
                    this.setIsAjax(flag2);
                } else if (index == 3) {
                    // flag1=this.isEmpty(data.upgradeIndirectNum,true);
                    flag2 = this.isEmpty(data.upgradeIndirectPerExp, false);
                    this.setIsAjax(flag2);
                } else if (index == 4) {
                    // flag1=this.isEmpty(data.upgradePerSalesNum,false);
                    flag2 = this.isEmpty(data.upgradePerSalesOneExp, false);
                    this.setIsAjax(flag2);
                } else if (index == 5) {
                    // flag1=this.isEmpty(data.upgradeDirectSalesNum,false);
                    flag2 = this.isEmpty(data.upgradeDirectSalesOneExp, false);
                    this.setIsAjax(flag2);
                } else if (index == 6) {
                    // flag1=this.isEmpty(data.upgradeIndirectSalesNum,false);
                    flag2 = this.isEmpty(data.upgradeIndirectSalesOneExp, false);
                    this.setIsAjax(flag2);
                } else if (index == 7) {
                    flag1 = this.isEmpty(data.upgradeWeekSalesNum, false);
                    flag2 = this.isEmpty(data.upgradeWeekSalesNumExp, false);
                    this.setIsAjax(flag1 && flag2);
                } else if (index == 8) {
                    flag1 = this.isEmpty(data.upgradeWeekSalesFreq, true);
                    flag2 = this.isEmpty(data.upgradeWeekSalesFreqExp, false);
                    this.setIsAjax(flag1 && flag2);
                } else if (index == 9) {
                    flag1 = this.isEmpty(data.upgradeBuyNum, false);
                    flag2 = this.isEmpty(data.upgradeBuyNumExp, false);
                    this.setIsAjax(flag1 && flag2);
                } else if (index == 10) {
                    // flag1=this.isEmpty(data.upgradeTokenCoinBuyNum,true);
                    flag2 = this.isEmpty(data.upgradeTokenCoinBuyOneExp, false);
                    this.setIsAjax(flag2);
                }
                if (this.isAjax) {
                    this.$axios.post(url, data)
                        .then((res) => {
                            this.$message.success(res.data.msg);
                            this.mask = false;
                        }).catch((err) => {
                        console.log(err);
                    });
                }
            },

            // 模糊查询
            querySearchAsync(queryString, cb) {
                if (queryString == '') {
                    return;
                }
                this.keyWordsID = '';
                //activityType:1秒杀 2降价拍 3优惠套餐
                this.$axios.post(api.queryProductByNameOrCode, {
                    condition: queryString,
                    activityType: 1
                }).then(res => {
                    let tmpArr = [];
                    res.data.data.forEach((v, k) => {
                        let o = {};
                        o.value = `${v.name} 产品ID：${v.prodCode}`;
                        o.id = v.id;
                        o.productNum = v.productNum;
                        o.flagStatus = v.flagStatus;
                        o.name = v.name;
                        o.status = v.status;
                        o.prodCode = v.prodCode;
                        tmpArr.push(o);
                    });
                    cb(tmpArr)
                })
            },
            // 模糊查询id
            handleSelect(item) {
               this.inventory=item.productNum
            },
            //获取所有优惠券
            getAllCoupon(){
                this.$axios
                    .post(api.getDiscountCouponPage, {pageSize:10000})
                    .then(res => {
                        this.couponList=res.data.data.data;
                    })
                    .catch(err => {
                        console.log(err);
                        this.tableLoading = false;
                    });
            },
            //显示优惠券库存
            showCouponInfo(name){
                this.$axios
                    .post(api.queryDiscountCouponList, {condition:name})
                    .then(res => {
                        if(res.data.data[0].totalNumber==-1){
                            this.inventory='无限';
                        }else{
                            this.inventory=res.data.data[0].totalNumber+'张';
                        }

                    })
                    .catch(err => {
                        console.log(err);
                        this.tableLoading = false;
                    });
            },
            //跳转到冻结库存活动页面
            toBlockStockActivity(){
                this.$router.push('/blockStockActivity')
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
    .prize-poll {
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
                height: 285px;
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
                        top: 20%;
                        left: 50%;
                        transform: translateX(-50%);
                        font-size: 18px;
                        text-align: center;
                        line-height: 40px;
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
        /deep/ .el-dialog {
            width: 530px;
            border-radius: 10px;
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
            .el-input {
                width: 210px;
            }
            .el-form-item {
                margin-left: 40px;
            }
            .el-dialog__footer {
                margin-right: 30px;
            }
            .tip {
                color: #ff6868;
            }
        }
    }

</style>
