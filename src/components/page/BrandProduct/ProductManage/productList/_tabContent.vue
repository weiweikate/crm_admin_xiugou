<template>
    <div class="tab-content">
        <el-button v-if="p.addProduct" @click="releaseProduct" class="add-product" type="primary">添加产品</el-button>
        <div class="search-pane">
            <el-form :model="form" ref='form' inline label-width="100px">
                <el-form-item prop="name" label="产品名称">
                    <el-input v-model.trim="form.name" placeholder="请输入产品名称"></el-input>
                </el-form-item>
                <el-form-item prop="prodCode" label="产品ID号">
                    <el-input v-model.trim="form.prodCode" placeholder="请输入产品ID"></el-input>
                </el-form-item>
                <el-form-item prop="barCode" label="条形码">
                    <el-input v-model.trim="form.barCode" placeholder="请输入条形码"></el-input>
                </el-form-item>
                <el-form-item prop="item" label="产品类目">
                    <el-cascader @change='getProItemId' v-model="defItem" :options="itemList"
                                 @active-item-change="handleItemChange" :props="itemProps"></el-cascader>
                </el-form-item>
                <el-form-item prop="saleMin" label="总销量">
                    <el-input style="width:95px" v-model.trim="form.saleMin"></el-input>
                    -
                    <el-input style="width:95px" v-model.trim="form.saleMax"></el-input>
                </el-form-item>
                <el-form-item prop="priceMin" label="价格">
                    <el-input style="width:95px" v-model.trim="form.priceMin">
                        <template slot="prepend">￥</template>
                    </el-input>
                    -
                    <el-input style="width:95px" v-model.trim="form.priceMax">
                        <template slot="prepend">￥</template>
                    </el-input>
                </el-form-item>
                <el-form-item label=" ">
                    <el-button type="primary" @click="getList(1)">搜索</el-button>
                    <el-button @click="resetForm('form')">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-table v-loading="tableLoading" border :data="tableData" @selection-change="handleSelectionChange">
            <el-table-column type="selection" align="center"></el-table-column>
            <el-table-column prop="name" label="产品名称" min-width="300">
                <template slot-scope="scope">
                    <div class="product-img">
                        <img :src="scope.row.img_url">
                    </div>
                    <p class="product-name">{{scope.row.name}}</p>
                    <p class="product-id">产品ID：{{scope.row.prod_code}}</p>
                </template>
            </el-table-column>
            <el-table-column label="产品类目" align="center" min-width="120">
                <template slot-scope="scope">
                    {{scope.row.firstName}}<br/>{{scope.row.secondName}}
                </template>
            </el-table-column>
            <el-table-column label="产品售价" align="center" min-width="50">
                <template slot-scope="scope">
                    {{scope.row.original_price == undefined?'0':scope.row.original_price | formatPrice}}
                </template>
            </el-table-column>
            <el-table-column prop="stock" label="库存" align="center" min-width="50"></el-table-column>
            <el-table-column prop="saleNum" label="销量" align="center" min-width="50">
                <template slot-scope="scope">
                    {{scope.row.saleNum || 0}}
                </template>
            </el-table-column>
            <el-table-column label="发布时间/发布人" align="center" min-width="120">
                <template slot-scope="scope">
                    {{scope.row.create_time | formatDate}}<br/>{{`产品编辑:${scope.row.create_admin}`}}
                </template>
            </el-table-column>
            <el-table-column prop="" label="状态" align="center" min-width="50">
                <template slot-scope="scope">
                    <template v-if='scope.row.status == 1'>待审核</template>
                    <template v-else-if='scope.row.status == 2'>已通过</template>
                    <template v-else-if='scope.row.status == 3'>未通过</template>
                    <template v-else-if='scope.row.status == 4'>已上架</template>
                    <template v-else-if='scope.row.status == 5'>停用</template>
                    <template v-else-if='scope.row.status == 6'>删除</template>
                </template>
            </el-table-column>
            <el-table-column label="操作" min-width="220">
                <template slot-scope="scope">
                    <div class="operate">
                        <el-button v-if='p.queryProductStockList' @click="inventoryManage(scope.row)" type="primary">
                            库存管理
                        </el-button>
                        <el-button v-if='p.querySaleSpecList && scope.row.status != 4' @click="specificationsManage(scope.row)" type="primary">
                            规格管理
                        </el-button>
                        <el-button v-if='p.queryProductPriceSaleSpecList && scope.row.status != 4' @click="priceManage(scope.row)"
                                   type="primary">价格管理
                        </el-button>
                        <template
                            v-if='(scope.row.status == 1 || scope.row.status == 5) && name == "auditProduct" && p.updateProductStatus'>
                            <el-button @click="auditProduct(scope.row,2)" type="primary">通过审核</el-button>
                            <el-button @click="auditProduct(scope.row,3)" type="danger">驳回审核</el-button>
                        </template>
                        <template v-else>
                            <el-button v-if='p.findProductAllDataById && scope.row.status != 4 && scope.row.status != 2'
                                       @click="editProduct(scope.row)" type="success">编辑产品
                            </el-button>
                            <template v-if='p.updateProductShelves'>
                                <el-button v-if='scope.row.status == 4' @click="productStatus(scope.row,'5')"
                                           type="warning">产品下架
                                </el-button>
                                <el-button v-else-if="scope.row.status == 2" @click="productStatus(scope.row,'4')"
                                           type="warning">产品上架
                                </el-button>
                                <el-button v-if="scope.row.status == 5" @click="productStatus(scope.row,'4')"
                                           type="warning">产品上架
                                </el-button>
                            </template>
                        </template>
                        <el-button v-if="p.findProductById" @click="productInfo(scope.row)" type="primary">查看详情
                        </el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <div class="block">
            <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="page.currentPage"
                layout="total, prev, pager, next, jumper"
                :total="page.totalPage">
            </el-pagination>
        </div>
        <div class="operate-table">
            <el-popover placement="top" width="160" v-model="isShowPop">
                <p>确定删除吗？</p>
                <div style="text-align: right; margin: 0">
                    <el-button @click="batchOperate('6')" type="primary" size="mini">确定</el-button>
                    <el-button size="mini" type="text" @click="isShowPop = false">取消</el-button>
                </div>
                <el-button slot="reference" @click="isShowPop = true">删除</el-button>
            </el-popover>
            <el-button @click="batchOperate('5')">下架</el-button>
        </div>
    </div>
</template>

<script>
import * as api from "@/api/BrandProduct/ProductMange/index.js";
import * as pApi from "@/privilegeList/BrandProduct/ProductMange/index.js";
import utils from '@/utils/index.js';
import { myMixinTable } from '@/JS/commom';

export default {
    props: ["name"],
    components: {},

    mixins:[myMixinTable],

    data() {
        return {
            // 权限控制
            p: {
                addProduct: false,
                queryProductStockList: false,
                querySaleSpecList: false,
                queryProductPriceSaleSpecList: false,
                findProductAllDataById: false,
                updateProductShelves: false,
                findProductById: false,
                updateProductStatus: false
            },

            itemList: [],
            defItem: [],
            itemProps: {
                value: "value",
                children: "children"
            },
            status: "",
            form: {
                name: "",
                prodCode: "",
                barCode: "",
                firstCategoryId: "",
                secCategoryId: "",
                saleMin: "",
                saleMax: "",
                priceMin: "",
                priceMax: ""
            },
            tableData: [],
            tableLoading: false,
            isShowPop: false,
            multipleSelection: [],
            //品牌管理页面跳转传参
            brandId: '',
            //供应商详情页面跳转传参
            supplierId: '',
            firstCategoryId: '',
            secCategoryId: '',
            brand_id: '',
            flag: ''//1供应商品类 2供应商品牌 3品牌
        };
    },

    activated() {
        this.brandId = this.$route.query.brandId || sessionStorage.getItem('brandId');
        this.supplierId = this.$route.query.supplierId || sessionStorage.getItem('supplierId');
        this.firstCategoryId = this.$route.query.firstCategoryId || sessionStorage.getItem('firstCategoryId');
        this.secCategoryId = this.$route.query.secCategoryId || sessionStorage.getItem('secCategoryId');
        this.brand_id = this.$route.query.brand_id || sessionStorage.getItem('brand_id');
        this.flag = this.$route.query.flag || sessionStorage.getItem('flag');
        if(this.flag){
            this.status = "4";
        }
        this.pControl();
        this.getList(1);
    },

    mounted() {
        let n = this.name;
        this.brandId = this.$route.query.brandId || sessionStorage.getItem('brandId');
        this.supplierId = this.$route.query.supplierId || sessionStorage.getItem('supplierId');
        this.firstCategoryId = this.$route.query.firstCategoryId || sessionStorage.getItem('firstCategoryId');
        this.secCategoryId = this.$route.query.secCategoryId || sessionStorage.getItem('secCategoryId');
        this.brand_id = this.$route.query.brand_id || sessionStorage.getItem('brand_id');
        this.flag = this.$route.query.flag || sessionStorage.getItem('flag');
        if(this.flag){
            this.status = "4";
        }
        if (n == "allProduct") {
            this.status = "";
        } else if (n == "upProduct") {
            this.status = "4";
        } else if (n == "downProduct") {
            this.status = "5";
        } else if (n == "auditProduct") {
            this.status = "7";
        } else if (n == "modifyProduct") {
            this.status = "3";
        }
        this.pControl();
        this.getFirstItem();
        this.getList(1);
    },
    methods: {

        // 权限控制
        pControl() {
            for (const k in this.p) {
                this.p[k] = utils.pc(pApi[k]);
            }
        },
        //   提交表单
        getList(val) {
            let data = {};
            data = this.form;
            data.page = val;
            data.status = this.status;
            data.url = pApi.queryProductPageList;
            if (this.flag) {
                if (this.flag == 0) {
                    data.supplierId = this.supplierId;
                    data.firstCategoryId = this.firstCategoryId;
                    data.secCategoryId = this.secCategoryId;
                    data.brandId = '';
                } else if (this.flag == 1) {
                    data.supplierId = this.supplierId;
                    data.brandId = this.brand_id;
                    data.firstCategoryId = '';
                    data.secCategoryId = '';
                } else {
                    data.brandId = this.brandId;
                    data.firstCategoryId = '';
                    data.secCategoryId = '';
                    data.supplierId = ''
                }
            } else {
                data.firstCategoryId = this.form.firstCategoryId;
                data.secCategoryId = this.form.secCategoryId;
                data.supplierId = '';
                data.brandId = ''
            }
            this.page.currentPage = val;
            this.tableLoading = true;

            this.$axios
                .post(api.queryProductPageList, data)
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
            this.form.saleMax = "";
            this.form.priceMax = "";
            this.form.firstCategoryId = "";
            this.form.secCategoryId = "";
            this.defItem = [];
            this.$refs[formName].resetFields();
            this.getList(1)
        },
        // 全选
        handleSelectionChange(val) {
            let that = this;
            this.multipleSelection = [];
            val.forEach((v, k) => {
                that.multipleSelection.push(v.id);
            });
        },
        // 发布产品
        releaseProduct() {
            this.$router.push({name: "releaseProduct"});
        },
        // 编辑产品
        editProduct(row) {
            sessionStorage.setItem("releaseProduct", row.id);
            this.$router.push({
                name: "editProduct",
                query: {releaseProductId: row.id}
            });
        },
        // 规格管理
        specificationsManage(row) {
            let tmp = [];
            tmp.push(row.sec_category_id);
            tmp.push(row.id);
            sessionStorage.setItem("productSpecifications", JSON.stringify(tmp));
            this.$router.push({
                name: "productSpecifications",
                query: {releaseProductId: JSON.stringify(tmp)}
            });
        },
        // 价格管理
        priceManage(row) {
            sessionStorage.setItem("priceManage", row.id);
            this.$router.push({
                name: "priceManage",
                query: {priceManageId: row.id}
            });
        },
        // 库存管理
        inventoryManage(row) {
            sessionStorage.setItem("productInventory", row.id);
            this.$router.push({
                name: "productInventory",
                query: {productInventoryId: row.id}
            });
        },
        // 产品上架/下架
        productStatus(row, status) {
            let data = {};
            data.productId = row.id;
            data.status = status;
            data.url = pApi.updateProductShelves;
            this.$axios
                .post(api.updateProductShelves, data)
                .then(res => {
                    this.$message.success(res.data.data);
                    row.status = status;
                    this.getList(this.page.currentPage)
                })
                .catch(err => {
                    console.log(err);
                });
        },
        // 通过/不通过审核
        auditProduct(row, status) {
            let data = {};
            data.productId = row.id;
            data.status = status;
            data.url = pApi.updateProductStatus;
            this.$axios
                .post(api.updateProductStatus, data)
                .then(res => {
                    row.status = status;
                    this.$message.success(res.data.data);
                    this.getList(this.page.currentPage)
                })
                .catch(err => {
                    console.log(err);
                });
        },
        // 查看详情
        productInfo(row) {
            sessionStorage.setItem("productInfo", row.id);
            this.$router.push({
                name: "productInfo",
                query: {productInfoId: row.id}
            });
        },
        // 获取一级类目
        getFirstItem() {
            this.itemList = [];
            this.$axios
                .post(api.getCategoryList, {fatherid: 0, url: pApi.queryProductPageList})
                .then(res => {
                    res.data.data.data.forEach((v, k) => {
                        this.itemList.push({label: v.name, value: v.id, children: []});
                    });
                })
                .catch(err => {
                    console.log(err);
                });
        },
        // 获取二级类目
        handleItemChange(val) {
            let index = 0;
            this.itemList.forEach((v, k) => {
                if (v.value == val[0]) {
                    index = k;
                }
            });
            let data = {};
            data.fatherid = val[0];
            data.url = pApi.queryProductPageList;
            this.$axios
                .post(api.getCategoryList, data)
                .then(res => {
                    res.data.data.data.forEach((v, k) => {
                        this.itemList[index].children.push({label: v.name, value: v.id});
                    });
                })
                .catch(err => {
                    console.log(err);
                });
        },
        // 获取一二级类目id
        getProItemId(val) {
            this.form.firstCategoryId = val[0];
            this.form.secCategoryId = val[1];
        },
        // 批量操作
        batchOperate(status) {
            let data = {};
            data.ids = this.multipleSelection.join(",");
            data.status = status;
            data.url = pApi.updateBatchProductStatus;
            this.$axios
                .post(api.updateBatchProductStatus, data)
                .then(res => {
                    this.$message.success(res.data.data);
                    this.isShowPop = false;
                    this.getList(this.page.currentPage);
                })
                .catch(err => {
                    console.log(err);
                });
        }
    },
    filters: {
        formatPrice(val) {
            return `￥${val}`;
        }
    }
};
</script>
<style lang='less'>
    .tab-content {
        .add-product {
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
            width: 65%;
            height: auto;
            margin: 5px 0 0 20px;
        }
        .product-id {
            float: left;
            width: 65%;
            height: auto;
            margin: 20px 0 0 20px;
        }
    }
</style>
