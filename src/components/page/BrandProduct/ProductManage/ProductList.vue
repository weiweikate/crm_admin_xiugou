<template>
    <div class="product-list">
        <v-breadcrumb :nav='nav'></v-breadcrumb>
        <el-card class="mb10">
            <el-form :model="form" ref='form' inline label-width="130px">
                <el-form-item prop="nameOrCode" label="商品SPU/商品名称">
                    <el-input v-model.trim="form.nameOrCode" placeholder="请输入商品SPU/商品名称"></el-input>
                </el-form-item>
                <!--<el-form-item prop="name" label="商品名称">-->
                    <!--<el-input v-model.trim="form.name" placeholder="请输入商品名称"></el-input>-->
                <!--</el-form-item>-->
                <el-form-item prop="feightTpl" label="运费模板">
                    <el-select v-model="form.feightTpl" placeholder="请选择运费模板">
                        <el-option value="" label="全部"></el-option>
                        <el-option v-for="(v, k) in freightList" :key="k" :value="v.id" :label="v.name"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="prodType" label="商品类型">
                    <el-select v-model="form.prodType" placeholder="请选择商品类型">
                        <el-option value="" label="全部"></el-option>
                        <el-option value="1" label="普通商品"></el-option>
                        <el-option value="2" label="内购商品"></el-option>
                        <!--<el-option value="3" label="虚拟商品"></el-option>-->
                        <!--<el-option value="4" label="卡券商品"></el-option>-->
                    </el-select>
                </el-form-item>
                <!--<el-form-item prop="updateUser" label="更新者">-->
                    <!--<el-input v-model.trim="form.updateUser" placeholder="模糊下拉搜索"></el-input>-->
                <!--</el-form-item>-->
                <el-form-item prop="firstCategoryId" label="一级分类">
                    <el-select v-model="form.firstCategoryId" placeholder="请选择一级分类">
                        <el-option value="" label="全部"></el-option>
                        <el-option v-for="(v, k) in firstCateList" :key="k" :value="v.id" :label="v.name"></el-option>
                    </el-select>
                </el-form-item>
                <!--<el-form-item prop="isProprietary" label="是否自营">-->
                    <!--<el-select v-model="form.isProprietary" placeholder="请选择是否自营">-->
                        <!--<el-option value="" label="全部"></el-option>-->
                        <!--<el-option value="1" label="是"></el-option>-->
                        <!--<el-option value="2" label="否"></el-option>-->
                    <!--</el-select>-->
                <!--</el-form-item>-->
                <!--<el-form-item prop="pushStatus" label="推送状态">-->
                    <!--<el-select v-model="form.pushStatus" placeholder="请选择推送状态">-->
                        <!--<el-option value="" label="全部"></el -option>-->
                        <!--<el-option value="1" label="未推送"></el-option>-->
                        <!--<el-option value="2" label="推送成功"></el-option>-->
                        <!--<el-option value="3" label="推送失败"></el-option>-->
                    <!--</el-select>-->
                <!--</el-form-item>-->
                <el-form-item prop="deliveryWare" label="发货方仓">
                    <el-select v-model="form.deliveryWare" placeholder="请选择发货方仓">
                        <el-option value="" label="全部"></el-option>
                        <el-option value="2" label="加盟仓"></el-option>
                        <el-option value="3" label="虚拟仓库"></el-option>
                        <!--<el-option value="4" label="供应商"></el-option>-->
                    </el-select>
                </el-form-item>
                <!--<el-form-item prop="deliveryWare" label="商品来源">-->
                    <!--<el-select v-model="form.deliveryWare" placeholder="请选择商品来源">-->
                        <!--<el-option value="" label="全部"></el-option>-->
                        <!--<el-option value="1" label="平台"></el-option>-->
                        <!--<el-option value="2" label="供应商"></el-option>-->
                    <!--</el-select>-->
                <!--</el-form-item>-->
                <!--/product/productBrand/findProductBrandList?name=耐克-->
                <el-form-item prop="brandName" label="品牌">
                    <el-input v-model.trim="form.brandName" placeholder="模糊搜索"></el-input>
                </el-form-item>
                <!--findAllSupplier-->
                <el-form-item prop="supplierCode" label="供应商ID">
                    <el-input v-model.trim="form.supplierCode" placeholder="模糊搜索"></el-input>
                </el-form-item>
                <!--<el-form-item prop="prodWarea" label="商品库存">-->
                    <!--<el-select v-model="form.prodWarea" placeholder="请选择发货方仓">-->
                        <!--<el-option value="" label="全部"></el-option>-->
                        <!--<el-option value="1" label="库存不足"></el-option>-->
                        <!--<el-option value="2" label="库存紧张"></el-option>-->
                        <!--<el-option value="3" label="暂无库存"></el-option>-->
                    <!--</el-select>-->
                <!--</el-form-item>-->
                <el-form-item prop="updateTime" label="更新时间">
                    <el-date-picker type="daterange" v-model="form.updateTime" placeholder="请输入更新时间" start-placeholder="开始时间" end-placeholder="结束时时间"></el-date-picker>
                </el-form-item>
                <el-form-item prop="minPrice" label="价格">
                    <el-input v-model.trim="form.minPrice">
                        <template slot="prepend">￥</template>
                    </el-input>
                    -
                    <el-input v-model.trim="form.maxPrice">
                        <template slot="prepend">￥</template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="maxPrice" label=""></el-form-item>
                <el-form-item label=" ">
                    <el-button type="primary" @click="handleClick">搜索</el-button>
                    <el-button @click="resetForm">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card class="mb10">
            <el-button @click="$refs[activeName].productStatus(0)">删除</el-button>
            <el-button @click="$refs[activeName].productStatus(6)">下架</el-button>
            <el-button @click="auditToask = true">审核</el-button>
            <el-button @click="freightToask = true">调整运费模板</el-button>
            <el-button type="danger">推送仓库</el-button>
            <el-button type="danger">导出</el-button>
            <el-button @click="createProd" type="danger">创建商品</el-button>
        </el-card>
        <el-card>
            <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                <el-tab-pane label="全部" name="allProduct">
                    <v-tab-content @transData = 'getData' ref="allProduct"></v-tab-content>
                </el-tab-pane>
                <el-tab-pane :label="listNum.checkingTotal" name="auditProduct">
                    <v-tab-content ref="auditProduct"></v-tab-content>
                </el-tab-pane>
                <el-tab-pane :label="listNum.inSellingTotal" name="sale">
                    <v-tab-content ref="sale"></v-tab-content>
                </el-tab-pane>
                <el-tab-pane :label="listNum.inWarehouseTotal" name="warehouse">
                    <v-tab-content ref="warehouse"></v-tab-content>
                </el-tab-pane>
            </el-tabs>
        </el-card>
        <!--批量调整运费模板-->
        <el-dialog title="替换模板" :visible.sync="freightToask" :before-close="()=>{freightToask = false;newFeightTpl=''}">
            <p class="tac">
                <el-select v-model="newFeightTpl" placeholder="请选择运费模板">
                    <el-option v-for="(v, k) in freightList" :key="k" :value="v.id" :label="v.name"></el-option>
                </el-select>
            </p>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="editFreightTpl">确 定</el-button>
                <el-button @click="()=>{freightToask = false;newFeightTpl=''}">取 消</el-button>
            </span>
        </el-dialog>
        <!--批量审核-->
        <el-dialog title="审核" :visible.sync="auditToask">
            <p class="tac">
                是否审核选中商品
            </p>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="auditProduct(3)">审核通过</el-button>
                <el-button @click="auditProduct(5)">审核驳回</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import vBreadcrumb from '@/components/common/Breadcrumb.vue';
    import vTabContent from './productList/_tabContent';
    import request from '@/http/http';
    export default {
        components: {
            vBreadcrumb,
            vTabContent
        },

        data() {
            return {
                nav: ['品牌产品管理', '产品管理'],
                keepAlive: true,
                freightList: [],
                firstCateList: [],
                listNum: {
                    checkingTotal: '待审核',
                    inSellingTotal: '出售中',
                    inWarehouseTotal: '仓库中'
                },
                form: {
                    nameOrCode: '',
                    // name: '',
                    feightTpl: '',
                    prodType: '',
                    // updateUser: '',
                    firstCategoryId: '',
                    isProprietary: '',
                    // pushStatus: '',
                    deliveryWare: '',
                    brandName: '',
                    supplierCode: '',
                    prodWarea: '',
                    updateTime: [],
                    minPrice: '',
                    maxPrice: ''
                },
                freightToask: false,
                auditToask: false,
                newFeightTpl: '', // 批量调整运费模板
                activeName: 'allProduct'
            };
        },
        mounted() {
            const param = this.$route.query;
            if (param) {
                this.form.brandId = param.brandId;
                this.form.supplierCode = param.supplierCode;
                this.form.paramStatus = param.flag; // 已上架状态
            }
            this.getFeightList();
            this.getFirstCateList();
            this.handleClick();
        },
        methods: {
            // 批量审核产品
            auditProduct(status) {
                if (this.$refs[this.activeName].prodIdArr.length === 0) return this.$message.warning('请先选择产品再进行操作');
                // 0：删除 1：待发布2：待审核3：已通过4:已上架5：未通过6:已下架
                const data = {
                    codes: this.$refs[this.activeName].prodIdArr.join(','),
                    status: status
                };
                request.batchUpdateProductStatus(data).then(res => {
                    this.$message.success(res.msg);
                    this.$refs[this.activeName].handleCurrentChange(this.$refs[this.activeName].page.currentPage);
                    this.auditToask = false;
                }).catch(err => {
                    this.auditToask = false;
                    console.log(err);
                });
            },
            // 批量调整运费模板
            editFreightTpl() {
                if (this.$refs[this.activeName].prodIdArr.length === 0) return this.$message.warning('请先选择产品再进行操作');
                const data = {
                    codes: this.$refs[this.activeName].prodIdArr.join(','),
                    freightTemplateId: this.newFeightTpl
                };
                request.batchUpdateProductStatus(data).then(res => {
                    this.newFeightTpl = '';
                    this.$message.success(res.msg);
                    this.freightToask = false;
                }).catch(err => {
                    this.newFeightTpl = '';
                    this.freightToask = false;
                    console.log(err);
                });
            },
            // 切换选项卡
            handleClick(tab) {
                let status = '';
                switch (this.activeName) {
                    case 'allProduct': status = '0'; break;
                    case 'auditProduct': status = '1'; break;
                    case 'sale': status = '2'; break;
                    case 'warehouse': status = '3'; break;
                    default: status = '0';
                }
                if (!this.form.updateTime) this.form.updateTime = [];
                const data = {
                    ...this.form,
                    totalStatus: status,
                    beginTime: this.$utils.formatTime(this.form.updateTime[0], 1),
                    endTime: this.$utils.formatTime(this.form.updateTime[1], 1)
                };
                this.$refs[this.activeName].form = { ...data };
                this.$refs[this.activeName].handleCurrentChange(1);
            },
            // 获取子组件传的数据
            getData(val) {
                this.listNum = {
                    checkingTotal: `待审核(${val.checkingTotal})`,
                    inSellingTotal: `出售中(${val.inSellingTotal})`,
                    inWarehouseTotal: `仓库中(${val.inWarehouseTotal})`
                };
            },
            // 获取运费模板列表
            getFeightList() {
                request.queryFreightTemplateList({}).then(res => {
                    this.freightList = res.data;
                }).catch(err => {
                    console.log(err);
                });
            },
            // 获取一级分类列表
            getFirstCateList() {
                const data = {
                    fatherId: 0,
                    level: 1,
                    page: 1,
                    pageSize: 100000
                };
                request.queryProductCategoryList(data).then(res => {
                    this.firstCateList = res.data.data;
                }).catch(err => {
                    console.log(err);
                });
            },
            // 创建商品
            createProd() {
                this.keepAlive = true;
                this.$router.push('releaseProduct');
            },
            // 重置
            resetForm() {
                this.$refs['form'].resetFields();
                this.form.paramStatus = '';
                this.form.brandId = '';
            }
        },
        // 路由离开钩子
        beforeRouteLeave(to, from, next) {
            to.meta.noKeepAlive = !this.keepAlive;
            next();
        }
    };
</script>
<style lang='less' scoped>
    .product-list {
        /deep/.el-tabs__active-bar {
            background-color: #ff1e30;
        }
        /deep/.el-tabs__item.is-active,
        /deep/.el-tabs__item:hover {
            color: #ff1e30;
        }
        /deep/.el-input {
            width: 215px;
        }
        /deep/.el-pagination__editor.el-input{
            width: 50px;
        }
        /deep/.el-input-group__prepend{
            padding: 0 5px;
        }
    }
</style>
