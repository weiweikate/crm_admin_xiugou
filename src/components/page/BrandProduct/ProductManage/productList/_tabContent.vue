<template>
    <div class="tab-content">
        <el-button @click="releaseProduct" class="add-product" type="primary">添加产品</el-button>
        <div class="search-pane">
            <el-form :model="form" ref='form' inline label-width="100px">
                <el-form-item prop="productName" label="产品名称">
                    <el-input v-model.trim="form.productName" placeholder="请输入产品名称"></el-input>
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
                <el-form-item prop="salesMin" label="总销量">
                    <el-input style="width:95px" v-model.trim="form.salesMin"></el-input>
                    -
                    <el-input style="width:95px" v-model.trim="form.salesMax"></el-input>
                </el-form-item>
                <el-form-item prop="minPrice" label="价格">
                    <el-input style="width:95px" v-model.trim="form.minPrice">
                        <template slot="prepend">￥</template>
                    </el-input>
                    -
                    <el-input style="width:95px" v-model.trim="form.maxPrice">
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
                        <img :src="scope.row.imgUrl">
                    </div>
                    <p class="product-name">{{scope.row.name}}</p>
                    <p class="product-id">产品ID：{{scope.row.prodCode}}</p>
                </template>
            </el-table-column>
            <el-table-column label="产品类目" align="center" min-width="120">
                <template slot-scope="scope">
                    {{scope.row.firstCategoryName}}<br/>{{scope.row.secCategoryName}}<br/>{{scope.row.thirdCategoryName}}
                </template>
            </el-table-column>
            <el-table-column label="产品售价" align="center" min-width="50">
                <template slot-scope="scope">
                    {{scope.row.maxPrice == undefined?'0':scope.row.maxPrice | formatPrice}}
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
                    {{scope.row.createTime |formatDateAll}}<br/>{{`产品编辑:${scope.row.adminName}`}}
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
                        <el-button @click="inventoryManage(scope.row)" type="primary">
                            库存管理
                        </el-button>
                        <el-button v-if='scope.row.status != 4' @click="specificationsManage(scope.row)" type="primary">
                            规格管理
                        </el-button>
                        <el-button v-if='scope.row.status != 4' @click="priceManage(scope.row)"
                                   type="primary">价格管理
                        </el-button>
                        <template
                            v-if='(scope.row.status == 1 || scope.row.status == 5) && name == "auditProduct"'>
                            <el-button @click="auditProduct(scope.row,2)" type="primary">通过审核</el-button>
                            <el-button @click="auditProduct(scope.row,3)" type="danger">驳回审核</el-button>
                        </template>
                        <template v-else>
                            <el-button v-if='scope.row.status != 4 && scope.row.status != 2'
                                       @click="editProduct(scope.row)" type="success">编辑产品
                            </el-button>
                            <template >
                                <el-button v-if='scope.row.status == 4' @click="productStatus(scope.row,'5')"
                                           type="warning">产品下架
                                </el-button>
                                <el-button v-else-if="scope.row.status == 2 || scope.row.status == 5" @click="productStatus(scope.row,'4')"
                                           type="warning">产品上架
                                </el-button>
                            </template>
                        </template>
                        <el-button @click="productInfo(scope.row)" type="primary">查看详情
                        </el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <div class="block">
            <el-pagination
                background
                @size-change="handleSizeChange"
                :page-size="page.pageSize"
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
                    <el-button @click="batchOperate('0')" type="primary" size="mini">确定</el-button>
                    <el-button size="mini" type="text" @click="isShowPop = false">取消</el-button>
                </div>
                <el-button slot="reference" @click="isShowPop = true">删除</el-button>
            </el-popover>
            <el-button @click="batchOperate('5')">下架</el-button>
        </div>
    </div>
</template>

<script>
import request from '@/http/http';
import { myMixinTable } from '@/JS/commom';

export default {
    props: ['name'],
    components: {},

    mixins: [myMixinTable],

    data() {
        return {
            itemList: [],
            defItem: [],
            itemProps: {
                value: 'value',
                children: 'children'
            },
            status: '',
            form: {
                productName: '',
                prodCode: '',
                barCode: '',
                firstCategoryId: '',
                secCategoryId: '',
                thirdCategoryId: '',
                salesMin: '',
                salesMax: '',
                minPrice: '',
                maxPrice: ''
            },
            tableData: [],
            tableLoading: false,
            isShowPop: false,
            multipleSelection: [],
            // 品牌管理页面跳转传参
            brandId: '',
            // 供应商详情页面跳转传参
            supplierId: '',
            firstCategoryId: '',
            secCategoryId: '',
            brand_id: '',
            flag: ''// 1供应商品类 2供应商品牌 3品牌
        };
    },

    activated() {
        this.brandId = this.$route.query.brandId || sessionStorage.getItem('brandId');
        this.supplierId = this.$route.query.supplierId || sessionStorage.getItem('supplierId');
        this.firstCategoryId = this.$route.query.firstCategoryId || sessionStorage.getItem('firstCategoryId');
        this.secCategoryId = this.$route.query.secCategoryId || sessionStorage.getItem('secCategoryId');
        this.brand_id = this.$route.query.brand_id || sessionStorage.getItem('brand_id');
        this.flag = this.$route.query.flag || sessionStorage.getItem('flag');
        if (this.flag) {
            this.status = '4';
        }
        this.getList(1);
    },

    mounted() {
        const n = this.name;
        this.brandId = this.$route.query.brandId || sessionStorage.getItem('brandId');
        this.supplierId = this.$route.query.supplierId || sessionStorage.getItem('supplierId');
        this.firstCategoryId = this.$route.query.firstCategoryId || sessionStorage.getItem('firstCategoryId');
        this.secCategoryId = this.$route.query.secCategoryId || sessionStorage.getItem('secCategoryId');
        this.brand_id = this.$route.query.brand_id || sessionStorage.getItem('brand_id');
        this.flag = this.$route.query.flag || sessionStorage.getItem('flag');
        if (this.flag) {
            this.status = '4';
        }
        if (n === 'allProduct') {
            this.status = '';
        } else if (n === 'upProduct') {
            this.status = '4';
        } else if (n === 'downProduct') {
            this.status = '5';
        } else if (n === 'auditProduct') {
            this.status = '1';
        } else if (n === 'modifyProduct') {
            this.status = '3';
        }
        this.getFirstItem();
        this.getList(1);
    },
    methods: {
        //   提交表单
        getList(val) {
            let data = {};
            data = this.form;
            data.page = val;
            data.pageSize = this.page.pageSize;
            data.statusParam = this.status;
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
                    data.supplierId = '';
                }
            } else {
                data.firstCategoryId = this.form.firstCategoryId;
                data.secCategoryId = this.form.secCategoryId;
                data.supplierId = '';
                data.brandId = '';
            }
            this.tableLoading = true;
            request.queryProductPageList(data).then(res => {
                this.tableData = [];
                this.tableData = res.data.data;
                this.page.totalPage = res.data.totalNum;
                this.tableLoading = false;
            }).catch(err => {
                console.log(err);
                this.tableLoading = false;
            });
        },
        //   重置表单
        resetForm(formName) {
            this.form.salesMax = '';
            this.form.maxPrice = '';
            this.form.firstCategoryId = '';
            this.form.secCategoryId = '';
            this.form.thirdCategoryId = '';
            this.defItem = [];
            this.$refs[formName].resetFields();
            this.getList(1);
        },
        // 全选
        handleSelectionChange(val) {
            const that = this;
            this.multipleSelection = [];
            val.forEach((v, k) => {
                that.multipleSelection.push(v.id);
            });
        },
        // 发布产品
        releaseProduct() {
            this.$router.push({ name: 'releaseProduct' });
        },
        // 编辑产品
        editProduct(row) {
            sessionStorage.setItem('releaseProduct', row.id);
            this.$router.push({
                name: 'editProduct',
                query: { releaseProductId: row.id }
            });
        },
        // 规格管理
        specificationsManage(row) {
            const tmp = [];
            tmp.push(row.sec_category_id);
            tmp.push(row.id);
            sessionStorage.setItem('productSpecifications', JSON.stringify(tmp));
            this.$router.push({
                name: 'productSpecifications',
                query: { releaseProductId: JSON.stringify(tmp) }
            });
        },
        // 价格管理
        priceManage(row) {
            sessionStorage.setItem('priceManage', row.id);
            this.$router.push({
                name: 'priceManage',
                query: { priceManageId: row.id }
            });
        },
        // 库存管理
        inventoryManage(row) {
            sessionStorage.setItem('productInventory', row.id);
            this.$router.push({
                name: 'productInventory',
                query: { productInventoryId: row.id }
            });
        },
        // 产品上架/下架
        productStatus(row, status) {
            const data = {};
            data.id = row.id;
            data.status = status;
            request.updateProductStatusById(data).then(res => {
                this.$message.success(res.msg);
                row.status = status;
            }).catch(err => {
                console.log(err);
            });
        },
        // 通过/不通过审核
        auditProduct(row, status) {
            const data = {};
            data.id = row.id;
            data.status = status;
            request.updateProductStatusById(data).then(res => {
                this.$message.success(res.msg);
                row.status = status;
            }).catch(err => {
                console.log(err);
            });
        },
        // 查看详情
        productInfo(row) {
            sessionStorage.setItem('productInfo', row.id);
            this.$router.push({
                name: 'productInfo',
                query: { productInfoId: row.id }
            });
        },
        // 获取一级类目
        getFirstItem() {
            this.itemList = [];
            request.queryProductCategoryList({ fatherId: 0, level: 1, pageSize: 100000 }).then(res => {
                res.data.data.forEach((v, k) => {
                    this.itemList.push({ label: v.name, value: v.id, children: [] });
                });
            }).catch(err => {
                console.log(err);
            });
        },
        // 获取二三级类目
        handleItemChange(val) {
            let index = 0;
            const data = {};
            data.pageSize = 100000;
            if (val[1]) {
                let tmpIndex = 0;
                this.itemList.forEach((v, k) => {
                    if (v.value == val[0]) {
                        tmpIndex = k;
                        v.children.forEach((value, key) => {
                            if (value.value == val[1]) {
                                index = key;
                            }
                        });
                    }
                });
                data.fatherId = val[1];
                data.level = 3;
                request.queryProductCategoryList(data).then(res => {
                    this.itemList[tmpIndex].children[index].children = [];
                    res.data.data.forEach((v, k) => {
                        this.itemList[tmpIndex].children[index].children.push({ label: v.name, value: v.id });
                    });
                }).catch(err => {
                    console.log(err);
                });
            } else {
                this.itemList.forEach((v, k) => {
                    if (v.value == val[0]) {
                        index = k;
                    }
                });
                data.fatherId = val[0];
                data.level = 2;
                request.queryProductCategoryList(data).then(res => {
                    this.itemList[index].children = [];
                    res.data.data.forEach((v, k) => {
                        this.itemList[index].children.push({ label: v.name, value: v.id, children: [] });
                    });
                }).catch(err => {
                    console.log(err);
                });
            }
        },
        // 获取一二三级类目id
        getProItemId(val) {
            this.form.firstCategoryId = val[0];
            this.form.secCategoryId = val[1];
            this.form.thirdCategoryId = val[2];
        },
        // 批量操作
        batchOperate(status) {
            const data = {};
            data.ids = this.multipleSelection.join(',');
            data.status = status;
            request.updateBatchProductStatus(data).then(res => {
                this.$message.success(res.msg);
                this.isShowPop = false;
                this.getList(this.page.currentPage);
            }).catch(err => {
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
